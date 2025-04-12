import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/status", { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const loginResponse = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true }
      );
      const statusResponse = await axios.get("/api/status", { withCredentials: true });
      setUser(statusResponse.data.user);

    } catch (err) {
      setIsLoading(false);
      setError(err.response.data.detail);
      throw new Error(err.response.data.detail);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    const role = "admin";
    try {
      const response = await axios.post(
        "/api/register",
        { name, email, password, role},
      );
      setUser(response.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
      setError(null);
      setUser(null);
    } catch (err) {
      throw new Error("Logout failed:");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
)};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
