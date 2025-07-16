import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, CheckCircle, AlertCircle, Target, Droplets, Utensils, Pill, Activity } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
  variant?: 'default' | 'compact';
}

export default function TaskCard({ task, variant = 'default' }: TaskCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      return await apiRequest('PATCH', `/api/tasks/${task.id}/complete`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: task.completed ? "Task Incomplete" : "Task Completed",
        description: task.completed ? "Task marked as incomplete" : "Great job! Task completed successfully.",
        variant: task.completed ? "default" : "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleToggleComplete = () => {
    updateTaskMutation.mutate(!task.completed);
  };

  const getTaskIcon = (type: string) => {
    const icons = {
      meal: Utensils,
      exercise: Activity,
      water: Droplets,
      supplement: Pill,
      custom: Target
    };
    return icons[type as keyof typeof icons] || Target;
  };

  const getTaskTypeColor = (type: string) => {
    const colors = {
      meal: 'bg-orange-100 text-orange-700',
      exercise: 'bg-blue-100 text-blue-700',
      water: 'bg-cyan-100 text-cyan-700',
      supplement: 'bg-purple-100 text-purple-700',
      custom: 'bg-gray-100 text-gray-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTimeStatus = () => {
    if (!task.dueDate) return null;
    
    const now = new Date();
    const dueDate = new Date(task.dueDate);
    const diffInHours = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (task.completed) {
      return {
        text: `✓ Completed at ${task.completedAt ? new Date(task.completedAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : 'N/A'}`,
        color: 'text-green-600',
        icon: CheckCircle
      };
    }
    
    if (diffInHours < 0) {
      return {
        text: `⚠ Overdue by ${Math.abs(diffInHours)} hours`,
        color: 'text-red-600',
        icon: AlertCircle
      };
    }
    
    if (diffInHours < 2) {
      return {
        text: `⏰ Due in ${diffInHours} hour${diffInHours !== 1 ? 's' : ''}`,
        color: 'text-primary-600',
        icon: Clock
      };
    }
    
    return {
      text: `📍 Scheduled for ${dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`,
      color: 'text-gray-500',
      icon: Clock
    };
  };

  const timeStatus = getTimeStatus();
  const TaskIcon = getTaskIcon(task.type);
  const isHighPriority = timeStatus?.color === 'text-red-600' || timeStatus?.color === 'text-primary-600';

  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            disabled={updateTaskMutation.isPending}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <TaskIcon className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </p>
            {task.description && (
              <p className="text-sm text-gray-600 truncate">{task.description}</p>
            )}
          </div>
          {timeStatus && (
            <div className={`text-xs ${timeStatus.color} flex items-center flex-shrink-0`}>
              <timeStatus.icon className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{timeStatus.text}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`transition-all duration-200 ${
        isHighPriority 
          ? 'border-2 border-primary-200 bg-primary-50 shadow-lg' 
          : task.completed 
            ? 'opacity-75 border-gray-200' 
            : 'border-gray-200 hover:shadow-lg'
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              disabled={updateTaskMutation.isPending}
              className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <TaskIcon className="w-4 h-4 text-primary" />
                    <Badge variant="secondary" className={getTaskTypeColor(task.type)}>
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Badge>
                  </div>
                  
                  <h3 className={`font-medium mb-1 ${
                    task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  
                  {timeStatus && (
                    <div className={`text-xs ${timeStatus.color} flex items-center`}>
                      <timeStatus.icon className="w-3 h-3 mr-1" />
                      {timeStatus.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
