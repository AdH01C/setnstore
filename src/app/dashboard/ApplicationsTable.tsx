import { AppDetailsWithID, RulesetApi } from "@inquisico/ruleset-editor-api";
import { useQueries } from "@tanstack/react-query";
import { Button, Space, Table, TableColumnsType } from "antd";
import Link from "next/link";

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
          <Link href={`/applications/${record.id}`}>
            <Button color="primary" variant="link" type="text">
              View
            </Button>
          </Link>
          <Button
            danger
            variant="link"
            type="text"
            onClick={() => {
              handleDelete(record.id);
            }}
          >
            Delete
          </Button>
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
          ...(application as ApplicationsTableType),
        }))}
      pagination={false}
    />
  );
}

export { ApplicationsTable };
