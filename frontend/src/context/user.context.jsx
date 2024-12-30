import React, { createContext, useState, useContext } from 'react';

// Create the UserContext
const UserContext = createContext();

// UserProvider to wrap the app and provide user state
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Initial user state

    const login = (userData) => {
        setUser(userData); // Set user data when logged in
    };

    const logout = () => {
        setUser(null); // Clear user data on logout
    };

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
