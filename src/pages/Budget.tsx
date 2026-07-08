import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Star, StarOff, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, VarianceBar, Badge } from '../components/ui';
import { localize, genId } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';
import type { BudgetGroup, BudgetItem } from '../types';

function BudgetItemRow({ item }: { item: BudgetItem }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const money = useCurrency();
  const { updateBudgetItem, deleteBudgetItem } = useWeddingStore();
  const isCustom = typeof item.name === 'string';

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-2">
          <button
            onClick={() => updateBudgetItem(item.id, { highPriority: !item.highPriority })}
            className="mt-0.5 shrink-0 text-gold-500 transition-transform hover:scale-110"
            title={item.highPriority ? t('budget.highPriority') : t('budget.canCut')}
            aria-label={t('budget.highPriority')}
          >
            {item.highPriority ? (
              <Star size={16} fill="currentColor" strokeWidth={1.5} />
            ) : (
              <StarOff size={16} strokeWidth={1.5} className="text-ink-soft/40" />
            )}
          </button>
          <div className="min-w-0">
            {isCustom ? (
              <input
                className="input-elegant border-none bg-transparent px-0 text-sm font-medium focus:bg-paper focus:px-2"
                value={item.name as string}
                placeholder={t('budget.itemNamePlaceholder')}
                onChange={(e) => updateBudgetItem(item.id, { name: e.target.value })}
                autoFocus={item.name === ''}
              />
            ) : (
              <p className="text-sm font-medium text-ink">{localize(item.name, lang)}</p>
            )}
            {item.note && <p className="mt-0.5 text-xs text-ink-soft">{localize(item.note, lang)}</p>}
          </div>
        </div>
        <button
          onClick={() => deleteBudgetItem(item.id)}
          aria-label={t('common.delete')}
          className="shrink-0 rounded-full p-1 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-3">
        <label className="block">
          <span className="text-xs text-ink-soft">{t('budget.plannedAmount')}</span>
          <input
            type="number"
            className="input-elegant mt-1"
            value={money.toDisplay(item.planned)}
            min={0}
            step={money.step}
            onChange={(e) =>
              updateBudgetItem(item.id, { planned: money.fromDisplay(Number(e.target.value) || 0) })
            }
          />
        </label>
        <label className="block">
          <span className="text-xs text-ink-soft">{t('budget.actualAmount')}</span>
          <input
            type="number"
            className="input-elegant mt-1"
            value={money.toDisplay(item.actual)}
            min={0}
            step={money.step}
            onChange={(e) =>
              updateBudgetItem(item.id, { actual: money.fromDisplay(Number(e.target.value) || 0) })
            }
          />
        </label>
      </div>

      <div className="mt-2.5">
        <VarianceBar
          planned={item.planned}
          actual={item.actual}
          labelPlanned={t('budget.plannedAmount')}
          labelActual={t('budget.actualAmount')}
          formatValue={money.format}
        />
      </div>
    </div>
  );
}

function BudgetGroupCard({ group, defaultOpen }: { group: BudgetGroup; defaultOpen?: boolean }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const money = useCurrency();
  const { budgetItems, addBudgetItem, deleteBudgetGroup, updateBudgetGroup } = useWeddingStore();
  const [open, setOpen] = useState(!!defaultOpen);

  const items = budgetItems.filter((b) => b.groupId === group.id);
  const groupPlanned = items.reduce((s, i) => s + i.planned, 0);
  const groupActual = items.reduce((s, i) => s + i.actual, 0);
  const isCustomGroup = typeof group.name === 'string';

  const addItem = () =>
    addBudgetItem({ id: genId('bi'), groupId: group.id, name: '', planned: 0, actual: 0 });

  return (
    <div className="card-surface overflow-hidden">
      <div
        className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3.5"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex min-w-0 items-center gap-2">
          <ChevronDown
            size={18}
            className={`shrink-0 text-ink-soft transition-transform ${open ? 'rotate-180' : ''}`}
          />
          {isCustomGroup ? (
            <input
              onClick={(e) => e.stopPropagation()}
              className="input-elegant border-none bg-transparent px-0 font-serif-heading text-lg font-medium focus:bg-paper focus:px-2"
              value={group.name as string}
              placeholder={t('budget.groupNamePlaceholder')}
              onChange={(e) => updateBudgetGroup(group.id, { name: e.target.value })}
              autoFocus={group.name === ''}
            />
          ) : (
            <h2 className="truncate font-serif-heading text-lg font-medium text-ink">
              {localize(group.name, lang)}
            </h2>
          )}
          <Badge>{items.length}</Badge>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="text-right text-xs">
            <div className="font-medium text-ink">{money.format(groupPlanned)}</div>
            {groupActual > 0 && (
              <div className={groupActual > groupPlanned ? 'text-blush-600' : 'text-sage-600'}>
                {money.format(groupActual)}
              </div>
            )}
          </div>
          {isCustomGroup && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteBudgetGroup(group.id);
              }}
              aria-label={t('common.delete')}
              className="rounded-full p-1 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="animate-fade-up divide-y divide-line border-t border-line">
          {items.map((item) => (
            <BudgetItemRow key={item.id} item={item} />
          ))}
          <button
            onClick={addItem}
            className="flex w-full items-center gap-1.5 px-4 py-3 text-sm text-blush-600 transition-colors hover:bg-blush-50"
          >
            <Plus size={15} strokeWidth={2} />
            {t('budget.addItem')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Budget() {
  const { t } = useTranslation();
  const { budgetGroups, budgetItems, totalBudgetCap, setTotalBudgetCap, addBudgetGroup, guests } =
    useWeddingStore();
  const money = useCurrency();
  const [lastAddedGroup, setLastAddedGroup] = useState<string | null>(null);

  const totalPlanned = budgetItems.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = budgetItems.reduce((sum, b) => sum + b.actual, 0);
  const isOverCap = totalPlanned > totalBudgetCap;

  const handleAddGroup = () => {
    const id = genId('bg');
    addBudgetGroup({ id, name: '' });
    setLastAddedGroup(id);
  };

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

      <div className="space-y-4">
        {budgetGroups.map((group, i) => (
          <BudgetGroupCard key={group.id} group={group} defaultOpen={i === 0 || group.id === lastAddedGroup} />
        ))}
      </div>

      <button
        onClick={handleAddGroup}
        className="flex items-center gap-1.5 rounded-full border border-line bg-paper px-4 py-2 text-sm text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
      >
        <Plus size={15} strokeWidth={2} />
        {t('budget.addGroup')}
      </button>
    </div>
  );
}
