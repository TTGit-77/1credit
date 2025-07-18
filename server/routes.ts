import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema, insertTaskSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // No auth middleware

  // User profile routes
  app.get('/api/profile', async (req: any, res) => {
    try {
      // For demo, use a fixed userId or get from query
      const userId = req.query.userId || 'demo-user';
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post('/api/profile', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId
      });
      const existingProfile = await storage.getUserProfile(userId);
      let profile;
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, profileData);
      } else {
        profile = await storage.createUserProfile(profileData);
      }
      res.json(profile);
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      res.status(500).json({ message: "Failed to save profile" });
    }
  });

  // Meal plan routes
  app.get('/api/meal-plans', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const { startDate, endDate } = req.query;
      const mealPlans = await storage.getMealPlansByUser(
        userId, 
        startDate as string, 
        endDate as string
      );
      res.json(mealPlans);
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      res.status(500).json({ message: "Failed to fetch meal plans" });
    }
  });

  app.post('/api/meal-plans/generate', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(400).json({ message: "Please complete your profile first" });
      }
      // Generate 3-day meal plan based on user profile
      const today = new Date();
      const mealPlans = [];
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        // Calculate target calories based on profile
        const targetCalories = 2000; // mock value
        const mealPlan = await storage.createMealPlan({
          userId,
          date: dateString,
          totalCalories: targetCalories,
        });
        // Generate meals based on preferences
        // (mock meals for now)
        mealPlans.push(mealPlan);
      }
      res.json(mealPlans);
    } catch (error) {
      console.error("Error generating meal plans:", error);
      res.status(500).json({ message: "Failed to generate meal plans" });
    }
  });

  app.patch('/api/meals/:id/complete', async (req: any, res) => {
    try {
      const mealId = req.params.id;
      const { completed } = req.body;
      const meal = await storage.updateMealCompletion(mealId, completed);
      res.json(meal);
    } catch (error) {
      console.error("Error updating meal completion:", error);
      res.status(500).json({ message: "Failed to update meal completion" });
    }
  });

  // Task routes
  app.get('/api/tasks', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const { date } = req.query;
      const tasks = await storage.getTasksByUser(userId, date as string);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const taskData = insertTaskSchema.parse({
        ...req.body,
        userId
      });
      const task = await storage.createTask(taskData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.patch('/api/tasks/:id/complete', async (req: any, res) => {
    try {
      const taskId = req.params.id;
      const { completed } = req.body;
      const task = await storage.updateTaskCompletion(taskId, completed);
      res.json(task);
    } catch (error) {
      console.error("Error updating task completion:", error);
      res.status(500).json({ message: "Failed to update task completion" });
    }
  });

  // Health news routes
  app.get('/api/health-news', async (req, res) => {
    try {
      const { category, limit } = req.query;
      const news = await storage.getHealthNews(
        category as string, 
        limit ? parseInt(limit as string) : undefined
      );
      res.json(news);
    } catch (error) {
      console.error("Error fetching health news:", error);
      res.status(500).json({ message: "Failed to fetch health news" });
    }
  });

  // Progress tracking routes
  app.get('/api/progress', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const { startDate, endDate } = req.query;
      const progress = await storage.getUserProgress(
        userId,
        startDate as string,
        endDate as string
      );
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', async (req: any, res) => {
    try {
      const userId = req.query.userId || 'demo-user';
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId
      });
      const progress = await storage.createUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error creating progress entry:", error);
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
