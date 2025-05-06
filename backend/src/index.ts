import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes';
import hotelRoutes from './routes/hotel.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';

dotenv.config(); // lê variáveis de ambiente do ficheiro .env

// conectar ao mongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB conectado com sucesso!');
  })
  .catch((error) => {
    console.error('Erro de conexão ao MongoDB:', error);
  });

const app = express();

// middleware
app.use(cors());
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

// iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor a rodar na porta ${PORT}`);
});
