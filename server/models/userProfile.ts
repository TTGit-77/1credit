import mongoose, { Document, Schema } from 'mongoose';

export interface IUserProfile extends Document {
  userId: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  goal?: string;
  dietType?: string;
  cuisinePreferences?: string[];
  allergies?: string[];
  additionalInfo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userProfileSchema = new Schema<IUserProfile>({
  userId: { type: String, required: true, ref: 'User' },
  age: Number,
  gender: String,
  height: Number,
  weight: Number,
  activityLevel: String,
  goal: String,
  dietType: String,
  cuisinePreferences: [String],
  allergies: [String],
  additionalInfo: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUserProfile>('UserProfile', userProfileSchema); 