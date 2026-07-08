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

// Budget is a two-level structure: groups (VN wedding, TW wedding, travel…)
// each holding line items that roll up into a group subtotal.
export interface BudgetGroup {
  id: string;
  name: LocalizedText;
}

export interface BudgetItem {
  id: string;
  groupId: string;
  name: LocalizedText;
  planned: number;
  actual: number;
  note?: LocalizedText;
  highPriority?: boolean; // ⭐ high priority (don't cut)
}

// Built-in vendor category ids (translated via i18n vendors.cat_*).
export type VendorCategory =
  | 'catering'
  | 'videography'
  | 'venue'
  | 'sound_lighting'
  | 'attire'
  | 'photography'
  | 'other';

// User-added category tag (e.g. bệnh viện, nhẫn cưới, máy bay, khách sạn).
export interface VendorTag {
  id: string;
  name: string;
}

export type NegotiationStatus = 'contacted' | 'negotiating' | 'confirmed';

export interface Vendor {
  id: string;
  name: string;
  category: string; // a built-in VendorCategory id, a custom VendorTag id, or 'other'
  categoryOther?: string; // free-text label used when category === 'other'
  contact: string;
  quoteAmount: number;
  status: NegotiationStatus;
  notes: string;
  link?: string;
  images?: string[]; // menu / quote photos, stored as compressed data URLs
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
