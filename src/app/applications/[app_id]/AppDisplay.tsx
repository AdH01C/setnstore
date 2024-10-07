"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/ApplicationDataService";
import { useAppContext } from "@/app/components/AppContext";
interface Application {
  appID: string;
  applicationName: string;
  dateCreated: Date;
  companyName: string;
}
export default function AppDisplay() {
  const { appID, companyName } = useAppContext();
  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByAppId(
        companyName,
        appID
      );
      const application: Application = {
        appID: appID,
        applicationName: response.data.app_name,
        companyName: response.data.company_name,
        dateCreated: response.data.created_datetime,
      };
      setApplication(application);
    };
    fetchApplications();
  }, [companyName, appID]);

  return (
    <>
      {application && (
        <ApplicationTable company={companyName} application={application} />
      )}
    </>
  );
}
