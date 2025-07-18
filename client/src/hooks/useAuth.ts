import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // For now, always return a mock user with all expected fields
  return {
    user: {
      id: 'demo-user',
      name: 'Demo User',
      firstName: 'Demo',
      lastName: 'User',
      email: 'demo@example.com',
      profileImageUrl: '',
    },
    isLoading: false,
    isAuthenticated: true,
  };
}
