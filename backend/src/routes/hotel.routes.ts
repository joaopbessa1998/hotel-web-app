import { Router } from 'express';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from '../controllers/hotel.controller';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

// Rotas públicas
router.get('/', getAllHotels); // GET /hotels
router.get('/:id', getHotelById); // GET /hotels/:id

// Rotas protegidas (apenas user autenticado + idealmente role hotel)
router.post('/', checkAuth, checkRole(['hotel']), createHotel);
router.put('/:id', checkAuth, checkRole(['hotel']), updateHotel);
router.delete('/:id', checkAuth, checkRole(['hotel']), deleteHotel);

export default router;
