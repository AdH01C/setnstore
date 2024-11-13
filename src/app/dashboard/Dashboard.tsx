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
import { redirect } from "next/navigation";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import ApplicationsTable from "./ApplicationsTable";
import { Button, Input, Modal } from "antd";
import { App } from "@inquisico/ruleset-editor-api";

export default function Dashboard() {
  const { companyName, setCompanyName, companyId, setCompanyId } =
    useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [applications, setApplications] = useState<AppDetailsWithID[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState("");

  useEffect(() => {
    const checkAndSetUser = async () => {
      const session = await getSession();
      try {
        if (session?.user?.email) {
          const email = session.user.email;
          const googleId = session.user.sub;

          // Try fetching the existing user
          let existingUser;
          try {
            existingUser = await oldUserDataService.getUserByUsername(email);
          } catch (error: any) {
            // Check if the error is a 404 (user not found)
            if (error.response && error.response.status === 404) {
              // No existing user, proceed to create one
              const newUser = {
                username: email,
                email: email,
                full_name: session.user.name,
                google_id: googleId,
                password: "password",
              };
              const userResponse = await oldUserDataService.createUser(newUser);
              // Create a company for the new user
              const companyData = {
                company_name: session.user.name + "'s company",
              };
              const companyResponse = await oldCompanyDataService.createCompany(
                userResponse.data.id,
                companyData
              );
              // Store company details in state
              setCompanyId(companyResponse.data.id);
              setCompanyName(companyResponse.data.company_name);
            } else if (error.response && error.response.status === 500) {
              // If the error is not 404, rethrow it to be caught by the outer catch
              console.error("Prevent User Creation 500 Error");
            } else {
              // If the error is not 404 or 500, rethrow it to be caught by the outer catch
              throw error;
            }
          }

          // If user exists, get company information
          if (existingUser?.data) {
            if (googleId !== existingUser.data.google_id) {
              console.error("Google Id does not match session google Id");
              redirect("/");
            }
            const companyResponse = await companyDataService.getCompanyByUserId(
              existingUser.data.id
            );
            setCompanyId(companyResponse.id);
            setCompanyName(companyResponse.companyName);
          }
        } else {
          console.error("No session or email found. Redirect to login.");
          redirect("/");
        }
      } catch (error) {
        console.error("Error during user check/creation:", error);
      }
    };

    checkAndSetUser();
  }, [companyId, companyName, setCompanyId, setCompanyName]);

  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      try {
        const response = await ApplicationDataService.getApplications(
          companyId
        );
        setApplications(response);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [companyId]);

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
                key={application.id} // Ensure each card has a unique key
                appId={application.id}
                appName={application.appName}
                companyName={companyName}
                companyId={companyId}
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
