"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/ApplicationDataService";
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
  const companyName = getCookie("username") as string;
    // const [companyName, setCompanyName] = useState<string | null>(null);

    // useEffect(() => {
  //   // Check for existing cookies or fetch session
  //   const checkAuthAndSetCookie = async () => {
  //     const existingCookie = getCookie("username");

  //     if (existingCookie) {
  //       // If cookie already exists, use it
  //       setCompanyName(existingCookie as string);
  //     } else {
  //       // Fetch session (for Google login)
  //       const session = await getSession();
  //       if (session?.user?.name) {
  //         // If logged in via Google, set cookie with session.user.name
  //         setCookie("username", session.user.name, { maxAge: 60 * 30 });
  //         setCompanyName(session.user.name);
  //       } else {
  //         // Handle credentials login (if applicable)
  //         // If you had stored username from credentials login elsewhere,
  //         // you could set it here or redirect to login if no user is found
  //         // For now, assume no cookie means redirect or handle anonymous session.
  //         console.error("No user found. Redirecting to login.");
  //         // Redirect logic here if necessary
  //       }
  //     }
  //   };

  //   // Call the function to check and set cookies
  //   checkAuthAndSetCookie();
  // }, []);

  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      const company = companyName === "admin" ? "null" : companyName;

      try {
        const response =
          await ApplicationDataService.getAllApplicationsByCompanyName(company);
        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [companyName]);

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
              companyName={application.company_name}
              onDelete={handleDelete}
            />
          ))}

          <CreateProjectCard onCreate={handleCreate} />
        </div>
      )}
    </div>
  );
}
