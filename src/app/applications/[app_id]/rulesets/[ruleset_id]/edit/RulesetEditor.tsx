"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";
import RulesetForm from "../../../../../components/RulesetForm";
import RulesetDataService from "@/app/services/RulesetDataService";
import { useAppContext } from "@/app/components/AppContext";

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetEditor() {
  const router = useRouter();
  const { appID, companyId, rulesetID } = useAppContext();
  const [ruleset, setRuleset] = useState<Ruleset>();

  const handleFormChange = (data: any) => {
    setRuleset(
      (prevRuleset) =>
        ({
          ...prevRuleset,
          ruleset: data,
        } as Ruleset)
    );
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

  const handleSubmit = async () => {
    if (ruleset?.ruleset) {
      const payload = { ruleset_json: ruleset.ruleset };

      try {
        // Update the existing ruleset
        await RulesetDataService.updateRuleset(
          payload,
          companyId,
          appID,
          ruleset.rulesetID
        );
        router.push(`/applications/${appID}/rulesets/${ruleset.rulesetID}`);
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
            formData={ruleset.ruleset}
            onFormChange={handleFormChange}
          />
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              handleSubmit();
            }}
          >
            Save Changes
          </button>
        </>
      )}
    </>
  );
}
