import { useState } from 'react';

// Shared view/edit orchestration for entity-list pages (vendors, guests, documents).
// Only one row is in edit mode at a time; `newId` marks a freshly-added row so that
// cancelling its first edit removes it instead of leaving an empty record behind.
export function useEditableList() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newId, setNewId] = useState<string | null>(null);

  return {
    isEditing: (id: string) => editingId === id,
    isNew: (id: string) => newId === id,
    startEdit: (id: string) => {
      setEditingId(id);
      setNewId(null);
    },
    startNew: (id: string) => {
      setEditingId(id);
      setNewId(id);
    },
    done: () => {
      setEditingId(null);
      setNewId(null);
    },
  };
}
