import React, { useState } from "react";
import ApplicationDataService from "@/app/services/ApplicationDataService";
import { useAppContext } from "../components/AppContext";

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
    <div className="flex flex-col gap-4 bg-gray-800 rounded-lg p-4 hover:border-4 hover:cursor-pointer transition-transform duration-300 ease-out transform hover:scale-105">
      <h1 className="text-gray-600 text-2xl font-bold">Create New Project</h1>
      {/* Input for app name */}
      <input
        type="text"
        placeholder="App Name"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
        className="p-2 rounded bg-gray-700 text-white"
      />

      {/* Button to trigger createApplication */}
      <button
        onClick={handleCreateApplication}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create Application
      </button>
    </div>
  );
}
