// Cloud sync via the user's own Firebase (Firestore). The whole planner state is
// serialized to a string and split into ~700KB chunks so attachments can exceed
// Firestore's 1MB-per-document limit. A tiny meta doc holds updatedAt + chunk
// count and drives realtime updates; access is gated only by a long secret
// "sync code" used as the document path (capability-style privacy).

export interface SyncConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
  storageBucket?: string;
  messagingSenderId?: string;
}

export interface RemoteSnapshot {
  updatedAt: number;
  json: string;
}

const CHUNK_SIZE = 700_000; // chars per chunk, safely under the 1MB doc cap

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getDb(config: SyncConfig): Promise<any> {
  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getFirestore } = await import('firebase/firestore');
  const app = getApps().length ? getApp() : initializeApp(config);
  return getFirestore(app);
}

export function isValidConfig(c: unknown): c is SyncConfig {
  if (!c || typeof c !== 'object') return false;
  const o = c as Record<string, unknown>;
  return (
    typeof o.apiKey === 'string' &&
    typeof o.projectId === 'string' &&
    typeof o.appId === 'string' &&
    typeof o.authDomain === 'string'
  );
}

// Write the state: chunks first, then the meta doc; clean up stale chunks.
export async function pushRemote(config: SyncConfig, code: string, json: string): Promise<number> {
  const db = await getDb(config);
  const { doc, getDoc, setDoc, deleteDoc } = await import('firebase/firestore');

  const chunks: string[] = [];
  for (let i = 0; i < json.length; i += CHUNK_SIZE) chunks.push(json.slice(i, i + CHUNK_SIZE));
  if (chunks.length === 0) chunks.push('');

  const metaRef = doc(db, 'plans', code);
  const prev = await getDoc(metaRef);
  const prevCount = prev.exists() ? ((prev.data().chunkCount as number) ?? 0) : 0;

  for (let i = 0; i < chunks.length; i++) {
    await setDoc(doc(db, 'plans', code, 'chunks', String(i)), { data: chunks[i] });
  }
  // remove chunks left over from a previous, larger state
  for (let i = chunks.length; i < prevCount; i++) {
    await deleteDoc(doc(db, 'plans', code, 'chunks', String(i)));
  }

  const updatedAt = Date.now();
  await setDoc(metaRef, { updatedAt, chunkCount: chunks.length });
  return updatedAt;
}

// Subscribe to remote changes; calls onChange with the reassembled state (or null
// when the plan doesn't exist yet). Returns an unsubscribe function.
export async function subscribeRemote(
  config: SyncConfig,
  code: string,
  onChange: (snap: RemoteSnapshot | null) => void,
  onError: (e: unknown) => void
): Promise<() => void> {
  const db = await getDb(config);
  const { doc, getDoc, onSnapshot } = await import('firebase/firestore');

  const metaRef = doc(db, 'plans', code);
  return onSnapshot(
    metaRef,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (snap: any) => {
      try {
        if (!snap.exists()) {
          onChange(null);
          return;
        }
        const meta = snap.data();
        const chunkCount = (meta.chunkCount as number) ?? 0;
        const updatedAt = (meta.updatedAt as number) ?? 0;
        let json = '';
        for (let i = 0; i < chunkCount; i++) {
          const cs = await getDoc(doc(db, 'plans', code, 'chunks', String(i)));
          json += cs.exists() ? ((cs.data().data as string) ?? '') : '';
        }
        onChange({ updatedAt, json });
      } catch (e) {
        onError(e);
      }
    },
    onError
  );
}

// A random, hard-to-guess sync code (the shared secret between devices).
export function generateSyncCode(): string {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Parse a Firebase config the user pasted — accepts JSON or a JS object literal
// (as copied from the Firebase console, e.g. `const firebaseConfig = { ... }`).
export function parseFirebaseConfig(text: string): SyncConfig | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  const body = text.slice(start, end + 1);
  let obj: unknown;
  try {
    obj = JSON.parse(body);
  } catch {
    try {
      // the user's own config pasted into their own browser
      obj = new Function(`return (${body})`)();
    } catch {
      return null;
    }
  }
  return isValidConfig(obj) ? obj : null;
}

// Bundle config + code into one string to move to another device.
export function encodeSetup(config: SyncConfig, code: string): string {
  const json = JSON.stringify({ config, code });
  return btoa(String.fromCharCode(...new TextEncoder().encode(json)));
}

export function decodeSetup(text: string): { config: SyncConfig; code: string } | null {
  try {
    const bytes = Uint8Array.from(atob(text.trim()), (c) => c.charCodeAt(0));
    const obj = JSON.parse(new TextDecoder().decode(bytes));
    if (isValidConfig(obj.config) && typeof obj.code === 'string' && obj.code) {
      return { config: obj.config, code: obj.code };
    }
  } catch {
    /* ignore */
  }
  return null;
}
