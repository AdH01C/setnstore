"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/ApplicationDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { useAppContext } from "../components/AppContext";
import { getSession } from "next-auth/react";
import userDataService from "../services/UserDataService";
import companyDataService from "../services/CompanyDataService";
import { redirect } from "next/navigation";

interface Application {
  app_name: string;
  company_name: string;
  id: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      sub?: string;
    };
  }
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const { companyName, setCompanyName, companyId, setCompanyId } =
    useAppContext();

  useEffect(() => {
    const checkAndSetUser = async () => {
      const session = await getSession();
      try {
        if (session?.user?.email) {
          const email = session.user.email;
          const googleId = session.user.sub;

          // Try fetching the existing user
          let existingUser;
          try {
            existingUser = await userDataService.getUserByUsername(email);
          } catch (error: any) {
            // Check if the error is a 404 (user not found)
            if (error.response && error.response.status === 404) {
              // No existing user, proceed to create one
              const newUser = {
                username: email,
                email: email,
                full_name: session.user.name,
                google_id: googleId,
                password: "password",
              };
              const userResponse = await userDataService.createUser(newUser);

              // Create a company for the new user
              const companyData = {
                company_name: session.user.name + "'s company",
              };
              const companyResponse = await companyDataService.createCompany(
                userResponse.data.id,
                companyData
              );
              // Store company details in state
              setCompanyId(companyResponse.data.id);
              setCompanyName(companyResponse.data.company_name);
            } else if (error.response && error.response.status === 500) {
              // If the error is not 404, rethrow it to be caught by the outer catch
              console.error("Prevent User Creation 500 Error");
            } else {
              // If the error is not 404 or 500, rethrow it to be caught by the outer catch
              throw error;
            }
          }

          // If user exists, get company information
          if (existingUser?.data) {
            if (googleId !== existingUser.data.google_id) {
              console.error("Google Id does not match session google Id");
              redirect("/");
            }
            const companyResponse = await userDataService.getCompanyByUserId(
              existingUser.data.id
            );
            setCompanyId(companyResponse.data.id);
            setCompanyName(companyResponse.data.company_name);
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
