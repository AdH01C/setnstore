"use client";

import { App, ApplicationApi } from "@inquisico/ruleset-editor-api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Input, Modal, notification } from "antd";
import { useState } from "react";

import { ApplicationsTable } from "./ApplicationsTable";
import { useAppContext } from "../components/AppContext";
import { Loading } from "../components/Loading";
import configuration from "../constants/apiConfig";
import { ErrorMessages, InfoMessages } from "../constants/messages/messages";
import { errorResponseHandler } from "../utils/responseHandler";

function Dashboard() {
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
        appName,
      } as App);
    },
    onSuccess: () => {
      notification.success({
        message: "Application created",
        description: InfoMessages.CREATE_APPLICATION_SUCCESS,
        placement: "bottomRight",
      });
      void refetchApplications();
      setConfirmLoading(false);
      setIsModalOpen(false);
      setAppName("");
    },
    onError: error => {
      errorResponseHandler(error, {
        detail: ErrorMessages.CREATE_APPLICATION_ERROR,
      });
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
    onSuccess: () => {
      notification.success({
        message: "Application deleted",
        description: InfoMessages.DELETE_APPLICATION_SUCCESS,
        placement: "bottomRight",
      });
      void refetchApplications();
    },
    onError: error => {
      errorResponseHandler(error, {
        detail: ErrorMessages.DELETE_APPLICATION_ERROR,
      });
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
        void deleteApplicationMutation.mutate(appID);
      },
    });
  };

  return (
    <div>
      {isLoading || createApplicationMutation.isPending ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
          <Loading />
        </div>
      ) : (
        // </div>
        <div>
          <Button type="primary" onClick={showModal} style={{ marginBottom: 16, marginTop: 16 }}>
            Add Application
          </Button>
          <Modal
            title="Add Application"
            open={isModalOpen}
            onOk={handleApplicationCreate}
            confirmLoading={confirmLoading}
            onCancel={handleCancel}
          >
            <Input placeholder="App Name" value={appName} onChange={e => setAppName(e.target.value)} />
          </Modal>
          {companyID && (
            <ApplicationsTable
              companyID={companyID}
              applications={applications ? applications.filter(application => application !== undefined) : []}
              handleDelete={handleApplicationDelete}
            />
          )}
        </div>
      )}
    </div>
  );
}

export { Dashboard };
