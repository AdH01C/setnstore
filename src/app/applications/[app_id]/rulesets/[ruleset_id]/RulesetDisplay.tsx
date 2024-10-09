"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";
import { useAppContext } from "@/app/components/AppContext";

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

  const handleRulesetDelete = async (
    e: React.MouseEvent,
    rulesetID: string
  ) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

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
        <div className="flex items-start space-x-4">
          <pre className="flex-grow">
            {JSON.stringify(ruleset.ruleset, null, 2)}
          </pre>
          <button
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            onClick={() => {
              router.push(`/applications/${appID}/rulesets/${rulesetID}/edit`);
            }}
          >
            Edit ruleset
          </button>
          <button
            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
            onClick={(e) => {
              handleRulesetDelete(e, ruleset.rulesetID);
            }}
          >
            Delete ruleset
          </button>
        </div>
      )}
    </>
  );
}
