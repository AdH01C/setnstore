import { TableColumnsType, Space, Table } from "antd";
import { useState, useEffect } from "react";
import RulesetDataService from "../../services/NewRulesetDataService";
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

export default function ApplicationTable({
  companyId,
  application,
}: {
  companyId: string;
  application: AppDetailsWithID;
}) {
  const [tableData, setTableData] = useState<RulesetTableType[]>([]);
  const router = useRouter();

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
      setTableData((prevTableData) =>
        prevTableData
          ? prevTableData.filter((ruleset) => ruleset.id !== rulesetID)
          : []
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  const columns: TableColumnsType<RulesetTableType> = [
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
            console.log({ ...rulesetResponse, host: hostResponse });
            return { ...rulesetResponse, host: hostResponse };
          })
        );

        const tableData = rulesetsData.map((ruleset) => {
          return {
            key: ruleset.id,
            id: ruleset.id,
            host: ruleset.host,
            lastModifiedDatetime: ruleset.lastModifiedDatetime,
            appId: ruleset.appId,
            rulesetJson: ruleset.rulesetJson,
          };
        });
        setTableData(tableData);
        console.log(tableData);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchApplications();
  }, [companyId, application]);

  return (
    <Table<RulesetTableType>
      columns={columns}
      dataSource={tableData.map((ruleset) => ({
        ...ruleset,
      }))}
      pagination={false}
    />
  );
}
