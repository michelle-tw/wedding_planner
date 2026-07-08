import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, RefreshCw, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Card } from './ui';
import { useSyncStore } from '../store/useSyncStore';
import { parseFirebaseConfig, generateSyncCode, encodeSetup, decodeSetup } from '../lib/sync';
import { restartSync, stopSync, pushNow } from '../lib/syncManager';

const primaryBtn =
  'flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600';
const ghostBtn =
  'flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600';

function formatTime(ms: number | null, locale: string): string {
  if (!ms) return '';
  return new Date(ms).toLocaleString(locale === 'zh-TW' ? 'zh-TW' : 'vi-VN');
}

export function SyncSettings() {
  const { t, i18n } = useTranslation();
  const { enabled, config, code, status, lastSyncedAt, error, enable, disable } = useSyncStore();
  const [tab, setTab] = useState<'new' | 'join'>('new');
  const [configText, setConfigText] = useState('');
  const [setupText, setSetupText] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const setupCode = enabled && config && code ? encodeSetup(config, code) : '';

  const enableNew = () => {
    const cfg = parseFirebaseConfig(configText);
    if (!cfg) {
      setLocalError(t('settings.sync.invalidConfig'));
      return;
    }
    setLocalError(null);
    enable(cfg, generateSyncCode());
    void restartSync();
  };

  const join = () => {
    const parsed = decodeSetup(setupText);
    if (!parsed) {
      setLocalError(t('settings.sync.invalidSetup'));
      return;
    }
    setLocalError(null);
    enable(parsed.config, parsed.code);
    void restartSync();
  };

  const turnOff = () => {
    stopSync();
    disable();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(setupCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Cloud size={18} className="text-blush-500" strokeWidth={1.75} />
        <h2 className="font-serif-heading text-lg font-medium text-ink">{t('settings.sync.title')}</h2>
      </div>
      <p className="text-sm text-ink-soft">{t('settings.sync.desc')}</p>

      {!enabled ? (
        <>
          <div className="flex w-fit gap-1 rounded-full border border-line bg-paper p-1 text-xs">
            {(['new', 'join'] as const).map((tb) => (
              <button
                key={tb}
                onClick={() => setTab(tb)}
                className={`rounded-full px-3 py-1.5 transition-colors ${
                  tab === tb ? 'bg-blush-500 text-white' : 'text-ink-soft hover:bg-blush-50'
                }`}
              >
                {t(`settings.sync.tab${tb === 'new' ? 'New' : 'Join'}`)}
              </button>
            ))}
          </div>

          {tab === 'new' ? (
            <div className="space-y-2">
              <label className="text-xs text-ink-soft">{t('settings.sync.configLabel')}</label>
              <textarea
                className="input-elegant min-h-28 resize-y font-mono text-xs"
                value={configText}
                placeholder={t('settings.sync.configPlaceholder')}
                onChange={(e) => setConfigText(e.target.value)}
              />
              <p className="text-xs text-ink-soft/70">{t('settings.sync.guide')}</p>
              <button onClick={enableNew} className={primaryBtn}>
                <Cloud size={15} strokeWidth={2} />
                {t('settings.sync.enableBtn')}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs text-ink-soft">{t('settings.sync.setupLabel')}</label>
              <textarea
                className="input-elegant min-h-20 resize-y font-mono text-xs"
                value={setupText}
                placeholder={t('settings.sync.setupPlaceholder')}
                onChange={(e) => setSetupText(e.target.value)}
              />
              <button onClick={join} className={primaryBtn}>
                <Cloud size={15} strokeWidth={2} />
                {t('settings.sync.connectBtn')}
              </button>
            </div>
          )}

          {localError && (
            <p className="flex items-center gap-1 text-xs text-blush-600">
              <AlertCircle size={12} />
              {localError}
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {status === 'connecting' && <Loader2 size={15} className="animate-spin text-gold-500" />}
            {status === 'synced' && <Check size={15} className="text-sage-600" />}
            {status === 'error' && <AlertCircle size={15} className="text-blush-600" />}
            <span className={status === 'error' ? 'text-blush-600' : 'text-ink'}>
              {status === 'connecting'
                ? t('settings.sync.statusConnecting')
                : status === 'error'
                  ? t('settings.sync.statusError')
                  : t('settings.sync.statusSynced')}
            </span>
            {lastSyncedAt && status !== 'connecting' && (
              <span className="text-xs text-ink-soft">
                · {t('settings.sync.lastSynced', { time: formatTime(lastSyncedAt, i18n.language) })}
              </span>
            )}
          </div>
          {error && status === 'error' && (
            <p className="break-words text-xs text-blush-600">{error}</p>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-ink-soft">{t('settings.sync.shareLabel')}</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={setupCode}
                onFocus={(e) => e.currentTarget.select()}
                className="input-elegant font-mono text-xs"
              />
              <button onClick={copy} className={`${ghostBtn} shrink-0`}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? t('settings.sync.copied') : t('settings.sync.copy')}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={pushNow} className={ghostBtn}>
              <RefreshCw size={14} />
              {t('settings.sync.syncNow')}
            </button>
            <button onClick={turnOff} className={ghostBtn}>
              {t('settings.sync.disable')}
            </button>
          </div>
        </>
      )}
    </Card>
  );
}
