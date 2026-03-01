// src/context/UserContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('nepstreams_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('nepstreams_user');
      }
    }
    setIsLoaded(true);
  }, []);

  const login = (username) => {
    const userData = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      avatar: `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${username}`,
      createdAt: new Date().toISOString(),
    };
    setUser(userData);
    localStorage.setItem('nepstreams_user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nepstreams_user');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
