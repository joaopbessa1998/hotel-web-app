import { RequestHandler } from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.model';
import Hotel from '../models/Hotel.model';
import Invoice from '../models/Invoice.model';
import { generateInvoicePdf } from '../utils/invoicePdf';
import 'dotenv/config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // usa a default apiVersion

// POST /payments/checkout
export const createCheckout: RequestHandler = async (req, res) => {
  console.log('createCheckout headers:', req.headers);
  console.log('createCheckout body:', req.body);
  try {
    console.log('createCheckout body:', req.body);
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).lean();
    console.log('found booking:', booking);

    if (!booking || booking.status !== 'pending') {
      console.warn('Booking inválida ou não pendente:', booking);
      res.status(400).json({ message: 'Reserva inválida' });
      return;
    }

    // popula apenas o nome do hotel
    const hotel = await Hotel.findById(booking.hotelId, { name: 1 }).lean();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: req.userEmail, // pode ser undefined (??)
      line_items: [
        {
          price_data: {
            currency: 'eur',
            unit_amount: Math.round(booking.totalPrice * 100),
            product_data: {
              name: `Reserva em ${hotel?.name || 'Hotel'}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: bookingId.toString() },
      success_url: `${process.env.FRONT_URL}/guest?paid=success`,
      cancel_url: `${process.env.FRONT_URL}/guest?paid=cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erro interno createCheckout:', err);
    res.status(500).json({ message: 'Erro interno' });
  }
};

// post /payments/webhook
export const webhook: RequestHandler = async (req, res) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as string,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'paid' },
      { new: true },
    ).lean();

    if (!booking) {
      res.json({ received: true });
      return;
    }

    const hotel = await Hotel.findById(booking.hotelId, { name: 1 }).lean();
    const pdfUrl = await generateInvoicePdf(booking, hotel);

    await Invoice.create({
      hospedeId: booking.hospedeId,
      bookingId: booking._id,
      pdfUrl,
    });
  }

  res.json({ received: true });
};
