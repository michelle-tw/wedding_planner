// Core domain types for the wedding planner app

export type Lang = 'vi' | 'zh-TW';

// Seed-provided display text carries both languages so it switches with the UI.
// User-entered text is a plain string (whatever language they typed).
export type LocalizedText = string | { vi: string; 'zh-TW': string };

export type TaskStatus = 'todo' | 'doing' | 'done';

export type PhaseId = 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'phase5';

export interface TaskItem {
  id: string;
  phase: PhaseId;
  title: LocalizedText;
  note: LocalizedText;
  status: TaskStatus;
  assignee?: 'bride' | 'groom' | 'parents' | 'both';
}

export type BudgetCategoryId =
  | 'food'
  | 'video'
  | 'venue'
  | 'sound'
  | 'attire'
  | 'photo'
  | 'ceremony'
  | 'invitations'
  | 'contingency';

export interface BudgetCategory {
  id: BudgetCategoryId;
  name: LocalizedText;
  planned: number;
  actual: number;
  percent: number;
  note: LocalizedText;
  highPriority: boolean; // true = ⭐ high priority (don't cut), false = can-cut
}

export type VendorCategory =
  | 'catering'
  | 'videography'
  | 'venue'
  | 'sound_lighting'
  | 'attire'
  | 'photography'
  | 'other';

export type NegotiationStatus = 'contacted' | 'negotiating' | 'confirmed';

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contact: string;
  quoteAmount: number;
  status: NegotiationStatus;
  notes: string;
}

export type GuestSide = 'vn' | 'tw';

export type RsvpStatus = 'not_invited' | 'invited' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  side: GuestSide;
  name: string;
  rsvp: RsvpStatus;
  tableNumber: string;
  notes: string;
}

export type DocumentCategory = 'marriage' | 'passport' | 'vendor_contract' | 'visa' | 'other';

export type DocumentStatus = 'not_started' | 'in_progress' | 'completed';

export interface DocumentItem {
  id: string;
  name: LocalizedText;
  category: DocumentCategory;
  status: DocumentStatus;
  link?: string;
  expiryDate?: string; // ISO date string
  notes?: string;
}

export interface ItineraryActivity {
  day: number;
  activities: LocalizedText;
}

export interface ItineraryPlan {
  id: 'binh_duong' | 'dai_nam';
  titleKey: string;
  location: string;
  stayNote: LocalizedText;
  days: ItineraryActivity[];
  foodNote: LocalizedText;
}

export interface WeddingSettings {
  vnWeddingDate: string; // ISO date, fixed 2027-06-12
  twWeddingDate: string; // ISO date, editable, default 2027-07-15
  totalBudgetCap: number; // default 100,000,000 VND
  language: Lang;
}
