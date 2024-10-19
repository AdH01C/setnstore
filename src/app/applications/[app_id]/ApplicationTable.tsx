import { TableColumnsType, Space, Table } from "antd";
import { useState, useEffect } from "react";
import RulesetDataService from "../../services/NewRulesetDataService";
import ApplicationDataService from "../../services/NewAppDataService";
import HostDataService from "../../services/HostDataService";
import { useRouter } from "next/navigation";
import {
  AppDetailsWithID,
  RulesetWithRulesetJson,
} from "@inquisico/ruleset-editor-api";

interface RulesetTableType extends RulesetWithRulesetJson {
  key: string;
  host: string;
}

interface ApplicationTableType extends AppDetailsWithID {
  key: string;
  rulesetCount: number;
  rulesets: RulesetTableType[];
}

export default function ApplicationTable({
  companyId,
  application,
}: {
  companyId: string;
  application: AppDetailsWithID;
}) {
  const [tableData, setTableData] = useState<ApplicationTableType[]>([]);
  const router = useRouter();

  const handleApplicationDelete = async (e: React.MouseEvent) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    try {
      await ApplicationDataService.deleteApplication(companyId, application.id);
      console.log(`Application with ID ${application.id} deleted successfully`);
      router.push(`/dashboard`);
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const handleRulesetDelete = async (
    e: React.MouseEvent,
    rulesetID: string
  ) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    try {
      await RulesetDataService.deleteRulesetByID(
        companyId,
        application.id,
        rulesetID
      );
      console.log(
        `Ruleset with ID ${rulesetID} in application ${application.id} deleted successfully`
      );

      // Update the tableData to remove the deleted ruleset
      setTableData((prevTableData) => {
        return prevTableData.map((app) => {
          if (app.id === application.id) {
            return {
              ...app,
              rulesets: app.rulesets.filter(
                (ruleset) => ruleset.id !== rulesetID
              ),
              rulesetCount: app.rulesetCount - 1, // Decrease the ruleset count
            };
          }
          return app;
        });
      });
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const expandColumns: TableColumnsType<RulesetTableType> = [
    { title: "Ruleset ID", dataIndex: "id", key: "id" },
    { title: "Host", dataIndex: "host", key: "host" },
    {
      title: "Date Last Modified",
      dataIndex: "lastModifiedDatetime",
      key: "lastModifiedDatetime",
      render: (date: Date) => date.toString(),
    },
    {
      title: "Action",
      key: "operation",
      render: (text, row) => {
        return (
          <Space size="middle">
            <a
              onClick={() => {
                router.push(
                  `/applications/${application.id}/rulesets/${row.id}`
                );
              }}
            >
              View
            </a>
            <a
              onClick={() => {
                router.push(
                  `/applications/${application.id}/rulesets/${row.id}/edit`
                );
              }}
            >
              Edit
            </a>
            <a
              onClick={(e) => {
                handleRulesetDelete(e, row.id);
              }}
            >
              Delete
            </a>
          </Space>
        );
      },
    },
  ];

  const columns: TableColumnsType<ApplicationTableType> = [
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
      render: () => (
        <Space size="middle">
          <a
            onClick={() => {
              router.push(`/applications/${application.id}/rulesets/new`);
            }}
          >
            Add Ruleset
          </a>
          <a onClick={handleApplicationDelete}>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const rulesetsID = await RulesetDataService.getRulesets(
          companyId,
          application.id
        );
        const rulesetsData = await Promise.all(
          rulesetsID.map(async (rulesetID: string) => {
            const rulesetResponse = await RulesetDataService.getRulesetByID(
              companyId,
              application.id,
              rulesetID
            );
            const hostResponse = await HostDataService.getHostByRulesetID(
              companyId,
              application.id,
              rulesetID
            );
            return { ...rulesetResponse, host: hostResponse };
          })
        );

        const tableData = {
          ...application,
          key: application.id,
          rulesetCount: rulesetsData.length,
          rulesets: rulesetsData.map((ruleset) => {
            return {
              key: ruleset.id,
              id: ruleset.id,
              host: ruleset.host,
              lastModifiedDatetime: ruleset.lastModifiedDatetime,
              appId: ruleset.appId,
              rulesetJson: ruleset.rulesetJson,
            };
          }),
        };
        setTableData([tableData]);
        console.log(tableData);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchApplications();
  }, [companyId, application]);

  const expandedRowRender = (row: any) => {
    return (
      <Table<RulesetTableType>
        columns={expandColumns}
        dataSource={row.rulesets.map((app: RulesetTableType) => ({
          ...app,
        }))}
        pagination={false}
      />
    );
  };
  return (
    <Table<ApplicationTableType>
      columns={columns}
      expandable={{ expandedRowRender }}
      dataSource={tableData.map((app) => ({
        ...app,
      }))}
      pagination={false}
    />
  );
}
