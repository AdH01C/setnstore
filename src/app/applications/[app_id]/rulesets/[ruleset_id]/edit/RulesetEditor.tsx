"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RulesetForm from "../../../../../components/RulesetForm";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import { Button } from "antd";
import { RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useAtom } from "jotai";
import { userDetailsAtom } from "@/jotai/User";

export default function RulesetEditor() {
  const router = useRouter();
  

  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  const appID = userDetails.appId;
  const rulesetID = userDetails.rulesetId;
  const companyId = userDetails.companyId;

  const [ruleset, setRuleset] = useState<RulesetWithRulesetJson>();

  const handleFormChange = (data: any) => {
    setRuleset(
      (prevRuleset) =>
        ({
          ...prevRuleset,
          rulesetJson: data,
        } as RulesetWithRulesetJson)
    );
  };

  useEffect(() => {
    const fetchRuleset = async () => {
      if (!rulesetID) {
        return;
      }

      const response = await RulesetDataService.getRulesetByID(
        companyId,
        appID,
        rulesetID
      );

      setRuleset(response);
    };

    fetchRuleset();
  }, [companyId, appID, rulesetID]);

  const handleSubmit = async () => {
    if (ruleset?.rulesetJson) {
      try {
        await RulesetDataService.updateRuleset(
          companyId,
          appID,
          ruleset.id,
          ruleset
        );
        router.push(`/applications/${appID}/rulesets/${ruleset.id}`);
      } catch (error) {
        console.error("Error submitting ruleset:", error);
      }
    }
  };

  return (
    <>
      {ruleset && (
        <>
          <RulesetForm
            formData={ruleset.rulesetJson}
            onFormChange={handleFormChange}
          />
          <Button
            type="primary"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save Changes
          </Button>
        </>
      )}
    </>
  );
}
