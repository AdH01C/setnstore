"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RulesetDataService from "@/app/services/NewRulesetDataService";
import RulesetDetail from "@/app/components/RulesetDetail";
import { RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";

interface RulesetDisplayProps {
  rulesetID: string;
  appID: string;
}

export default function RulesetDisplay(
  { rulesetID, appID }: RulesetDisplayProps
) {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);

  const companyId = userDetails.companyId;


  const [ruleset, setRuleset] = useState<RulesetWithRulesetJson>();

  const handleRulesetDelete = async (rulesetID: string) => {
    try {
      await RulesetDataService.deleteRulesetByID(companyId, appID, rulesetID);
      router.push(`/applications/${appID}`);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
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

  return (
    <>
      {ruleset && (
        <RulesetDetail
          ruleset={ruleset.rulesetJson}
          isEditable
          isDeletable
          onEdit={() => {
            setUserDetails((prev) => ({ ...prev, rulesetId: rulesetID }));
            router.push(`/applications/${appID}/rulesets/${rulesetID}/edit`);
          }}
          onDelete={() => {
            handleRulesetDelete(ruleset.id);
          }}
        />
      )}
    </>
  );
}
