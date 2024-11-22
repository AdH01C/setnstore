import { RulesetApi, RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, notification } from "antd";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/app/components/AppContext";
import { Loading } from "@/app/components/Loading";
import configuration from "@/app/constants/apiConfig";
import { ErrorMessages, InfoMessages } from "@/app/constants/messages/messages";
import { errorResponseHandler } from "@/app/utils/responseHandler";

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

  const { data: ruleset, isLoading } = useQuery({
    queryKey: ["ruleset", companyID, appID, rulesetID],
    queryFn: () => {
      return companyID && rulesetID ? rulesetApi.getRulesetById(companyID, appID, rulesetID) : null;
    },
    refetchOnWindowFocus: false,
    enabled: !!companyID && !!appID && !!rulesetID,
  });

  const editRulesetMutation = useMutation({
    mutationFn: ({
      companyID,
      appID,
      rulesetID,
      ruleset,
    }: {
      companyID: string;
      appID: string;
      rulesetID: string;
      ruleset: any;
    }) => {
      return rulesetApi.updateRuleset(companyID, appID, rulesetID, ruleset);
    },
    onSuccess: () => {
      notification.success({
        message: "Ruleset updated",
        description: InfoMessages.UPDATE_RULESET_SUCCESS,
        placement: "bottomRight",
      });
      void router.push(`/applications/${appID}/rulesets/${rulesetID}`);
    },
    onError: error => {
      errorResponseHandler(error, {
        detail: ErrorMessages.UPDATE_RULESET_ERROR,
      });
    },
  });

  const handleSubmit = async () => {
    try {
      if (companyID && appID && rulesetID && ruleset) {
        void (await editRulesetMutation.mutateAsync({ companyID, appID, rulesetID, ruleset }));
      }
    } catch (e) {
      return;
    }
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
      {isLoading || editRulesetMutation.isPending ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
          <Loading />
        </div>
      ) : (
        ruleset && (
          <>
            <RulesetForm formData={ruleset.rulesetJson} onFormChange={handleFormChange} operations={saveOperation} />
          </>
        )
      )}
    </>
  );
}
