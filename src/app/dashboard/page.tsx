"use client"

import React, { useState } from "react";
import Dashboard from "./Dashboard";
import AppLayout from "../components/AppLayout";
import companyDataService from "@/app/services/NewCompanyDataService";
import applicationDataService from "../services/NewAppDataService";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import identityDataService from "../services/IdentityDataService";
import CreateCompanyModal from "./CreateCompanyModal";
import { userDetailsAtom } from "@/jotai/User"; // Adjust the import path as necessary
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default function Page() {
  const [applications, setApplications] = useState<AppDetailsWithID[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Control modal visibility
  const [identityId, setIdentityId] = useState<string | null>(null); // Track identity ID
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  const { identity } = useAuth();

  if (!identity) {
    redirect("/");
  }

  const fetchApplications = async () => {
    try {
      // Step 2: Fetch company details
      let companyDetails;
      try {
        companyDetails = await companyDataService.getCompanyByUserId(userDetails.id);


      } catch (error) {
        console.warn("No company found. Showing modal to create one.");
        setIsModalOpen(true); // Show the modal
        return; // Exit early since no company exists
      }

      // Step 3: Fetch applications
      const apps = await applicationDataService.getApplications(companyDetails.id);
      console.log("Applications fetched successfully", apps);

      setUserDetails({
        ...userDetails,
        companyId: companyDetails.id,
        companyName: companyDetails.companyName,
      });


      if (apps == null) 
        return [];

      // Transform and set applications
      const transformedApps = apps.map((app) => ({
        id: app.id,
        companyId: app.companyId,
        createdDatetime: app.createdDatetime,
        appName: app.appName,
      }));

      setApplications(transformedApps);
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  // Fetch applications when the component mounts
  React.useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <AppLayout>
      <Dashboard apps={applications} />
      <CreateCompanyModal
        identityId={identityId || ""}
        open={isModalOpen} // Use `open` instead of `visible`
        onClose={() => setIsModalOpen(false)} // Close modal handler
        onSuccess={() => {
          setIsModalOpen(false); // Close modal on success
          fetchApplications(); // Re-fetch applications
        }}
      />
    </AppLayout>
  );
}
