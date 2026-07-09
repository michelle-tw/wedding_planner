import { useTranslation } from 'react-i18next';
import { MapPin, Utensils, CalendarHeart, Hotel, Plus, Trash2, X } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState } from '../components/ui';
import { formatDate, genId } from '../lib/utils';
import type { ItineraryPlan } from '../types';

function ItineraryEditor({ plan }: { plan: ItineraryPlan }) {
  const { t } = useTranslation();
  const { updateItinerary, deleteItinerary } = useWeddingStore();

  const setDayAt = (i: number, activities: string) =>
    updateItinerary(plan.id, { days: plan.days.map((d, j) => (j === i ? { activities } : d)) });
  const addDay = () => updateItinerary(plan.id, { days: [...plan.days, { activities: '' }] });
  const removeDay = (i: number) =>
    updateItinerary(plan.id, { days: plan.days.filter((_, j) => j !== i) });

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-1 items-center gap-2">
          <MapPin size={18} strokeWidth={1.75} className="shrink-0 text-blush-500" />
          <input
            className="input-elegant border-none bg-transparent px-0 font-serif-heading text-xl font-medium focus:bg-paper focus:px-2"
            value={plan.title}
            placeholder={t('timeline.itineraryNamePlaceholder')}
            onChange={(e) => updateItinerary(plan.id, { title: e.target.value })}
          />
        </div>
        <button
          onClick={() => deleteItinerary(plan.id)}
          aria-label={t('common.delete')}
          className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <label className="block rounded-lg bg-cream/70 p-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
          <Hotel size={13} strokeWidth={1.75} /> {t('timeline.stayTip')}
        </span>
        <textarea
          className="input-elegant mt-1.5 min-h-12 resize-y bg-paper text-xs"
          value={plan.stayNote}
          placeholder={t('timeline.stayNotePlaceholder')}
          onChange={(e) => updateItinerary(plan.id, { stayNote: e.target.value })}
        />
      </label>

      <div className="space-y-2">
        {plan.days.map((d, i) => (
          <div key={i} className="rounded-lg border border-line p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium text-blush-600">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blush-100 text-xs">
                  {i + 1}
                </span>
                {t('timeline.dayLabel', { n: i + 1 })}
              </span>
              <button
                onClick={() => removeDay(i)}
                aria-label={t('common.delete')}
                className="rounded-full p-1 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
              >
                <X size={13} />
              </button>
            </div>
            <textarea
              className="input-elegant min-h-14 resize-y text-sm"
              value={d.activities}
              placeholder={t('timeline.dayPlaceholder')}
              onChange={(e) => setDayAt(i, e.target.value)}
            />
          </div>
        ))}
        <button
          onClick={addDay}
          className="flex items-center gap-1 text-xs text-blush-600 transition-colors hover:text-blush-700"
        >
          <Plus size={13} /> {t('timeline.addDay')}
        </button>
      </div>

      <label className="block rounded-lg bg-sage-50 p-3">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink">
          <Utensils size={13} strokeWidth={1.75} className="text-sage-600" /> {t('timeline.foodTip')}
        </span>
        <textarea
          className="input-elegant mt-1.5 min-h-12 resize-y bg-paper text-xs"
          value={plan.foodNote}
          placeholder={t('timeline.foodNotePlaceholder')}
          onChange={(e) => updateItinerary(plan.id, { foodNote: e.target.value })}
        />
      </label>
    </Card>
  );
}

export default function Timeline() {
  const { t, i18n } = useTranslation();
  const { vnWeddingDate, twWeddingDate, itineraries, addItinerary } = useWeddingStore();

  const handleAdd = () =>
    addItinerary({ id: genId('it'), title: '', stayNote: '', foodNote: '', days: [{ activities: '' }] });

  return (
    <div className="space-y-6">
      <SectionHeading title={t('timeline.heading')} />

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <CalendarHeart size={18} strokeWidth={1.75} className="text-blush-500" />
          <h2 className="font-serif-heading text-lg font-medium text-ink">{t('timeline.weddingDates')}</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-lg border border-blush-200 bg-blush-50 px-4 py-3">
            <span className="text-sm font-medium text-ink">{t('timeline.vnWedding')}</span>
            <Badge tone="danger">{formatDate(vnWeddingDate, i18n.language)}</Badge>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-sage-200 bg-sage-50 px-4 py-3">
            <span className="text-sm font-medium text-ink">{t('timeline.twWedding')}</span>
            <Badge tone="success">{formatDate(twWeddingDate, i18n.language)}</Badge>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif-heading text-xl font-medium text-ink">{t('timeline.itineraries')}</h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
        >
          <Plus size={15} strokeWidth={2} />
          {t('timeline.addItinerary')}
        </button>
      </div>

      {itineraries.length === 0 ? (
        <EmptyState icon={<MapPin size={22} className="text-ink-soft/50" />} text={t('timeline.emptyItineraries')} />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {itineraries.map((plan) => (
            <ItineraryEditor key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
