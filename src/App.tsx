import { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Tasks from './pages/Tasks';
import Vendors from './pages/Vendors';
import Guests from './pages/Guests';
import Timeline from './pages/Timeline';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import { useWeddingStore } from './store/useWeddingStore';
import { useFxStore } from './store/useFxStore';
import { useSyncStore } from './store/useSyncStore';
import { startSync } from './lib/syncManager';
import { SHARED_FIREBASE_CONFIG } from './lib/syncConfig';

export default function App() {
  const { i18n } = useTranslation();
  const language = useWeddingStore((s) => s.language);
  const refreshRate = useFxStore((s) => s.refresh);
  const syncEnabled = useSyncStore((s) => s.enabled);

  // i18n initialises at 'vi'; on load (and any change) align it with the
  // persisted language so both UI chrome and content render in one language.
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
    document.documentElement.lang = language ?? 'vi';
  }, [language, i18n]);

  // Refresh the VND->TWD exchange rate once per day (cached in localStorage).
  useEffect(() => {
    refreshRate();
  }, [refreshRate]);

  // A share link (?sync=<code>) auto-connects to the shared plan — no setup.
  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get('sync');
    if (urlCode && urlCode.length > 24) {
      const s = useSyncStore.getState();
      if (!s.enabled || s.code !== urlCode) {
        s.enable(SHARED_FIREBASE_CONFIG, urlCode);
      }
    }
  }, []);

  // Start cloud sync when it's turned on, and re-check on focus.
  useEffect(() => {
    if (!syncEnabled) return;
    startSync();
    const onFocus = () => startSync();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
    };
  }, [syncEnabled]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
