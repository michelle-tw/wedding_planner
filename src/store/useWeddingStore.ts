import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BudgetCategory,
  DocumentItem,
  Guest,
  Lang,
  TaskItem,
  TaskStatus,
  Vendor,
} from '../types';
import {
  seedBudget,
  seedDocuments,
  seedGuests,
  seedTasks,
  seedVendors,
} from '../data/seed';

export const DEFAULT_TW_DATE = '2027-07-15';
export const VN_WEDDING_DATE = '2027-06-12';
export const DEFAULT_BUDGET_CAP = 100_000_000;

interface WeddingState {
  // settings
  vnWeddingDate: string;
  twWeddingDate: string;
  totalBudgetCap: number;
  language: Lang;

  // domain data
  budget: BudgetCategory[];
  tasks: TaskItem[];
  vendors: Vendor[];
  guests: Guest[];
  documents: DocumentItem[];

  // actions — settings
  setTwWeddingDate: (date: string) => void;
  setTotalBudgetCap: (amount: number) => void;
  setLanguage: (lang: Lang) => void;

  // actions — budget
  updateBudgetCategory: (id: string, patch: Partial<BudgetCategory>) => void;

  // actions — tasks
  moveTask: (id: string, status: TaskStatus) => void;
  addTask: (task: TaskItem) => void;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;

  // actions — vendors
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;

  // actions — guests
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, patch: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;

  // actions — documents
  addDocument: (doc: DocumentItem) => void;
  updateDocument: (id: string, patch: Partial<DocumentItem>) => void;
  deleteDocument: (id: string) => void;

  // data management
  exportState: () => string;
  importState: (json: string) => boolean;
  resetAll: () => void;
}

const defaultState = {
  vnWeddingDate: VN_WEDDING_DATE,
  twWeddingDate: DEFAULT_TW_DATE,
  totalBudgetCap: DEFAULT_BUDGET_CAP,
  language: 'vi' as Lang,
  budget: seedBudget,
  tasks: seedTasks,
  vendors: seedVendors,
  guests: seedGuests,
  documents: seedDocuments,
};

export const useWeddingStore = create<WeddingState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setTwWeddingDate: (date) => set({ twWeddingDate: date }),
      setTotalBudgetCap: (amount) => set({ totalBudgetCap: amount }),
      setLanguage: (lang) => set({ language: lang }),

      updateBudgetCategory: (id, patch) =>
        set((state) => ({
          budget: state.budget.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, patch) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
      deleteTask: (id) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

      addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
      updateVendor: (id, patch) =>
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === id ? { ...v, ...patch } : v)),
        })),
      deleteVendor: (id) =>
        set((state) => ({ vendors: state.vendors.filter((v) => v.id !== id) })),

      addGuest: (guest) => set((state) => ({ guests: [...state.guests, guest] })),
      updateGuest: (id, patch) =>
        set((state) => ({
          guests: state.guests.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      deleteGuest: (id) =>
        set((state) => ({ guests: state.guests.filter((g) => g.id !== id) })),

      addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
      updateDocument: (id, patch) =>
        set((state) => ({
          documents: state.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      deleteDocument: (id) =>
        set((state) => ({ documents: state.documents.filter((d) => d.id !== id) })),

      exportState: () => {
        const state = get();
        const exportable = {
          vnWeddingDate: state.vnWeddingDate,
          twWeddingDate: state.twWeddingDate,
          totalBudgetCap: state.totalBudgetCap,
          language: state.language,
          budget: state.budget,
          tasks: state.tasks,
          vendors: state.vendors,
          guests: state.guests,
          documents: state.documents,
          exportedAt: new Date().toISOString(),
        };
        return JSON.stringify(exportable, null, 2);
      },

      importState: (json) => {
        try {
          const parsed = JSON.parse(json);
          if (typeof parsed !== 'object' || parsed === null) return false;
          const required = ['budget', 'tasks', 'vendors', 'guests', 'documents'];
          for (const key of required) {
            if (!Array.isArray(parsed[key])) return false;
          }
          set({
            vnWeddingDate: parsed.vnWeddingDate ?? VN_WEDDING_DATE,
            twWeddingDate: parsed.twWeddingDate ?? DEFAULT_TW_DATE,
            totalBudgetCap: parsed.totalBudgetCap ?? DEFAULT_BUDGET_CAP,
            language: parsed.language ?? 'vi',
            budget: parsed.budget,
            tasks: parsed.tasks,
            vendors: parsed.vendors,
            guests: parsed.guests,
            documents: parsed.documents,
          });
          return true;
        } catch {
          return false;
        }
      },

      resetAll: () => set({ ...defaultState }),
    }),
    {
      name: 'wedding-planner-state',
    }
  )
);
