import { RequestHandler } from 'express';
import Booking from '../models/Booking.model';
import Hotel from '../models/Hotel.model';
import { nightsBetween } from '../utils/dateUtils';
import { roomsBooked } from '../utils/bookingUtils';

// cria reserva
export const createBooking: RequestHandler = async (req, res) => {
  try {
    const hospedeId = (req as any).userId;
    const { hotelId, roomType, checkIn, checkOut, adults, children } = req.body;

    // verifica hotel existe
    const hotel = await Hotel.findById(hotelId).lean();
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }

    // verifica tipo de quarto
    const roomInfo = hotel.roomTypes.find((r) => r.type === roomType);
    if (!roomInfo) {
      res.status(400).json({ message: 'Tipo de quarto inválido' });
      return;
    }

    // verifica disponibilidade
    const ocupados = await roomsBooked(
      hotelId,
      roomType,
      new Date(checkIn),
      new Date(checkOut),
    );
    if (ocupados >= roomInfo.quantity) {
      res.status(400).json({ message: 'Sem quartos disponíveis' });
      return;
    }

    // calcula preço
    const nights = nightsBetween(new Date(checkIn), new Date(checkOut));
    const totalPrice = nights * roomInfo.nightlyRate;

    // cria reserva
    const booking = await Booking.create({
      hospedeId,
      hotelId,
      roomType,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children,
      status: 'pending',
      totalPrice,
    });

    res.status(201).json({ message: 'Reserva criada', booking });
  } catch (err) {
    console.error('Erro ao criar reserva:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// list nas reservas
export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const role = (req as any).role as string;
    const userId = (req as any).userId as string;

    if (role === 'hotel') {
      const hotels = await Hotel.find({ owner: userId }, { _id: 1 }).lean();
      const hotelIds = hotels.map((h) => h._id);
      const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
        .populate('hospedeId', 'name email')
        .populate('hotelId', 'name');
      res.json(bookings);
      return;
    }

    if (role === 'hospede') {
      const bookings = await Booking.find({ hospedeId: userId })
        .populate('hospedeId', 'name email')
        .populate('hotelId', 'name');
      res.json(bookings);
      return;
    }

    res.status(403).json({ message: 'Acesso não permitido' });
  } catch (err) {
    console.error('Erro ao listar reservas:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// fetch reserva por id
export const getBookingById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const role = (req as any).role as string;
    const userId = (req as any).userId as string;

    const booking = await Booking.findById(id)
      .populate('hospedeId', 'name email')
      .populate('hotelId', 'name');

    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    // Verifica permissão
    const isOwnerOfHotel =
      role === 'hotel' &&
      (await Hotel.findById(booking.hotelId))?.owner.toString() === userId;
    const isGuest =
      role === 'hospede' && booking.hospedeId.toString() === userId;

    if (!isGuest && !isOwnerOfHotel) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    res.json(booking);
  } catch (err) {
    console.error('Erro ao buscar reserva:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// update na reserva
export const updateBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const role = (req as any).role as string;
    const userId = (req as any).userId as string;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    // mesma lógica de permissão de getBookingById
    const isOwnerOfHotel =
      role === 'hotel' &&
      (await Hotel.findById(booking.hotelId))?.owner.toString() === userId;
    const isGuest =
      role === 'hospede' && booking.hospedeId.toString() === userId;
    if (!isGuest && !isOwnerOfHotel) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    // atualiza só os campos permitidos
    const { checkIn, checkOut, adults, children, status, totalPrice } =
      req.body;
    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (adults !== undefined) booking.adults = adults;
    if (children !== undefined) booking.children = children;
    if (status) booking.status = status;
    if (totalPrice !== undefined) booking.totalPrice = totalPrice;

    await booking.save();
    res.json({ message: 'Reserva atualizada', booking });
  } catch (err) {
    console.error('Erro ao atualizar reserva:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// apagar / cancelar reserva
export const deleteBooking: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const role = (req as any).role as string;
    const userId = (req as any).userId as string;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    const isOwnerOfHotel =
      role === 'hotel' &&
      (await Hotel.findById(booking.hotelId))?.owner.toString() === userId;
    const isGuest =
      role === 'hospede' && booking.hospedeId.toString() === userId;
    if (!isGuest && !isOwnerOfHotel) {
      res.status(403).json({ message: 'Acesso negado' });
      return;
    }

    await booking.deleteOne();
    res.json({ message: 'Reserva apagada' });
  } catch (err) {
    console.error('Erro ao apagar reserva:', err);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
