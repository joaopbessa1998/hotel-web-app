import { useState, useEffect } from 'react';
import api from '@/services/api'; // importa axios
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table'; // se já adicionaste “table” via shadcn-ui

interface Booking {
  _id: string;
  checkIn: string;
  checkOut: string;
  status: string;
  hospedeId: { name: string; email: string };
  hotelId: { name: string };
}

export function HotelArea() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get('/bookings').then((r) => setBookings(r.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Reservas recebidas</h2>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hóspede</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b._id}>
              <TableCell>{b.hospedeId.name}</TableCell>
              <TableCell>{b.checkIn.slice(0, 10)}</TableCell>
              <TableCell>{b.checkOut.slice(0, 10)}</TableCell>
              <TableCell>{b.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
