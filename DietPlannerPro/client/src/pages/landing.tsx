import { motion } from "framer-motion";
import { Leaf, Utensils, ChartLine, Newspaper, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import HealthNews from "@/components/health-news";
import AuthModals from "@/components/auth-modals";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'signup' | null>(null);
  const [, navigate] = useLocation();

  const features = [
    {
      icon: Utensils,
      title: "Personalized Meals",
      description: "AI-crafted meal plans based on your preferences, goals, and dietary restrictions.",
      color: "from-primary-500 to-secondary-500",
      delay: 0
    },
    {
      icon: ChartLine,
      title: "Progress Tracking",
      description: "Monitor your journey with detailed analytics and achievement milestones.",
      color: "from-secondary-500 to-indigo-500",
      delay: 0.2
    },
    {
      icon: Newspaper,
      title: "Health Insights",
      description: "Stay informed with curated health news and expert nutrition tips.",
      color: "from-amber-500 to-orange-500",
      delay: 0.4
    }
  ];

  const handleGetStarted = () => {
    setShowAuthModal('signup');
  };

  const handleSkip = () => {
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50">
      {/* Navigation */}
      <motion.nav 
        className="fixed top-0 w-full z-50 glassmorphism shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <Leaf className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">NutriFlow</span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-primary transition-colors font-medium">Home</a>
              <a href="#news" className="text-gray-700 hover:text-primary transition-colors font-medium">Health News</a>
              <a href="#features" className="text-gray-700 hover:text-primary transition-colors font-medium">Features</a>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => setShowAuthModal('login')}
                className="text-primary hover:text-primary-600 font-medium"
              >
                Login
              </Button>
              <Button 
                onClick={() => setShowAuthModal('signup')}
                className="bg-primary hover:bg-primary-600 text-white font-medium"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Your Personal <span className="text-transparent bg-clip-text gradient-bg">Nutrition Journey</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Get personalized meal plans, track your progress, and achieve your health goals with AI-powered nutrition insights.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button 
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                variant="link"
                onClick={handleSkip}
                className="text-primary hover:text-primary-600 font-semibold text-lg underline decoration-2 underline-offset-4"
              >
                Skip for now
              </Button>
            </motion.div>
          </div>

          {/* Feature highlights */}
          <div id="features" className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                whileHover={{ y: -10 }}
                className="animate-float"
                style={{ animationDelay: `${feature.delay}s` }}
              >
                <Card className="text-center p-6 glassmorphism shadow-lg hover:shadow-xl transition-all h-full">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Health News Section */}
      <section id="news" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Latest Health News</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stay updated with the latest research and trends in nutrition and wellness</p>
          </motion.div>

          <HealthNews showFilters={true} />

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              View All Articles
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Auth Modals */}
      <AuthModals 
        showModal={showAuthModal}
        onClose={() => setShowAuthModal(null)}
        onSwitch={(type) => setShowAuthModal(type)}
      />
    </div>
  );
}
