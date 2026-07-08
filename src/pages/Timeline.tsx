import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MapPin, Utensils, CalendarHeart, Hotel } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge } from '../components/ui';
import { formatDate } from '../lib/utils';
import { seedItineraries } from '../data/seed';
import type { ItineraryPlan } from '../types';

function DayCard({ day, activities, defaultOpen }: { day: number; activities: string; defaultOpen?: boolean }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(!!defaultOpen);

  return (
    <div className="card-surface overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blush-100 text-xs font-medium text-blush-600">
            {day}
          </span>
          <span className="text-sm font-medium text-ink">
            {open ? t('timeline.collapseDay') : t('timeline.expandDay')}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="border-t border-line px-4 py-3">
          <p className="text-sm leading-relaxed text-ink-soft">{activities}</p>
        </div>
      )}
    </div>
  );
}

function ItineraryCard({ plan }: { plan: ItineraryPlan }) {
  const { t } = useTranslation();

  return (
    <Card className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <MapPin size={18} strokeWidth={1.75} className="text-blush-500" />
          <h2 className="font-serif-heading text-xl font-medium text-ink">{t(plan.titleKey)}</h2>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-cream/70 p-3 text-xs text-ink-soft">
        <Hotel size={15} className="mt-0.5 shrink-0" strokeWidth={1.75} />
        <div>
          <p className="font-medium text-ink">{t('timeline.stayTip')}</p>
          <p className="mt-0.5">{plan.stayNote}</p>
        </div>
      </div>

      <div className="space-y-2">
        {plan.days.map((d, idx) => (
          <DayCard key={d.day} day={d.day} activities={d.activities} defaultOpen={idx === 0} />
        ))}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-sage-50 p-3 text-xs text-ink-soft">
        <Utensils size={15} className="mt-0.5 shrink-0 text-sage-600" strokeWidth={1.75} />
        <div>
          <p className="font-medium text-ink">{t('timeline.foodTip')}</p>
          <p className="mt-0.5">{plan.foodNote}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Timeline() {
  const { t, i18n } = useTranslation();
  const { vnWeddingDate, twWeddingDate } = useWeddingStore();

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

      <h2 className="font-serif-heading text-xl font-medium text-ink">{t('timeline.itineraries')}</h2>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {seedItineraries.map((plan) => (
          <ItineraryCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}
