import { Router } from 'express';
import { checkAuth } from '../middlewares/checkAuth';
import { createCheckout, webhook } from '../controllers/payment.controller';

const router = Router();

// Inicia um checkout session para a reserva especificada
// POST /payments/checkout
router.post('/checkout', checkAuth, createCheckout);

// Recebe webhooks do Stripe (montado com express.raw no index.ts)
// POST /payments/webhook
router.post('/webhook', webhook);

export default router;
