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
          // no remote copy yet — seed it with our local state
          schedulePush(0);
          return;
        }
        if (snap.updatedAt > lastKnownUpdatedAt) {
          lastKnownUpdatedAt = snap.updatedAt;
          applyingRemote = true;
          const ok = useWeddingStore.getState().importState(snap.json);
          applyingRemote = false;
          if (ok) {
            s.setLastSyncedAt(snap.updatedAt);
            s.setError(null);
            s.setStatus('synced');
          }
        } else {
          s.setStatus('synced');
        }
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

  // push local edits (skip the ones we just applied from remote)
  unsubStore = useWeddingStore.subscribe(() => {
    if (applyingRemote) return;
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
}

export async function restartSync() {
  stopSync();
  await startSync();
}

// Force an immediate upload of the current local state.
export function pushNow() {
  schedulePush(0);
}
