"use client";

import { Layout, Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import React, { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import ApplicationSiderMenu from "@/app/components/ApplicationSiderMenu";
import { useParams, useRouter } from "next/navigation";
import NestedApplicationTable from "@/app/components/NestedApplicationTable";
import applicationDataService from "@/app/services/ApplicationDataService";
interface Application {
  appID: string;
  applicationName: string;
  dateCreated: Date;
  companyName: string;
}
export default function AppDisplay() {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const { app_id } = useParams<{ app_id: string }>();
  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await applicationDataService.getApplicationByAppId(
        companyName,
        app_id
      );
      const application: Application = {
        appID: app_id,
        applicationName: response.data.app_name,
        companyName: response.data.company_name,
        dateCreated: response.data.created_datetime,
      };
      setApplication(application);
    };
    fetchApplications();
  }, [companyName, app_id]);

  return (
    <>
      <ApplicationSiderMenu company={companyName} appID={app_id} />
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              onClick: () => {
                router.push(`/dashboard`);
              },
            },
            { title: "Application" },
            { title: application?.applicationName },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {application && (
            <NestedApplicationTable
              company={companyName}
              application={application}
            />
          )}
        </Content>
      </Layout>
    </>
  );
}
