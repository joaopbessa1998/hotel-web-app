import { RequestHandler } from 'express';
import Booking from '../models/Booking.model';
import Hotel from '../models/Hotel.model';

// ------------------------------
// Criar reserva
// ------------------------------
export const createBooking: RequestHandler = async (req, res) => {
  try {
    // O ID do user (hóspede) vem do middleware checkAuth
    // e assumimos que o user tem role "hospede" (psteriormente criar um checkRole).
    const userId = (req as any).userId;

    // Extrair dados do body
    const { hotelId, checkIn, checkOut, adults, children } = req.body;

    // Verificar se o hotel existe
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: 'Hotel não encontrado' });
      return;
    }

    // Criar a reserva
    const newBooking = await Booking.create({
      hospedeId: userId,
      hotelId: hotelId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      adults,
      children,
      status: 'pending', // ou "confirmed"
      totalPrice: 0, // p calcular mais tarde
    });

    res.status(201).json({
      message: 'Reserva criada com sucesso',
      booking: newBooking,
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// mostrar reservas (filtro por role do user)
// ------------------------------
export const getAllBookings: RequestHandler = async (req, res) => {
  try {
    const role = (req as any).role;
    const userId = (req as any).userId;

    // Se for "hotel", mostra apenas reservas do(s) hotel(es) desse user
    // Se for "hospede", mostra apenas as reservas feitas por ele
    // Se for "admin" (breve), podemos mostrar todas...

    if (role === 'hotel') {
      // Descobrir quais hotéis pertencem a esse user
      const hotels = await Hotel.find({ owner: userId }, { _id: 1 });
      const hotelIds = hotels.map((h) => h._id);

      // procurar reservas cujo hotelId esteja nesse array
      const bookings = await Booking.find({ hotelId: { $in: hotelIds } })
        .populate('hospedeId', 'name email')
        .populate('hotelId', 'name');
      res.json(bookings);
      return;
    } else if (role === 'hospede') {
      // Mostra apenas reservas em que hospedeId = userId
      const bookings = await Booking.find({ hospedeId: userId })
        .populate('hospedeId', 'name email')
        .populate('hotelId', 'name');
      res.json(bookings);
      return;
    } else {
      // Se não tiver outro role, devolve algo ou 403
      res.status(403).json({ message: 'Acesso não permitido' });
      return;
    }
  } catch (error) {
    console.error('Erro ao obter reservas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Procura reserva por ID
// ------------------------------
export const getBookingById: RequestHandler = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const role = (req as any).role;
    const userId = (req as any).userId;

    const booking = await Booking.findById(bookingId)
      .populate('hospedeId', 'name email')
      .populate('hotelId', 'name');

    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    // verificar se o user pode ver esta reserva
    // Se for hospede, só pode ver a reserva se for dele
    // Se for hotel, só pode ver se for do hotel do dono
    if (role === 'hospede') {
      if (booking.hospedeId.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és o dono da reserva)' });
        return;
      }
    } else if (role === 'hotel') {
      // Verificar se o booking se refere a algum hotel do user
      const hotel = await Hotel.findById(booking.hotelId);
      if (!hotel || hotel.owner.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és dono do hotel)' });
        return;
      }
    }

    res.json(booking);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Atualizar reserva (status, datas, etc.)
// ------------------------------
// decidir se o hóspede pode editar datas ou se apenas cancela IMPORTANTE IMPORTANTE,
// se o hotel pode aceitar/cancelar, etc.
export const updateBooking: RequestHandler = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const role = (req as any).role;
    const userId = (req as any).userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    // Se for hospede, verifica se é o dono da reserva
    if (role === 'hospede') {
      if (booking.hospedeId.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és o dono da reserva)' });
        return;
      }
    }
    // Se for hotel, verifica se a reserva pertence ao hotel do user
    else if (role === 'hotel') {
      const hotel = await Hotel.findById(booking.hotelId);
      if (!hotel || hotel.owner.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és dono do hotel)' });
        return;
      }
    }

    // Atualizar campos permitidos
    const {
      checkIn,
      checkOut,
      adults,
      children,
      status, // ex.: "confirmed", "cancelled"
      totalPrice,
    } = req.body;

    if (checkIn) booking.checkIn = new Date(checkIn);
    if (checkOut) booking.checkOut = new Date(checkOut);
    if (adults !== undefined) booking.adults = adults;
    if (children !== undefined) booking.children = children;
    if (status) booking.status = status;
    if (totalPrice !== undefined) booking.totalPrice = totalPrice; // ex. calculado ou após pagamento

    await booking.save();

    res.json({ message: 'Reserva atualizada', booking });
  } catch (error) {
    console.error('Erro ao atualizar reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// ------------------------------
// Cancelar/apagar reserva
// ------------------------------
export const deleteBooking: RequestHandler = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const role = (req as any).role;
    const userId = (req as any).userId;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Reserva não encontrada' });
      return;
    }

    // Verificações de ownership (hospede vs hotel)
    if (role === 'hospede') {
      if (booking.hospedeId.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és o dono da reserva)' });
        return;
      }
    } else if (role === 'hotel') {
      const hotel = await Hotel.findById(booking.hotelId);
      if (!hotel || hotel.owner.toString() !== userId) {
        res
          .status(403)
          .json({ message: 'Acesso negado (não és dono do hotel)' });
        return;
      }
    }

    await booking.deleteOne();
    res.json({ message: 'Reserva apagada com sucesso' });
  } catch (error) {
    console.error('Erro ao apagar reserva:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};
