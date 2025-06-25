import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/index';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST!);
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

describe('Auth Endpoints', () => {
  it('Regista novo hóspede', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Hóspede Jest Unit Test',
      email: 'hospedejestunittest@test.com',
      password: '123456',
      role: 'hospede',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('hospede');
  });

  it('Faz login com credenciais correctas', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'hospedejestunittest@test.com',
      password: '123456',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('hospedejestunittest@test.com');
  });
});
