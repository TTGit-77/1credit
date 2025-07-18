import { motion } from "framer-motion";
import { Leaf, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardSidebar from "@/components/dashboard-sidebar";
import DashboardOverview from "@/components/dashboard-overview";
import DashboardMealPlans from "@/components/dashboard-meal-plans";
import DashboardTasks from "@/components/dashboard-tasks";
import HealthNews from "@/components/health-news";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if user has completed profile setup
  const { data: profile } = useQuery({
    queryKey: ['/api/profile'],
    retry: false,
  });

  // Remove handleLogout and /api/logout

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'meal-plans':
        return <DashboardMealPlans />;
      case 'tasks':
        return <DashboardTasks />;
      case 'news':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Health News & Insights</h1>
              <p className="text-gray-600">Stay updated with the latest in health and nutrition</p>
            </div>
            <HealthNews showFilters={true} />
          </div>
        );
      default:
        return null;
    }
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
              <button 
                onClick={() => setActiveTab('overview')}
                className={`font-medium transition-colors ${activeTab === 'overview' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('meal-plans')}
                className={`font-medium transition-colors ${activeTab === 'meal-plans' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Meal Plans
              </button>
              <button 
                onClick={() => setActiveTab('tasks')}
                className={`font-medium transition-colors ${activeTab === 'tasks' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Tasks
              </button>
              <button 
                onClick={() => setActiveTab('news')}
                className={`font-medium transition-colors ${activeTab === 'news' ? 'text-primary' : 'text-gray-700 hover:text-primary'}`}
              >
                Health News
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-primary-100 text-primary-700">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.location.href = '/api/logout'}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Main Content Area */}
            <div className="lg:w-3/4">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
