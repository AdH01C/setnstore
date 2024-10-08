"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/ApplicationDataService";
import UserDataService from "../services/UserDataService";
import CompanyDataService from "../services/CompanyDataService";
import ProjectCard from "./ProjectCard";
import CreateProjectCard from "./CreateProjectCard";
import { getCookie, setCookie } from "cookies-next";
import { useAppContext } from "../components/AppContext";
import { getSession } from "next-auth/react";

interface Application {
  app_name: string;
  company_name: string;
  id: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const { companyName, companyId } = useAppContext();

  const checkAndSetUser = async () => {
    try {
      const session = await getSession();

      if (session?.user?.email) {
        const email = session.user.email;
        const googleId = session.user.sub;
        // const accessToken = session.accessToken;

        const existingUser = await UserDataService.getUserByUsername(email);

        if (!existingUser.data) {
          const newUser = {
            username: email,
            email: email,
            full_name: session.user.name,
            google_id: googleId,
            password: "",
          };
          const newCompany = {
            companyName: email
          };
          await UserDataService.createUser(newUser);
          await CompanyDataService.createCompany(googleId, newCompany);
        }

        setCookie("username", email, { maxAge: 60 * 30 });
        return email;
      } else {
        console.error("No session or email found. Redirect to login.");
      }
    } catch(error) {
      console.error("Error during user check/creation:", error);
      throw error;
    }
  };
  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      // const company = companyName === "admin" ? "null" : companyName;

      try {
        const company = await checkAndSetUser();
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
