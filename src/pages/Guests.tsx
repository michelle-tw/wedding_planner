import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Pencil, Check, X, UsersRound } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState } from '../components/ui';
import { genId } from '../lib/utils';
import { useEditableList } from '../lib/useEditableList';
import type { Guest, GuestSide, RsvpStatus } from '../types';

const RSVP_STATUSES: RsvpStatus[] = ['not_invited', 'invited', 'confirmed', 'declined'];

const rsvpDotClass: Record<RsvpStatus, string> = {
  not_invited: 'bg-ink-soft/30',
  invited: 'bg-gold-400',
  confirmed: 'bg-sage-500',
  declined: 'bg-blush-500',
};

type EditApi = ReturnType<typeof useEditableList>;

function GuestRowView({ guest, onEdit }: { guest: Guest; onEdit: () => void }) {
  const { t } = useTranslation();
  const deleteGuest = useWeddingStore((s) => s.deleteGuest);

  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-2.5 pr-3 text-sm text-ink">
        {guest.name || <span className="text-ink-soft/70">{t('common.untitled')}</span>}
      </td>
      <td className="py-2.5 pr-3">
        <span className="inline-flex items-center gap-1.5 text-sm text-ink-soft">
          <span className={`h-2 w-2 shrink-0 rounded-full ${rsvpDotClass[guest.rsvp]}`} />
          {t(`guests.rsvp_${guest.rsvp}`)}
        </span>
      </td>
      <td className="py-2.5 pr-3 text-sm text-ink-soft">{guest.tableNumber || '—'}</td>
      <td className="py-2.5 pr-3 text-sm text-ink-soft">{guest.notes || '—'}</td>
      <td className="py-2.5">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            aria-label={t('common.edit')}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => deleteGuest(guest.id)}
            aria-label={t('common.delete')}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function GuestRowEdit({ guest, isNew, onDone }: { guest: Guest; isNew: boolean; onDone: () => void }) {
  const { t } = useTranslation();
  const { updateGuest, deleteGuest } = useWeddingStore();
  const [draft, setDraft] = useState<Guest>(guest);
  const set = (patch: Partial<Guest>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    updateGuest(guest.id, draft);
    onDone();
  };
  const cancel = () => {
    if (isNew) deleteGuest(guest.id);
    onDone();
  };

  return (
    <tr className="border-b border-line bg-blush-50/40 last:border-0">
      <td className="py-2 pr-3">
        <input
          autoFocus
          className="input-elegant"
          value={draft.name}
          placeholder={t('common.name')}
          onChange={(e) => set({ name: e.target.value })}
        />
      </td>
      <td className="py-2 pr-3">
        <select
          className="input-elegant"
          value={draft.rsvp}
          onChange={(e) => set({ rsvp: e.target.value as RsvpStatus })}
        >
          {RSVP_STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`guests.rsvp_${s}`)}
            </option>
          ))}
        </select>
      </td>
      <td className="py-2 pr-3">
        <input
          className="input-elegant w-20"
          value={draft.tableNumber}
          placeholder="—"
          onChange={(e) => set({ tableNumber: e.target.value })}
        />
      </td>
      <td className="py-2 pr-3">
        <input
          className="input-elegant"
          value={draft.notes}
          placeholder={t('common.notes')}
          onChange={(e) => set({ notes: e.target.value })}
        />
      </td>
      <td className="py-2">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={save}
            aria-label={t('common.save')}
            className="rounded-full bg-blush-500 p-1.5 text-white transition-colors hover:bg-blush-600"
          >
            <Check size={14} />
          </button>
          <button
            onClick={cancel}
            aria-label={t('common.cancel')}
            className="rounded-full border border-line p-1.5 text-ink-soft transition-colors hover:text-blush-600"
          >
            <X size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function GuestSideTable({ side, edit }: { side: GuestSide; edit: EditApi }) {
  const { t } = useTranslation();
  const { guests, addGuest } = useWeddingStore();
  const sideGuests = guests.filter((g) => g.side === side);
  const confirmed = sideGuests.filter((g) => g.rsvp === 'confirmed').length;

  const handleAdd = () => {
    const id = genId('g');
    addGuest({ id, side, name: '', rsvp: 'not_invited', tableNumber: '', notes: '' });
    edit.startNew(id);
  };

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif-heading text-lg font-medium text-ink">
          {side === 'vn' ? t('guests.vnSide') : t('guests.twSide')}
        </h2>
        <div className="flex items-center gap-2">
          <Badge>
            {sideGuests.length} {t('guests.totalGuests').toLowerCase()}
          </Badge>
          <Badge tone="success">
            {confirmed} {t('guests.confirmedGuests').toLowerCase()}
          </Badge>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 rounded-full bg-blush-500 px-3 py-1.5 text-xs font-medium text-white shadow-soft transition-colors hover:bg-blush-600"
          >
            <Plus size={13} strokeWidth={2} />
            {t('guests.addGuest')}
          </button>
        </div>
      </div>

      {sideGuests.length === 0 ? (
        <EmptyState icon={<UsersRound size={22} className="text-ink-soft/50" />} text={t('guests.addGuest')} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-ink-soft">
                <th className="pb-2 pr-3 font-normal">{t('common.name')}</th>
                <th className="pb-2 pr-3 font-normal">{t('common.status')}</th>
                <th className="pb-2 pr-3 font-normal">{t('guests.tableNumber')}</th>
                <th className="pb-2 pr-3 font-normal">{t('common.notes')}</th>
                <th className="w-16 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {sideGuests.map((guest) =>
                edit.isEditing(guest.id) ? (
                  <GuestRowEdit
                    key={guest.id}
                    guest={guest}
                    isNew={edit.isNew(guest.id)}
                    onDone={edit.done}
                  />
                ) : (
                  <GuestRowView key={guest.id} guest={guest} onEdit={() => edit.startEdit(guest.id)} />
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default function Guests() {
  const { t } = useTranslation();
  const guests = useWeddingStore((s) => s.guests);
  const edit = useEditableList();

  const totalConfirmed = guests.filter((g) => g.rsvp === 'confirmed').length;

  return (
    <div className="space-y-6">
      <SectionHeading
        title={t('guests.heading')}
        action={
          <Badge tone="gold">
            {t('guests.totalGuests')}: {guests.length} · {t('guests.confirmedGuests')}: {totalConfirmed}
          </Badge>
        }
      />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GuestSideTable side="vn" edit={edit} />
        <GuestSideTable side="tw" edit={edit} />
      </div>
    </div>
  );
}
