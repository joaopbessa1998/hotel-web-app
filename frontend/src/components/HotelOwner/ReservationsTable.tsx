//  src/components/HotelOwner/ReservationsTable.tsx
import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Booking {
  _id: string;
  hospedeId: { name: string; email: string };
  checkIn: string; // ISO date
  checkOut: string; // ISO date
  status: 'pending' | 'paid' | 'cancelled';
  totalPrice?: number; // caso tenhas
}

export default function ReservationsTable({ hotelId }: { hotelId: string }) {
  const [rows, setRows] = useState<Booking[]>([]);
  const [loading, setL] = useState(true);
  const [error, setErr] = useState('');

  // fetch no mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/bookings', {
          params: { hotelId }, // backend: req.query.hotelId
        });
        setRows(data);
      } catch (err) {
        console.error(err);
        setErr('Falha ao carregar reservas');
      } finally {
        setL(false);
      }
    })();
  }, [hotelId]);

  if (loading) return <p>A carregar reservas…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!rows.length) return <p>Sem reservas ainda.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Hóspede</th>
            <th className="px-3 py-2">Check-in</th>
            <th className="px-3 py-2">Check-out</th>
            <th className="px-3 py-2">Estado</th>
            <th className="px-3 py-2">Preço&nbsp;€</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((b) => (
            <tr key={b._id} className="even:bg-gray-50">
              <td className="px-3 py-2">
                {b.hospedeId?.name ?? '—'}
                <div className="text-xs text-gray-500">
                  {b.hospedeId?.email}
                </div>
              </td>
              <td className="px-3 py-2">{b.checkIn.slice(0, 10)}</td>
              <td className="px-3 py-2">{b.checkOut.slice(0, 10)}</td>
              <td className="px-3 py-2 capitalize">{b.status}</td>
              <td className="px-3 py-2 text-right">{b.totalPrice ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
