import React, { createContext, useState, ReactNode, useContext } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const handleSetIsLoggedIn = (status: boolean) => {
    setIsLoggedIn(status);
    localStorage.setItem('isLoggedIn', status.toString());
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn: handleSetIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};