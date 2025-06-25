import { RequestHandler } from 'express';
import User from '../models/User.model';
import Booking from '../models/Booking.model';
import Invoice from '../models/Invoice.model';

// get /my-profile
export const getProfile: RequestHandler = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.json(user); // user existe (token válido)
};

// put /my-profile
export const updateProfile: RequestHandler = async (req, res) => {
  const { name, phone, address } = req.body;
  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, phone, address },
    { new: true, runValidators: true, select: '-password' },
  );
  res.json(user);
};

// get /bookings (para hóspede)
export const getMyBookings: RequestHandler = async (req, res) => {
  const bookings = await Booking.find({ hospedeId: req.userId }).populate(
    'hotelId',
    'name',
  );
  res.json(bookings);
};

// get /invoices
export const getMyInvoices: RequestHandler = async (req, res) => {
  const invoices = await Invoice.find({ guestId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(invoices);
};

// patch /bookings/:id  (cancelar)
export const cancelBooking: RequestHandler = async (req, res) => {
  const { id } = req.params;

  const booking = await Booking.findOneAndUpdate(
    { _id: id, hospedeId: req.userId }, // ← hospedeId!
    { status: 'cancelled' },
    { new: true },
  );

  if (!booking) {
    res.status(404).json({ message: 'Reserva não encontrada' });
    return;
  }
  res.json(booking);
};
