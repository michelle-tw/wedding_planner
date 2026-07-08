import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, ExternalLink, AlertTriangle, FolderLock, Pencil } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState, Field, EditActions } from '../components/ui';
import { genId, daysUntil, localize, formatDate } from '../lib/utils';
import { useEditableList } from '../lib/useEditableList';
import type { DocumentCategory, DocumentItem, DocumentStatus } from '../types';

const CATEGORIES: DocumentCategory[] = ['marriage', 'passport', 'vendor_contract', 'visa', 'other'];
const STATUSES: DocumentStatus[] = ['not_started', 'in_progress', 'completed'];

const statusTone: Record<DocumentStatus, 'neutral' | 'warning' | 'success'> = {
  not_started: 'neutral',
  in_progress: 'warning',
  completed: 'success',
};

const EXPIRING_SOON_THRESHOLD_DAYS = 60;

function expiryState(expiryDate?: string) {
  const daysLeft = expiryDate ? daysUntil(expiryDate) : null;
  return {
    isExpiringSoon: daysLeft !== null && daysLeft >= 0 && daysLeft <= EXPIRING_SOON_THRESHOLD_DAYS,
    isExpired: daysLeft !== null && daysLeft < 0,
  };
}

function DocumentView({ doc, onEdit }: { doc: DocumentItem; onEdit: () => void }) {
  const { t, i18n } = useTranslation();
  const deleteDocument = useWeddingStore((s) => s.deleteDocument);
  const { isExpiringSoon, isExpired } = expiryState(doc.expiryDate);

  return (
    <div className="card-surface flex items-start justify-between gap-3 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif-heading text-lg font-medium text-ink">
            {localize(doc.name, i18n.language) || (
              <span className="text-ink-soft/70">{t('common.untitled')}</span>
            )}
          </h3>
          <Badge>{t(`documents.cat_${doc.category}`)}</Badge>
          <Badge tone={statusTone[doc.status]}>{t(`documents.status_${doc.status}`)}</Badge>
          {(isExpiringSoon || isExpired) && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blush-100 px-2.5 py-1 text-xs font-medium text-blush-700">
              <AlertTriangle size={12} />
              {t('documents.expiringSoon')}
            </span>
          )}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          {doc.expiryDate && (
            <span>
              {t('documents.expiryDate')}: {formatDate(doc.expiryDate, i18n.language)}
            </span>
          )}
          {doc.link && (
            <a
              href={doc.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blush-600 hover:text-blush-700"
            >
              <ExternalLink size={12} />
              {t('common.openLink')}
            </a>
          )}
        </div>
        {doc.notes && <p className="mt-1.5 text-xs text-ink-soft">{doc.notes}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onEdit}
          aria-label={t('common.edit')}
          className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={() => deleteDocument(doc.id)}
          aria-label={t('common.delete')}
          className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function DocumentEdit({
  doc,
  isNew,
  onDone,
}: {
  doc: DocumentItem;
  isNew: boolean;
  onDone: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { updateDocument, deleteDocument } = useWeddingStore();
  const [draft, setDraft] = useState<DocumentItem>(doc);
  const set = (patch: Partial<DocumentItem>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    updateDocument(doc.id, draft);
    onDone();
  };
  const cancel = () => {
    if (isNew) deleteDocument(doc.id);
    onDone();
  };

  return (
    <Card className="space-y-3">
      <input
        autoFocus
        className="input-elegant border-none bg-transparent px-0 font-serif-heading text-lg font-medium focus:bg-paper focus:px-2"
        value={localize(draft.name, i18n.language)}
        placeholder={t('common.name')}
        onChange={(e) => set({ name: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t('common.category')}>
          <select
            className="input-elegant"
            value={draft.category}
            onChange={(e) => set({ category: e.target.value as DocumentCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`documents.cat_${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('common.status')}>
          <select
            className="input-elegant"
            value={draft.status}
            onChange={(e) => set({ status: e.target.value as DocumentStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`documents.status_${s}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('common.link')}>
          <input
            className="input-elegant"
            value={draft.link ?? ''}
            placeholder="https://..."
            onChange={(e) => set({ link: e.target.value })}
          />
        </Field>
        <Field label={t('documents.expiryDate')}>
          <input
            type="date"
            className="input-elegant"
            value={draft.expiryDate ?? ''}
            onChange={(e) => set({ expiryDate: e.target.value })}
          />
        </Field>
      </div>

      <Field label={t('common.notes')}>
        <textarea
          className="input-elegant min-h-14 resize-y"
          value={draft.notes ?? ''}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </Field>

      <EditActions onSave={save} onCancel={cancel} saveLabel={t('common.save')} cancelLabel={t('common.cancel')} />
    </Card>
  );
}

export default function Documents() {
  const { t } = useTranslation();
  const { documents, addDocument } = useWeddingStore();
  const edit = useEditableList();

  const handleAdd = () => {
    const id = genId('d');
    addDocument({ id, name: '', category: 'other', status: 'not_started', notes: '' });
    edit.startNew(id);
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
        <div className="space-y-3">
          {documents.map((doc) =>
            edit.isEditing(doc.id) ? (
              <DocumentEdit key={doc.id} doc={doc} isNew={edit.isNew(doc.id)} onDone={edit.done} />
            ) : (
              <DocumentView key={doc.id} doc={doc} onEdit={() => edit.startEdit(doc.id)} />
            )
          )}
        </div>
      )}
    </div>
  );
}
