import React, { createContext, useContext } from 'react';

// Define types for the context
interface AppContextType {
  appID: string;
  companyName: string;
  rulesetID?: string; // Optional
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Hook to use the context in child components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

// Context provider component
export const AppProvider: React.FC<{ appID: string; companyName: string; rulesetID?: string; children: React.ReactNode }> = ({ appID, companyName, rulesetID, children }) => {
  return (
    <AppContext.Provider value={{ appID, companyName, rulesetID }}>
      {children}
    </AppContext.Provider>
  );
};
