import { AppDetailsWithID, RulesetApi } from "@inquisico/ruleset-editor-api";
import { useQueries } from "@tanstack/react-query";
import { Space, Table, TableColumnsType } from "antd";
import { useRouter } from "next/navigation";

import configuration from "../constants/apiConfig";

interface ApplicationsTableType extends AppDetailsWithID {
  key: string;
  rulesetCount: number;
}

interface ApplicationsTableProps {
  companyID: string;
  applications: AppDetailsWithID[];
  handleDelete: (appID: string) => void;
}

function ApplicationsTable({ companyID, applications, handleDelete }: ApplicationsTableProps) {
  const router = useRouter();
  const rulesetApi = new RulesetApi(configuration());

  const fetchAppsWithRulesetCount = async (
    companyID: string,
    application: AppDetailsWithID,
  ): Promise<ApplicationsTableType> => {
    const rulesetRes = await rulesetApi.getRulesets(companyID, application.id);

    return {
      ...application,
      key: application.id,
      rulesetCount: rulesetRes.length,
    };
  };

  const applicationsWithRulesetCount = useQueries({
    queries: applications
      ? applications.map((application: AppDetailsWithID) => ({
          queryKey: ["rulesetsID", companyID, application.id],
          queryFn: () => fetchAppsWithRulesetCount(companyID, application),
        }))
      : [],
  }).map(query => query.data);

  const columns: TableColumnsType<ApplicationsTableType> = [
    // { title: "Application ID", dataIndex: "id", key: "id" },
    {
      title: "Application Name",
      dataIndex: "appName",
      key: "appName",
    },
    {
      title: "Date Created",
      dataIndex: "createdDatetime",
      key: "createdDatetime",
      render: (date: Date) => (date ? new Date(date).toLocaleString() : "N/A"),
    },
    {
      title: "Number of Rulesets",
      dataIndex: "rulesetCount",
      key: "rulesetCount",
    },
    {
      title: "Action",
      key: "operation",
      render: (_, record) => (
        <Space size="middle">
          <a
            onClick={() => {
              router.push(`/applications/${record.id}`);
            }}
          >
            View
          </a>
          <a
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            Delete
          </a>
        </Space>
      ),
    },
  ];

  return (
    <Table<ApplicationsTableType>
      columns={columns}
      dataSource={applicationsWithRulesetCount
        .filter(application => application !== undefined)
        .map(application => ({
          ...application,
        }))}
      pagination={false}
    />
  );
}

export { ApplicationsTable };
