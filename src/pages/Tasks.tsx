import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, GanttChartSquare, Plus, Trash2 } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, ProgressBar } from '../components/ui';
import { localize, genId } from '../lib/utils';
import type { PhaseId, TaskItem, TaskStatus } from '../types';

const STATUS_ORDER: TaskStatus[] = ['todo', 'doing', 'done'];
const PHASE_ORDER: PhaseId[] = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];

function TaskCard({ task }: { task: TaskItem }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { moveTask, updateTask, deleteTask } = useWeddingStore();
  const isCustom = typeof task.title === 'string'; // user-added tasks have editable titles

  return (
    <div className="card-surface p-3.5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <Badge tone="gold">{t(`tasks.${task.phase}`)}</Badge>
        <button
          onClick={() => deleteTask(task.id)}
          aria-label={t('common.delete')}
          className="-mt-0.5 shrink-0 rounded-full p-1 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
        >
          <Trash2 size={14} />
        </button>
      </div>
      {isCustom ? (
        <input
          className="input-elegant mb-2 border-none bg-transparent px-0 text-sm font-medium focus:bg-paper focus:px-2"
          value={task.title as string}
          placeholder={t('tasks.newTaskPlaceholder')}
          onChange={(e) => updateTask(task.id, { title: e.target.value })}
          autoFocus={task.title === ''}
        />
      ) : (
        <p className="mb-2 text-sm font-medium text-ink">{localize(task.title, lang)}</p>
      )}
      {task.note && <p className="mb-2.5 text-xs text-ink-soft">{localize(task.note, lang)}</p>}
      <div className="flex items-center gap-0.5 rounded-full border border-line bg-cream/50 p-0.5">
        {STATUS_ORDER.map((s) => (
          <button
            key={s}
            onClick={() => moveTask(task.id, s)}
            className={`flex-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
              s === task.status
                ? 'bg-blush-500 text-white shadow-soft'
                : 'text-ink-soft hover:text-blush-600'
            }`}
          >
            {t(`tasks.${s}`)}
          </button>
        ))}
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
  const addTask = useWeddingStore((s) => s.addTask);

  const handleAdd = () =>
    addTask({ id: genId('t'), phase: 'phase1', title: '', note: '', status: 'todo' });

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t('tasks.heading')}
        action={
          <div className="flex flex-wrap items-center gap-2">
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
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 rounded-full bg-blush-500 px-4 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
            >
              <Plus size={15} strokeWidth={2} />
              {t('tasks.addTask')}
            </button>
          </div>
        }
      />
      {view === 'kanban' ? <KanbanView /> : <TimelinePhaseGroupView />}
    </div>
  );
}
