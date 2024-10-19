import { useAppContext } from "@/app/components/AppContext";
import RulesetDetail from "@/app/components/RulesetDetail";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Step3({
  ruleset,
  prev,
}: {
  ruleset: any;
  prev: () => void;
}) {
  const router = useRouter();
  const { appID, companyId } = useAppContext();
  const handleSubmit = async () => {
    try {
      // Update the existing ruleset
      const newRuleset = await RulesetDataService.createRuleset(
        companyId,
        appID,
        { rulesetJson: ruleset }
      );

      router.push(`/applications/${appID}/rulesets/${newRuleset.id}`);
    } catch (error) {
      console.error("Error submitting ruleset:", error);
    }
  };
  return (
    <>
      <RulesetDetail ruleset={ruleset} />
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
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
}
