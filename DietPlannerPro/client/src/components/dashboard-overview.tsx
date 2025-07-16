import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Scale, 
  Flame, 
  Droplets, 
  Zap, 
  Plus, 
  ShoppingCart, 
  Calendar, 
  Heart,
  TrendingDown,
  Target,
  CheckCircle
} from "lucide-react";
import MealPlanCard from "./meal-plan-card";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardOverview() {
  const { user } = useAuth();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/profile'],
    retry: false,
  });

  const { data: mealPlans, isLoading: mealPlansLoading } = useQuery({
    queryKey: ['/api/meal-plans'],
    retry: false,
  });

  const { data: todayTasks } = useQuery({
    queryKey: ['/api/tasks', { date: new Date().toISOString().split('T')[0] }],
    retry: false,
  });

  const statsCards = [
    {
      title: "Current Weight",
      value: profile ? `${profile.weight} kg` : "-- kg",
      change: "-0.5 kg this week",
      changeType: "positive" as const,
      icon: Scale,
      color: "border-primary-500",
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600"
    },
    {
      title: "Calories Today",
      value: "1,847",
      change: "Goal: 2,000 cal",
      changeType: "neutral" as const,
      icon: Flame,
      color: "border-secondary-500",
      bgColor: "bg-secondary-100",
      iconColor: "text-secondary-600"
    },
    {
      title: "Water Intake",
      value: "6/8",
      change: "2 glasses remaining",
      changeType: "warning" as const,
      icon: Droplets,
      color: "border-amber-500",
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    {
      title: "Streak",
      value: "12 days",
      change: "Keep it up!",
      changeType: "positive" as const,
      icon: Zap,
      color: "border-indigo-500",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

  const quickActions = [
    { label: "Log Meal", icon: Plus },
    { label: "Shopping List", icon: ShoppingCart },
    { label: "Meal Calendar", icon: Calendar },
    { label: "Health Check", icon: Heart }
  ];

  const completedTasks = todayTasks?.filter(task => task.completed).length || 0;
  const totalTasks = todayTasks?.length || 0;

  if (profileLoading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'there'}!
        </h1>
        <p className="text-gray-600">Here's your health journey overview for today</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className={`shadow-lg border-l-4 ${stat.color} hover:shadow-xl transition-shadow`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium flex items-center ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'warning' ? 'text-amber-600' : 'text-gray-500'
                  }`}>
                    {stat.changeType === 'positive' && <TrendingDown className="w-4 h-4 mr-1" />}
                    {stat.changeType === 'warning' && <Target className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Today's Meal Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Meal Plan</h2>
              <Button variant="outline" size="sm">
                View Full Plan
              </Button>
            </div>

            {mealPlansLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <Skeleton className="h-32 w-full mb-3" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {/* Sample meals - in a real app, this would come from mealPlans */}
                <MealPlanCard
                  mealType="breakfast"
                  name="Oatmeal Bowl"
                  description="Steel-cut oats with berries and nuts"
                  time="8:00 AM"
                  calories={320}
                  imageUrl="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400"
                  completed={true}
                />
                <MealPlanCard
                  mealType="lunch"
                  name="Quinoa Power Bowl"
                  description="Protein-rich quinoa with vegetables"
                  time="1:00 PM"
                  calories={450}
                  imageUrl="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400"
                  completed={false}
                />
                <MealPlanCard
                  mealType="dinner"
                  name="Grilled Salmon"
                  description="Omega-3 rich salmon with vegetables"
                  time="7:00 PM"
                  calories={520}
                  imageUrl="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400"
                  completed={false}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Tasks Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Today's Progress</h2>
              <Badge variant="secondary">
                {completedTasks}/{totalTasks} Complete
              </Badge>
            </div>
            
            <div className="space-y-3">
              {todayTasks?.slice(0, 3).map((task, index) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <CheckCircle className={`w-5 h-5 ${task.completed ? 'text-green-500' : 'text-gray-300'}`} />
                  <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {task.title}
                  </span>
                </div>
              ))}
              {totalTasks > 3 && (
                <p className="text-sm text-gray-500">+{totalTasks - 3} more tasks</p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2 w-full hover:bg-primary-50 hover:border-primary-300"
                  >
                    <action.icon className="w-6 h-6 text-primary" />
                    <span className="font-medium text-gray-900">{action.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
