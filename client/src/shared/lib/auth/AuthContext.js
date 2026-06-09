// shared/lib/auth/AuthContext.js
import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("AuthProvider 내에서만 사용 가능");
  return context;
};
