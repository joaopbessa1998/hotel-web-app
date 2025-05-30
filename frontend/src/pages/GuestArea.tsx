import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@/components/ui/table';

interface Booking {
  _id: string;
  hotelId: { name: string };
  checkIn: string;
  checkOut: string;
  status: string;
}

export function GuestArea() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    api.get('/bookings').then((r) => setBookings(r.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Minhas reservas</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Hotel</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b._id}>
              <TableCell>{b.hotelId.name}</TableCell>
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
