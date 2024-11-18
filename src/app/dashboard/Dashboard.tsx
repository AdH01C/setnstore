"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/NewAppDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { Input, Modal } from "antd";
import newUserDataService from "../services/NewUserDataService";
import companyDataService from "../services/NewCompanyDataService";
import { AppDetailsWithID, Identity, UserApi } from "@inquisico/ruleset-editor-api";
import configuration from "../services/apiConfig";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";

interface DashboardProps {
  apps: AppDetailsWithID[];
}

export default function Dashboard({ apps }: DashboardProps) {
  console.warn("Dashboard props:", apps);
  // Use the provided data directly
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);


  }, []);

  // Function to remove a deleted application from the list
  const handleDelete = (appId: string) => {
    // setApplications(applications.filter((app) => app.id !== appId));
  };

  // Function to add a new application to the list
  const handleCreate = (newApp: AppDetailsWithID) => {
    // setApplications((prevApps = []) => [...prevApps, newApp]); // Append the new application
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold pt-8">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3/4">
          {apps &&
            apps.map((app) => (
              <ProjectCard
                key={app.id} // Ensure each card has a unique key
                appId={app.id}
                appName={app.appName}
                companyId={app.companyId}
                onDelete={handleDelete}
              />
            ))}

          <CreateProjectCard onCreate={handleCreate} />
        </div>
      )}
    </div>
  );
}
