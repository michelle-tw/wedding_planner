import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, GanttChartSquare, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, ProgressBar } from '../components/ui';
import type { PhaseId, TaskItem, TaskStatus } from '../types';

const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'done'];
const PHASE_ORDER: PhaseId[] = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];

function TaskCard({ task }: { task: TaskItem }) {
  const { t } = useTranslation();
  const moveTask = useWeddingStore((s) => s.moveTask);
  const currentIndex = STATUS_ORDER.indexOf(task.status);

  return (
    <div className="card-surface p-3.5">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <Badge tone="gold">{t(`tasks.${task.phase}`)}</Badge>
      </div>
      <p className="text-sm font-medium text-ink">{task.title}</p>
      {task.note && <p className="mt-1 text-xs text-ink-soft">{task.note}</p>}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          disabled={currentIndex === 0}
          onClick={() => moveTask(task.id, STATUS_ORDER[currentIndex - 1])}
          className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={13} />
        </button>
        <div className="flex gap-1">
          {STATUS_ORDER.map((s) => (
            <button
              key={s}
              onClick={() => moveTask(task.id, s)}
              className={`h-1.5 w-4 rounded-full transition-colors ${
                s === task.status ? 'bg-blush-500' : 'bg-cream'
              }`}
              aria-label={t(`tasks.${s}`)}
            />
          ))}
        </div>
        {currentIndex === STATUS_ORDER.length - 1 ? (
          <span className="flex items-center gap-1 rounded-full bg-sage-100 px-2 py-1 text-xs text-sage-700">
            <Check size={13} />
          </span>
        ) : (
          <button
            onClick={() => moveTask(task.id, STATUS_ORDER[currentIndex + 1])}
            className="flex items-center gap-1 rounded-full border border-line px-2 py-1 text-xs text-ink-soft transition-colors hover:border-blush-300 hover:text-blush-600"
          >
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}

function KanbanView() {
  const { t } = useTranslation();
  const tasks = useWeddingStore((s) => s.tasks);

  const columns = STATUS_ORDER.map((status) => ({
    status,
    items: tasks.filter((task) => task.status === status),
  }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.status} className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-cream px-3 py-2">
            <h3 className="text-sm font-medium text-ink">{t(`tasks.${col.status}`)}</h3>
            <Badge>{col.items.length}</Badge>
          </div>
          <div className="space-y-3">
            {col.items.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {col.items.length === 0 && (
              <p className="rounded-xl border border-dashed border-line py-6 text-center text-xs text-ink-soft">
                —
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelinePhaseGroupView() {
  const { t } = useTranslation();
  const tasks = useWeddingStore((s) => s.tasks);

  const grouped = useMemo(
    () =>
      PHASE_ORDER.map((phase) => ({
        phase,
        items: tasks.filter((task) => task.phase === phase),
      })),
    [tasks]
  );

  return (
    <div className="space-y-6">
      {grouped.map(({ phase, items }) => {
        const doneCount = items.filter((i) => i.status === 'done').length;
        const pct = items.length ? Math.round((doneCount / items.length) * 100) : 0;
        return (
          <Card key={phase}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-serif-heading text-lg font-medium text-ink">{t(`tasks.${phase}`)}</h3>
              <Badge tone={pct === 100 ? 'success' : 'neutral'}>
                {doneCount}/{items.length}
              </Badge>
            </div>
            <ProgressBar value={pct} className="mb-4" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {items.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export default function Tasks() {
  const { t } = useTranslation();
  const [view, setView] = useState<'kanban' | 'timeline'>('kanban');

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t('tasks.heading')}
        action={
          <div className="flex items-center gap-1 rounded-full border border-line bg-paper p-1 text-xs">
            <button
              onClick={() => setView('kanban')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                view === 'kanban' ? 'bg-blush-500 text-white' : 'text-ink-soft hover:bg-blush-50'
              }`}
            >
              <LayoutGrid size={14} strokeWidth={1.75} />
              {t('tasks.kanbanView')}
            </button>
            <button
              onClick={() => setView('timeline')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors ${
                view === 'timeline' ? 'bg-blush-500 text-white' : 'text-ink-soft hover:bg-blush-50'
              }`}
            >
              <GanttChartSquare size={14} strokeWidth={1.75} />
              {t('tasks.timelineView')}
            </button>
          </div>
        }
      />
      {view === 'kanban' ? <KanbanView /> : <TimelinePhaseGroupView />}
    </div>
  );
}
