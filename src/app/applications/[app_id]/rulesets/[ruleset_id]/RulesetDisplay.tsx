"use client";

import { useRouter } from "next/navigation";
import RulesetDetail from "@/app/components/RulesetDetail";
import { RulesetApi } from "@inquisico/ruleset-editor-api";
import { Modal } from "antd";
import { useAppContext } from "@/app/components/AppContext";
import configuration from "@/app/services/apiConfig";
import { useMutation, useQuery } from "@tanstack/react-query";

export default function RulesetDisplay() {
  const router = useRouter();
  const { companyID, appID, rulesetID } = useAppContext();

  const rulesetApi = new RulesetApi(configuration());

  const handleRulesetDelete = async (companyID: string, rulesetID: string) => {
    Modal.confirm({
      title: "Delete Ruleset",
      content: "Are you sure you want to delete this ruleset?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        handleDeleteRuleset();
      },
    });
  };

  const { data: ruleset } = useQuery({
    queryKey: ["ruleset", companyID, appID, rulesetID],
    queryFn: () => {
      return companyID && rulesetID
        ? rulesetApi.getRulesetById(companyID, appID, rulesetID)
        : null;
    },
    enabled: !!companyID && !!appID && !!rulesetID,
  });

  const deleteRulesetMutation = useMutation({
    mutationFn: () => {
      if (!companyID || !appID || !rulesetID) {
        throw new Error("companyID, appID, or rulesetID is undefined");
      }
      return rulesetApi.deleteRulesetById(companyID, appID, rulesetID);
    },
    onSuccess: (data, variables) => {
      void router.push(`/applications/${appID}`);
    },
    onError: (error) => {
      console.error("Error deleting ruleset:", error);
    },
  });

  const handleDeleteRuleset = () => {
    void deleteRulesetMutation.mutateAsync();
  };

  return (
    <>
      {ruleset && (
        <RulesetDetail
          ruleset={ruleset.rulesetJson}
          isEditable
          isDeletable
          onEdit={() => {
            router.push(`/applications/${appID}/rulesets/${rulesetID}/edit`);
          }}
          onDelete={() => {
            if (companyID && rulesetID) {
              handleRulesetDelete(companyID, rulesetID);
            }
          }}
        />
      )}
    </>
  );
}
