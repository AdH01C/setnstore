import { createContext, useContext } from "react";
import { useParams } from "next/navigation";

interface AppContextType {
  appID: string;
  companyName: string;
  companyId: string;
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
  companyId: string;
  companyName: string;
}> = ({ children, companyId, companyName }) => {
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();

  return (
    <AppContext.Provider
      value={{ appID: app_id, companyName, companyId, rulesetID: ruleset_id }}
    >
      {children}
    </AppContext.Provider>
  );
};
