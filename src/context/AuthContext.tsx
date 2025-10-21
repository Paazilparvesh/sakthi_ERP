import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole, AuthContextType } from "../types/user.type.ts";


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // ✅ Restore user on app load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.username && parsedUser?.role_type) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Error restoring user from localStorage:", error);
      localStorage.removeItem("user");
    } finally {
      // ✅ Important: end loading
      setIsLoading(false);
    }
  }, []);

  const login = async (
    username: string,
    password: string,
    role_type: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/single_login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role_type }),
      });

      if (!response.ok) {
        console.error("Login failed:", response.statusText);
        return false;
      }

      const data = await response.json();

      if (data.msg === "Login successful") {
        const loggedUser: User = {
          username: data.username,
          role_type: data.role_type,
        };
        setUser(loggedUser);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
