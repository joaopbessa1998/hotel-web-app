import { Router } from 'express';
import { createPaymentIntent } from '../controllers/payment.controller';
import { checkAuth } from '../middlewares/checkAuth';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

// POST /payments/create
//router.post('/create', checkAuth, checkRole, createPaymentIntent);
router.post('/create', checkAuth, createPaymentIntent);

export default router;
