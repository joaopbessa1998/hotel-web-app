import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import dayjs from 'dayjs';

interface Hotel {
  _id: string;
  name: string;
  description: string;
  stars: number;
  photos: string[];
  rooms: string[];
  address: { city: string; country: string };
}

export function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [open, setOpen] = useState(false);

  // dados reserva
  const [checkIn, setIn] = useState(dayjs().format('YYYY-MM-DD'));
  const [checkOut, setOut] = useState(
    dayjs().add(1, 'day').format('YYYY-MM-DD'),
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  useEffect(() => {
    api.get(`/hotels/${id}`).then((r) => setHotel(r.data));
  }, [id]);

  if (!hotel) return <p className="p-6">A carregar…</p>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">{hotel.name}</h2>
      <p className="text-sm text-muted-foreground">{hotel.address.city}</p>
      <p>{hotel.description}</p>

      <Button onClick={() => setOpen(true)}>Reservar</Button>

      {/* diálogo de reserva */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova reserva</DialogTitle>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await api.post('/bookings', {
                hotelId: hotel._id,
                checkIn,
                checkOut,
                adults,
                children,
              });
              setOpen(false);
              alert('Reserva criada!'); // substituir por toast
            }}
          >
            <Label>Check-in</Label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setIn(e.target.value)}
            />
            <Label>Check-out</Label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setOut(e.target.value)}
            />
            <Label>Adultos</Label>
            <Input
              type="number"
              min={1}
              value={adults}
              onChange={(e) => setAdults(+e.target.value)}
            />
            <Label>Crianças</Label>
            <Input
              type="number"
              min={0}
              value={children}
              onChange={(e) => setChildren(+e.target.value)}
            />
            <Button type="submit" className="w-full">
              Confirmar
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
