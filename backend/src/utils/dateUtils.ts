export const nightsBetween = (a: Date, b: Date) =>
  Math.ceil((+b - +a) / 86_400_000); // 86 400 000 ms = 1 dia

// src/utils/bookingUtils.ts
import Booking from '../models/Booking.model';

export async function roomsBooked(
  hotelId: string,
  roomType: string,
  from: Date,
  to: Date,
) {
  // reservas que se sobrepõem ao intervalo
  const overlap = await Booking.countDocuments({
    hotelId,
    roomType,
    status: { $nin: ['cancelled'] },
    $or: [
      { checkIn: { $lt: to }, checkOut: { $gt: from } }, // [---]
    ],
  });
  return overlap; // nº quartos já ocupados
}
