import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Users, Pencil, ExternalLink } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState, Field, EditActions } from '../components/ui';
import { genId } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';
import { useEditableList } from '../lib/useEditableList';
import type { NegotiationStatus, Vendor, VendorCategory } from '../types';

const CATEGORIES: VendorCategory[] = [
  'catering',
  'videography',
  'venue',
  'sound_lighting',
  'attire',
  'photography',
  'other',
];

const STATUSES: NegotiationStatus[] = ['contacted', 'negotiating', 'confirmed'];

const statusTone: Record<NegotiationStatus, 'neutral' | 'warning' | 'success'> = {
  contacted: 'neutral',
  negotiating: 'warning',
  confirmed: 'success',
};

function VendorView({ vendor, onEdit }: { vendor: Vendor; onEdit: () => void }) {
  const { t } = useTranslation();
  const money = useCurrency();
  const deleteVendor = useWeddingStore((s) => s.deleteVendor);

  return (
    <div className="card-surface flex items-start justify-between gap-3 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif-heading text-lg font-medium text-ink">
            {vendor.name || <span className="text-ink-soft/70">{t('common.untitled')}</span>}
          </h3>
          <Badge>{t(`vendors.cat_${vendor.category}`)}</Badge>
          <Badge tone={statusTone[vendor.status]}>{t(`vendors.status_${vendor.status}`)}</Badge>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
          <span>{vendor.contact || t('common.noContact')}</span>
          {vendor.quoteAmount > 0 && (
            <span className="font-medium text-ink">{money.format(vendor.quoteAmount)}</span>
          )}
          {vendor.link && (
            <a
              href={vendor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blush-600 hover:text-blush-700"
            >
              <ExternalLink size={12} />
              {t('common.openLink')}
            </a>
          )}
        </div>
        {vendor.notes && <p className="mt-1.5 text-xs text-ink-soft">{vendor.notes}</p>}
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
          onClick={() => deleteVendor(vendor.id)}
          aria-label={t('common.delete')}
          className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function VendorEdit({
  vendor,
  isNew,
  onDone,
}: {
  vendor: Vendor;
  isNew: boolean;
  onDone: () => void;
}) {
  const { t } = useTranslation();
  const money = useCurrency();
  const { updateVendor, deleteVendor } = useWeddingStore();
  const [draft, setDraft] = useState<Vendor>(vendor);
  const set = (patch: Partial<Vendor>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    updateVendor(vendor.id, draft);
    onDone();
  };
  const cancel = () => {
    if (isNew) deleteVendor(vendor.id);
    onDone();
  };

  return (
    <Card className="space-y-3">
      <input
        autoFocus
        className="input-elegant border-none bg-transparent px-0 font-serif-heading text-lg font-medium focus:bg-paper focus:px-2"
        value={draft.name}
        placeholder={t('common.name')}
        onChange={(e) => set({ name: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label={t('common.category')}>
          <select
            className="input-elegant"
            value={draft.category}
            onChange={(e) => set({ category: e.target.value as VendorCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`vendors.cat_${c}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('common.status')}>
          <select
            className="input-elegant"
            value={draft.status}
            onChange={(e) => set({ status: e.target.value as NegotiationStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`vendors.status_${s}`)}
              </option>
            ))}
          </select>
        </Field>
        <Field label={t('common.contact')}>
          <input
            className="input-elegant"
            value={draft.contact}
            placeholder="Phone / Zalo / Line / Email"
            onChange={(e) => set({ contact: e.target.value })}
          />
        </Field>
        <Field label={`${t('vendors.quoteAmount')} (${money.unit})`}>
          <input
            type="number"
            className="input-elegant"
            value={money.toDisplay(draft.quoteAmount)}
            min={0}
            step={money.step}
            onChange={(e) => set({ quoteAmount: money.fromDisplay(Number(e.target.value) || 0) })}
          />
        </Field>
        <Field label={t('common.link')}>
          <input
            className="input-elegant"
            value={draft.link ?? ''}
            placeholder="https://..."
            onChange={(e) => set({ link: e.target.value })}
          />
        </Field>
      </div>

      <Field label={t('common.notes')}>
        <textarea
          className="input-elegant min-h-16 resize-y"
          value={draft.notes}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </Field>

      <EditActions onSave={save} onCancel={cancel} saveLabel={t('common.save')} cancelLabel={t('common.cancel')} />
    </Card>
  );
}

export default function Vendors() {
  const { t } = useTranslation();
  const { vendors, addVendor } = useWeddingStore();
  const [filter, setFilter] = useState<VendorCategory | 'all'>('all');
  const edit = useEditableList();

  const filtered = filter === 'all' ? vendors : vendors.filter((v) => v.category === filter);

  const handleAdd = () => {
    const id = genId('v');
    addVendor({
      id,
      name: '',
      category: filter === 'all' ? 'other' : filter,
      contact: '',
      quoteAmount: 0,
      status: 'contacted',
      notes: '',
      link: '',
    });
    edit.startNew(id);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t('vendors.heading')}
        action={
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
          >
            <Plus size={15} strokeWidth={2} />
            {t('vendors.addVendor')}
          </button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
            filter === 'all'
              ? 'border-blush-400 bg-blush-500 text-white'
              : 'border-line bg-paper text-ink-soft hover:border-blush-300'
          }`}
        >
          {t('vendors.categoryAll')}
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              filter === c
                ? 'border-blush-400 bg-blush-500 text-white'
                : 'border-line bg-paper text-ink-soft hover:border-blush-300'
            }`}
          >
            {t(`vendors.cat_${c}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={22} className="text-ink-soft/50" />} text={t('vendors.noVendors')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) =>
            edit.isEditing(vendor.id) ? (
              <VendorEdit
                key={vendor.id}
                vendor={vendor}
                isNew={edit.isNew(vendor.id)}
                onDone={edit.done}
              />
            ) : (
              <VendorView key={vendor.id} vendor={vendor} onEdit={() => edit.startEdit(vendor.id)} />
            )
          )}
        </div>
      )}
    </div>
  );
}
