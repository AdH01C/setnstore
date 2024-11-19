"use client"

import RulesetDetail from "@/app/components/RulesetDetail";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import { userDetailsAtom } from "@/jotai/User";
import { Button, Modal } from "antd";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

interface Step3Props {
  ruleset: any;
  prev: () => void;
  appID: string;
}

export default function Step3(
  { ruleset, prev, appID }: Step3Props
) {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  
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
      Modal.error(
        {
          title: "Error",
          content: String(error)
        }
      )
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
