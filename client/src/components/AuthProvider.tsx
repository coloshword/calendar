import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (value: boolean) => void; 
    isGuest: boolean;
    setIsGuest: (value: boolean) => void;
    userEmail: string;
    setUserEmail: (value: string) => void; 
    logout: () => void,
}

const AuthContext = createContext<AuthContextType>({
    isLoggedIn: false,
    setIsLoggedIn: () => {},
    isGuest: false,
    setIsGuest: () => {},
    userEmail: 'Guest', // default value for auth provide if not logged in 
    setUserEmail: () => {},
    logout: () => {}, 
});

/** AuthProvider: context provider */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("Guest"); 
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const guest = localStorage.getItem('isGuest') === 'true'; 
    const email = localStorage.getItem('email');
    setIsLoggedIn(!!token);
    setIsGuest(guest); 
    setUserEmail(email || 'Guest');
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.setItem('isGuest', 'false'); 
    setIsLoggedIn(false);
    setIsGuest(false);
    setUserEmail('Guest');
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, isGuest, setIsGuest, userEmail, setUserEmail, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
