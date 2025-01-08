import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

// UserProvider to wrap the app and provide user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Retrieve the user data from localStorage when the app initializes
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => { 
        setUser(userData.user); // Set user data when logged in
        localStorage.setItem('user', JSON.stringify(userData)); // Save user data to localStorage
    };

    const logout = () => {
        setUser(null); // Clear user data on logout
        localStorage.removeItem('user'); // Remove user data from localStorage
    };

    // Optional: Synchronize state and localStorage if needed
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook for easier use of the context
export const useUser = () => {
    return useContext(UserContext);
};
