import { CompanyApi } from "@inquisico/ruleset-editor-api";
import { useMutation } from "@tanstack/react-query";
import { Input, Modal } from "antd";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import configuration from "../constants/apiConfig";
import { addTrailingSlash } from "../utils/common";
import { Loading } from "../components/Loading";

interface CreateCompanyModalProps {
  userID: string | undefined; // The ID of the user's identity
  open: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  onSuccess: () => void; // Callback for when the company is successfully created
}

function CreateCompanyModal({ userID, open, onClose, onSuccess }: CreateCompanyModalProps) {
  const router = useRouter();
  const [formCompanyName, setFormCompanyName] = useState("");
  const companyApi = new CompanyApi(configuration());

  const createCompanyMutation = useMutation({
    mutationFn: () => {
      if (!userID) {
        throw new Error("userID is undefined");
      }
      return companyApi.createCompany(userID, {
        companyName: formCompanyName,
      });
    },
    onSuccess: () => {
      void onSuccess();
      void onClose();
    },
  });

  const handleCreateCompany = () => {
    void createCompanyMutation.mutateAsync();
  };

  return (
    <Modal
      title="Create Company"
      open={open}
      closable={false}
      maskClosable={false}
      onOk={handleCreateCompany}
      onCancel={() => router.push(addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "") + "logout_unified")}
    >
      {createCompanyMutation.isPending ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
          <Loading />
        </div>
      ) : (
        <>
          <p>You do not have a company yet.</p>
          <Input placeholder="Enter Company Name" required onChange={e => setFormCompanyName(e.target.value)} />
        </>
      )}
    </Modal>
  );
}

export { CreateCompanyModal };
