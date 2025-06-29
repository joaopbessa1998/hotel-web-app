import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import dayjs from 'dayjs';

/* Swiper */
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  stars: number;
  photos: string[];
  address: {
    street: string;
    number: string;
    postalCode: string;
    city: string;
    country: string;
  };
  facilities: string[];
  roomTypes: {
    type: string;
    quantity: number;
    nightlyRate: number;
  }[];
}

export function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [open, setOpen] = useState(false);

  const today = dayjs().format('YYYY-MM-DD');
  const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD');
  const [checkIn, setIn] = useState(today);
  const [checkOut, setOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomType, setRoomType] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const minCheckOut = dayjs(checkIn).add(1, 'day').format('YYYY-MM-DD');
    if (dayjs(checkOut).isBefore(minCheckOut)) {
      setOut(minCheckOut);
    }
  }, [checkIn]);

  // Carrega o hotel e inicializa roomType
  useEffect(() => {
    api.get(`/hotels/${id}`).then((r) => {
      setHotel(r.data);
      if (r.data.roomTypes.length) {
        setRoomType(r.data.roomTypes[0].type);
      }
    });
  }, [id]);

  // Recalcula total sempre que datas ou roomType mudem
  useEffect(() => {
    if (!hotel || !checkIn || !checkOut || !roomType) return;
    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
    const rt = hotel.roomTypes.find((r) => r.type === roomType);
    setTotal(rt ? rt.nightlyRate * nights : 0);
  }, [hotel, checkIn, checkOut, roomType]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paid = params.get('paid');
    const bookingId = params.get('booking');

    if (paid === 'success' && bookingId) {
      api
        .post('/payments/confirm', {
          bookingId,
        })
        .then(() => {
          console.log('Pagamento confirmado manualmente!');
        })
        .catch((err) => {
          console.log('Erro ao confirmar o pagamento', err);
        });
    }
  }, []);

  if (!hotel) return <p className="p-6">A carregar…</p>;

  // modal simples
  const Modal = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 shadow-xl">
        {children}
      </div>
    </div>
  );

  // Submete reserva e dispara checkout Stripe
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) cria a reserva
    const res1 = await api.post('/bookings', {
      hotelId: hotel._id,
      roomType,
      checkIn,
      checkOut,
      adults,
      children,
    });
    const booking = res1.data.booking;

    // inicia a sessão Stripe corretamente
    const res2 = await api.post('/payments/checkout', {
      bookingId: booking._id,
    });
    const { url } = res2.data;

    // redireciona
    window.location.href = url;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 flex flex-col">
      {/* Slider de fotos */}
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        className="rounded-lg overflow-hidden w-full"
      >
        {hotel.photos.map((url, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={url}
              alt={`${hotel.name} ${idx + 1}`}
              className="w-full h-96 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Informações */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-left">{hotel.name}</h2>
        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span>
            {hotel.address.street} {hotel.address.number}, {hotel.address.city}
          </span>
          <span>{'★'.repeat(hotel.stars)}</span>
        </p>
        <p className="text-left">{hotel.description}</p>
      </div>

      {/* Facilities */}
      <div>
        <h3 className="font-semibold mb-2 text-left">Comodidades</h3>
        <ul className="flex flex-wrap gap-2">
          {hotel.facilities.map((f) => (
            <li key={f} className="px-3 py-1 rounded-full bg-gray-100 text-sm">
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Botão reservar */}
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-0 cursor-pointer"
      >
        Reservar
      </button>

      {/* Modal de reserva */}
      {open && (
        <Modal>
          <h3 className="text-lg font-semibold mb-4">
            Reserva em {hotel.name}
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Tipo de quarto */}
            <div>
              <label className="block text-sm mb-1">Tipo de quarto</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                {hotel.roomTypes.map((r) => (
                  <option key={r.type} value={r.type}>
                    {r.type} — €{r.nightlyRate.toFixed(2)}/noite ({r.quantity}{' '}
                    dispon.)
                  </option>
                ))}
              </select>
            </div>

            {/* Datas */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Check-in</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={checkIn}
                  onChange={(e) => setIn(e.target.value)}
                  min={today}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Check-out</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={checkOut}
                  onChange={(e) => setOut(e.target.value)}
                  min={dayjs(checkIn).add(1, 'day').format('YYYY-MM-DD')}
                />
              </div>
            </div>

            {/* Hóspedes */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Adultos</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border rounded px-3 py-2"
                  value={adults}
                  onChange={(e) => setAdults(+e.target.value)}
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">Crianças</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border rounded px-3 py-2"
                  value={children}
                  onChange={(e) => setChildren(+e.target.value)}
                />
              </div>
            </div>

            {/* Total e ações */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-lg font-medium">
                Total: €{total.toFixed(2)}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300  cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                >
                  Pagar com Stripe
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
