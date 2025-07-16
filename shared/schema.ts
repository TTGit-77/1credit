import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  real,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles with detailed health information
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  age: integer("age"),
  gender: varchar("gender"),
  height: real("height"), // in cm
  weight: real("weight"), // in kg
  activityLevel: varchar("activity_level"), // sedentary, light, moderate, very
  goal: varchar("goal"), // lose-weight, gain-weight, maintain
  dietType: varchar("diet_type"), // vegetarian, non-vegetarian
  cuisinePreferences: text("cuisine_preferences").array(), // indian, italian, french, south-indian
  allergies: text("allergies").array(),
  additionalInfo: text("additional_info"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Meal plans
export const mealPlans = pgTable("meal_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  totalCalories: integer("total_calories"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Individual meals
export const meals = pgTable("meals", {
  id: serial("id").primaryKey(),
  mealPlanId: integer("meal_plan_id").notNull().references(() => mealPlans.id, { onDelete: "cascade" }),
  mealType: varchar("meal_type").notNull(), // breakfast, lunch, snack, dinner
  name: varchar("name").notNull(),
  description: text("description"),
  ingredients: text("ingredients").array(),
  instructions: text("instructions").array(),
  calories: integer("calories"),
  imageUrl: varchar("image_url"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
});

// User tasks
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // meal, exercise, water, supplement, custom
  dueDate: date("due_date"),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Health news articles
export const healthNews = pgTable("health_news", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  content: text("content"),
  category: varchar("category").notNull(), // nutrition, fitness, wellness, research
  imageUrl: varchar("image_url"),
  sourceUrl: varchar("source_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  weight: real("weight"),
  caloriesConsumed: integer("calories_consumed"),
  waterIntake: integer("water_intake"), // glasses
  exerciseMinutes: integer("exercise_minutes"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
});

export const insertHealthNewsSchema = createInsertSchema(healthNews).omit({
  id: true,
  createdAt: true,
  publishedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type Meal = typeof meals.$inferSelect;
export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type HealthNews = typeof healthNews.$inferSelect;
export type InsertHealthNews = z.infer<typeof insertHealthNewsSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
