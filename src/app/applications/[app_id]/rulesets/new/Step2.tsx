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
      
      <div className="mb-4 flex justify-between pr-4">
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
      <RulesetForm formData={ruleset} onFormChange={handleFormChange} />
    </>
  );
}
