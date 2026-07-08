import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Users, Pencil, ExternalLink, X } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState, Field, EditActions } from '../components/ui';
import { genId } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';
import { useEditableList } from '../lib/useEditableList';
import { ImageUploader, ImageGallery } from '../components/ImageAttachments';
import type { NegotiationStatus, Vendor, VendorCategory } from '../types';

const BUILTIN_CATEGORIES: VendorCategory[] = [
  'catering',
  'videography',
  'venue',
  'sound_lighting',
  'attire',
  'photography',
  'other',
];
const BUILTIN_SET = new Set<string>(BUILTIN_CATEGORIES);

const STATUSES: NegotiationStatus[] = ['contacted', 'negotiating', 'confirmed'];

const statusTone: Record<NegotiationStatus, 'neutral' | 'warning' | 'success'> = {
  contacted: 'neutral',
  negotiating: 'warning',
  confirmed: 'success',
};

// Resolve any category id (built-in / custom tag / 'other' free-text) to a label.
function useCategoryLabel() {
  const { t } = useTranslation();
  const vendorTags = useWeddingStore((s) => s.vendorTags);
  return (category: string, categoryOther?: string) => {
    if (category === 'other') return categoryOther?.trim() || t('vendors.cat_other');
    if (BUILTIN_SET.has(category)) return t(`vendors.cat_${category}`);
    return vendorTags.find((tag) => tag.id === category)?.name || t('vendors.cat_other');
  };
}

function VendorView({ vendor, onEdit }: { vendor: Vendor; onEdit: () => void }) {
  const { t } = useTranslation();
  const money = useCurrency();
  const categoryLabel = useCategoryLabel();
  const deleteVendor = useWeddingStore((s) => s.deleteVendor);

  return (
    <div className="card-surface flex items-start justify-between gap-3 p-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-serif-heading text-lg font-medium text-ink">
            {vendor.name || <span className="text-ink-soft/70">{t('common.untitled')}</span>}
          </h3>
          <Badge>{categoryLabel(vendor.category, vendor.categoryOther)}</Badge>
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
        {vendor.images && vendor.images.length > 0 && (
          <div className="mt-2.5">
            <ImageGallery images={vendor.images} />
          </div>
        )}
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

function VendorEdit({ vendor, isNew, onDone }: { vendor: Vendor; isNew: boolean; onDone: () => void }) {
  const { t } = useTranslation();
  const money = useCurrency();
  const vendorTags = useWeddingStore((s) => s.vendorTags);
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
            onChange={(e) => set({ category: e.target.value })}
          >
            {BUILTIN_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`vendors.cat_${c}`)}
              </option>
            ))}
            {vendorTags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name || t('common.untitled')}
              </option>
            ))}
          </select>
          {draft.category === 'other' && (
            <input
              className="input-elegant mt-2"
              value={draft.categoryOther ?? ''}
              placeholder={t('vendors.otherPlaceholder')}
              onChange={(e) => set({ categoryOther: e.target.value })}
            />
          )}
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

      <Field label={t('common.images')}>
        <ImageUploader images={draft.images ?? []} onChange={(images) => set({ images })} />
      </Field>

      <EditActions onSave={save} onCancel={cancel} saveLabel={t('common.save')} cancelLabel={t('common.cancel')} />
    </Card>
  );
}

function tagButtonClass(active: boolean): string {
  return active
    ? 'border-blush-400 bg-blush-500 text-white'
    : 'border-line bg-paper text-ink-soft hover:border-blush-300';
}

export default function Vendors() {
  const { t } = useTranslation();
  const { vendors, vendorTags, addVendor, addVendorTag, deleteVendorTag } = useWeddingStore();
  const [filter, setFilter] = useState<string>('all');
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const cancelAdd = useRef(false);
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
      images: [],
    });
    edit.startNew(id);
  };

  const commitNewCat = () => {
    if (cancelAdd.current) {
      cancelAdd.current = false;
      setAddingCat(false);
      setNewCatName('');
      return;
    }
    const name = newCatName.trim();
    setAddingCat(false);
    setNewCatName('');
    if (name) {
      const id = genId('vc');
      addVendorTag({ id, name });
      setFilter(id);
    }
  };

  const removeTag = (id: string) => {
    if (filter === id) setFilter('all');
    deleteVendorTag(id);
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

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${tagButtonClass(filter === 'all')}`}
        >
          {t('vendors.categoryAll')}
        </button>
        {BUILTIN_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${tagButtonClass(filter === c)}`}
          >
            {t(`vendors.cat_${c}`)}
          </button>
        ))}
        {vendorTags.map((tag) => {
          const active = filter === tag.id;
          return (
            <span
              key={tag.id}
              className={`inline-flex items-center gap-1 rounded-full border py-1.5 pl-3 pr-1.5 text-xs transition-colors ${tagButtonClass(active)}`}
            >
              <button onClick={() => setFilter(tag.id)}>{tag.name || t('common.untitled')}</button>
              <button
                onClick={() => removeTag(tag.id)}
                aria-label={t('common.delete')}
                className={`rounded-full p-0.5 ${active ? 'hover:bg-white/25' : 'hover:bg-blush-100'}`}
              >
                <X size={11} />
              </button>
            </span>
          );
        })}
        {addingCat ? (
          <input
            autoFocus
            className="input-elegant w-52"
            value={newCatName}
            placeholder={t('vendors.categoryNamePlaceholder')}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') {
                cancelAdd.current = true;
                e.currentTarget.blur();
              }
            }}
            onBlur={commitNewCat}
          />
        ) : (
          <button
            onClick={() => setAddingCat(true)}
            className="flex items-center gap-1 rounded-full border border-dashed border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
          >
            <Plus size={12} />
            {t('vendors.addCategory')}
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={22} className="text-ink-soft/50" />} text={t('vendors.noVendors')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((vendor) =>
            edit.isEditing(vendor.id) ? (
              <VendorEdit key={vendor.id} vendor={vendor} isNew={edit.isNew(vendor.id)} onDone={edit.done} />
            ) : (
              <VendorView key={vendor.id} vendor={vendor} onEdit={() => edit.startEdit(vendor.id)} />
            )
          )}
        </div>
      )}
    </div>
  );
}
