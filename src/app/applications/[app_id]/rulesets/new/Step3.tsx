"use client"

import RulesetDetail from "@/app/components/RulesetDetail";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import { userDetailsAtom } from "@/jotai/User";
import { Button } from "antd";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

export default function Step3({
  ruleset,
  prev,
}: {
  ruleset: any;
  prev: () => void;
}) {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  const appID = userDetails.appId;
  const companyId = userDetails.companyId;



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
      
      <div className="flex justify-between mb-4 pr-4">
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
      <RulesetDetail ruleset={ruleset} />
    </>
  );
}
