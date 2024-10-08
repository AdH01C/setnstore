"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/ApplicationDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { useAppContext } from "../components/AppContext";

interface Application {
  app_name: string;
  company_name: string;
  id: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const { companyName, companyId } = useAppContext();

  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      try {
        const response =
          await ApplicationDataService.getAllApplicationsByCompanyId(companyId);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [companyId]);

  // Function to remove a deleted application from the list
  const handleDelete = (appId: string) => {
    setApplications(applications.filter((app) => app.id !== appId));
  };

  // Function to add a new application to the list
  const handleCreate = (newApp: Application) => {
    setApplications((prevApps) => [...prevApps, newApp]); // Append the new application
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold pt-8">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3/4">
          {applications.map((application) => (
            <ProjectCard
              key={application.id} // Ensure each card has a unique key
              appId={application.id}
              appName={application.app_name}
              companyName={companyName}
              companyId={companyId}
              onDelete={handleDelete}
            />
          ))}

          <CreateProjectCard onCreate={handleCreate} />
        </div>
      )}
    </div>
  );
}
