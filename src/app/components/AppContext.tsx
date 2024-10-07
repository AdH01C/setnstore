import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import React, { createContext, useContext } from "react";

interface AppContextType {
  appID: string;
  companyName: string;
  rulesetID?: string;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const companyName = getCookie("username") as string;

  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();

  return (
    <AppContext.Provider
      value={{ appID: app_id, companyName, rulesetID: ruleset_id }}
    >
      {children}
    </AppContext.Provider>
  );
};
