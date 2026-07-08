import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ExternalLink, AlertTriangle, FolderLock } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState } from '../components/ui';
import { genId, daysUntil } from '../lib/utils';
import type { DocumentCategory, DocumentItem, DocumentStatus } from '../types';

const CATEGORIES: DocumentCategory[] = ['marriage', 'passport', 'vendor_contract', 'visa', 'other'];
const STATUSES: DocumentStatus[] = ['not_started', 'in_progress', 'completed'];

const statusTone: Record<DocumentStatus, 'neutral' | 'warning' | 'success'> = {
  not_started: 'neutral',
  in_progress: 'warning',
  completed: 'success',
};

const EXPIRING_SOON_THRESHOLD_DAYS = 60;

function DocumentCard({ doc }: { doc: DocumentItem }) {
  const { t } = useTranslation();
  const { updateDocument, deleteDocument } = useWeddingStore();

  const daysLeft = doc.expiryDate ? daysUntil(doc.expiryDate) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= EXPIRING_SOON_THRESHOLD_DAYS;
  const isExpired = daysLeft !== null && daysLeft < 0;

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <input
          className="input-elegant flex-1 border-none bg-transparent px-0 font-serif-heading text-lg font-medium focus:bg-paper focus:px-2"
          value={doc.name}
          placeholder={t('common.name')}
          onChange={(e) => updateDocument(doc.id, { name: e.target.value })}
        />
        <button
          onClick={() => deleteDocument(doc.id)}
          className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
          aria-label={t('common.delete')}
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs text-ink-soft">{t('common.category')}</label>
          <select
            className="input-elegant mt-1"
            value={doc.category}
            onChange={(e) => updateDocument(doc.id, { category: e.target.value as DocumentCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`documents.cat_${c}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('common.status')}</label>
          <select
            className="input-elegant mt-1"
            value={doc.status}
            onChange={(e) => updateDocument(doc.id, { status: e.target.value as DocumentStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`documents.status_${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('common.link')}</label>
          <input
            className="input-elegant mt-1"
            value={doc.link ?? ''}
            placeholder="https://..."
            onChange={(e) => updateDocument(doc.id, { link: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('documents.expiryDate')}</label>
          <input
            type="date"
            className="input-elegant mt-1"
            value={doc.expiryDate ?? ''}
            onChange={(e) => updateDocument(doc.id, { expiryDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-ink-soft">{t('common.notes')}</label>
        <textarea
          className="input-elegant mt-1 min-h-14 resize-y"
          value={doc.notes ?? ''}
          onChange={(e) => updateDocument(doc.id, { notes: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Badge tone={statusTone[doc.status]}>{t(`documents.status_${doc.status}`)}</Badge>
        <div className="flex items-center gap-2">
          {doc.link && (
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-blush-600 hover:text-blush-700"
            >
              <ExternalLink size={13} />
            </a>
          )}
          {(isExpiringSoon || isExpired) && (
            <span className="flex items-center gap-1 rounded-full bg-blush-100 px-2.5 py-1 text-xs font-medium text-blush-700">
              <AlertTriangle size={12} />
              {t('documents.expiringSoon')}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Documents() {
  const { t } = useTranslation();
  const { documents, addDocument } = useWeddingStore();

  const handleAdd = () => {
    addDocument({
      id: genId('d'),
      name: '',
      category: 'other',
      status: 'not_started',
      notes: '',
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t('documents.heading')}
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
          >
            <Plus size={15} strokeWidth={2} />
            {t('documents.addDocument')}
          </button>
        }
      />

      {documents.length === 0 ? (
        <EmptyState icon={<FolderLock size={22} className="text-ink-soft/50" />} text={t('documents.addDocument')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
