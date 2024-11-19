"use client";

import { useEffect, useState } from "react";
import RulesetForm from "../../../../../components/RulesetForm";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import { Button } from "antd";
import { RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useAtom } from "jotai";
import { userDetailsAtom } from "@/jotai/User";
import router from "next/router";

interface RulesetEditorProps {
  rulesetId: string;
  appId: string;
}


export default function RulesetEditor(
  { rulesetId, appId }: RulesetEditorProps
) {

  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

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
      
      if (!rulesetId) {
        return;
      }

      console.warn("Fetching ruleset with ID", rulesetId, "for company", userDetails.companyId);
      const response = await RulesetDataService.getRulesetByID(
        userDetails.companyId,
        appId,
        rulesetId
      );

      console.log("Ruleset fetched:", response);

      setRuleset(response);
    };

    fetchRuleset();
  }, []);

  const handleSubmit = async () => {
    if (ruleset?.rulesetJson) {
      try {
        await RulesetDataService.updateRuleset(
          userDetails.companyId,
          appId,
          ruleset.id,
          ruleset
        );
        router.push(`/applications/${appId}/rulesets/${ruleset.id}`);
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
