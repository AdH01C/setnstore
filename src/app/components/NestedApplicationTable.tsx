import { TableColumnsType, Space, Table } from "antd";
import { useState, useEffect } from "react";
import applicationDataService from "../services/ApplicationDataService";
import rulesetDataService from "../services/RulesetDataService";
import ApplicationDataService from "../services/ApplicationDataService";
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
  companyName: string;
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

export default function NestedApplicationTable({
  company,
  application,
}: {
  company: string;
  application: Application;
}) {
  const [tableData, setTableData] = useState<ApplicationWithRulesets[]>([]);
  const router = useRouter();

  const handleApplicationDelete = async (e: React.MouseEvent) => {
    // Prevent the card click event from firing when delete is clicked
    e.stopPropagation();

    try {
      await ApplicationDataService.deleteApplication(
        company,
        application.appID
      );
      console.log(
        `Application with ID ${application.appID} deleted successfully`
      );
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
      // await rulesetDataService.deleteRulesetByRulesetId(
      //   company,
      //   appID,
      //   rulesetID
      // );
      console.log(
        `Ruleset with ID ${rulesetID} in application ${application.appID} deleted successfully`
      );
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
          company,
          application.appID
        );
        const rulesetsData = await Promise.all(
          rulesetsID.data.map(async (rulesetID: string) => {
            const rulesetResponse =
              await rulesetDataService.getRulesetByRulesetId(
                company,
                application.appID,
                rulesetID
              );
            return rulesetResponse;
          })
        );

        const tableData = {
          ...application,
          rulesetCount: rulesetsData.length,
          rulesets: rulesetsData.map((ruleset) => {
            return {
              rulesetID: ruleset.id,
              host: "to implement getHostByRulesetID eg. www.host.com",
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
  }, [company, application]);

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
