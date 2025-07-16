import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Leaf, Drumstick, Coffee, Pizza, Wine, Sprout, Target, Dumbbell, Scale, Activity, Users, Bed, Zap } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface FormData {
  age: string;
  gender: string;
  height: string;
  weight: string;
  dietType: string;
  cuisinePreferences: string[];
  goal: string;
  activityLevel: string;
  allergies: string[];
  additionalInfo: string;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    dietType: '',
    cuisinePreferences: [],
    goal: '',
    activityLevel: '',
    allergies: [],
    additionalInfo: ''
  });

  const { toast } = useToast();
  const totalSteps = 4;

  const createProfileMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await apiRequest('POST', '/api/profile', {
        age: parseInt(data.age),
        gender: data.gender,
        height: parseFloat(data.height),
        weight: parseFloat(data.weight),
        dietType: data.dietType,
        cuisinePreferences: data.cuisinePreferences,
        goal: data.goal,
        activityLevel: data.activityLevel,
        allergies: data.allergies,
        additionalInfo: data.additionalInfo
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your personalized profile has been created successfully!",
      });
      // Generate initial meal plans
      generateMealPlans();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  const generateMealPlansMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest('POST', '/api/meal-plans/generate');
    },
    onSuccess: () => {
      toast({
        title: "Meal Plans Generated",
        description: "Your personalized 3-day meal plan is ready!",
      });
      onComplete();
    },
    onError: (error) => {
      console.error('Failed to generate meal plans:', error);
      // Still complete onboarding even if meal plan generation fails
      onComplete();
    }
  });

  const generateMealPlans = () => {
    generateMealPlansMutation.mutate();
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'cuisinePreferences' | 'allergies', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    createProfileMutation.mutate(formData);
  };

  const progress = (currentStep / totalSteps) * 100;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
          <span className="font-medium text-gray-600">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3 }}
      >
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about yourself</h2>
              <p className="text-gray-600">This helps us create your personalized meal plan</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData('age', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.1"
                  placeholder="Enter your height"
                  value={formData.height}
                  onChange={(e) => updateFormData('height', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Current Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={(e) => updateFormData('weight', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Food Preferences */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Food Preferences</h2>
              <p className="text-gray-600">Help us understand your dietary preferences</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Dietary Type</Label>
                <RadioGroup 
                  value={formData.dietType} 
                  onValueChange={(value) => updateFormData('dietType', value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor="vegetarian" className="cursor-pointer">
                      <RadioGroupItem value="vegetarian" id="vegetarian" className="sr-only" />
                      <Card className={`p-4 text-center transition-all ${formData.dietType === 'vegetarian' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <CardContent className="p-0">
                          <Leaf className="w-8 h-8 text-primary mx-auto mb-2" />
                          <div className="font-semibold">Vegetarian</div>
                        </CardContent>
                      </Card>
                    </Label>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Label htmlFor="non-vegetarian" className="cursor-pointer">
                      <RadioGroupItem value="non-vegetarian" id="non-vegetarian" className="sr-only" />
                      <Card className={`p-4 text-center transition-all ${formData.dietType === 'non-vegetarian' ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <CardContent className="p-0">
                          <Drumstick className="w-8 h-8 text-primary mx-auto mb-2" />
                          <div className="font-semibold">Non-Vegetarian</div>
                        </CardContent>
                      </Card>
                    </Label>
                  </motion.div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Cuisine Preferences</Label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'indian', label: 'Indian', icon: Coffee },
                    { id: 'italian', label: 'Italian', icon: Pizza },
                    { id: 'french', label: 'French', icon: Wine },
                    { id: 'south-indian', label: 'South Indian', icon: Sprout }
                  ].map((cuisine) => (
                    <motion.div 
                      key={cuisine.id}
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.98 }}
                    >
                      <Label htmlFor={cuisine.id} className="cursor-pointer">
                        <Card className={`p-4 text-center transition-all ${
                          formData.cuisinePreferences.includes(cuisine.id) 
                            ? 'border-primary bg-primary-50' 
                            : 'border-gray-200 hover:border-primary-300'
                        }`}>
                          <CardContent className="p-0">
                            <cuisine.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="font-semibold">{cuisine.label}</div>
                            <Checkbox
                              id={cuisine.id}
                              checked={formData.cuisinePreferences.includes(cuisine.id)}
                              onCheckedChange={() => toggleArrayItem('cuisinePreferences', cuisine.id)}
                              className="sr-only"
                            />
                          </CardContent>
                        </Card>
                      </Label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Goals and Activity */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Goals</h2>
              <p className="text-gray-600">What would you like to achieve?</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Primary Goal</Label>
                <RadioGroup 
                  value={formData.goal} 
                  onValueChange={(value) => updateFormData('goal', value)}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {[
                    { id: 'lose-weight', label: 'Lose Weight', icon: Scale },
                    { id: 'gain-weight', label: 'Gain Weight', icon: Dumbbell },
                    { id: 'maintain', label: 'Maintain', icon: Target }
                  ].map((goal) => (
                    <motion.div key={goal.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Label htmlFor={goal.id} className="cursor-pointer">
                        <RadioGroupItem value={goal.id} id={goal.id} className="sr-only" />
                        <Card className={`p-4 text-center transition-all ${formData.goal === goal.id ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                          <CardContent className="p-0">
                            <goal.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                            <div className="font-semibold">{goal.label}</div>
                          </CardContent>
                        </Card>
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-base font-medium mb-4 block">Activity Level</Label>
                <RadioGroup 
                  value={formData.activityLevel} 
                  onValueChange={(value) => updateFormData('activityLevel', value)}
                  className="space-y-3"
                >
                  {[
                    { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise', icon: Bed },
                    { id: 'light', label: 'Lightly Active', desc: 'Light exercise 1-3 days/week', icon: Users },
                    { id: 'moderate', label: 'Moderately Active', desc: 'Moderate exercise 3-5 days/week', icon: Activity },
                    { id: 'very', label: 'Very Active', desc: 'Hard exercise 6-7 days/week', icon: Zap }
                  ].map((activity) => (
                    <Label key={activity.id} htmlFor={activity.id} className="cursor-pointer">
                      <Card className={`p-3 transition-all ${formData.activityLevel === activity.id ? 'border-primary bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                        <CardContent className="p-0">
                          <div className="flex items-center space-x-3">
                            <RadioGroupItem value={activity.id} id={activity.id} />
                            <activity.icon className="w-5 h-5 text-primary" />
                            <div>
                              <div className="font-medium">{activity.label}</div>
                              <div className="text-sm text-gray-600">{activity.desc}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Allergies and Restrictions */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Allergies & Restrictions</h2>
              <p className="text-gray-600">Let us know about any dietary restrictions</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Food Allergies</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['nuts', 'dairy', 'gluten', 'shellfish', 'eggs', 'soy', 'fish', 'none'].map((allergy) => (
                    <Label key={allergy} htmlFor={`allergy-${allergy}`} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        id={`allergy-${allergy}`}
                        checked={formData.allergies.includes(allergy)}
                        onCheckedChange={() => toggleArrayItem('allergies', allergy)}
                      />
                      <span className="text-sm capitalize">{allergy}</span>
                    </Label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional dietary restrictions or preferences</Label>
                <Textarea
                  id="additionalInfo"
                  placeholder="Tell us about any other dietary requirements..."
                  rows={4}
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={currentStep === 1 ? 'invisible' : ''}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={nextStep} className="bg-primary hover:bg-primary-600">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleComplete} 
            disabled={createProfileMutation.isPending}
            className="bg-primary hover:bg-primary-600"
          >
            {createProfileMutation.isPending ? 'Creating Profile...' : 'Complete Setup'}
          </Button>
        )}
      </div>
    </div>
  );
}
