"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";
import { useAppContext } from "@/app/components/AppContext";
import RulesetDetail from "@/app/components/RulesetDetail";

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetDisplay() {
  const router = useRouter();
  const { appID, companyId, rulesetID } = useAppContext();
  const [ruleset, setRuleset] = useState<Ruleset>();

  const handleRulesetDelete = async (rulesetID: string) => {
    try {
      await rulesetDataService.deleteRulesetByRulesetId(
        companyId,
        appID,
        rulesetID
      );
      console.log(
        `Ruleset with ID ${rulesetID} in application ${appID} deleted successfully`
      );
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

      const response = await rulesetDataService.getRulesetByRulesetId(
        companyId,
        appID,
        rulesetID
      );

      const ruleset: Ruleset = {
        rulesetID: response.id,
        host: response.app_id,
        dateLastModified: response.last_modified_datetime,
        ruleset: response.ruleset_json,
      };

      setRuleset(ruleset);
    };

    fetchRuleset();
  }, [companyId, appID, rulesetID]);

  return (
    <>
      {ruleset && (
        <RulesetDetail
          ruleset={ruleset.ruleset}
          isEditable
          isDeletable
          onEdit={() => {
            router.push(`/applications/${appID}/rulesets/${rulesetID}/edit`);
          }}
          onDelete={() => {
            handleRulesetDelete(ruleset.rulesetID);
          }}
        />
      )}
    </>
  );
}
