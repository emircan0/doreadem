import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('adminInfo');
      return saved ? JSON.parse(saved).admin : null;
    } catch (error) {
      localStorage.removeItem('adminInfo');
      return null;
    }
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('adminInfo')));

  const login = async (credentials) => {
    if (!credentials.email || !credentials.password) {
      return false;
    }

    try {
      const { data } = await axios.post(`${config.API_BASE}/api/admin/login`, {
        username: credentials.email,
        password: credentials.password
      });

      localStorage.setItem('adminInfo', JSON.stringify(data));
      setIsAuthenticated(true);
      setUser(data.admin);
      return true;
    } catch (error) {
      localStorage.removeItem('adminInfo');
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminInfo');
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
