import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { X, Eye, EyeOff } from "lucide-react";
import { useLocation } from "wouter";

interface AuthModalsProps {
  showModal: 'login' | 'signup' | null;
  onClose: () => void;
  onSwitch: (type: 'login' | 'signup') => void;
}

export default function AuthModals({ showModal, onClose, onSwitch }: AuthModalsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [, navigate] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    window.location.href = '/api/login';
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
    navigate('/onboarding');
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md"
            variants={modalVariants}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Card className="bg-white rounded-2xl shadow-2xl">
              <CardContent className="p-8">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </Button>

                {/* Login Modal */}
                {showModal === 'login' && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                      <p className="text-gray-600">Sign in to continue your health journey</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="loginEmail">Email address</Label>
                        <Input
                          id="loginEmail"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="loginPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="loginPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="w-full pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" />
                          <Label htmlFor="remember" className="text-sm text-gray-600">
                            Remember me
                          </Label>
                        </div>
                        <Button variant="link" className="text-sm text-primary hover:text-primary-600">
                          Forgot password?
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        Sign In
                      </Button>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Button
                          variant="link"
                          onClick={() => onSwitch('signup')}
                          className="text-primary hover:text-primary-600 font-semibold p-0"
                        >
                          Sign up
                        </Button>
                      </p>
                    </div>
                  </div>
                )}

                {/* Signup Modal */}
                {showModal === 'signup' && (
                  <div>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                      <p className="text-gray-600">Start your personalized nutrition journey</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="signupName">Full name</Label>
                        <Input
                          id="signupName"
                          type="text"
                          placeholder="Enter your full name"
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupEmail">Email address</Label>
                        <Input
                          id="signupEmail"
                          type="email"
                          placeholder="Enter your email"
                          className="w-full"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signupPassword">Password</Label>
                        <div className="relative">
                          <Input
                            id="signupPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="w-full pr-10"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox id="terms" required />
                        <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                          I agree to the{' '}
                          <Button variant="link" className="text-primary hover:text-primary-600 p-0 h-auto text-sm">
                            Terms of Service
                          </Button>
                          {' '}and{' '}
                          <Button variant="link" className="text-primary hover:text-primary-600 p-0 h-auto text-sm">
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                      >
                        Create Account
                      </Button>
                    </form>

                    <div className="mt-8 text-center">
                      <p className="text-gray-600">
                        Already have an account?{' '}
                        <Button
                          variant="link"
                          onClick={() => onSwitch('login')}
                          className="text-primary hover:text-primary-600 font-semibold p-0"
                        >
                          Sign in
                        </Button>
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
