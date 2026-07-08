import { useTranslation } from 'react-i18next';
import { Plus, Trash2, UsersRound } from 'lucide-react';
import { useWeddingStore } from '../store/useWeddingStore';
import { Card, SectionHeading, Badge, EmptyState } from '../components/ui';
import { genId } from '../lib/utils';
import type { Guest, GuestSide, RsvpStatus } from '../types';

const RSVP_STATUSES: RsvpStatus[] = ['not_invited', 'invited', 'confirmed', 'declined'];

const rsvpDotClass: Record<RsvpStatus, string> = {
  not_invited: 'bg-ink-soft/30',
  invited: 'bg-gold-400',
  confirmed: 'bg-sage-500',
  declined: 'bg-blush-500',
};

function GuestRow({ guest }: { guest: Guest }) {
  const { t } = useTranslation();
  const { updateGuest, deleteGuest } = useWeddingStore();

  return (
    <tr className="border-b border-line last:border-0">
      <td className="py-2 pr-3">
        <input
          className="input-elegant border-none bg-transparent px-0 focus:bg-paper focus:px-2"
          value={guest.name}
          placeholder={t('common.name')}
          onChange={(e) => updateGuest(guest.id, { name: e.target.value })}
        />
      </td>
      <td className="py-2 pr-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${rsvpDotClass[guest.rsvp]}`} />
          <select
            className="input-elegant"
            value={guest.rsvp}
            onChange={(e) => updateGuest(guest.id, { rsvp: e.target.value as RsvpStatus })}
          >
            {RSVP_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`guests.rsvp_${s}`)}
              </option>
            ))}
          </select>
        </div>
      </td>
      <td className="py-2 pr-3">
        <input
          className="input-elegant w-20"
          value={guest.tableNumber}
          placeholder="—"
          onChange={(e) => updateGuest(guest.id, { tableNumber: e.target.value })}
        />
      </td>
      <td className="py-2 pr-3">
        <input
          className="input-elegant"
          value={guest.notes}
          placeholder={t('common.notes')}
          onChange={(e) => updateGuest(guest.id, { notes: e.target.value })}
        />
      </td>
      <td className="w-10 py-2">
        <button
          onClick={() => deleteGuest(guest.id)}
          className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush-50 hover:text-blush-600"
          aria-label={t('common.delete')}
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  );
}

function GuestSideTable({ side }: { side: GuestSide }) {
  const { t } = useTranslation();
  const { guests, addGuest } = useWeddingStore();
  const sideGuests = guests.filter((g) => g.side === side);
  const confirmed = sideGuests.filter((g) => g.rsvp === 'confirmed').length;

  const handleAdd = () => {
    addGuest({
      id: genId('g'),
      side,
      name: '',
      rsvp: 'not_invited',
      tableNumber: '',
      notes: '',
    });
  };

  return (
    <Card>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif-heading text-lg font-medium text-ink">
          {side === 'vn' ? t('guests.vnSide') : t('guests.twSide')}
        </h2>
        <div className="flex items-center gap-2">
          <Badge>{sideGuests.length} {t('guests.totalGuests').toLowerCase()}</Badge>
          <Badge tone="success">{confirmed} {t('guests.confirmedGuests').toLowerCase()}</Badge>
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
                <th className="w-10 pb-2"></th>
              </tr>
            </thead>
            <tbody>
              {sideGuests.map((guest) => (
                <GuestRow key={guest.id} guest={guest} />
              ))}
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
        <GuestSideTable side="vn" />
        <GuestSideTable side="tw" />
      </div>
    </div>
  );
}
