import { useTranslation } from 'react-i18next';
import { Star, StarOff } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, VarianceBar, Badge } from '../components/ui';
import { localize } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';

export default function Budget() {
  const { t, i18n } = useTranslation();
  const { budget, totalBudgetCap, setTotalBudgetCap, updateBudgetCategory, guests } =
    useWeddingStore();
  const lang = i18n.language;
  const money = useCurrency();

  const totalPlanned = budget.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = budget.reduce((sum, b) => sum + b.actual, 0);
  const isOverCap = totalPlanned > totalBudgetCap;

  return (
    <div className="space-y-6">
      <SectionHeading title={t('budget.heading')} />

      <Card className="bg-gradient-to-br from-gold-50 to-paper">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label className="text-sm text-ink-soft">{t('budget.totalCap')}</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                className="input-elegant w-48 font-serif-heading text-xl"
                value={money.toDisplay(totalBudgetCap)}
                min={0}
                step={money.step}
                onChange={(e) => setTotalBudgetCap(money.fromDisplay(Number(e.target.value) || 0))}
              />
              <span className="text-sm text-ink-soft">{money.unit}</span>
            </div>
          </div>
          <Badge tone={isOverCap ? 'danger' : 'success'}>
            {isOverCap ? t('budget.overBudget') : t('budget.underBudget')}
          </Badge>
        </div>
        <div className="mt-4">
          <p className="mb-1 text-xs text-ink-soft">{t('budget.overallVariance')}</p>
          <VarianceBar
            planned={totalBudgetCap}
            actual={totalActual}
            labelPlanned={t('budget.plannedAmount')}
            labelActual={t('budget.actualAmount')}
            formatValue={money.format}
          />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          {t('budget.guestCountRef', { count: guests.length })}
        </p>
        {money.currency === 'TWD' && (
          <p className="mt-1 text-xs text-ink-soft/70">
            {t('budget.rateNote', {
              vnd: new Intl.NumberFormat('vi-VN').format(Math.round(1 / money.twdPerVnd)),
            })}
          </p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {budget.map((cat) => {
          const catOver = cat.actual > cat.planned;
          return (
            <Card key={cat.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => updateBudgetCategory(cat.id, { highPriority: !cat.highPriority })}
                    className="mt-0.5 text-gold-500 transition-transform hover:scale-110"
                    title={cat.highPriority ? t('budget.highPriority') : t('budget.canCut')}
                  >
                    {cat.highPriority ? (
                      <Star size={18} fill="currentColor" strokeWidth={1.5} />
                    ) : (
                      <StarOff size={18} strokeWidth={1.5} className="text-ink-soft/50" />
                    )}
                  </button>
                  <div>
                    <h3 className="font-serif-heading text-lg font-medium text-ink">
                      {localize(cat.name, lang)}
                    </h3>
                    {cat.note && (
                      <p className="mt-0.5 max-w-xl text-xs text-ink-soft">{localize(cat.note, lang)}</p>
                    )}
                  </div>
                </div>
                <Badge tone={cat.highPriority ? 'gold' : 'neutral'}>
                  {cat.highPriority ? t('budget.highPriority') : t('budget.canCut')}
                </Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-ink-soft">{t('budget.plannedAmount')}</label>
                  <input
                    type="number"
                    className="input-elegant mt-1"
                    value={money.toDisplay(cat.planned)}
                    min={0}
                    step={money.step}
                    onChange={(e) =>
                      updateBudgetCategory(cat.id, { planned: money.fromDisplay(Number(e.target.value) || 0) })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{t('budget.actualAmount')}</label>
                  <input
                    type="number"
                    className="input-elegant mt-1"
                    value={money.toDisplay(cat.actual)}
                    min={0}
                    step={money.step}
                    onChange={(e) =>
                      updateBudgetCategory(cat.id, { actual: money.fromDisplay(Number(e.target.value) || 0) })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <VarianceBar
                  planned={cat.planned}
                  actual={cat.actual}
                  labelPlanned={t('budget.plannedAmount')}
                  labelActual={t('budget.actualAmount')}
                  formatValue={money.format}
                />
              </div>
              {catOver && (
                <p className="mt-2 text-xs text-blush-600">{t('budget.overBudget')}</p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
