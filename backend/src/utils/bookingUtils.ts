import Booking from '../models/Booking.model';

/** devolve quantos quartos já estão ocupados naquele intervalo */
export async function roomsBooked(
  hotelId: string,
  roomType: string,
  from: Date,
  to: Date,
) {
  return Booking.countDocuments({
    hotelId,
    roomType,
    status: { $nin: ['cancelled'] },
    $or: [
      { checkIn: { $lt: to }, checkOut: { $gt: from } }, // sobreposição
    ],
  });
}
