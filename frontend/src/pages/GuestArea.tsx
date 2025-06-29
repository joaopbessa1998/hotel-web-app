import { useEffect, useState } from 'react';
import api from '@/services/api';

type Role = 'hospede' | 'hotel';

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Booking {
  _id: string;
  hotelId: { name: string };
  checkIn: string;
  checkOut: string;
  status: 'pending' | 'paid' | 'cancelled';
}

interface Invoice {
  _id: string;
  bookingId: string;
  pdfUrl: string;
  createdAt: string;
}

export function GuestArea() {
  const [tab, setTab] = useState<'profile' | 'bookings' | 'invoices'>(
    'profile',
  );

  // perfil
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busyProfile, setBusyProfile] = useState(false);

  // bookings
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingB, setLoadingB] = useState(true);

  // invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingI, setLoadingI] = useState(true);

  // carregamentos iniciaiss
  useEffect(() => {
    //api.get('/auth/me').then((r) => setProfile(r.data));
    api.get('/guests/my-profile').then((r) => setProfile(r.data));

    api.get('/bookings').then((r) => {
      setBookings(r.data);
      console.log('setBookings:', r.data);
      setLoadingB(false);
    });

    api.get('/guests/invoices').then((r) => {
      setInvoices(r.data);
      setLoadingI(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    const bookingId = params.get('booking');

    if (paid === 'success' && bookingId) {
      api
        .post('/payments/confirm', { bookingId })
        .then(() => {
          // Atualiza estado local para refletir novo status
          setBookings((prev) =>
            prev.map((b) =>
              b._id === bookingId ? { ...b, status: 'paid' } : b,
            ),
          );
        })
        .catch((err) => {
          console.error('Erro ao confirmar pagamento:', err);
        });
    }
  }, []);

  // cancelar reserva
  const cancel = async (id: string) => {
    await api.patch(`/bookings/${id}`, { status: 'cancelled' });
    setBookings((cur) =>
      cur.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)),
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* tabs */}
      <div className="flex border-b-2 mb-6">
        {['profile', 'bookings', 'invoices'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={
              'px-4 py-2 -mb-px border-b-2 ' +
              (tab === t
                ? 'border-blue-600 font-semibold'
                : 'border-transparent text-gray-500')
            }
          >
            {t === 'profile'
              ? 'Perfil'
              : t === 'bookings'
              ? 'Reservas'
              : 'Faturas'}
          </button>
        ))}
      </div>

      {/* perfil */}
      {tab === 'profile' && profile && (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusyProfile(true);
            const { data } = await api.put('/guests/my-profile', profile);
            setProfile(data);
            setBusyProfile(false);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm">Nome</label>
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm">Telefone</label>
            <input
              value={profile.phone || ''}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm">Morada</label>
            <textarea
              value={profile.address || ''}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <button
            disabled={busyProfile}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            {busyProfile ? 'A guardar…' : 'Guardar'}
          </button>
        </form>
      )}

      {/* reservas */}
      {tab === 'bookings' && (
        <>
          {loadingB ? (
            <p>A carregar reservas…</p>
          ) : bookings.length === 0 ? (
            <p>Não tens reservas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Hotel</th>
                    <th className="px-3 py-2">Check-in</th>
                    <th className="px-3 py-2">Check-out</th>
                    <th className="px-3 py-2">Estado</th>
                    <th className="px-3 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id} className="even:bg-gray-50">
                      <td className="px-3 py-2 text-left">{b.hotelId?.name}</td>
                      <td className="px-3 py-2">{b.checkIn.slice(0, 10)}</td>
                      <td className="px-3 py-2">{b.checkOut.slice(0, 10)}</td>
                      <td className="px-3 py-2 capitalize">{b.status}</td>
                      <td className="px-3 py-2">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => cancel(b._id)}
                            className="text-red-600 underline mr-4 cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                        {b.status === 'pending' && (
                          <button
                            className="text-blue-600 underline cursor-pointer"
                            onClick={async () => {
                              const { data } = await api.post(
                                '/payments/checkout',
                                {
                                  bookingId: b._id,
                                },
                              );
                              window.location.href = data.url;
                            }}
                          >
                            Pagar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* faturas */}
      {tab === 'invoices' && (
        <>
          {loadingI ? (
            <p>A carregar faturas…</p>
          ) : invoices.length === 0 ? (
            <p>Sem faturas disponíveis.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Reserva</th>
                    <th className="px-3 py-2">Data</th>
                    <th className="px-3 py-2">PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="even:bg-gray-50">
                      <td className="px-3 py-2">{inv.bookingId}</td>
                      <td className="px-3 py-2">
                        {inv.createdAt.slice(0, 10)}
                      </td>
                      <td className="px-3 py-2">
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
