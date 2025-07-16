import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, X } from "lucide-react";
import OnboardingFlow from "@/components/onboarding-flow";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, navigate] = useLocation();

  const handleClose = () => {
    navigate('/');
  };

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl glassmorphism">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome to NutriFlow</h1>
                  <p className="text-gray-600">Let's create your personalized nutrition plan</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Onboarding Flow */}
            <OnboardingFlow onComplete={handleComplete} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
