import mongoose, { Document, Schema } from 'mongoose';

export interface IHealthNews extends Document {
  title: string;
  description?: string;
  content?: string;
  category: string;
  imageUrl?: string;
  sourceUrl?: string;
  publishedAt?: Date;
  createdAt?: Date;
}

const healthNewsSchema = new Schema<IHealthNews>({
  title: { type: String, required: true },
  description: String,
  content: String,
  category: { type: String, required: true },
  imageUrl: String,
  sourceUrl: String,
  publishedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IHealthNews>('HealthNews', healthNewsSchema); 