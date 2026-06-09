import { createContext, useContext, useEffect, useState } from "react";
import { login as loginApi } from "@/pages/login/api/auth";
import { getUserById } from "@/pages/my-page/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const initializeAuth = async () => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId || storedUserId === "undefined") {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await getUserById(storedUserId);
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      localStorage.removeItem("userId");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const userData = await loginApi(credentials);
      const user = userData.user;
      setUser(user);
      localStorage.setItem("userId", user.userId);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
  };

  const refreshUser = () => initializeAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 내에서만 사용 가능");
  return context;
};
