import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Users } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState } from '../components/ui';
import { formatVnd, genId } from '../lib/utils';
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

function VendorCard({ vendor }: { vendor: Vendor }) {
  const { t } = useTranslation();
  const { updateVendor, deleteVendor } = useWeddingStore();

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <input
          className="input-elegant flex-1 border-none bg-transparent px-0 font-serif-heading text-lg font-medium focus:bg-paper focus:px-2"
          value={vendor.name}
          placeholder={t('common.name')}
          onChange={(e) => updateVendor(vendor.id, { name: e.target.value })}
        />
        <button
          onClick={() => deleteVendor(vendor.id)}
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
            value={vendor.category}
            onChange={(e) => updateVendor(vendor.id, { category: e.target.value as VendorCategory })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {t(`vendors.cat_${c}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('common.status')}</label>
          <select
            className="input-elegant mt-1"
            value={vendor.status}
            onChange={(e) => updateVendor(vendor.id, { status: e.target.value as NegotiationStatus })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`vendors.status_${s}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('common.contact')}</label>
          <input
            className="input-elegant mt-1"
            value={vendor.contact}
            placeholder="Phone / Zalo / Line / Email"
            onChange={(e) => updateVendor(vendor.id, { contact: e.target.value })}
          />
        </div>
        <div>
          <label className="text-xs text-ink-soft">{t('vendors.quoteAmount')}</label>
          <input
            type="number"
            className="input-elegant mt-1"
            value={vendor.quoteAmount}
            min={0}
            onChange={(e) => updateVendor(vendor.id, { quoteAmount: Number(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-ink-soft">{t('common.notes')}</label>
        <textarea
          className="input-elegant mt-1 min-h-16 resize-y"
          value={vendor.notes}
          onChange={(e) => updateVendor(vendor.id, { notes: e.target.value })}
        />
      </div>

      <div className="flex items-center justify-between">
        <Badge tone={statusTone[vendor.status]}>{t(`vendors.status_${vendor.status}`)}</Badge>
        {vendor.quoteAmount > 0 && (
          <span className="text-sm font-medium text-ink">{formatVnd(vendor.quoteAmount)}</span>
        )}
      </div>
    </Card>
  );
}

export default function Vendors() {
  const { t } = useTranslation();
  const { vendors, addVendor } = useWeddingStore();
  const [filter, setFilter] = useState<VendorCategory | 'all'>('all');

  const filtered = filter === 'all' ? vendors : vendors.filter((v) => v.category === filter);

  const handleAdd = () => {
    addVendor({
      id: genId('v'),
      name: '',
      category: filter === 'all' ? 'other' : filter,
      contact: '',
      quoteAmount: 0,
      status: 'contacted',
      notes: '',
    });
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      )}
    </div>
  );
}
