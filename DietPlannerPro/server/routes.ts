import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertUserProfileSchema, insertTaskSchema, insertUserProgressSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
  app.get('/api/meal-plans', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/meal-plans/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
        const targetCalories = calculateDailyCalories(profile);
        
        const mealPlan = await storage.createMealPlan({
          userId,
          date: dateString,
          totalCalories: targetCalories,
        });

        // Generate meals based on preferences
        const meals = generateMealsForProfile(profile, targetCalories);
        
        for (const mealData of meals) {
          await storage.addMealToPlan({
            ...mealData,
            mealPlanId: mealPlan.id,
          });
        }

        mealPlans.push(mealPlan);
      }

      res.json(mealPlans);
    } catch (error) {
      console.error("Error generating meal plans:", error);
      res.status(500).json({ message: "Failed to generate meal plans" });
    }
  });

  app.patch('/api/meals/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const mealId = parseInt(req.params.id);
      const { completed } = req.body;
      
      const meal = await storage.updateMealCompletion(mealId, completed);
      res.json(meal);
    } catch (error) {
      console.error("Error updating meal completion:", error);
      res.status(500).json({ message: "Failed to update meal completion" });
    }
  });

  // Task routes
  app.get('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.query;
      
      const tasks = await storage.getTasksByUser(userId, date as string);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.patch('/api/tasks/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const taskId = parseInt(req.params.id);
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
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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

function calculateDailyCalories(profile: any): number {
  // Basic BMR calculation using Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  
  // Activity level multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725
  };
  
  const tdee = bmr * (activityMultipliers[profile.activityLevel as keyof typeof activityMultipliers] || 1.2);
  
  // Adjust based on goal
  if (profile.goal === 'lose-weight') {
    return Math.round(tdee - 500); // 500 calorie deficit
  } else if (profile.goal === 'gain-weight') {
    return Math.round(tdee + 500); // 500 calorie surplus
  }
  
  return Math.round(tdee); // maintain
}

function generateMealsForProfile(profile: any, targetCalories: number) {
  // Basic meal distribution
  const breakfastCals = Math.round(targetCalories * 0.25);
  const lunchCals = Math.round(targetCalories * 0.35);
  const snackCals = Math.round(targetCalories * 0.15);
  const dinnerCals = Math.round(targetCalories * 0.25);
  
  const isVeg = profile.dietType === 'vegetarian';
  const cuisines = profile.cuisinePreferences || ['indian'];
  
  // Sample meal templates (in a real app, this would be a comprehensive database)
  const mealTemplates = {
    breakfast: [
      {
        name: "Oatmeal Bowl",
        description: "Steel-cut oats with berries, nuts, and honey",
        ingredients: ["oats", "mixed berries", "almonds", "honey", "milk"],
        instructions: ["Cook oats", "Add toppings", "Serve warm"],
        imageUrl: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400"
      },
      {
        name: "Vegetable Upma",
        description: "Traditional South Indian breakfast with vegetables",
        ingredients: ["semolina", "mixed vegetables", "curry leaves", "mustard seeds"],
        instructions: ["Roast semolina", "Sauté vegetables", "Mix and cook"],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?w=400"
      }
    ],
    lunch: [
      {
        name: "Quinoa Power Bowl",
        description: "Protein-rich quinoa with vegetables and chickpeas",
        ingredients: ["quinoa", "chickpeas", "avocado", "vegetables", "tahini"],
        instructions: ["Cook quinoa", "Prepare vegetables", "Assemble bowl"],
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
      },
      {
        name: isVeg ? "Dal Rice Bowl" : "Chicken Curry Rice",
        description: isVeg ? "Traditional dal with brown rice" : "Spiced chicken curry with rice",
        ingredients: isVeg ? ["lentils", "brown rice", "spices", "vegetables"] : ["chicken", "rice", "curry spices", "onions"],
        instructions: ["Cook main dish", "Prepare rice", "Serve together"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400"
      }
    ],
    snack: [
      {
        name: "Trail Mix",
        description: "Mixed nuts and dried fruits",
        ingredients: ["almonds", "walnuts", "dried cranberries", "dark chocolate chips"],
        instructions: ["Mix all ingredients", "Store in container"],
        imageUrl: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400"
      }
    ],
    dinner: [
      {
        name: isVeg ? "Grilled Vegetables with Quinoa" : "Grilled Salmon with Vegetables",
        description: isVeg ? "Seasonal grilled vegetables with quinoa" : "Omega-3 rich salmon with roasted vegetables",
        ingredients: isVeg ? ["mixed vegetables", "quinoa", "olive oil", "herbs"] : ["salmon fillet", "broccoli", "sweet potato", "olive oil"],
        instructions: ["Prepare protein/grain", "Roast vegetables", "Serve together"],
        imageUrl: isVeg ? "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400" : "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400"
      }
    ]
  };
  
  return [
    {
      mealType: 'breakfast',
      ...mealTemplates.breakfast[0],
      calories: breakfastCals
    },
    {
      mealType: 'lunch',
      ...mealTemplates.lunch[0],
      calories: lunchCals
    },
    {
      mealType: 'snack',
      ...mealTemplates.snack[0],
      calories: snackCals
    },
    {
      mealType: 'dinner',
      ...mealTemplates.dinner[0],
      calories: dinnerCals
    }
  ];
}
