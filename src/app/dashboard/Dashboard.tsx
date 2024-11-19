"use client";

import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import ApplicationDataService from "../services/NewAppDataService";
// import ProjectCard from "./ProjectCard";
// import CreateProjectCard from "./CreateProjectCard";
import { useAppContext } from "../components/AppContext";
import { getSession } from "next-auth/react";
import oldUserDataService from "../services/OldUserDataService";
import oldCompanyDataService from "../services/OldCompanyDataService";
import companyDataService from "../services/NewCompanyDataService";
import newUserDataService from "../services/NewUserDataService";
import { redirect } from "next/navigation";
import { AppDetailsWithID, Identity, UserApi } from "@inquisico/ruleset-editor-api";
import ApplicationsTable from "./ApplicationsTable";
import { Button, Input, Modal } from "antd";
import { App } from "@inquisico/ruleset-editor-api";
import { fetchedApplicationsAtom, userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";
import { Input, Modal } from "antd";
    
export default function Dashboard() {
  const [applications, setApplications] = useAtom(fetchedApplicationsAtom);
  const { companyName, setCompanyName, companyId, setCompanyId } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  // const [applications, setApplications] = useState<AppDetailsWithID[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState("");

  useEffect(() => {
    
    setTimeout(() => {
      setIsLoading(false);
    }, 500);


  }, [applications]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    const response = await ApplicationDataService.createApplication(companyId, {
      appName: appName,
    } as App);
    setApplications((prevApps) => [...(prevApps || []), response]);
    setConfirmLoading(false);
    setIsModalOpen(false);
    setAppName("");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAppName("");
  };

  const handleApplicationDelete = async (appID: string) => {
    Modal.confirm({
      title: "Delete Application",
      content: "Are you sure you want to delete this application?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        try {
          await ApplicationDataService.deleteApplication(companyId, appID);
          setApplications((prevApps) =>
            prevApps ? prevApps.filter((app) => app.id !== appID) : []
          );
          console.log(`Application with ID ${appID} deleted successfully`);
        } catch (error) {
          console.error("Error deleting application:", error);
        }
      },
    });
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          {/* {applications &&
            applications.map((application) => (
              <ProjectCard
                key={app.id} // Ensure each card has a unique key
                appId={app.id}
                appName={app.appName}
                companyId={app.companyId}
                onDelete={handleDelete}
              />
            ))}
          <CreateProjectCard onCreate={handleCreate} /> */}
          <Button
            type="primary"
            onClick={showModal}
            style={{ marginBottom: 16, marginTop: 16 }}
          >
            Add Application
          </Button>
          <Modal
            title="Add Application"
            open={isModalOpen}
            onOk={handleOk}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Input
              placeholder="App Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </Modal>
          <ApplicationsTable
            companyId={companyId}
            applications={applications}
            handleDelete={handleApplicationDelete}
          />
        </div>
      )}
    </div>
  );
}
