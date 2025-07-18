import mongoose, { Document, Schema } from 'mongoose';

export interface IMealPlan extends Document {
  userId: string;
  date: Date;
  totalCalories?: number;
  createdAt?: Date;
}

const mealPlanSchema = new Schema<IMealPlan>({
  userId: { type: String, required: true, ref: 'User' },
  date: { type: Date, required: true },
  totalCalories: Number,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMealPlan>('MealPlan', mealPlanSchema); 