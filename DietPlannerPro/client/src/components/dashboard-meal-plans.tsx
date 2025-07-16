import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CalendarDays, 
  ChefHat, 
  Clock, 
  Flame, 
  Plus, 
  RefreshCw, 
  CheckCircle,
  Circle,
  Sun,
  Sunset,
  Moon,
  Coffee
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "./task-card";
import type { MealPlan, Meal, Task } from "@shared/schema";

export default function DashboardMealPlans() {
  const [selectedDay, setSelectedDay] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate date range for next 3 days
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: mealPlans, isLoading, error } = useQuery({
    queryKey: ['/api/meal-plans', { startDate, endDate }],
    retry: false,
  });

  const { data: allTasks } = useQuery({
    queryKey: ['/api/tasks'],
    retry: false,
  });

  const generateMealPlansMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/meal-plans/generate');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans'] });
      toast({
        title: "Meal Plans Generated",
        description: "Your personalized 3-day meal plan is ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to generate meal plans. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateMealMutation = useMutation({
    mutationFn: async ({ mealId, completed }: { mealId: number; completed: boolean }) => {
      return await apiRequest('PATCH', `/api/meals/${mealId}/complete`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/meal-plans'] });
      toast({
        title: "Meal Updated",
        description: "Meal completion status updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update meal. Please try again.",
        variant: "destructive",
      });
    }
  });

  const getMealIcon = (mealType: string) => {
    const icons = {
      breakfast: Sun,
      lunch: Sunset,
      snack: Coffee,
      dinner: Moon
    };
    return icons[mealType as keyof typeof icons] || Coffee;
  };

  const getMealTypeColor = (mealType: string) => {
    const colors = {
      breakfast: 'text-amber-500',
      lunch: 'text-orange-500',
      snack: 'text-purple-500',
      dinner: 'text-indigo-500'
    };
    return colors[mealType as keyof typeof colors] || 'text-gray-500';
  };

  const getDayLabel = (index: number) => {
    const date = new Date(today.getTime() + index * 24 * 60 * 60 * 1000);
    const labels = ['Today', 'Tomorrow', 'Day 3'];
    return {
      label: labels[index],
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  };

  const getDayTasks = (dayIndex: number) => {
    const date = new Date(today.getTime() + dayIndex * 24 * 60 * 60 * 1000);
    const dateString = date.toISOString().split('T')[0];
    return allTasks?.filter(task => task.dueDate === dateString) || [];
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary to-secondary p-6">
                <Skeleton className="h-6 w-32 bg-white/20" />
              </div>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <Skeleton key={j} className="h-48 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !mealPlans || mealPlans.length === 0) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Meal Plans</h1>
            <p className="text-gray-600">AI-generated meal plans based on your preferences and goals</p>
          </div>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Meal Plans Available</h3>
            <p className="text-gray-600 mb-6">Generate your personalized 3-day meal plan to get started.</p>
            <Button 
              onClick={() => generateMealPlansMutation.mutate()}
              disabled={generateMealPlansMutation.isPending}
              className="bg-primary hover:bg-primary-600"
            >
              {generateMealPlansMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Meal Plans
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Personalized Meal Plans</h1>
          <p className="text-gray-600">AI-generated meal plans based on your preferences and goals</p>
        </div>
        <Button 
          onClick={() => generateMealPlansMutation.mutate()}
          disabled={generateMealPlansMutation.isPending}
          variant="outline"
        >
          {generateMealPlansMutation.isPending ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Regenerate Plans
            </>
          )}
        </Button>
      </motion.div>

      {/* Day Tabs */}
      <Tabs value={selectedDay.toString()} onValueChange={(value) => setSelectedDay(parseInt(value))}>
        <TabsList className="grid w-full grid-cols-3">
          {[0, 1, 2].map((dayIndex) => {
            const { label, date } = getDayLabel(dayIndex);
            const dayPlan = mealPlans.find(plan => {
              const planDate = new Date(plan.date).toDateString();
              const targetDate = new Date(today.getTime() + dayIndex * 24 * 60 * 60 * 1000).toDateString();
              return planDate === targetDate;
            });
            
            return (
              <TabsTrigger key={dayIndex} value={dayIndex.toString()} className="flex flex-col">
                <span className="font-semibold">{label}</span>
                <span className="text-xs text-gray-500">{date}</span>
                {dayPlan && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {dayPlan.totalCalories} cal
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {[0, 1, 2].map((dayIndex) => {
          const { label } = getDayLabel(dayIndex);
          const dayPlan = mealPlans.find(plan => {
            const planDate = new Date(plan.date).toDateString();
            const targetDate = new Date(today.getTime() + dayIndex * 24 * 60 * 60 * 1000).toDateString();
            return planDate === targetDate;
          });
          const dayTasks = getDayTasks(dayIndex);

          return (
            <TabsContent key={dayIndex} value={dayIndex.toString()}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {dayPlan ? (
                  <Card className="overflow-hidden shadow-lg">
                    {/* Plan Header */}
                    <div className={`p-6 text-white ${
                      dayIndex === 0 ? 'bg-gradient-to-r from-primary to-primary-600' :
                      dayIndex === 1 ? 'bg-gradient-to-r from-secondary to-secondary-600' :
                      'bg-gradient-to-r from-indigo-500 to-indigo-600'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-2xl font-bold">{label}</h2>
                          <p className="opacity-90">
                            {dayIndex === 0 ? 'Focus: Balanced nutrition' :
                             dayIndex === 1 ? 'Focus: Protein boost' :
                             'Focus: Energy optimization'}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">{dayPlan.totalCalories}</div>
                          <div className="text-sm opacity-90">calories</div>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Meals Grid */}
                      <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {['breakfast', 'lunch', 'snack', 'dinner'].map((mealType) => {
                          const meal = dayPlan.meals?.find(m => m.mealType === mealType);
                          const MealIcon = getMealIcon(mealType);
                          
                          return (
                            <div key={mealType} className="space-y-4">
                              <h3 className="font-semibold text-gray-900 flex items-center">
                                <MealIcon className={`w-5 h-5 mr-2 ${getMealTypeColor(mealType)}`} />
                                {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                              </h3>
                              
                              {meal ? (
                                <motion.div
                                  whileHover={{ scale: 1.02 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                                    <CardContent className="p-3">
                                      {meal.imageUrl && (
                                        <img 
                                          src={meal.imageUrl} 
                                          alt={meal.name}
                                          className="w-full h-24 object-cover rounded mb-2"
                                        />
                                      )}
                                      <h4 className="font-medium text-sm mb-1">{meal.name}</h4>
                                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                        {meal.description}
                                      </p>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-primary font-medium">
                                          {meal.calories} cal
                                        </span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => updateMealMutation.mutate({ 
                                            mealId: meal.id, 
                                            completed: !meal.completed 
                                          })}
                                          disabled={updateMealMutation.isPending}
                                          className="h-6 w-6 p-0"
                                        >
                                          {meal.completed ? (
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                          ) : (
                                            <Circle className="w-4 h-4 text-gray-400 hover:text-primary" />
                                          )}
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </motion.div>
                              ) : (
                                <Card className="border border-dashed border-gray-300">
                                  <CardContent className="p-3 text-center">
                                    <div className="text-gray-400 text-sm">No meal planned</div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Tasks for the day */}
                      {dayTasks.length > 0 && (
                        <div className="p-4 bg-gray-50 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            <CalendarDays className="w-5 h-5 text-primary mr-2" />
                            {label}'s Tasks
                          </h4>
                          <div className="space-y-2">
                            {dayTasks.map((task) => (
                              <TaskCard key={task.id} task={task} variant="compact" />
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {dayIndex === 0 ? 'No meal plan for today' : 
                         dayIndex === 1 ? 'Meal plan will be available tomorrow' : 
                         'Complete previous days to unlock'}
                      </h3>
                      <p className="text-gray-600">
                        {dayIndex === 0 ? 'Generate your first meal plan to get started.' :
                         dayIndex === 1 ? 'Your meal plan will be generated based on today\'s progress.' :
                         'Complete today\'s plan to unlock Day 3.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
