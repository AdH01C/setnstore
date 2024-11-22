import { RulesetApi } from "@inquisico/ruleset-editor-api";
import { useMutation } from "@tanstack/react-query";
import { Button, notification } from "antd";
import { useRouter } from "next/navigation";

import { useAppContext } from "@/app/components/AppContext";
import { Loading } from "@/app/components/Loading";
import { RulesetDetail } from "@/app/components/RulesetDetail";
import configuration from "@/app/constants/apiConfig";
import { ErrorMessages, InfoMessages } from "@/app/constants/messages/messages";
import { errorResponseHandler } from "@/app/utils/responseHandler";

interface Step3Props {
  ruleset: any;
  prev: () => void;
}

export function Step3({ ruleset, prev }: Step3Props) {
  const router = useRouter();
  const { companyID, appID } = useAppContext();
  const rulesetApi = new RulesetApi(configuration());

  const createRulesetMutation = useMutation({
    mutationFn: ({ companyID, appID, ruleset }: { companyID: string; appID: string; ruleset: any }) => {
      return rulesetApi.createRuleset(companyID, appID, {
        rulesetJson: ruleset,
      });
    },
    onSuccess: data => {
      notification.success({
        message: "Ruleset created",
        description: InfoMessages.CREATE_RULESET_SUCCESS,
        placement: "bottomRight",
      });
      void router.push(`/applications/${appID}/rulesets/${data.id}`);
    },
    onError: error => {
      errorResponseHandler(error, {
        detail: ErrorMessages.CREATE_RULESET_ERROR,
      });
    },
  });

  const handleSubmit = async () => {
    try {
      if (companyID && appID && ruleset) {
        void (await createRulesetMutation.mutateAsync({
          companyID,
          appID,
          ruleset,
        }));
      }
    } catch (e) {
      return;
    }
  };

  return (
    <>
      <div className="mb-4 flex justify-between pr-4">
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
      {createRulesetMutation.isPending ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
          <Loading />
        </div>
      ) : (
        <RulesetDetail ruleset={ruleset} />
      )}
    </>
  );
}
