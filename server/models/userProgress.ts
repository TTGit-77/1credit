import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProgress extends Document {
  userId: string;
  date: Date;
  weight?: number;
  caloriesConsumed?: number;
  waterIntake?: number;
  exerciseMinutes?: number;
  notes?: string;
  createdAt?: Date;
}

const userProgressSchema = new Schema<IUserProgress>({
  userId: { type: String, required: true, ref: 'User' },
  date: { type: Date, required: true },
  weight: Number,
  caloriesConsumed: Number,
  waterIntake: Number,
  exerciseMinutes: Number,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserProgress>('UserProgress', userProgressSchema); 