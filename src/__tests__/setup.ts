import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    throw new Error('MongoDB URI não está definida nas variáveis de ambiente');
  }

  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
}); 