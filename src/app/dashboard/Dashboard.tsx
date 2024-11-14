"use client"

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/NewAppDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { useAppContext } from "../components/AppContext";
import { Input, Modal } from "antd";
import newUserDataService from "../services/NewUserDataService";
import companyDataService from "../services/NewCompanyDataService";
import { AppDetailsWithID, Identity } from "@inquisico/ruleset-editor-api";


export default function Dashboard(
  { id }: { id: string },
) {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<AppDetailsWithID[]>([]);
  const { companyName, setCompanyName, companyId, setCompanyId } =
    useAppContext();
  const [formCompanyName, setFormCompanyName] = useState("");

  useEffect(() => {
    console.log(id);
    const fetchUserAndCompanyData = () => {
      newUserDataService
        .getUserById(id)
        .then((user) => {
          if (!user?.id) {
            console.error("User not found or error fetching user data");
            setIsLoading(false);
            return;
          }

          console.log("User exists:", user.firstName, user.lastName);

          // Fetch company data using user ID
          return companyDataService.getCompanyByUserId(user.id);
        })
        .then((companyResponse) => {
          if (companyResponse && companyResponse.id && companyResponse.companyName) {
            setCompanyId(companyResponse.id);
            setCompanyName(companyResponse.companyName);
          } else {
            console.error("No company found for user.");
            // Modal to register a company if none exists
            Modal.confirm({
              title: "Register Company",
              content: (
                <div className="flex flex-col gap-4">
                  <Input placeholder="Company Name" />
                  <Input
                    placeholder="Company Name"
                    onChange={(e) => setFormCompanyName(e.target.value)}
                  />
                </div>
              ),
              onOk: () => {
                companyDataService
                  .createCompany(id, { companyName: formCompanyName })
                  .then((newCompany) => {
                    setCompanyId(newCompany.id);
                    setCompanyName(formCompanyName);
                  })
                  .catch((createCompanyError) => {
                    console.error("Error creating company:", createCompanyError);
                  });
              },
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching user or company data:", error);
        });
    };

    const fetchApplications = () => {
      if (!companyId) {
        console.warn("Company ID is not set. Skipping application fetch.");
        setIsLoading(false);
        return;
      }

      ApplicationDataService.getApplications(companyId)
        .then((response) => {
          setApplications(response);
        })
        .catch((error) => {
          console.error("Error fetching applications:", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchUserAndCompanyData();
    fetchApplications();
  }, [id, companyId, setCompanyId, setCompanyName]);


  // Function to remove a deleted application from the list
  const handleDelete = (appId: string) => {
    setApplications(applications.filter((app) => app.id !== appId));
  };

  // Function to add a new application to the list
  const handleCreate = (newApp: AppDetailsWithID) => {
    setApplications((prevApps = []) => [...prevApps, newApp]); // Append the new application
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold pt-8">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3/4">
          {applications &&
            applications.map((application) => (
              <ProjectCard
                key={application.id} // Ensure each card has a unique key
                appId={application.id}
                appName={application.appName}
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
