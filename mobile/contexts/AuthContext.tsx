import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users storage key
const USERS_STORAGE_KEY = "workout_app_users";
const CURRENT_USER_KEY = "workout_app_current_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUsers = async (): Promise<User[]> => {
    try {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersData) {
        return JSON.parse(usersData);
      }

      // Create demo users if none exist
      const demoUsers: User[] = [
        {
          id: "demo-1",
          name: "Uriel Szwarcberg",
          email: "uriel@workout.com",
          createdAt: new Date().toISOString(),
        },
        {
          id: "demo-2",
          name: "Demo User",
          email: "demo@workout.com",
          createdAt: new Date().toISOString(),
        },
      ];

      await saveUsers(demoUsers);
      return demoUsers;
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  };

  const saveUsers = async (users: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Error saving users:", error);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = await getUsers();
      console.log("Users loaded for login:", users);

      // Check password first (demo password)
      if (password !== "password123") {
        return { success: false, error: "Contraseña incorrecta" };
      }

      // Look for existing user
      let foundUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      // If user doesn't exist, create a new one (demo behavior)
      if (!foundUser) {
        foundUser = {
          id: Date.now().toString(),
          name: email.split("@")[0], // Use email prefix as name
          email: email.toLowerCase().trim(),
          createdAt: new Date().toISOString(),
        };

        users.push(foundUser);
        await saveUsers(users);
      }

      setUser(foundUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error interno del servidor" };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const users = await getUsers();

      // Check if user already exists
      const existingUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (existingUser) {
        return { success: false, error: "Este email ya está registrado" };
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await saveUsers(users);

      setUser(newUser);
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: "Error interno del servidor" };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
