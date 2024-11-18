"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/NewAppDataService";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";

export default function AppDisplay() {
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [application, setApplication] = useState<AppDetailsWithID>();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByID(
        userDetails.companyId,
        userDetails.appId
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
