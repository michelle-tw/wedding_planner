import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { CalendarHeart, PartyPopper, AlertCircle, ArrowRight } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, ProgressBar, VarianceBar, Badge } from '../components/ui';
import { daysUntil, formatDate, localize } from '../lib/utils';
import { useCurrency } from '../lib/useCurrency';

function CountdownCard({
  label,
  dateIso,
  accent,
}: {
  label: string;
  dateIso: string;
  accent: 'blush' | 'sage';
}) {
  const { t, i18n } = useTranslation();
  const days = daysUntil(dateIso);
  const accentClasses =
    accent === 'blush'
      ? 'from-blush-50 to-paper border-blush-200'
      : 'from-sage-50 to-paper border-sage-200';
  const numberColor = accent === 'blush' ? 'text-blush-600' : 'text-sage-600';

  return (
    <Card className={`bg-gradient-to-br ${accentClasses}`}>
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        <CalendarHeart size={16} strokeWidth={1.75} />
        {label}
      </div>
      <div className="mt-3 flex items-end gap-2">
        {days > 0 ? (
          <>
            <span className={`font-serif-heading text-5xl font-semibold ${numberColor}`}>{days}</span>
            <span className="mb-1 text-sm text-ink-soft">{t('dashboard.daysLeft')}</span>
          </>
        ) : days === 0 ? (
          <span className={`font-serif-heading text-2xl font-semibold ${numberColor}`}>
            {t('dashboard.todayIsTheDay')}
          </span>
        ) : (
          <span className="font-serif-heading text-2xl font-semibold text-ink-soft">
            {t('dashboard.datePassed')}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-ink-soft">{formatDate(dateIso, i18n.language)}</p>
    </Card>
  );
}

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const money = useCurrency();
  const { vnWeddingDate, twWeddingDate, totalBudgetCap, budgetItems, tasks, guests } =
    useWeddingStore();

  const totalActual = budgetItems.reduce((sum, b) => sum + b.actual, 0);
  const totalPlanned = budgetItems.reduce((sum, b) => sum + b.planned, 0);

  const doneCount = tasks.filter((t2) => t2.status === 'done').length;
  const completionPct = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;

  // "Urgent" tasks: not done, in the earliest incomplete phase (proxy for
  // "next 7 days" since phases are the doc's actual time-boxing mechanism)
  const phaseOrder: string[] = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];
  const earliestIncompletePhase = phaseOrder.find((p) =>
    tasks.some((t2) => t2.phase === p && t2.status !== 'done')
  );
  const urgentTasks = tasks
    .filter((t2) => t2.status !== 'done' && t2.phase === earliestIncompletePhase)
    .slice(0, 6);

  const isOverBudget = totalActual > totalBudgetCap;

  return (
    <div className="space-y-6">
      <SectionHeading title={t('dashboard.heading')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CountdownCard label={t('dashboard.countdownVn')} dateIso={vnWeddingDate} accent="blush" />
        <CountdownCard label={t('dashboard.countdownTw')} dateIso={twWeddingDate} accent="sage" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif-heading text-lg font-medium text-ink">
              {t('dashboard.checklistProgress')}
            </h2>
            <Badge tone="success">{completionPct}% {t('dashboard.completed')}</Badge>
          </div>
          <ProgressBar value={completionPct} colorClass="bg-sage-400" />
          <p className="mt-2 text-xs text-ink-soft">
            {doneCount} / {tasks.length}
          </p>
          <Link
            to="/tasks"
            className="mt-3 inline-flex items-center gap-1 text-sm text-blush-600 hover:text-blush-700"
          >
            {t('nav.tasks')} <ArrowRight size={14} />
          </Link>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif-heading text-lg font-medium text-ink">
              {t('dashboard.budgetVariance')}
            </h2>
            <Badge tone={isOverBudget ? 'danger' : 'success'}>
              {isOverBudget ? t('budget.overBudget') : t('budget.underBudget')}
            </Badge>
          </div>
          <VarianceBar
            planned={totalBudgetCap}
            actual={totalActual}
            labelPlanned={t('dashboard.planned')}
            labelActual={t('dashboard.actual')}
            formatValue={money.format}
          />
          <p className="mt-2 text-xs text-ink-soft">
            {t('budget.totalCap')}: {money.format(totalBudgetCap)} · {t('common.total')} {t('dashboard.planned').toLowerCase()}: {money.format(totalPlanned)}
          </p>
          <Link
            to="/budget"
            className="mt-3 inline-flex items-center gap-1 text-sm text-blush-600 hover:text-blush-700"
          >
            {t('nav.budget')} <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} strokeWidth={1.75} className="text-gold-500" />
            <h2 className="font-serif-heading text-lg font-medium text-ink">{t('dashboard.urgentTasks')}</h2>
          </div>
          {urgentTasks.length > 0 && earliestIncompletePhase && (
            <Badge tone="gold">{t(`tasks.${earliestIncompletePhase}`)}</Badge>
          )}
        </div>
        {urgentTasks.length === 0 ? (
          <p className="text-sm text-ink-soft">{t('dashboard.noUrgentTasks')}</p>
        ) : (
          <ul className="divide-y divide-line">
            {urgentTasks.map((task, i) => (
              <li
                key={task.id}
                className="animate-fade-up py-2.5"
                style={{ animationDelay: `${i * 55}ms` }}
              >
                <p className="text-sm font-medium text-ink">{localize(task.title, lang)}</p>
                {task.note && (
                  <p className="mt-0.5 text-xs text-ink-soft">{localize(task.note, lang)}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <div className="mb-3 flex items-center gap-2">
          <PartyPopper size={18} strokeWidth={1.75} className="text-blush-500" />
          <h2 className="font-serif-heading text-lg font-medium text-ink">{t('dashboard.quickLinks')}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { to: '/vendors', key: 'vendors' },
            { to: '/guests', key: 'guests' },
            { to: '/timeline', key: 'timeline' },
            { to: '/documents', key: 'documents' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-soft">
          {t('guests.totalGuests')}: {guests.length}
        </p>
      </Card>
    </div>
  );
}
