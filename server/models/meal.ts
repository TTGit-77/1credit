import mongoose, { Document, Schema } from 'mongoose';

export interface IMeal extends Document {
  mealPlanId: mongoose.Types.ObjectId;
  mealType: string;
  name: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  calories?: number;
  imageUrl?: string;
  completed?: boolean;
  completedAt?: Date;
}

const mealSchema = new Schema<IMeal>({
  mealPlanId: { type: Schema.Types.ObjectId, required: true, ref: 'MealPlan' },
  mealType: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  ingredients: [String],
  instructions: [String],
  calories: Number,
  imageUrl: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

export default mongoose.model<IMeal>('Meal', mealSchema); 