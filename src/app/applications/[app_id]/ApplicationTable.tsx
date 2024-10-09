import { TableColumnsType, Space, Table } from "antd";
import { useState, useEffect } from "react";
import rulesetDataService from "../../services/RulesetDataService";
import ApplicationDataService from "../../services/ApplicationDataService";
import { useRouter } from "next/navigation";

interface RulesetTableType extends Ruleset {
  key: string;
}

interface ApplicationTableType extends Application {
  key: string;
}

interface Application {
  appID: string;
  applicationName: string;
  dateCreated: Date;
  companyId: string;
}

interface ApplicationWithRulesets extends Application {
  rulesetCount: number;
  rulesets: Ruleset[];
}

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
}

export default function ApplicationTable({
  companyId,
  application,
}: {
  companyId: string;
  application: Application;
}) {
  const [tableData, setTableData] = useState<ApplicationWithRulesets[]>([]);
  const router = useRouter();

  const handleApplicationDelete = async (e: React.MouseEvent) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    try {
      await ApplicationDataService.deleteApplication(
        companyId,
        application.appID
      );
      console.log(
        `Application with ID ${application.appID} deleted successfully`
      );
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
      await rulesetDataService.deleteRulesetByRulesetId(
        companyId,
        application.appID,
        rulesetID
      );
      console.log(
        `Ruleset with ID ${rulesetID} in application ${application.appID} deleted successfully`
      );

      // Update the tableData to remove the deleted ruleset
      setTableData((prevTableData) => {
        return prevTableData.map((app) => {
          if (app.appID === application.appID) {
            return {
              ...app,
              rulesets: app.rulesets.filter(
                (ruleset) => ruleset.rulesetID !== rulesetID
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
    { title: "Ruleset ID", dataIndex: "rulesetID", key: "rulesetID" },
    { title: "Host", dataIndex: "host", key: "host" },
    {
      title: "Date Last Modified",
      dataIndex: "dateLastModified",
      key: "dateLastModified",
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
                  `/applications/${application.appID}/rulesets/${row.rulesetID}`
                );
              }}
            >
              View
            </a>
            <a
              onClick={() => {
                router.push(
                  `/applications/${application.appID}/rulesets/${row.rulesetID}/edit`
                );
              }}
            >
              Edit
            </a>
            <a
              onClick={(e) => {
                handleRulesetDelete(e, row.rulesetID);
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
    { title: "Application ID", dataIndex: "appID", key: "appID" },
    {
      title: "Application Name",
      dataIndex: "applicationName",
      key: "applicationName",
    },
    { title: "Date Created", dataIndex: "dateCreated", key: "dateCreated" },
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
              router.push(`/applications/${application.appID}/rulesets/new`);
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
        const rulesetsID = await rulesetDataService.getRulesetsByAppId(
          companyId,
          application.appID
        );
        const rulesetsData = await Promise.all(
          rulesetsID.data.map(async (rulesetID: string) => {
            const rulesetResponse =
              await rulesetDataService.getRulesetByRulesetId(
                companyId,
                application.appID,
                rulesetID
              );
            const hostResponse = await rulesetDataService.getHostByRulesetId(
              companyId,
              application.appID,
              rulesetID
            );
            return { ...rulesetResponse, host: hostResponse.data.host };
          })
        );

        const tableData = {
          ...application,
          rulesetCount: rulesetsData.length,
          rulesets: rulesetsData.map((ruleset) => {
            return {
              rulesetID: ruleset.id,
              host: ruleset.host,
              dateLastModified: ruleset.last_modified_datetime,
            };
          }),
        };
        setTableData([tableData]);
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
        dataSource={row.rulesets.map((app: any) => ({
          ...app,
          key: app.rulesetID,
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
        key: app.appID,
      }))}
      pagination={false}
    />
  );
}
