import React, { createContext, useState, useContext } from 'react';

// Create the Auth context
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth provider component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token'); // Clear token on logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
