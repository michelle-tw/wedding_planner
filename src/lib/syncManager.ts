import { useWeddingStore } from '../store/useWeddingStore';
import { useSyncStore } from '../store/useSyncStore';
import { pushRemote, subscribeRemote } from './sync';

// Bridges the local planner store and the remote (Firestore) copy:
// - realtime pull: when the remote is newer, replace local state
// - debounced push: when local changes, upload after a short pause
// Reconciliation is whole-state last-write-wins by updatedAt.

let unsubRemote: (() => void) | null = null;
let unsubStore: (() => void) | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;
let lastKnownUpdatedAt = 0;
let applyingRemote = false;
let started = false;
// Don't push local state until we've seen the remote once — otherwise a device
// opening a share link could overwrite the shared plan with its empty seed.
let primed = false;

function errText(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message);
  return String(e);
}

function schedulePush(delay: number) {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(doPush, delay);
}

async function doPush() {
  const { config, code, enabled, setStatus, setError, setLastSyncedAt } = useSyncStore.getState();
  if (!enabled || !config || !code) return;
  try {
    setStatus('connecting');
    const json = useWeddingStore.getState().exportState();
    const updatedAt = await pushRemote(config, code, json);
    lastKnownUpdatedAt = updatedAt;
    setLastSyncedAt(updatedAt);
    setError(null);
    setStatus('synced');
  } catch (e) {
    setError(errText(e));
    setStatus('error');
  }
}

export async function startSync() {
  const sync = useSyncStore.getState();
  if (!sync.enabled || !sync.config || !sync.code || started) return;
  started = true;
  sync.setStatus('connecting');

  try {
    unsubRemote = await subscribeRemote(
      sync.config,
      sync.code,
      (snap) => {
        const s = useSyncStore.getState();
        if (!snap) {
          // empty room — seed it with our local state
          primed = true;
          schedulePush(0);
          return;
        }
        const adopt = () => {
          lastKnownUpdatedAt = snap.updatedAt;
          applyingRemote = true;
          const ok = useWeddingStore.getState().importState(snap.json);
          applyingRemote = false;
          if (ok) {
            s.setLastSyncedAt(snap.updatedAt);
            s.setError(null);
          }
        };

        if (!primed) {
          primed = true;
          // First view this session: the copy with more data wins, so an empty
          // device can't wipe a device that already has the real plan.
          const localLen = useWeddingStore.getState().exportState().length;
          if (snap.json.length + 200 < localLen) {
            schedulePush(0); // local is clearly richer → push it up
          } else {
            adopt();
          }
          s.setStatus('synced');
          return;
        }

        if (snap.updatedAt > lastKnownUpdatedAt) adopt();
        s.setStatus('synced');
      },
      (e) => {
        const s = useSyncStore.getState();
        s.setError(errText(e));
        s.setStatus('error');
      }
    );
  } catch (e) {
    const s = useSyncStore.getState();
    s.setError(errText(e));
    s.setStatus('error');
    started = false;
    return;
  }

  // push local edits (skip remote-applied changes, and wait until primed)
  unsubStore = useWeddingStore.subscribe(() => {
    if (applyingRemote || !primed) return;
    schedulePush(1500);
  });
}

export function stopSync() {
  if (unsubRemote) unsubRemote();
  if (unsubStore) unsubStore();
  if (pushTimer) clearTimeout(pushTimer);
  unsubRemote = null;
  unsubStore = null;
  pushTimer = null;
  started = false;
  lastKnownUpdatedAt = 0;
  primed = false;
}

export async function restartSync() {
  stopSync();
  await startSync();
}

// Force an immediate upload of the current local state.
export function pushNow() {
  schedulePush(0);
}
