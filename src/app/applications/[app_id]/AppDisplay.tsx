"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/NewAppDataService";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";

interface AppDisplayProps {
  appId: string;
}

export default function AppDisplay(
  { appId }: AppDisplayProps
) {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [application, setApplication] = useState<AppDetailsWithID | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      console.warn("Fetching application with ID", appId, "for company", userDetails.companyId);
      const response = await applicationDataService.getApplicationByID(
        userDetails.companyId,
        appId
      );
      setApplication(response);
    };
    fetchApplications();
  }, []);

  return (
    <>
      {application && (
        <ApplicationTable companyId={userDetails.companyId} application={application} />
      )}
    </>
  );
}
