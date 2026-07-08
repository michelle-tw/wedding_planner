import type { Lang, LocalizedText } from '../types';

// Resolve seed content (bilingual object) or user content (plain string) to the active language.
export function localize(text: LocalizedText | undefined | null, lang: string): string {
  if (text == null) return '';
  if (typeof text === 'string') return text;
  return text[lang as Lang] ?? text.vi ?? '';
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' ₫';
}

export function daysUntil(dateIso: string): number {
  const target = new Date(dateIso + 'T00:00:00');
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - todayMidnight.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function formatDate(dateIso: string, locale: string): string {
  if (!dateIso) return '';
  const d = new Date(dateIso + 'T00:00:00');
  return new Intl.DateTimeFormat(locale === 'zh-TW' ? 'zh-TW' : 'vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

export function genId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
