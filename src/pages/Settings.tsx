import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { useWeddingStore, VN_WEDDING_DATE } from '../store/useWeddingStore';
import { Card, SectionHeading } from '../components/ui';
import { formatDate } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';
import type { Lang } from '../types';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const money = useCurrency();
  const {
    vnWeddingDate,
    twWeddingDate,
    totalBudgetCap,
    setTwWeddingDate,
    setTotalBudgetCap,
    setLanguage,
    exportState,
    importState,
    resetAll,
  } = useWeddingStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [saved, setSaved] = useState(false);

  const flashSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleLangChange = (lang: Lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const handleExport = () => {
    const json = exportState();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `wedding-planner-backup-${dateStamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const ok = importState(text);
      if (ok) {
        setImportMessage({ type: 'success', text: t('settings.importSuccess') });
        i18n.changeLanguage(useWeddingStore.getState().language);
      } else {
        setImportMessage({ type: 'error', text: t('settings.importError') });
      }
      setTimeout(() => setImportMessage(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm(t('settings.resetConfirm'))) {
      resetAll();
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading title={t('settings.heading')} />

      <Card className="space-y-5">
        <div>
          <label className="text-sm font-medium text-ink">{t('settings.vnDateLabel')}</label>
          <input
            type="date"
            className="input-elegant mt-1.5 max-w-xs"
            value={vnWeddingDate}
            disabled
          />
          <p className="mt-1 text-xs text-ink-soft">{formatDate(VN_WEDDING_DATE, i18n.language)}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">{t('settings.twDateLabel')}</label>
          <input
            type="date"
            className="input-elegant mt-1.5 max-w-xs"
            value={twWeddingDate}
            onChange={(e) => {
              setTwWeddingDate(e.target.value);
              flashSaved();
            }}
          />
          <p className="mt-1 text-xs text-ink-soft">{t('settings.twDateHint')}</p>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">
            {t('settings.budgetCapLabel')} ({money.unit})
          </label>
          <input
            type="number"
            className="input-elegant mt-1.5 max-w-xs"
            value={money.toDisplay(totalBudgetCap)}
            min={0}
            step={money.step}
            onChange={(e) => {
              setTotalBudgetCap(money.fromDisplay(Number(e.target.value) || 0));
              flashSaved();
            }}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink">{t('settings.languageLabel')}</label>
          <div className="mt-1.5 flex gap-2">
            <button
              onClick={() => handleLangChange('vi')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                i18n.language === 'vi'
                  ? 'bg-blush-500 text-white'
                  : 'border border-line bg-paper text-ink-soft hover:border-blush-300'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => handleLangChange('zh-TW')}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                i18n.language === 'zh-TW'
                  ? 'bg-blush-500 text-white'
                  : 'border border-line bg-paper text-ink-soft hover:border-blush-300'
              }`}
            >
              繁體中文
            </button>
          </div>
        </div>

        {saved && (
          <p className="flex items-center gap-1.5 text-xs text-sage-600">
            <Check size={13} /> {t('settings.saved')}
          </p>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif-heading text-lg font-medium text-ink">{t('settings.dataManagement')}</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line p-4">
            <button
              onClick={handleExport}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-sage-500 px-4 py-2.5 text-sm font-medium text-white shadow-soft transition-colors hover:bg-sage-600"
            >
              <Download size={15} strokeWidth={2} />
              {t('settings.exportData')}
            </button>
          </div>

          <div className="rounded-lg border border-line p-4">
            <button
              onClick={handleImportClick}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-blush-300 bg-blush-50 px-4 py-2.5 text-sm font-medium text-blush-700 transition-colors hover:bg-blush-100"
            >
              <Upload size={15} strokeWidth={2} />
              {t('settings.importData')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {importMessage && (
          <p
            className={`flex items-center gap-1.5 text-sm ${
              importMessage.type === 'success' ? 'text-sage-600' : 'text-blush-600'
            }`}
          >
            {importMessage.type === 'success' ? <Check size={15} /> : <AlertCircle size={15} />}
            {importMessage.text}
          </p>
        )}

        <div className="border-t border-line pt-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
          >
            <RotateCcw size={13} />
            {t('settings.resetData')}
          </button>
        </div>
      </Card>
    </div>
  );
}
