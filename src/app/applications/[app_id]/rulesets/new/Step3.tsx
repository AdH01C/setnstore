import { useAppContext } from "@/app/components/AppContext";
import RulesetDetail from "@/app/components/RulesetDetail";
import configuration from "@/app/services/apiConfig";
import { RulesetApi } from "@inquisico/ruleset-editor-api";
import { useMutation } from "@tanstack/react-query";
import { Button } from "antd";
import { useRouter } from "next/navigation";

interface Step3Props {
  ruleset: any;
  prev: () => void;
}

export default function Step3({ ruleset, prev }: Step3Props) {
  const router = useRouter();
  const { companyID, appID } = useAppContext();
  const rulesetApi = new RulesetApi(configuration());

  const createRulesetMutation = useMutation({
    mutationFn: () => {
      if (!companyID || !appID || !ruleset) {
        throw new Error("companyID, appID, rulesetID or ruleset is undefined");
      }
      return rulesetApi.createRuleset(companyID, appID, {
        rulesetJson: ruleset,
      });
    },
    onSuccess: (data, variables) => {
      void router.push(`/applications/${appID}/rulesets/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating ruleset:", error);
    },
  });

  const handleSubmit = () => {
    void createRulesetMutation.mutateAsync();
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
