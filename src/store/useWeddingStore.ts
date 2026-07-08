import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  BudgetGroup,
  BudgetItem,
  DocumentItem,
  Guest,
  Lang,
  TaskItem,
  TaskStatus,
  Vendor,
  VendorTag,
} from '../types';
import {
  seedBudgetGroups,
  seedBudgetItems,
  seedDocuments,
  seedGuests,
  seedTasks,
  seedVendors,
} from '../data/seed';

export const DEFAULT_TW_DATE = '2027-07-15';
export const VN_WEDDING_DATE = '2027-06-12';
export const DEFAULT_BUDGET_CAP = 100_000_000;

// Convert a legacy flat budget (array of categories) into grouped line items,
// preserving edited amounts by id and keeping any custom categories under the
// Vietnam-wedding group.
function flattenOldBudget(oldBudget: Array<Record<string, unknown>>): BudgetItem[] {
  const byId = new Map(oldBudget.map((b) => [b.id as string, b]));
  const seedIds = new Set(seedBudgetItems.map((i) => i.id));
  const mapped = seedBudgetItems.map((it) => {
    const old = byId.get(it.id);
    return old
      ? {
          ...it,
          planned: (old.planned as number) ?? it.planned,
          actual: (old.actual as number) ?? it.actual,
          highPriority: (old.highPriority as boolean) ?? it.highPriority,
        }
      : it;
  });
  const customs: BudgetItem[] = oldBudget
    .filter((b) => !seedIds.has(b.id as string))
    .map((b) => ({
      id: b.id as string,
      groupId: 'g_vn',
      name: b.name as BudgetItem['name'],
      planned: (b.planned as number) ?? 0,
      actual: (b.actual as number) ?? 0,
      note: b.note as BudgetItem['note'],
      highPriority: b.highPriority as boolean | undefined,
    }));
  return [...mapped, ...customs];
}

interface WeddingState {
  // settings
  vnWeddingDate: string;
  twWeddingDate: string;
  totalBudgetCap: number;
  language: Lang;

  // domain data
  budgetGroups: BudgetGroup[];
  budgetItems: BudgetItem[];
  tasks: TaskItem[];
  vendors: Vendor[];
  vendorTags: VendorTag[];
  guests: Guest[];
  documents: DocumentItem[];

  // actions — settings
  setTwWeddingDate: (date: string) => void;
  setTotalBudgetCap: (amount: number) => void;
  setLanguage: (lang: Lang) => void;

  // actions — budget
  addBudgetItem: (item: BudgetItem) => void;
  updateBudgetItem: (id: string, patch: Partial<BudgetItem>) => void;
  deleteBudgetItem: (id: string) => void;
  addBudgetGroup: (group: BudgetGroup) => void;
  updateBudgetGroup: (id: string, patch: Partial<BudgetGroup>) => void;
  deleteBudgetGroup: (id: string) => void;

  // actions — tasks
  moveTask: (id: string, status: TaskStatus) => void;
  addTask: (task: TaskItem) => void;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  deleteTask: (id: string) => void;

  // actions — vendors
  addVendor: (vendor: Vendor) => void;
  updateVendor: (id: string, patch: Partial<Vendor>) => void;
  deleteVendor: (id: string) => void;
  addVendorTag: (tag: VendorTag) => void;
  deleteVendorTag: (id: string) => void;

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
  budgetGroups: seedBudgetGroups,
  budgetItems: seedBudgetItems,
  tasks: seedTasks,
  vendors: seedVendors,
  vendorTags: [] as VendorTag[],
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

      addBudgetItem: (item) => set((state) => ({ budgetItems: [...state.budgetItems, item] })),
      updateBudgetItem: (id, patch) =>
        set((state) => ({
          budgetItems: state.budgetItems.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        })),
      deleteBudgetItem: (id) =>
        set((state) => ({ budgetItems: state.budgetItems.filter((b) => b.id !== id) })),
      addBudgetGroup: (group) =>
        set((state) => ({ budgetGroups: [...state.budgetGroups, group] })),
      updateBudgetGroup: (id, patch) =>
        set((state) => ({
          budgetGroups: state.budgetGroups.map((g) => (g.id === id ? { ...g, ...patch } : g)),
        })),
      deleteBudgetGroup: (id) =>
        set((state) => ({
          // removing a group removes its items too
          budgetGroups: state.budgetGroups.filter((g) => g.id !== id),
          budgetItems: state.budgetItems.filter((b) => b.groupId !== id),
        })),

      moveTask: (id, status) =>
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
        })),
      addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
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
      addVendorTag: (tag) => set((state) => ({ vendorTags: [...state.vendorTags, tag] })),
      deleteVendorTag: (id) =>
        set((state) => ({
          vendorTags: state.vendorTags.filter((c) => c.id !== id),
          // vendors on the removed tag fall back to "other"
          vendors: state.vendors.map((v) => (v.category === id ? { ...v, category: 'other' } : v)),
        })),

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
          budgetGroups: state.budgetGroups,
          budgetItems: state.budgetItems,
          tasks: state.tasks,
          vendors: state.vendors,
          vendorTags: state.vendorTags,
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
          const required = ['tasks', 'vendors', 'guests', 'documents'];
          for (const key of required) {
            if (!Array.isArray(parsed[key])) return false;
          }
          // Budget: accept the new grouped shape, convert an old flat `budget`,
          // or fall back to seed.
          let budgetGroups = seedBudgetGroups;
          let budgetItems = seedBudgetItems;
          if (Array.isArray(parsed.budgetGroups) && Array.isArray(parsed.budgetItems)) {
            budgetGroups = parsed.budgetGroups;
            budgetItems = parsed.budgetItems;
          } else if (Array.isArray(parsed.budget)) {
            budgetItems = flattenOldBudget(parsed.budget);
          }
          set({
            vnWeddingDate: parsed.vnWeddingDate ?? VN_WEDDING_DATE,
            twWeddingDate: parsed.twWeddingDate ?? DEFAULT_TW_DATE,
            totalBudgetCap: parsed.totalBudgetCap ?? DEFAULT_BUDGET_CAP,
            language: parsed.language ?? 'vi',
            budgetGroups,
            budgetItems,
            tasks: parsed.tasks,
            vendors: parsed.vendors,
            vendorTags: Array.isArray(parsed.vendorTags) ? parsed.vendorTags : [],
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
      version: 6,
      migrate: (persisted, version) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state = persisted as any;
        if (!state) return state;

        // v<2: seed content was single-language; re-derive bilingual tasks/docs,
        // keeping the user's own edits by id.
        if (version < 2) {
          const oldTasks = Array.isArray(state.tasks) ? state.tasks : [];
          const statusById = new Map(oldTasks.map((t: { id: string; status: TaskStatus }) => [t.id, t.status]));
          const seedTaskIds = new Set(seedTasks.map((t) => t.id));
          state.tasks = [
            ...seedTasks.map((t) => ({ ...t, status: statusById.get(t.id) ?? t.status })),
            ...oldTasks.filter((t: { id: string }) => !seedTaskIds.has(t.id)),
          ];

          const oldDocs = Array.isArray(state.documents) ? state.documents : [];
          const docById = new Map(oldDocs.map((d: { id: string }) => [d.id, d]));
          const seedDocIds = new Set(seedDocuments.map((d) => d.id));
          state.documents = [
            ...seedDocuments.map((d) => {
              const old = docById.get(d.id) as Partial<DocumentItem> | undefined;
              return old
                ? { ...d, status: old.status ?? d.status, notes: old.notes, link: old.link, expiryDate: old.expiryDate }
                : d;
            }),
            ...oldDocs.filter((d: { id: string }) => !seedDocIds.has(d.id)),
          ];
        }

        // v<3: budget was a flat category list; convert to groups + items,
        // preserving edited amounts by id.
        if (version < 3) {
          state.budgetGroups = seedBudgetGroups;
          state.budgetItems = flattenOldBudget(Array.isArray(state.budget) ? state.budget : []);
          delete state.budget;
        }

        // v<4: custom vendor category tags introduced.
        if (version < 4 && !Array.isArray(state.vendorTags)) {
          state.vendorTags = [];
        }

        // v<5: a vendor's single `link` becomes a `links` array.
        if (version < 5 && Array.isArray(state.vendors)) {
          state.vendors = state.vendors.map((v: Record<string, unknown>) => {
            const links = Array.isArray(v.links)
              ? v.links
              : v.link
                ? [v.link as string]
                : [];
            const { link: _drop, ...rest } = v;
            void _drop;
            return { ...rest, links };
          });
        }

        // v<6: merge the 'catering' + 'venue' vendor categories into 'banquet'.
        if (version < 6 && Array.isArray(state.vendors)) {
          state.vendors = state.vendors.map((v: Record<string, unknown>) =>
            v.category === 'catering' || v.category === 'venue'
              ? { ...v, category: 'banquet' }
              : v
          );
        }

        // guests are user-entered — left untouched.
        return state as WeddingState;
      },
    }
  )
);
