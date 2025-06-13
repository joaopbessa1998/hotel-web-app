// src/routes/hotel.routes.ts

import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';
import {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  getMyHotel,
  updateMyHotel,
  updateMyFacilities,
  deleteMyPhoto,
} from '../controllers/hotel.controller';

const router = Router();

// ─── Public ────────────────────────────────────────────────────

// Lista todos os hotéis
// GET /hotels
router.get('/', getAllHotels);

// ─── “Meu hotel” (owner) ───────────────────────────────────────
// Estas rotas precisam só de autenticação e usam os controller
// que manipulam o hotel cujo owner === req.userId

// GET    /hotels/my
router.get('/my', checkAuth, getMyHotel);

// PUT    /hotels/my
router.put('/my', checkAuth, updateMyHotel);

// PATCH  /hotels/my/facilities
router.patch('/my/facilities', checkAuth, updateMyFacilities);

// DELETE /hotels/my/photo/:filename
router.delete('/my/photo/:filename', checkAuth, deleteMyPhoto);

// ─── Público por ID ────────────────────────────────────────────
// Deve vir depois de `/my` para não ser apanhado pelo `/:id`

// GET    /hotels/:id
router.get('/:id', getHotelById);

// ─── Protegido ─────────────────────────────────────────────────

// Cria um hotel (qualquer user autenticado)
// POST   /hotels
router.post('/', checkAuth, createHotel);

// Atualiza um hotel por ID (só role 'hotel')
// PUT    /hotels/:id
router.put('/:id', checkAuth, checkRole(['hotel']), updateHotelById);

// Apaga um hotel por ID (só role 'hotel')
// DELETE /hotels/:id
router.delete('/:id', checkAuth, checkRole(['hotel']), deleteHotelById);

export default router;
