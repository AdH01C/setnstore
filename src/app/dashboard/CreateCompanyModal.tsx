import React, { useState } from "react";
import { Modal, Input } from "antd";
import companyDataService from "@/app/services/NewCompanyDataService";

interface CreateCompanyModalProps {
  identityId: string; // The ID of the user's identity
  open: boolean; // Whether the modal is open
  onClose: () => void; // Function to close the modal
  onSuccess?: () => void; // Callback for when the company is successfully created
}

const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({
  identityId,
  open,
  onClose,
  onSuccess,
}) => {
  const [formCompanyName, setFormCompanyName] = useState(""); // Track company name input
  const [isSubmitting, setIsSubmitting] = useState(false); // Track loading state

  const handleCreateCompany = async () => {
    if (!formCompanyName.trim()) {
      Modal.error({
        title: "Error",
        content: "Company name cannot be empty.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await companyDataService.createCompany(identityId, { companyName: formCompanyName });
      Modal.success({
        title: "Success",
        content: "Company created successfully!",
      });

      // Trigger success callback
      if (onSuccess) onSuccess();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating company:", error);
      Modal.error({
        title: "Error",
        content: "Failed to create the company. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      title="Create Company"
      open={open} // Use `open` instead of `visible`
      onCancel={onClose}
      onOk={handleCreateCompany}
      okButtonProps={{ loading: isSubmitting }}
    >
      <p>You do not have a company yet.</p>
      <Input
        placeholder="Enter Company Name"
        onChange={(e) => setFormCompanyName(e.target.value)}
      />
    </Modal>
  );
};

export default CreateCompanyModal;
