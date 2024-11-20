import { Button } from "antd";

import { RulesetForm } from "@/app/components/RulesetForm";

interface Step2Props {
  ruleset: any;
  updateRuleset: (newRuleset: any) => void;
  next: () => void;
  prev: () => void;
}

export function Step2({ ruleset, updateRuleset, next, prev }: Step2Props) {
  const handleFormChange = (data: any) => {
    updateRuleset(data);
  };

  const navOperations = [
    <Button
      key="next"
      type="primary"
      onClick={() => {
        prev();
      }}
    >
      Previous
    </Button>,
    <Button
      key="prev"
      type="primary"
      onClick={() => {
        next();
      }}
    >
      Next
    </Button>,
  ];

  return (
    <>
      <div className="mb-4 flex justify-between pr-4" />
      <RulesetForm formData={ruleset} onFormChange={handleFormChange} operations={navOperations} />
    </>
  );
}
