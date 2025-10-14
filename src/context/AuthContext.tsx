import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'role1' | 'role2' | 'role3' | 'role4' | 'admin';

interface User {
  email: string;
  name: string;
  role: UserRole;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Dummy user data for authentication
const DUMMY_USERS: Record<string, { password: string; name: string; role: UserRole }> = {
  'role1@sakthi.com': { password: 'password1', name: 'Role 1 User', role: 'role1' },
  'role2@sakthi.com': { password: 'password2', name: 'Role 2 User', role: 'role2' },
  'role3@sakthi.com': { password: 'password3', name: 'Role 3 User', role: 'role3' },
  'role4@sakthi.com': { password: 'password4', name: 'Role 4 User', role: 'role4' },
  'admin@sakthi.com': { password: 'admin123', name: 'Admin User', role: 'admin' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const userData = DUMMY_USERS[email.toLowerCase()];
    
    if (userData && userData.password === password) {
      const newUser: User = {
        email,
        name: userData.name,
        role: userData.role,
        token: `dummy-token-${Date.now()}`,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
