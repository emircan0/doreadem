import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Dev mode: start authenticated. A real implementation would check a token/cookie.
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com', role: 'admin' });

  const login = async (credentials) => {
    // In a real app, validate credentials against the backend here.
    // For now, accept any non-empty credentials (the backend handles validation).
    if (credentials.email && credentials.password) {
      setIsAuthenticated(true);
      setUser({ name: 'Admin', email: credentials.email, role: 'admin' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);