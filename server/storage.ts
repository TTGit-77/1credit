import {
  users,
  userProfiles,
  mealPlans,
  meals,
  tasks,
  healthNews,
  userProgress,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type MealPlan,
  type InsertMealPlan,
  type Meal,
  type InsertMeal,
  type Task,
  type InsertTask,
  type HealthNews,
  type InsertHealthNews,
  type UserProgress,
  type InsertUserProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // User profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Meal plan operations
  getMealPlansByUser(userId: string, startDate?: string, endDate?: string): Promise<(MealPlan & { meals: Meal[] })[]>;
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  addMealToPlan(meal: InsertMeal): Promise<Meal>;
  updateMealCompletion(mealId: number, completed: boolean): Promise<Meal>;
  
  // Task operations
  getTasksByUser(userId: string, date?: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTaskCompletion(taskId: number, completed: boolean): Promise<Task>;
  
  // Health news operations
  getHealthNews(category?: string, limit?: number): Promise<HealthNews[]>;
  createHealthNews(news: InsertHealthNews): Promise<HealthNews>;
  
  // Progress tracking
  getUserProgress(userId: string, startDate?: string, endDate?: string): Promise<UserProgress[]>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Meal plan operations
  async getMealPlansByUser(userId: string, startDate?: string, endDate?: string): Promise<(MealPlan & { meals: Meal[] })[]> {
    const whereConditions = [eq(mealPlans.userId, userId)];

    if (startDate && endDate) {
      whereConditions.push(gte(mealPlans.date, startDate));
      whereConditions.push(lte(mealPlans.date, endDate));
    }

    const plans = await db
      .select()
      .from(mealPlans)
      .where(and(...whereConditions))
      .orderBy(desc(mealPlans.date));
    
    // Get meals for each plan
    const plansWithMeals = await Promise.all(
      plans.map(async (plan) => {
        const planMeals = await db
          .select()
          .from(meals)
          .where(eq(meals.mealPlanId, plan.id))
          .orderBy(meals.mealType);
        
        return { ...plan, meals: planMeals };
      })
    );

    return plansWithMeals;
  }

  async createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan> {
    const [newPlan] = await db
      .insert(mealPlans)
      .values(mealPlan)
      .returning();
    return newPlan;
  }

  async addMealToPlan(meal: InsertMeal): Promise<Meal> {
    const [newMeal] = await db
      .insert(meals)
      .values(meal)
      .returning();
    return newMeal;
  }

  async updateMealCompletion(mealId: number, completed: boolean): Promise<Meal> {
    const [updatedMeal] = await db
      .update(meals)
      .set({ 
        completed, 
        completedAt: completed ? new Date() : null 
      })
      .where(eq(meals.id, mealId))
      .returning();
    return updatedMeal;
  }

  // Task operations
  async getTasksByUser(userId: string, date?: string): Promise<Task[]> {
    const whereConditions = [eq(tasks.userId, userId)];

    if (date) {
      whereConditions.push(eq(tasks.dueDate, date));
    }

    return await db
      .select()
      .from(tasks)
      .where(and(...whereConditions))
      .orderBy(tasks.createdAt);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const [newTask] = await db
      .insert(tasks)
      .values(task)
      .returning();
    return newTask;
  }

  async updateTaskCompletion(taskId: number, completed: boolean): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set({ 
        completed, 
        completedAt: completed ? new Date() : null 
      })
      .where(eq(tasks.id, taskId))
      .returning();
    return updatedTask;
  }

  // Health news operations
  async getHealthNews(category?: string, limit = 10): Promise<HealthNews[]> {
    let baseQuery = db.select().from(healthNews);

    if (category && category !== 'all') {
      return await baseQuery
        .where(eq(healthNews.category, category))
        .orderBy(desc(healthNews.publishedAt))
        .limit(limit);
    }

    return await baseQuery
      .orderBy(desc(healthNews.publishedAt))
      .limit(limit);
  }

  async createHealthNews(news: InsertHealthNews): Promise<HealthNews> {
    const [newNews] = await db
      .insert(healthNews)
      .values(news)
      .returning();
    return newNews;
  }

  // Progress tracking
  async getUserProgress(userId: string, startDate?: string, endDate?: string): Promise<UserProgress[]> {
    const whereConditions = [eq(userProgress.userId, userId)];

    if (startDate && endDate) {
      whereConditions.push(gte(userProgress.date, startDate));
      whereConditions.push(lte(userProgress.date, endDate));
    }

    return await db
      .select()
      .from(userProgress)
      .where(and(...whereConditions))
      .orderBy(desc(userProgress.date));
  }

  async createUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [newProgress] = await db
      .insert(userProgress)
      .values(progress)
      .returning();
    return newProgress;
  }
}

export const storage = new DatabaseStorage();
