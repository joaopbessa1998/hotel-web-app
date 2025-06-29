import { RequestHandler } from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.model';
import Hotel from '../models/Hotel.model';
import Invoice from '../models/Invoice.model';
import { generateInvoicePdf } from '../utils/invoicePdf';
import 'dotenv/config';
import { IUser } from '@/models/User.model';

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
      //success_url: `${process.env.FRONT_URL}/guest?paid=success`,
      success_url: `${process.env.FRONT_URL}/guest?paid=success&booking=${bookingId}`,
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
    console.error('Erro ao validar assinatura do Stripe:', err.message);
    res.status(400).send(`Webhook error: ${err.message}`);
    return;
  }

  console.log('Tipo de evento recebido:', event.type);

  if (event.type === 'checkout.session.completed') {
    res.json({ received: true });

    (async () => {
      try {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error('bookingId em falta');
          res.status(400).send('bookingId em falta');
          return;
        }

        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          { status: 'paid' },
          { new: true },
        ).populate('hospedeId', 'name email');

        if (!booking) {
          console.error('Booking não encontrado');
          res.status(404).json({ message: 'Booking not found' });
          return;
        }

        const guest = booking.hospedeId as IUser;

        if (!guest.name || !guest.email) {
          console.error('Dados do hóspede em falta:', guest);
          return;
        }

        const hotel = await Hotel.findById(booking.hotelId, {
          name: 1,
          address: 1,
        });

        if (!hotel) {
          console.error('Hotel não encontrado');
          res.status(404).json({ message: 'Hotel not found' });
          return;
        }

        const pdfUrl = await generateInvoicePdf(
          {
            ...booking.toObject?.(),
            guestName: guest.name,
            guestEmail: guest.email,
          },
          hotel,
        );

        console.log('PDF gerado com sucesso:', pdfUrl);

        const invoice = await Invoice.create({
          guestId: guest._id,
          bookingId: booking._id,
          pdfUrl,
        });

        console.log('Fatura criada:', invoice._id);
      } catch (err) {
        console.error('Erro dentro do handler do webhook:', err);
        res.status(500).send('Erro interno');
        return;
      }
    })();
  }
};

export const confirmPayment: RequestHandler = async (req, res) => {
  const { bookingId } = req.body;

  if (!bookingId) {
    res.status(400).json({
      message: 'Missing bookingId.',
    });
    return;
  }

  const booking = await Booking.findById(bookingId);
  if (!booking) {
    res.status(404).json({
      message: 'Booking not found.',
    });
    return;
  }

  if (booking.status === 'paid') {
    res.status(200).json({
      message: 'Already paid.',
    });
    return;
  }

  booking.status = 'paid';
  await booking.save();

  res.status(200).json({
    success: true,
  });
};
