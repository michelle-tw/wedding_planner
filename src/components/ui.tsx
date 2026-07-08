import type { PropsWithChildren, ReactNode } from 'react';

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`card-surface p-5 ${className}`}>{children}</div>;
}

export function SectionHeading({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-serif-heading text-2xl font-medium text-ink sm:text-3xl">{title}</h1>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  className = '',
  colorClass = 'bg-sage-400',
}: {
  value: number; // 0..100
  className?: string;
  colorClass?: string;
}) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-cream ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export function VarianceBar({
  planned,
  actual,
  labelPlanned,
  labelActual,
  formatValue,
}: {
  planned: number;
  actual: number;
  labelPlanned: string;
  labelActual: string;
  formatValue: (n: number) => string;
}) {
  const isOver = actual > planned;
  const max = Math.max(planned, actual, 1);
  const plannedPct = (planned / max) * 100;
  const actualPct = (actual / max) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <span>
          {labelPlanned}: <span className="font-medium text-ink">{formatValue(planned)}</span>
        </span>
        <span>
          {labelActual}:{' '}
          <span className={`font-medium ${isOver ? 'text-blush-600' : 'text-sage-600'}`}>
            {formatValue(actual)}
          </span>
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-cream">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gold-200"
          style={{ width: `${plannedPct}%` }}
        />
        <div
          className={`absolute inset-y-0 left-0 rounded-full opacity-90 ${
            isOver ? 'bg-blush-500' : 'bg-sage-400'
          }`}
          style={{ width: `${actualPct}%` }}
        />
      </div>
    </div>
  );
}

export function Badge({
  children,
  tone = 'neutral',
}: PropsWithChildren<{ tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'gold' }>) {
  const toneClasses: Record<string, string> = {
    neutral: 'bg-cream text-ink-soft',
    success: 'bg-sage-100 text-sage-700',
    warning: 'bg-gold-100 text-gold-700',
    danger: 'bg-blush-100 text-blush-700',
    gold: 'bg-gold-100 text-gold-700',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ icon, text }: { icon?: ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line py-10 text-center text-sm text-ink-soft">
      {icon}
      <p>{text}</p>
    </div>
  );
}
