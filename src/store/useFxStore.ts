import { create } from 'zustand';
import { FALLBACK_TWD_PER_VND } from '../lib/currency';

// Live VND->TWD rate, cached once per day in localStorage. Source: open.er-api.com
// (free, no API key, CORS-enabled) which tracks market rates comparable to Google/xe.com.
const LS_KEY = 'wedding-fx-rate';
const ENDPOINT = 'https://open.er-api.com/v6/latest/VND';

interface CachedRate {
  twdPerVnd: number;
  date: string; // YYYY-MM-DD
}

function loadCached(): CachedRate | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.twdPerVnd === 'number' && parsed.twdPerVnd > 0) {
      return parsed as CachedRate;
    }
  } catch {
    /* ignore */
  }
  return null;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

interface FxState {
  twdPerVnd: number;
  date: string | null;
  refresh: () => Promise<void>;
}

const cached = loadCached();

export const useFxStore = create<FxState>((set, get) => ({
  twdPerVnd: cached?.twdPerVnd ?? FALLBACK_TWD_PER_VND,
  date: cached?.date ?? null,
  refresh: async () => {
    if (get().date === today()) return; // already fresh today
    try {
      const res = await fetch(ENDPOINT);
      const data = await res.json();
      const twdPerVnd = data?.rates?.TWD;
      if (typeof twdPerVnd === 'number' && twdPerVnd > 0) {
        const next: CachedRate = { twdPerVnd, date: today() };
        set(next);
        try {
          localStorage.setItem(LS_KEY, JSON.stringify(next));
        } catch {
          /* ignore quota */
        }
      }
    } catch {
      /* offline or blocked: keep cached/fallback rate */
    }
  },
}));
