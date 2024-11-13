import { TableColumnsType, Space, Table } from "antd";
import { useState, useEffect } from "react";
import RulesetDataService from "../services/NewRulesetDataService";
import ApplicationDataService from "../services/NewAppDataService";
import HostDataService from "../services/HostDataService";
import { useRouter } from "next/navigation";
import {
  AppDetailsWithID,
  RulesetWithRulesetJson,
} from "@inquisico/ruleset-editor-api";

interface ApplicationsTableType extends AppDetailsWithID {
  key: string;
  rulesetCount: number;
}

export default function ApplicationsTable({
  companyId,
  applications,
  handleDelete,
}: {
  companyId: string;
  applications: AppDetailsWithID[];
  handleDelete: (appID: string) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<ApplicationsTableType[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all applications by company name
    const fetchApplications = async () => {
      try {
        const tableData = await Promise.all(
          applications.map(async (application) => {
            const rulesets = await RulesetDataService.getRulesets(
              companyId,
              application.id
            );
            return {
              ...application,
              key: application.id,
              rulesetCount: rulesets.length,
            };
          })
        );

        setTableData(tableData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [companyId, applications]);

  const columns: TableColumnsType<ApplicationsTableType> = [
    { title: "Application ID", dataIndex: "id", key: "id" },
    {
      title: "Application Name",
      dataIndex: "appName",
      key: "appName",
    },
    {
      title: "Date Created",
      dataIndex: "createdDatetime",
      key: "createdDatetime",
      render: (date: Date) => date.toString(),
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
      dataSource={tableData.map((app) => ({
        ...app,
      }))}
      pagination={false}
    />
  );
}
