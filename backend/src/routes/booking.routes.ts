import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} from '../controllers/booking.controller';

const router = Router();

// A reserva deve ser feita por um hospede, e também ele pode ver/cancelar as reservas dele
// O hotel (role 'hotel') pode ver/cancelar/atualizar apenas as reservas do hotel dele

// Criar reserva (apenas hospede)
router.post('/', checkAuth, checkRole(['hospede']), createBooking);

// List reservas do user (hospede ou hotel)
router.get('/', checkAuth, getAllBookings);

// Obter detalhe de uma reserva
router.get('/:id', checkAuth, getBookingById);

// Atualizar reserva (datas, status, etc.)
router.put('/:id', checkAuth, updateBooking);

// Apagar reserva
router.delete('/:id', checkAuth, deleteBooking);

export default router;
