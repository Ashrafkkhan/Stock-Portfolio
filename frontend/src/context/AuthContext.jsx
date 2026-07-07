import { createContext, useState, useEffect, useContext } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const profileData = await authService.getProfile();
          setUser(profileData);
        } catch (error) {
          console.error("Failed to load user profile:", error);
          authService.logout();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginUser = async (formData) => {
    setLoading(true);
    try {
      const data = await authService.login(formData);
      localStorage.setItem("token", data.token);
      const profileData = await authService.getProfile();
      setUser(profileData);
      return profileData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
