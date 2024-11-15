import React, { createContext, useState, useContext } from 'react';

// Create a context for message handling
const MessageContext = createContext();

// Custom hook to use the Message context
export const useMessage = () => {
    return useContext(MessageContext);
};

// Message provider component
export const MessageProvider = ({ children }) => {
    const [message, setMessage] = useState('');

    return (
        <MessageContext.Provider value={{ message, setMessage }}>
            {children}
        </MessageContext.Provider>
    );
};
