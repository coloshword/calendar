import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void; 
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
    userEmail: string | null;
    setUserEmail: (value: string | null) => void; // Adjusted for nullability
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    isGuest: false,
    setIsGuest: () => {},
    userEmail: null,
    setUserEmail: () => {}
});

/** AuthProvider: context provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); 
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    const guest = localStorage.getItem('isGuest') === 'true'; 
    setIsLoggedIn(!!token);
    setIsGuest(guest); 
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.setItem('isGuest', 'false'); 
    setIsLoggedIn(false);
    setIsGuest(false);
    setUserEmail(null);
    navigate('/');
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isGuest, setIsGuest, userEmail, setUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
