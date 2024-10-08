import { getCookie } from "cookies-next";
import { useParams } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import userDataService from "../services/UserDataService";

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
}> = ({ children }) => {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const username = getCookie("username") as string;

  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const userResponse = await userDataService.getUserByUsername(username);

        if (userResponse && userResponse.data) {
          const userId = userResponse.data.id;
          const companyResponse = await userDataService.getCompanyByUserId(
            userId
          );
          if (companyResponse && companyResponse.data) {
            setCompanyId(companyResponse.data.id);
            setCompanyName(companyResponse.data.company_name);
          }
        }
      } catch (error) {
        console.error("Error fetching company ID:", error);
      }
    };

    if (username) {
      fetchCompanyId();
    }
  }, [username]);

  return (
    <AppContext.Provider
      value={{ appID: app_id, companyName, companyId, rulesetID: ruleset_id }}
    >
      {children}
    </AppContext.Provider>
  );
};
