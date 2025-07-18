import mongoose from 'mongoose';

const mongoUrl = process.env.DATABASE_URL || 'mongodb://localhost:27017/dietplannerpro';

mongoose.connect(mongoUrl);

export const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});