"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/NewAppDataService";
import { useAppContext } from "@/app/components/AppContext";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
export default function AppDisplay() {
  const { appID, companyId } = useAppContext();
  const [application, setApplication] = useState<AppDetailsWithID>();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByAppID(
        companyId,
        appID
      );
      setApplication(response);
    };
    fetchApplications();
  }, [companyId, appID]);

  return (
    <>
      {application && (
        <ApplicationTable companyId={companyId} application={application} />
      )}
    </>
  );
}
