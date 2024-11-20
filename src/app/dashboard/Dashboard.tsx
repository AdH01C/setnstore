"use client";

import { useState } from "react";
import Loading from "../components/Loading";
import { useAppContext } from "../components/AppContext";
import ApplicationsTable from "./ApplicationsTable";
import { Button, Input, Modal } from "antd";
import { App, ApplicationApi } from "@inquisico/ruleset-editor-api";
import configuration from "../services/apiConfig";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const { companyID } = useAppContext();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const applicationApi = new ApplicationApi(configuration());

  const showModal = () => {
    setIsModalOpen(true);
  };

  const {
    data: applications,
    refetch: refetchApplications,
    isLoading,
  } = useQuery({
    queryKey: ["applications", companyID],
    queryFn: () => {
      return companyID ? applicationApi.getApplications(companyID) : undefined;
    },
    enabled: !!companyID,
  });

  const createApplicationMutation = useMutation({
    mutationFn: () => {
      if (!companyID) {
        throw new Error("companyID is undefined");
      }
      return applicationApi.createApplication(companyID, {
        appName: appName,
      } as App);
    },
    onSuccess: (data, variables) => {
      void refetchApplications();
      setConfirmLoading(false);
      setIsModalOpen(false);
      setAppName("");
    },
    onError: (error) => {
      console.error("Error deleting ruleset:", error);
    },
  });

  const handleApplicationCreate = () => {
    void createApplicationMutation.mutateAsync();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAppName("");
  };

  const deleteApplicationMutation = useMutation({
    mutationFn: (appID: string) => {
      if (!companyID || !appID) {
        throw new Error("companyID or appID is undefined");
      }
      return applicationApi.deleteApplication(companyID, appID);
    },
    onSuccess: (data, variables) => {
      void refetchApplications();
    },
    onError: (error) => {
      console.error("Error deleting ruleset:", error);
    },
  });

  const handleApplicationDelete = (appID: string) => {
    Modal.confirm({
      title: "Delete Application",
      content: "Are you sure you want to delete this application?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        void deleteApplicationMutation.mutateAsync(appID);
      },
    });
  };

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div>
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
            onOk={handleApplicationCreate}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Input
              placeholder="App Name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </Modal>
          {companyID && (
            <ApplicationsTable
              companyID={companyID}
              applications={
                applications
                  ? applications.filter(
                      (application) => application !== undefined
                    )
                  : []
              }
              handleDelete={handleApplicationDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}
