import { RulesetApi, RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "antd";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/app/components/AppContext";
import configuration from "@/app/constants/apiConfig";

import { RulesetForm } from "../../../../../components/RulesetForm";

export function RulesetEditor() {
  const router = useRouter();
  const { appID, companyID, rulesetID } = useAppContext();
  const rulesetApi = new RulesetApi(configuration());
  const queryClient = useQueryClient();

  const handleFormChange = (newRuleset: any) => {
    queryClient.setQueryData(["ruleset", companyID, appID, rulesetID], (oldRuleset: RulesetWithRulesetJson) => {
      return {
        ...oldRuleset,
        rulesetJson: newRuleset,
      };
    });
  };

  const { data: ruleset } = useQuery({
    queryKey: ["ruleset", companyID, appID, rulesetID],
    queryFn: () => {
      return companyID && rulesetID ? rulesetApi.getRulesetById(companyID, appID, rulesetID) : null;
    },
    enabled: !!companyID && !!appID && !!rulesetID,
  });

  const editRulesetMutation = useMutation({
    mutationFn: () => {
      if (!companyID || !appID || !rulesetID || !ruleset) {
        throw new Error("companyID, appID, rulesetID or ruleset is undefined");
      }
      return rulesetApi.updateRuleset(companyID, appID, rulesetID, ruleset);
    },
    onSuccess: () => {
      void router.push(`/applications/${appID}/rulesets/${rulesetID}`);
    },
    // onError: error => {
    //   console.error("Error editing ruleset:", error);
    // },
  });

  const handleSubmit = () => {
    void editRulesetMutation.mutateAsync();
  };

  const saveOperation = [
    <Button
      key="save"
      type="primary"
      onClick={() => {
        handleSubmit();
      }}
    >
      Save Changes
    </Button>,
  ];

  return (
    <>
      {ruleset && (
        <>
          <RulesetForm formData={ruleset.rulesetJson} onFormChange={handleFormChange} operations={saveOperation} />
        </>
      )}
    </>
  );
}
