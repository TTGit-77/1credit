import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, Circle } from "lucide-react";

interface MealPlanCardProps {
  mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  description: string;
  time: string;
  calories: number;
  imageUrl: string;
  completed: boolean;
  onToggleComplete?: () => void;
}

export default function MealPlanCard({
  mealType,
  name,
  description,
  time,
  calories,
  imageUrl,
  completed,
  onToggleComplete
}: MealPlanCardProps) {
  const getMealTypeColor = (type: string) => {
    const colors = {
      breakfast: 'bg-amber-100 text-amber-700',
      lunch: 'bg-orange-100 text-orange-700',
      snack: 'bg-purple-100 text-purple-700',
      dinner: 'bg-indigo-100 text-indigo-700'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`border border-gray-200 hover:shadow-lg transition-all ${completed ? 'opacity-75' : ''}`}>
        <CardContent className="p-4">
          <div className="relative mb-3">
            <img 
              src={imageUrl} 
              alt={name}
              className="w-full h-32 object-cover rounded-lg"
            />
            <Badge className={`absolute top-2 left-2 ${getMealTypeColor(mealType)}`}>
              {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex justify-between items-center text-sm mb-3">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              {time}
            </div>
            <span className="text-primary font-medium">{calories} cal</span>
          </div>
          
          <Button
            variant={completed ? "secondary" : "outline"}
            size="sm"
            className="w-full"
            onClick={onToggleComplete}
          >
            {completed ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                Mark Complete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
