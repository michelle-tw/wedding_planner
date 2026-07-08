import { NavLink, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Wallet,
  ListChecks,
  Users,
  UserRound,
  CalendarRange,
  FolderLock,
  Settings,
  Heart,
} from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import type { Lang } from '../types';

const navItems = [
  { to: '/', key: 'dashboard', icon: LayoutDashboard },
  { to: '/budget', key: 'budget', icon: Wallet },
  { to: '/tasks', key: 'tasks', icon: ListChecks },
  { to: '/vendors', key: 'vendors', icon: Users },
  { to: '/guests', key: 'guests', icon: UserRound },
  { to: '/timeline', key: 'timeline', icon: CalendarRange },
  { to: '/documents', key: 'documents', icon: FolderLock },
  { to: '/settings', key: 'settings', icon: Settings },
] as const;

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const setLanguage = useWeddingStore((s) => s.setLanguage);

  const setLang = (lang: Lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const current = i18n.language as Lang;

  return (
    <div className="flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-xs">
      <button
        onClick={() => setLang('vi')}
        className={`rounded-full px-3 py-1 transition-colors ${
          current === 'vi' ? 'bg-blush-500 text-white' : 'text-ink-soft hover:bg-blush-50'
        }`}
      >
        Tiếng Việt
      </button>
      <button
        onClick={() => setLang('zh-TW')}
        className={`rounded-full px-3 py-1 transition-colors ${
          current === 'zh-TW' ? 'bg-blush-500 text-white' : 'text-ink-soft hover:bg-blush-50'
        }`}
      >
        繁體中文
      </button>
    </div>
  );
}

export default function Layout() {
  const { t } = useTranslation();
  const vnWeddingDate = useWeddingStore((s) => s.vnWeddingDate);
  const [y, m, d] = vnWeddingDate.split('-');
  const saveTheDate = `${d}.${m}.${y}`;

  return (
    <div className="min-h-screen bg-ivory">
      <header className="sticky top-0 z-20 border-b border-line bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blush-100 text-blush-600">
              <Heart size={18} strokeWidth={1.75} />
            </div>
            <div className="leading-tight">
              <p className="font-serif-heading text-lg font-medium text-ink">{t('app.title')}</p>
              <p className="font-serif-heading text-sm italic text-blush-500">{t('app.subtitle')}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>
        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-blush-500 text-white shadow-soft'
                    : 'text-ink-soft hover:bg-blush-50 hover:text-ink'
                }`
              }
            >
              <Icon size={15} strokeWidth={1.75} />
              {t(`nav.${key}`)}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="mx-auto max-w-7xl px-4 pb-8 pt-5 text-center sm:px-6">
        <p className="flex items-center justify-center gap-1.5 font-serif-heading text-sm text-blush-500">
          Mi
          <Heart size={11} className="-translate-y-px text-blush-400" strokeWidth={2} fill="currentColor" />
          Luân
        </p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
          <span className="uppercase tracking-[0.15em] text-gold-500">Save the date</span>
          <span className="text-gold-300">·</span>
          <span className="font-serif-heading text-ink">{saveTheDate}</span>
        </p>
      </footer>
    </div>
  );
}
