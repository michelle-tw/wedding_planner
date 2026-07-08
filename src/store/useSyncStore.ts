import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SyncConfig } from '../lib/sync';

export type SyncStatus = 'off' | 'connecting' | 'synced' | 'error';

interface SyncState {
  config: SyncConfig | null;
  code: string | null;
  enabled: boolean;
  // runtime only
  status: SyncStatus;
  lastSyncedAt: number | null;
  error: string | null;

  enable: (config: SyncConfig, code: string) => void;
  disable: () => void;
  setStatus: (status: SyncStatus) => void;
  setError: (error: string | null) => void;
  setLastSyncedAt: (t: number) => void;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      config: null,
      code: null,
      enabled: false,
      status: 'off',
      lastSyncedAt: null,
      error: null,

      enable: (config, code) => set({ config, code, enabled: true, status: 'connecting', error: null }),
      disable: () =>
        set({ config: null, code: null, enabled: false, status: 'off', error: null, lastSyncedAt: null }),
      setStatus: (status) => set({ status }),
      setError: (error) => set({ error }),
      setLastSyncedAt: (lastSyncedAt) => set({ lastSyncedAt }),
    }),
    {
      name: 'wedding-sync',
      // only the credentials + on/off flag are persisted
      partialize: (s) => ({ config: s.config, code: s.code, enabled: s.enabled }),
    }
  )
);
