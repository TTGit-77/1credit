import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Target, 
  Trophy, 
  Star, 
  Lock, 
  Flame,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TaskCard from "./task-card";

// Local type for Task
interface Task {
  id: string;
  dueDate: string;
  completed?: boolean;
  type?: string;
  [key: string]: any;
}

export default function DashboardTasks() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    type: '',
    dueDate: '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const today = new Date().toISOString().split('T')[0];

  const { data: todayTasks = [], isLoading: todayLoading } = useQuery<Task[]>({
    queryKey: ['/api/tasks', { date: today }],
    retry: false,
  });

  const { data: allTasks = [] } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
    retry: false,
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      return await apiRequest('POST', '/api/tasks', taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      setShowCreateTask(false);
      setNewTask({
        title: '',
        description: '',
        type: 'custom',
        dueDate: today
      });
      toast({
        title: "Task Created",
        description: "Your new task has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateTask = () => {
    if (!newTask.title?.trim()) {
      toast({
        title: "Error", 
        description: "Task title is required.",
        variant: "destructive",
      });
      return;
    }

    createTaskMutation.mutate({
      title: newTask.title,
      description: newTask.description || '',
      type: newTask.type || 'custom',
      dueDate: newTask.dueDate || today
    });
  };

  // Calculate weekly progress
  const getWeeklyProgress = () => {
    if (!allTasks) return [];

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const weeklyTasks = allTasks.filter((task: Task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate >= weekAgo && taskDate <= now;
    });

    const goals = [
      {
        title: "Drink 8 glasses water daily",
        type: "water",
        target: 7,
        completed: weeklyTasks.filter((t: Task) => t.type === 'water' && t.completed).length,
        color: "bg-cyan-500"
      },
      {
        title: "Exercise 4 times per week", 
        type: "exercise",
        target: 4,
        completed: weeklyTasks.filter((t: Task) => t.type === 'exercise' && t.completed).length,
        color: "bg-blue-500"
      },
      {
        title: "Follow meal plan",
        type: "meal", 
        target: 7,
        completed: weeklyTasks.filter((t: Task) => t.type === 'meal' && t.completed).length,
        color: "bg-green-500"
      },
      {
        title: "Take daily supplements",
        type: "supplement",
        target: 7, 
        completed: weeklyTasks.filter((t: Task) => t.type === 'supplement' && t.completed).length,
        color: "bg-purple-500"
      }
    ];

    return goals;
  };

  // Sample achievements
  const achievements = [
    {
      id: 1,
      title: "12-Day Streak!",
      description: "Followed meal plan consistently",
      icon: Flame,
      color: "from-amber-50 to-amber-100 border-amber-200",
      iconBg: "bg-amber-500",
      earned: true,
      earnedDate: "today"
    },
    {
      id: 2,
      title: "Hydration Hero", 
      description: "Reached daily water goal 20 times",
      icon: Trophy,
      color: "from-green-50 to-green-100 border-green-200",
      iconBg: "bg-green-500",
      earned: true,
      earnedDate: "3 days ago"
    },
    {
      id: 3,
      title: "First Week Complete",
      description: "Completed your first week!",
      icon: Star,
      color: "from-blue-50 to-blue-100 border-blue-200", 
      iconBg: "bg-blue-500",
      earned: true,
      earnedDate: "1 week ago"
    },
    {
      id: 4,
      title: "30-Day Champion",
      description: "Complete 30 days to unlock",
      icon: Award,
      color: "border-dashed border-gray-300",
      iconBg: "bg-gray-100",
      earned: false,
      progress: { current: 12, total: 30 }
    }
  ];

  const todayCompleted = todayTasks.filter((task: Task) => task.completed).length;
  const todayTotal = todayTasks.length;
  const weeklyGoals = getWeeklyProgress();

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Health Tasks</h1>
          <p className="text-gray-600">Track your daily health and nutrition goals</p>
        </div>

        <Dialog open={showCreateTask} onOpenChange={setShowCreateTask}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  placeholder="Enter task title"
                  value={newTask.title || ''}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter task description"
                  value={newTask.description || ''}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Task Type</Label>
                  <Select 
                    value={newTask.type || 'custom'} 
                    onValueChange={(value) => setNewTask({ ...newTask, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="meal">Meal</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate || today}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateTask(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTask}
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Main Content */}
      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today's Tasks</TabsTrigger>
          <TabsTrigger value="weekly">Weekly Goals</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        {/* Today's Tasks */}
        <TabsContent value="today">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
                  <Badge variant="secondary" className="px-3 py-1">
                    {todayCompleted}/{todayTotal} Complete
                  </Badge>
                </div>

                {todayLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : todayTasks && todayTasks.length > 0 ? (
                  <div className="space-y-4">
                    {todayTasks.map((task: Task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TaskCard task={task} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks for today</h3>
                    <p className="text-gray-600 mb-4">Create your first task to get started with tracking your health goals.</p>
                    <Button onClick={() => setShowCreateTask(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Task
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Weekly Goals */}
        <TabsContent value="weekly">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Weekly Goals</h2>
                  <Badge variant="outline" className="px-3 py-1">
                    This Week
                  </Badge>
                </div>

                <div className="space-y-6">
                  {weeklyGoals.map((goal, index) => {
                    const progress = Math.round((goal.completed / goal.target) * 100);
                    const isComplete = goal.completed >= goal.target;
                    
                    return (
                      <motion.div
                        key={goal.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{goal.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className={`text-sm font-medium ${
                              isComplete ? 'text-green-600' : 
                              progress >= 75 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                              {goal.completed}/{goal.target} {goal.type === 'exercise' ? 'sessions' : 'days'}
                            </span>
                            {isComplete && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{progress}% complete</span>
                            <span>{Math.max(0, goal.target - goal.completed)} remaining</span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Detailed Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>

                <div className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${
                        achievement.earned 
                          ? `bg-gradient-to-r ${achievement.color}` 
                          : 'border-dashed border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-12 h-12 ${achievement.iconBg} rounded-full flex items-center justify-center mr-4 ${!achievement.earned && 'opacity-50'}`}>
                          <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                              {achievement.title}
                            </h3>
                            {!achievement.earned && <Lock className="w-4 h-4 text-gray-400" />}
                          </div>
                          
                          <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                            {achievement.description}
                          </p>
                          
                          {achievement.earned ? (
                            <p className={`text-xs mt-1 ${
                              achievement.earnedDate === 'today' ? 'text-green-600 font-medium' : 
                              'text-gray-500'
                            }`}>
                              {achievement.earnedDate === 'today' ? '🎉 Earned today' : `Earned ${achievement.earnedDate}`}
                            </p>
                          ) : achievement.progress ? (
                            <div className="mt-2">
                              <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Progress: {achievement.progress.current}/{achievement.progress.total} days</span>
                                <span>{Math.round((achievement.progress.current / achievement.progress.total) * 100)}%</span>
                              </div>
                              <Progress 
                                value={(achievement.progress.current / achievement.progress.total) * 100} 
                                className="h-1"
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
