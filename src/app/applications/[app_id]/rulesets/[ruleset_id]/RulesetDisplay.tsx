"use client";

import ApplicationSiderMenu from "@/app/components/ApplicationSiderMenu";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Layout, Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetDisplay() {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id: string;
  }>();
  const [ruleset, setRuleset] = useState<Ruleset>();

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
        `Ruleset with ID ${rulesetID} in application ${app_id} deleted successfully`
      );
    } catch (error) {
      console.error("Error deleting application:", error);
    }
  };

  useEffect(() => {
    const fetchRuleset = async () => {
      const response = await rulesetDataService.getRulesetByRulesetId(
        companyName,
        app_id,
        ruleset_id
      );

      const ruleset: Ruleset = {
        rulesetID: response.id,
        host: response.app_id,
        dateLastModified: response.last_modified_datetime,
        ruleset: response.ruleset_json,
      };

      setRuleset(ruleset);
    };

    fetchRuleset();
  }, [companyName, app_id, ruleset_id]);

  return (
    <>
      <ApplicationSiderMenu
        company={companyName}
        appID={app_id}
        rulesetID={ruleset_id}
      />
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb
          items={[
            {
              title: "Dashboard",
              onClick: () => {
                router.push(`/dashboard`);
              },
            },
            {
              title: "Application",
              onClick: () => {
                router.push(`/applications/${app_id}`);
              },
            },
            { title: "Ruleset" },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {ruleset && (
            <div className="flex items-start space-x-4">
              <pre className="flex-grow">
                {JSON.stringify(ruleset.ruleset, null, 2)}
              </pre>
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  router.push(
                    `/applications/${app_id}/rulesets/${ruleset_id}/edit`
                  );
                }}
              >
                Edit ruleset
              </button>
              <button
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                onClick={(e) => {
                  handleRulesetDelete(e, ruleset.rulesetID);
                }}
              >
                Delete ruleset
              </button>
            </div>
          )}
        </Content>
      </Layout>
    </>
  );
}
