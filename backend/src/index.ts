import express, { Request, Response } from 'express';
import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import uploadRoutes from './routes/upload.routes';
import guestRoutes from './routes/guest.routes';
import Stripe from 'stripe';
import 'dotenv/config';

dotenv.config(); // lê variáveis de ambiente do ficheiro .env

// conectar ao mongoDB
// mongoose
//   .connect(process.env.MONGODB_URI as string)
//   .then(() => {
//     console.log('MongoDB conectado com sucesso!');
//   })
//   .catch((error) => {
//     console.error('Erro de conexão ao MongoDB:', error);
//   });

const app = express();

// middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
// rota de teste
app.get('/ping', (req: Request, res: Response) => {
  res.send('Pong');
});

// rota de autenticação
app.use('/auth', authRoutes);
app.use('/hotels', hotelRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/upload', uploadRoutes);
app.use('/uploads', express.static(path.resolve('uploads')));
app.use('/guests', guestRoutes);
//app.use('/', guestRoutes);
//app.use('/', paymentRoutes);

// iniciar servidor
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Servidor a rodar na porta ${PORT}`);
// });
export default app;

if (require.main === module) {
  const MONGO_URI = process.env.MONGODB_URI!;
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log('MongoDB connectado com sucesso!'))
    .catch((err) => console.error('Erro de conexão ao MongoDB', err));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor a rodar na porta ${PORT}`));
}

// if (require.main === module) {
//   // só .listen() quando for executado diretamente
//   const PORT = process.env.PORT || 3000;
//   app.listen(PORT, () => console.log(`Servidor a rodar na porta ${PORT}`));
// }
