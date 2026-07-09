import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cloud, RefreshCw, Copy, Check, Loader2, AlertCircle } from 'lucide-react';
import { Card } from './ui';
import { useSyncStore } from '../store/useSyncStore';
import { generateSyncCode } from '../lib/sync';
import { SHARED_FIREBASE_CONFIG } from '../lib/syncConfig';
import { restartSync, stopSync, pushNow } from '../lib/syncManager';

const ghostBtn =
  'flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600';

function formatTime(ms: number | null, locale: string): string {
  if (!ms) return '';
  return new Date(ms).toLocaleString(locale === 'zh-TW' ? 'zh-TW' : 'vi-VN');
}

export function SyncSettings() {
  const { t, i18n } = useTranslation();
  const { enabled, code, status, lastSyncedAt, error, enable, disable } = useSyncStore();
  const [copied, setCopied] = useState(false);

  const shareLink =
    enabled && code
      ? `${window.location.origin}${window.location.pathname}?sync=${code}`
      : '';

  const turnOn = () => {
    enable(SHARED_FIREBASE_CONFIG, generateSyncCode());
    void restartSync();
  };
  const turnOff = () => {
    stopSync();
    disable();
  };
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
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
      <p className="text-sm text-ink-soft">{t('settings.sync.shareOnDesc')}</p>

      {!enabled ? (
        <div className="space-y-2">
          <button
            onClick={turnOn}
            className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
          >
            <Cloud size={15} strokeWidth={2} />
            {t('settings.sync.enableShare')}
          </button>
          <p className="text-xs text-ink-soft/70">{t('settings.sync.enableNote')}</p>
        </div>
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
          {error && status === 'error' && <p className="break-words text-xs text-blush-600">{error}</p>}

          <div className="space-y-1.5">
            <label className="text-xs text-ink-soft">{t('settings.sync.shareLinkLabel')}</label>
            <div className="flex gap-2">
              <input
                readOnly
                value={shareLink}
                onFocus={(e) => e.currentTarget.select()}
                className="input-elegant text-xs"
              />
              <button onClick={copyLink} className={`${ghostBtn} shrink-0`}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? t('settings.sync.copied') : t('settings.sync.copyLink')}
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
