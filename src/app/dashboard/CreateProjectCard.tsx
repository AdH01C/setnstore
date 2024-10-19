import React, { useState } from "react";
import ApplicationDataService from "@/app/services/NewAppDataService";
import { useAppContext } from "../components/AppContext";
import { Button, Card, Input } from "antd";
import { App } from "@inquisico/ruleset-editor-api";

interface CreateProjectCardProps {
  onCreate: (newApp: any) => void; // The function to call when a new app is created
}

export default function CreateProjectCard({
  onCreate,
}: CreateProjectCardProps) {
  const { companyId } = useAppContext();
  const [appName, setAppName] = useState("");

  const handleCreateApplication = async () => {
    try {
      const payload: App = { appName: appName };
      const response = await ApplicationDataService.createApplication(
        companyId,
        payload
      );
      console.log("Application created successfully", response);

      onCreate(response);
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
