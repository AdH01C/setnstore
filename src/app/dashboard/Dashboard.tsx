"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/NewAppDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { useAppContext } from "../components/AppContext";
import { getSession } from "next-auth/react";
import oldUserDataService from "../services/OldUserDataService";
import oldCompanyDataService from "../services/OldCompanyDataService";
import companyDataService from "../services/NewCompanyDataService";
import { redirect } from "next/navigation";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import IdentityDataService from "../services/IdentityDataService";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<AppDetailsWithID[]>([]);
  const { companyName, setCompanyName, companyId, setCompanyId } = useAppContext();

  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const obtainUser = (): Promise<any> => {
        const identityDataService = new IdentityDataService();
        return identityDataService.getIdentity();
      };

      setUser(await obtainUser());
    };

    try {
      fetchUser();
    } catch (error) {
      setError(String(error));
    }
    
  }, []);

  useEffect(() => {
    const checkAndSetUser = async () => {
      const session = await getSession();
      try {
        if (session?.user?.email) {
          const email = session.user.email;

          // Try fetching the existing user
          let existingUser;
          try {
            existingUser = await oldUserDataService.getUserByUsername(email);
          } catch (error: any) {
            // Check if the error is a 404 (user not found)
            if (error.response && error.response.status === 404) {
              // No existing user, proceed to create one
              const newUser = {
                username: email,
                email: email,
                full_name: session.user.name,
                password: "password", // Placeholder password
              };
              const userResponse = await oldUserDataService.createUser(newUser);
              // Create a company for the new user
              const companyData = {
                company_name: session.user.name + "'s company",
              };
              const companyResponse = await oldCompanyDataService.createCompany(
                userResponse.data.id,
                companyData
              );
              // Store company details in state
              setCompanyId(companyResponse.data.id);
              setCompanyName(companyResponse.data.company_name);
            } else if (error.response && error.response.status === 500) {
              console.error("Prevent User Creation 500 Error");
            } else {
              throw error;
            }
          }

          // If user exists, get company information
          if (existingUser?.data) {
            const companyResponse = await companyDataService.getCompanyByUserId(
              existingUser.data.id
            );
            setCompanyId(companyResponse.id);
            setCompanyName(companyResponse.companyName);
          }
        } else {
          console.error("No session or email found. Redirect to login.");
          redirect("/");
        }
      } catch (error) {
        console.error("Error during user check/creation:", error);
      }
    };

    checkAndSetUser();
  }, [companyId, companyName, setCompanyId, setCompanyName]);

  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      try {
        const response = await ApplicationDataService.getApplications(
          companyId
        );
        setApplications(response);
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
  const handleCreate = (newApp: AppDetailsWithID) => {
    setApplications((prevApps = []) => [...prevApps, newApp]); // Append the new application
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-full text-4xl gap-8 font-bold pt-8">
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-3/4">
          <>
            {user ? (
              <div className="flex flex-col gap-2 text-black">
                <h1>Welcome, {user}</h1>
                <h2>Company: {companyName}</h2>
              </div>
            ): (
              <div className="flex flex-col gap-2 text-black">
                <h1> {error} </h1>
              </div>
              )}
          </>
          {applications &&
            applications.map((application) => (
              <ProjectCard
                key={application.id}
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
