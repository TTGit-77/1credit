import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, CheckSquare, Home, Newspaper, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Local type for User
interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl: string;
}

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  const { user } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'meal-plans', label: 'Meal Plans', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'news', label: 'Health News', icon: Newspaper },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="lg:w-1/4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glassmorphism shadow-lg sticky top-24">
          <CardContent className="p-6">
            {/* User Info */}
            <div className="text-center mb-6">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-lg">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600">Health Enthusiast</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === item.id
                      ? 'text-primary bg-primary-50 border border-primary-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </motion.button>
              ))}
            </nav>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
