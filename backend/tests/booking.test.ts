import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

let hotelToken: string;
let guestToken: string;
let hotelId: string;
let bookingId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);

  // cria hotel
  const h = await request(app).post('/auth/register').send({
    name: 'Hotel B',
    email: 'hotelb@test.com',
    password: '123456',
    role: 'hotel',
  });
  hotelToken = h.body.token;

  const ht = await request(app)
    .post('/hotels')
    .set('Authorization', `Bearer ${hotelToken}`)
    .send({
      name: 'Hotel B',
      description: '...',
      stars: 4,
      address: {
        street: 'X',
        number: '1',
        postalCode: '2000-200',
        city: 'Porto',
        country: 'PT',
      },
      contact: { phone: '911111111', email: 'b@hotel.com' },
      roomTypes: [{ type: 'Single', quantity: 1, nightlyRate: 50 }],
      facilities: [],
      photos: [],
    });
  hotelId = ht.body.hotel._id;

  // cria hóspede e token
  await request(app).post('/auth/register').send({
    name: 'Hospede B',
    email: 'hospedeb@test.com',
    password: '123456',
    role: 'hospede',
  });
  const gl = await request(app).post('/auth/login').send({
    email: 'hospedeb@test.com',
    password: '123456',
  });
  guestToken = gl.body.token;
});

// afterAll(async () => {
//   await mongoose.connection.db.dropDatabase();
//   await mongoose.disconnect();
// });
afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

describe('Booking Endpoints', () => {
  it('Cria uma reserva', async () => {
    const res = await request(app)
      .post('/bookings')
      .set('Authorization', `Bearer ${guestToken}`)
      .send({
        hotelId,
        roomType: 'Single',
        checkIn: '2025-07-01',
        checkOut: '2025-07-06',
        adults: 1,
        children: 0,
      });
    expect(res.status).toBe(201);
    expect(res.body.booking.status).toBe('pending');
    bookingId = res.body.booking._id;
  });

  it('Hotel vê a reserva pendente', async () => {
    const res = await request(app)
      .get('/bookings')
      .set('Authorization', `Bearer ${hotelToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: bookingId })]),
    );
  });
});
