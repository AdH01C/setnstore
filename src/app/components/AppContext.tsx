import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "../hooks/useAuth";
import CreateCompanyModal from "../dashboard/CreateCompanyModal";
import Loading from "./Loading";
import { Layout } from "antd";

interface AppContextType {
  companyID?: string;
  appID: string;
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
  forceSignin: boolean;
  children: React.ReactNode;
}> = ({ forceSignin, children }) => {
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();

  const { isFetching, dataFetched, identity, refetch } = useAuth({
    forceSignin,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (
    !isFetching &&
    dataFetched &&
    identity &&
    !identity.company &&
    !isModalOpen
  ) {
    setIsModalOpen(true);
  }

  // Values provided by the context
  const value = {
    // identity: identity,
    companyID: identity?.company?.id,
    appID: app_id,
    rulesetID: ruleset_id,
  };

  if (isFetching || !dataFetched)
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-y-5">
          <Loading />
          <h1>Loading</h1>
        </div>
      </div>
    );

  if (!isFetching && dataFetched && !identity && forceSignin) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-y-5">
          <Loading />
          <h1>Redirecting to signin</h1>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {identity?.id && value.companyID ? (
        children
      ) : (
        <Layout style={{ minHeight: "100vh" }}>
          <CreateCompanyModal
            userID={identity?.id}
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => {
              setIsModalOpen(false);
              refetch();
            }}
          />
        </Layout>
      )}
    </AppContext.Provider>
  );
};
