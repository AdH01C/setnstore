"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/ApplicationDataService";
import { useAppContext } from "@/app/components/AppContext";
interface Application {
  appID: string;
  applicationName: string;
  dateCreated: Date;
  companyId: string;
}
export default function AppDisplay() {
  const { appID, companyId } = useAppContext();
  const [application, setApplication] = useState<Application>();
  
  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByAppId(
        companyId,
        appID
      );
      const application: Application = {
        appID: appID,
        applicationName: response.data.app_name,
        companyId: response.data.company_id,
        dateCreated: response.data.created_datetime,
      };
      setApplication(application);
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
