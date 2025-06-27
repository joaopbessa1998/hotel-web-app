import { useState } from 'react';
import api from '@/services/api';

const FACILITIES = [
  'wifi',
  'pool',
  'parking',
  'petFriendly',
  'evCharger',
  'roomService',
  'airConditioning',
  'fitnessCenter',
  'spa',
  'onSiteRestaurant',
  'bar',
  'laundry',
  'kitchenette',
  'balcony',
  'oceanView',
] as const;
type Fac = (typeof FACILITIES)[number];

export default function FacilitiesForm({
  hotel,
  onSave,
}: {
  hotel: any;
  onSave: (h: any) => void;
}) {
  const [state, setState] = useState<Record<Fac, boolean>>(
    Object.fromEntries(
      FACILITIES.map((f) => [f, hotel.facilities.includes(f)]),
    ) as any,
  );
  const toggle = (f: Fac) => setState({ ...state, [f]: !state[f] });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const facilities = FACILITIES.filter((f) => state[f]);
        const { data } = await api.patch('/hotels/my/facilities', {
          facilities,
        });
        onSave(data);
      }}
      className="border p-4 rounded space-y-2"
    >
      <p className="font-semibold">Comodidades</p>
      {FACILITIES.map((f) => (
        <label key={f} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={state[f]}
            onChange={() => toggle(f)}
          />
          {f}
        </label>
      ))}
      <button className="mt-2 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer">
        Guardar
      </button>
    </form>
  );
}
