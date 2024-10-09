import React, { useState } from "react";
import ApplicationDataService from "@/app/services/ApplicationDataService";
import { useAppContext } from "../components/AppContext";
import { Button, Card, Input } from "antd";

interface CreateProjectCardProps {
  onCreate: (newApp: any) => void; // The function to call when a new app is created
}

export default function CreateProjectCard({
  onCreate,
}: CreateProjectCardProps) {
  const { companyName, companyId } = useAppContext();
  const [appName, setAppName] = useState("");

  const handleCreateApplication = async () => {
    try {
      const payload = { app_name: appName };
      const response = await ApplicationDataService.createApplication(
        payload,
        companyId
      );
      console.log("Application created successfully", response);
      const newApp = {
        id: response.data.id,
        company_name: companyName,
        app_name: appName,
      };
      onCreate(newApp);
      setAppName("");
    } catch (error) {
      console.error("Error creating application:", error);
    }
  };

  return (
    <Card
      title="Create New Project"
      bordered={false}
      hoverable
      style={{ width: 300 }}
    >
      <Input
        placeholder="App Name"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
      />

      <Button
        type="primary"
        onClick={handleCreateApplication}
        style={{ marginTop: "1rem" }}
      >
        Create
      </Button>
    </Card>
  );
}
