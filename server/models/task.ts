import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  type: string;
  dueDate?: Date;
  completed?: boolean;
  completedAt?: Date;
  createdAt?: Date;
}

const taskSchema = new Schema<ITask>({
  userId: { type: String, required: true, ref: 'User' },
  title: { type: String, required: true },
  description: String,
  type: { type: String, required: true },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITask>('Task', taskSchema); 