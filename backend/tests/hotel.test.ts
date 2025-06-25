import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

let hotelToken: string;
let hotelId: string;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);

  // registar user hotel
  const reg = await request(app).post('/auth/register').send({
    name: 'Teste Hotel Unit Test',
    email: 'hotelunittest@test.com',
    password: '123456',
    role: 'hotel',
  });
  hotelToken = reg.body.token;
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

describe('Hotel Endpoints', () => {
  it('Cria um hotel', async () => {
    const res = await request(app)
      .post('/hotels')
      .set('Authorization', `Bearer ${hotelToken}`)
      .send({
        name: 'Hotel API',
        description: 'Descrição',
        stars: 5,
        address: {
          street: 'Rua A',
          number: '10',
          postalCode: '1000-100',
          city: 'Lisboa',
          country: 'Portugal',
        },
        contact: {
          phone: '910000000',
          email: 'contato@hotelapi.com',
        },
        roomTypes: [{ type: 'Single', quantity: 2, nightlyRate: 30 }],
        facilities: ['wifi'],
        photos: [],
      });
    expect(res.status).toBe(201);
    expect(res.body.hotel).toHaveProperty('_id');
    hotelId = res.body.hotel._id;
  });

  it('Obtém o “meu hotel”', async () => {
    const res = await request(app)
      .get('/hotels/my')
      .set('Authorization', `Bearer ${hotelToken}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(hotelId);
  });
});
