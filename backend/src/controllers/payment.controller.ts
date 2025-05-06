// payment.controller.ts
import { RequestHandler } from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.model'; // filtrar por booking
import dotenv from 'dotenv';

dotenv.config(); // acesso às variáveis de ambiente

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-03-31.basil',
});

// cria um payment intent e devolve o client secret ao front
export const createPaymentIntent: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // O userId vem do checkAuth
    const userId = (req as any).userId;

    if (!bookingId) {
      res.status(400).json({ message: 'Falta o bookingId' });
      return;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404).json({ message: 'Booking não encontrado' });
      return;
    }

    // determinar montante a cobrar (em cêntimos)
    const amountInCents = (booking.totalPrice || 0) * 100;

    // criar PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur', // ou 'usd'
      payment_method_types: ['card'],
      metadata: {
        bookingId: bookingId.toString(),
      },
    });

    // devolve clientSecret
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};
