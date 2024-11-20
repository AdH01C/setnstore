import { Host, HostApi, RulesetApi, RulesetWithRulesetJson } from "@inquisico/ruleset-editor-api";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { Space, Table, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";

import configuration from "@/app/constants/apiConfig";

interface RulesetTableType extends RulesetWithRulesetJson {
  key: string;
  host: string;
}

interface RulesetTableProps {
  companyID: string;
  appID: string;
}

export function RulesetTable({ companyID, appID }: RulesetTableProps) {
  const router = useRouter();
  const hostApi = new HostApi(configuration());
  const rulesetApi = new RulesetApi(configuration());

  const { data: rulesetsID, refetch: refetchRulesetsID } = useQuery({
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
  })
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
    .filter((ruleset): ruleset is RulesetTableType => ruleset !== undefined);

  const deleteRulesetMutation = useMutation({
    mutationFn: (rulesetID: string) => rulesetApi.deleteRulesetById(companyID, appID, rulesetID),
    onSuccess: () => {
      void refetchRulesetsID();
    },
    // onError: error => {
    //   console.error("Error deleting ruleset:", error);
    // },
  });

  const handleRulesetDelete = (rulesetID: string) => {
    void deleteRulesetMutation.mutateAsync(rulesetID);
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
      render: (text, row) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                router.push(`/applications/${appID}/rulesets/${row.id}`);
              }}
            >
              View
            </a>
            <a
              onClick={() => {
                router.push(`/applications/${appID}/rulesets/${row.id}/edit`);
              }}
            >
              Edit
            </a>
            <a
              onClick={() => {
                handleRulesetDelete(row.id);
              }}
            >
              Delete
            </a>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<RulesetTableType>
      columns={columns}
      dataSource={rulesetWithHost
        .filter(ruleset => ruleset !== undefined)
        .map(ruleset => ({
          ...ruleset,
        }))}
      pagination={false}
    />
  );
}
