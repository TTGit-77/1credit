import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // For now, always return a mock user or unauthenticated
  return {
    user: { id: 'demo-user', name: 'Demo User' },
    isLoading: false,
    isAuthenticated: true,
  };
}
