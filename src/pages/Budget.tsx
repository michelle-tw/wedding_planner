import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, StarOff, X, Lightbulb } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, VarianceBar, Badge } from '../components/ui';
import { formatVnd } from '../lib/utils';
import { CUT_FIRST_ORDER, NEVER_CUT } from '../data/seed';
import type { BudgetCategory } from '../types';

export default function Budget() {
  const { t } = useTranslation();
  const { budget, totalBudgetCap, setTotalBudgetCap, updateBudgetCategory, guests } =
    useWeddingStore();

  const [suggestion, setSuggestion] = useState<{ raisedName: string; suggestId: string } | null>(
    null
  );

  const totalPlanned = budget.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = budget.reduce((sum, b) => sum + b.actual, 0);
  const isOverCap = totalPlanned > totalBudgetCap;

  const handlePlannedChange = (cat: BudgetCategory, newValue: number) => {
    const oldValue = cat.planned;
    updateBudgetCategory(cat.id, { planned: newValue });

    if (newValue > oldValue && !NEVER_CUT.includes(cat.id)) {
      // find a can-cut suggestion, preferring categories not equal to the one raised
      const candidate = CUT_FIRST_ORDER.find((id) => id !== cat.id);
      if (candidate) {
        const candidateCat = budget.find((b) => b.id === candidate);
        if (candidateCat) {
          setSuggestion({ raisedName: cat.name, suggestId: candidate });
        }
      }
    } else if (newValue > oldValue && NEVER_CUT.includes(cat.id)) {
      const candidate = CUT_FIRST_ORDER[0];
      const candidateCat = budget.find((b) => b.id === candidate);
      if (candidateCat) {
        setSuggestion({ raisedName: cat.name, suggestId: candidate });
      }
    }
  };

  const suggestedCategory = suggestion ? budget.find((b) => b.id === suggestion.suggestId) : null;

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
                value={totalBudgetCap}
                min={0}
                step={1_000_000}
                onChange={(e) => setTotalBudgetCap(Number(e.target.value) || 0)}
              />
              <span className="text-sm text-ink-soft">{t('common.vnd')}</span>
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
            formatValue={formatVnd}
          />
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          {t('budget.guestCountRef', { count: guests.length })}
        </p>
      </Card>

      <Card className="border-gold-200 bg-gold-50">
        <h3 className="font-serif-heading text-base font-medium text-gold-700">
          {t('budget.principleTitle')}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{t('budget.principleText')}</p>
      </Card>

      {suggestion && suggestedCategory && (
        <div className="flex items-start gap-3 rounded-xl border border-gold-300 bg-gold-50 p-4">
          <Lightbulb size={20} className="mt-0.5 shrink-0 text-gold-500" strokeWidth={1.75} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gold-700">{t('budget.suggestion')}</p>
            <p className="mt-1 text-sm text-ink-soft">
              {t('budget.suggestionText', {
                category: suggestion.raisedName,
                suggestName: suggestedCategory.name,
              })}
            </p>
          </div>
          <button
            onClick={() => setSuggestion(null)}
            className="shrink-0 rounded-full p-1 text-ink-soft hover:bg-gold-100"
            aria-label={t('budget.dismiss')}
          >
            <X size={16} />
          </button>
        </div>
      )}

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
                    <h3 className="font-serif-heading text-lg font-medium text-ink">{cat.name}</h3>
                    {cat.note && <p className="mt-0.5 max-w-xl text-xs text-ink-soft">{cat.note}</p>}
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
                    value={cat.planned}
                    min={0}
                    step={500_000}
                    onChange={(e) => handlePlannedChange(cat, Number(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-soft">{t('budget.actualAmount')}</label>
                  <input
                    type="number"
                    className="input-elegant mt-1"
                    value={cat.actual}
                    min={0}
                    step={500_000}
                    onChange={(e) =>
                      updateBudgetCategory(cat.id, { actual: Number(e.target.value) || 0 })
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
                  formatValue={formatVnd}
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
