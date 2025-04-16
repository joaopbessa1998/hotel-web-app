import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  hospedeId: mongoose.Types.ObjectId; // referência ao user (role: 'hospede')
  hotelId: mongoose.Types.ObjectId; // referência ao Hotel
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  status: string; // ex.: "pending", "confirmed", "cancelled", ...
  totalPrice: number; // para preencher após cálculo ou pagamento
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    hospedeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
    },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, required: true, default: 1 },
    children: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'pending' },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
