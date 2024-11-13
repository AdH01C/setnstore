"use client";

import React, { useEffect, useState } from "react";
import ApplicationTable from "@/app/applications/[app_id]/ApplicationTable";
import applicationDataService from "@/app/services/NewAppDataService";
import { useAppContext } from "@/app/components/AppContext";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import { Button } from "antd";
import { useRouter } from "next/navigation";
export default function AppDisplay() {
  const { appID, companyId } = useAppContext();
  const [application, setApplication] = useState<AppDetailsWithID>();
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByID(
        companyId,
        appID
      );
      setApplication(response);
    };
    fetchApplications();
  }, [companyId, appID]);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          router.push(`/applications/${appID}/rulesets/new`);
        }}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        Add Ruleset
      </Button>
      {application && (
        <ApplicationTable companyId={companyId} application={application} />
      )}
    </>
  );
}
