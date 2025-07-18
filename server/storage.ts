import User from './models/user.ts';
import UserProfile from './models/userProfile.ts';
import MealPlan from './models/mealPlan.ts';
import Meal from './models/meal.ts';
import Task from './models/task.ts';
import HealthNews from './models/healthNews.ts';
import UserProgress from './models/userProgress.ts';

// Interface for storage operations
export interface IStorage {
  getUser(id: string): Promise<any>;
  upsertUser(user: any): Promise<any>;
  getUserProfile(userId: string): Promise<any>;
  createUserProfile(profile: any): Promise<any>;
  updateUserProfile(userId: string, profile: any): Promise<any>;
  getMealPlansByUser(userId: string, startDate?: string, endDate?: string): Promise<any[]>;
  createMealPlan(mealPlan: any): Promise<any>;
  addMealToPlan(meal: any): Promise<any>;
  updateMealCompletion(mealId: string, completed: boolean): Promise<any>;
  getTasksByUser(userId: string, date?: string): Promise<any[]>;
  createTask(task: any): Promise<any>;
  updateTaskCompletion(taskId: string, completed: boolean): Promise<any>;
  getHealthNews(category?: string, limit?: number): Promise<any[]>;
  createHealthNews(news: any): Promise<any>;
  getUserProgress(userId: string, startDate?: string, endDate?: string): Promise<any[]>;
  createUserProgress(progress: any): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) {
    return await User.findOne({ id });
  }

  async upsertUser(userData: any) {
    return await User.findOneAndUpdate(
      { id: userData.id },
      { ...userData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  async getUserProfile(userId: string) {
    return await UserProfile.findOne({ userId });
  }

  async createUserProfile(profile: any) {
    return await UserProfile.create(profile);
  }

  async updateUserProfile(userId: string, profile: any) {
    return await UserProfile.findOneAndUpdate(
      { userId },
      { ...profile, updatedAt: new Date() },
      { new: true }
    );
  }

  async getMealPlansByUser(userId: string, startDate?: string, endDate?: string) {
    const query: any = { userId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    const plans = await MealPlan.find(query).sort({ date: -1 });
    const plansWithMeals = await Promise.all(
      plans.map(async (plan: any) => {
        const meals = await Meal.find({ mealPlanId: plan._id }).sort({ mealType: 1 });
        return { ...plan.toObject(), meals };
      })
    );
    return plansWithMeals;
  }

  async createMealPlan(mealPlan: any) {
    return await MealPlan.create(mealPlan);
  }

  async addMealToPlan(meal: any) {
    return await Meal.create(meal);
  }

  async updateMealCompletion(mealId: string, completed: boolean) {
    return await Meal.findByIdAndUpdate(
      mealId,
      { completed, completedAt: completed ? new Date() : null },
      { new: true }
    );
  }

  async getTasksByUser(userId: string, date?: string) {
    const query: any = { userId };
    if (date) query.dueDate = new Date(date);
    return await Task.find(query).sort({ createdAt: 1 });
  }

  async createTask(task: any) {
    return await Task.create(task);
  }

  async updateTaskCompletion(taskId: string, completed: boolean) {
    return await Task.findByIdAndUpdate(
      taskId,
      { completed, completedAt: completed ? new Date() : null },
      { new: true }
    );
  }

  async getHealthNews(category?: string, limit = 10) {
    const query: any = {};
    if (category && category !== 'all') query.category = category;
    return await HealthNews.find(query).sort({ publishedAt: -1 }).limit(limit);
  }

  async createHealthNews(news: any) {
    return await HealthNews.create(news);
  }

  async getUserProgress(userId: string, startDate?: string, endDate?: string) {
    const query: any = { userId };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    return await UserProgress.find(query).sort({ date: -1 });
  }

  async createUserProgress(progress: any) {
    return await UserProgress.create(progress);
  }
}

export const storage = new DatabaseStorage();
