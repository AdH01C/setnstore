import { Host, HostApi, RulesetApi, RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Button, Modal, Space, Table, TableColumnsType, notification } from "antd";
import Link from "next/link";

import configuration from "@/app/constants/apiConfig";
import { ErrorMessages, InfoMessages } from "@/app/constants/messages/messages";
import { Loading } from "@/app/components/Loading";
import { errorResponseHandler } from "@/app/utils/responseHandler";

interface RulesetTableType extends RulesetWithRulesetJson {
  key: string;
  host: string;
}

interface RulesetTableProps {
  companyID: string;
  appID: string;
}

export function RulesetTable({ companyID, appID }: RulesetTableProps) {
  const hostApi = new HostApi(configuration());
  const rulesetApi = new RulesetApi(configuration());

  const {
    data: rulesetsID,
    isLoading: rulesetsIsLoading,
    refetch: refetchRulesetsID,
  } = useQuery({
    queryKey: ["rulesetsID", companyID, appID],
    queryFn: () => {
      return rulesetApi.getRulesets(companyID, appID);
    },
    enabled: !!companyID && !!appID,
  });

  interface RulesetWithHost {
    ruleset: RulesetWithRulesetJson;
    host: Host;
  }

  const fetchRulesetAndHost = async (companyID: string, appID: string, rulesetID: string): Promise<RulesetWithHost> => {
    const [rulesetResponse, hostResponse] = await Promise.all([
      rulesetApi.getRulesetById(companyID, appID, rulesetID),
      hostApi.getHostByRulesetId(companyID, appID, rulesetID),
    ]);

    return {
      ruleset: { ...rulesetResponse },
      host: { ...hostResponse },
    };
  };

  const rulesetWithHost = useQueries({
    queries: rulesetsID
      ? rulesetsID.map((rulesetID: string) => ({
          queryKey: ["rulesetsAndHost", companyID, appID, rulesetID],
          queryFn: () => fetchRulesetAndHost(companyID, appID, rulesetID),
        }))
      : [],
    combine: results => {
      return {
        data: results
          .map(query => {
            const data = query.data;
            if (!data || !data.ruleset || !data.host) {
              return;
            }
            return {
              key: data.ruleset.id,
              id: data.ruleset.id,
              host: data.host.host,
              lastModifiedDatetime: data.ruleset.lastModifiedDatetime,
              appId: data.ruleset.appId,
              rulesetJson: data.ruleset.rulesetJson,
            };
          })
          .filter((ruleset): ruleset is RulesetTableType => ruleset !== undefined),
        isRulesetWithHostLoading: results.some(result => result.isLoading),
      };
    },
  });

  const deleteRulesetMutation = useMutation({
    mutationFn: (rulesetID: string) => rulesetApi.deleteRulesetById(companyID, appID, rulesetID),
    onSuccess: () => {
      notification.success({
        message: "Ruleset deleted",
        description: InfoMessages.DELETE_RULESET_SUCCESS,
        placement: "bottomRight",
      });
      void refetchRulesetsID();
    },
    onError: error => {
      errorResponseHandler(error, {
        detail: ErrorMessages.DELETE_RULESET_ERROR,
      });
    },
  });

  const handleRulesetDelete = (rulesetID: string) => {
    Modal.confirm({
      title: "Delete Ruleset",
      content: "Are you sure you want to delete this ruleset?",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      async onOk() {
        void deleteRulesetMutation.mutate(rulesetID);
      },
    });
  };

  const columns: TableColumnsType<RulesetTableType> = [
    // { title: "Ruleset ID", dataIndex: "id", key: "id" },
    {
      title: "Host",
      dataIndex: "host",
      key: "host",
      render: (host: string) => host || "N/A",
    },
    {
      title: "Date Last Modified",
      dataIndex: "lastModifiedDatetime",
      key: "lastModifiedDatetime",
      render: (date: Date) => (date ? new Date(date).toLocaleString() : "N/A"),
    },
    {
      title: "Action",
      key: "operation",
      render: row => {
        return (
          <Space size="middle">
            <Link href={`/applications/${appID}/rulesets/${row.id}`}>
              <Button color="primary" variant="link" type="text">
                View
              </Button>
            </Link>

            <Link href={`/applications/${appID}/rulesets/${row.id}/edit`}>
              <Button color="primary" variant="link" type="text">
                Edit
              </Button>
            </Link>
            <Button
              danger
              variant="link"
              type="text"
              onClick={() => {
                handleRulesetDelete(row.id);
              }}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {rulesetsIsLoading || rulesetWithHost.isRulesetWithHostLoading ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-y-5">
          <Loading />
        </div>
      ) : (
        <Table<RulesetTableType>
          columns={columns}
          dataSource={rulesetWithHost.data
            .filter(ruleset => ruleset !== undefined)
            .map(ruleset => ({
              ...ruleset,
            }))}
          pagination={false}
        />
      )}
    </>
  );
}
