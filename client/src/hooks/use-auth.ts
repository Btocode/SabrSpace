import { useState } from "react";

// Mock user for development without authentication
const mockUser = {
  id: "demo-user-id",
  email: "demo@sabrspace.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: null,
};

export function useAuth() {
  const [user] = useState(mockUser);

  return {
    user,
    isLoading: false,
    isAuthenticated: true,
    logout: () => {
      // Mock logout - do nothing
      console.log("Mock logout called");
    },
    isLoggingOut: false,
  };
}
