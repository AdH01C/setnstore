import {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";
import { useParams } from "next/navigation";

interface AppContextType {
  appID: string;
  companyName: string;
  setCompanyName: Dispatch<SetStateAction<string>>;
  companyId: string;
  setCompanyId: Dispatch<SetStateAction<string>>;
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
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();

  // Load initial values from local storage
  const [companyId, setCompanyId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("companyId") || "";
    }
    return "";
  });

  const [companyName, setCompanyName] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("companyName") || "";
    }
    return "";
  });

  // Save values to local storage whenever they change
  useEffect(() => {
    if (companyId) {
      localStorage.setItem("companyId", companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (companyName) {
      localStorage.setItem("companyName", companyName);
    }
  }, [companyName]);

  // Values provided by the context
  const value = {
    companyId,
    setCompanyId,
    companyName,
    setCompanyName,
    appID: app_id,
    rulesetID: ruleset_id,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
