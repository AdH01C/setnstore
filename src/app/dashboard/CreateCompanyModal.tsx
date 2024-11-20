import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import configuration from "../services/apiConfig";
import { CompanyApi } from "@inquisico/ruleset-editor-api";
import { useMutation } from "@tanstack/react-query";

interface CreateCompanyModalProps {
  userID: string | undefined; // The ID of the user's identity
  open: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  onSuccess: () => void; // Callback for when the company is successfully created
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  userID,
  open,
  onClose,
  onSuccess,
}) => {
  const [formCompanyName, setFormCompanyName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    onSuccess: (data, variables) => {
      void onSuccess();
      void onClose();
    },
    onError: (error) => {
      console.error("Error creating company:", error);
    },
    onSettled: () => {
      setIsSubmitting(false);
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
      footer={[
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={()=>handleCreateCompany()}
        >
          OK
        </Button>,
      ]}
    >
      <p>You do not have a company yet.</p>
      <Input
        placeholder="Enter Company Name"
        required
        onChange={(e) => setFormCompanyName(e.target.value)}
      />
    </Modal>
  );
};

export default CreateCompanyModal;
