import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import Hotel from '../src/models/Hotel.model';
import User from '../src/models/User.model';

dotenv.config();

// a URI from .env
const MONGO_URI = process.env.MONGODB_URI!;
if (!MONGO_URI) {
  console.error('🚨 MONGODB_URI não definido em .env');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB conectado!');

  // limpa todos os hotéis
  await Hotel.deleteMany({});
  console.log('Coleção de hotéis limpa');

  // cria / obtém o user “seed-hotel-owner”
  let owner = await User.findOne({ email: 'seed-hotel-owner@localhost' });
  if (!owner) {
    const passwordHash = await bcrypt.hash('password123', 10);
    owner = await User.create({
      name: 'Seed Hotel Owner',
      email: 'seed-hotel-owner@localhost',
      password: passwordHash,
      role: 'hotel',
    });
    console.log(`→ Criado owner de seed: ${owner._id}`);
  } else {
    console.log(`→ Reutilizando owner existente: ${owner._id}`);
  }

  // gera 10 hotéis aleatórios
  const amenities = [
    'wifi',
    'pool',
    'parking',
    'petFriendly',
    'evCharger',
    'roomService',
    'breakfastIncluded',
    'freeCancellation',
  ];

  for (let i = 0; i < 10; i++) {
    const roomTypes = Array.from({
      length: faker.number.int({ min: 1, max: 3 }),
    }).map(() => ({
      type: faker.helpers.arrayElement(['Single', 'Double', 'Suite']),
      quantity: faker.number.int({ min: 1, max: 5 }),
      nightlyRate: faker.number.int({ min: 40, max: 200 }),
    }));

    const phone =
      '+351 ' + faker.number.int({ min: 900000000, max: 999999999 }).toString();

    const hotel = new Hotel({
      name: `${faker.company.name()} Hotel`,
      description: faker.lorem.paragraphs({ min: 1, max: 2 }),
      stars: faker.number.int({ min: 1, max: 5 }),
      address: {
        street: faker.location.street(),
        number: faker.location.buildingNumber(),
        postalCode: faker.location.zipCode(),
        city: faker.location.city(),
        country: faker.location.country(),
      },
      contact: {
        phone,
        email: faker.internet.email(),
      },
      roomTypes,
      totalRooms: roomTypes.reduce((sum, r) => sum + r.quantity, 0),
      facilities: faker.helpers.arrayElements(
        amenities,
        faker.number.int({ min: 2, max: amenities.length }),
      ),
      photos: [],
      owner: owner._id,
    });

    await hotel.save();
    console.log(`→ Hotel criado: ${hotel.name}`);
  }

  console.log('Seed concluído com sucesso!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
