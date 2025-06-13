import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import {
  getProfile,
  updateProfile,
  getMyBookings,
  getMyInvoices,
  cancelBooking,
} from '../controllers/guest.controller';

const router = Router();

router.get('/my-profile', checkAuth, getProfile);
router.put('/my-profile', checkAuth, updateProfile);

router.get('/bookings', checkAuth, getMyBookings); // devolve só do hóspede
router.patch('/bookings/:id', checkAuth, cancelBooking);

router.get('/invoices', checkAuth, getMyInvoices);

export default router;
