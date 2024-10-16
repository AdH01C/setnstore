import RulesetForm from "@/app/components/RulesetForm";
import { Button } from "antd";

export default function Step2({
  ruleset,
  updateRuleset,
  next,
  prev,
}: {
  ruleset: any;
  updateRuleset: (newRuleset: any) => void;
  next: () => void;
  prev: () => void;
}) {
  const handleFormChange = (data: any) => {
    updateRuleset(data);
  };

  return (
    <>
      <RulesetForm formData={ruleset} onFormChange={handleFormChange} />
      <div style={{ marginTop: 24 }}>
        <Button
          type="primary"
          onClick={() => {
            prev();
          }}
        >
          Previous
        </Button>
        <Button
          type="primary"
          onClick={() => {
            next();
          }}
        >
          Next
        </Button>
      </div>
    </>
  );
}