"use client";

import ApplicationSiderMenu from "@/app/components/ApplicationSiderMenu";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Layout, Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";
import RulesetForm from "../../../../../components/RulesetForm";
import RulesetDataService from "@/app/services/RulesetDataService";

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetEditor() {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id: string;
  }>();
  const [ruleset, setRuleset] = useState<Ruleset>();

  const handleFormChange = (data: any) => {
    setRuleset(
      (prevRuleset) =>
        ({
          ...prevRuleset,
          ruleset: data,
        } as Ruleset)
    );
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

  const handleSubmit = async () => {
    if (ruleset?.ruleset) {
      const payload = { ruleset_json: ruleset.ruleset };

      try {
        // Update the existing ruleset
        await RulesetDataService.updateRuleset(
          payload,
          companyName,
          app_id,
          ruleset.rulesetID
        );
        router.push(`/applications/${app_id}/rulesets/${ruleset.rulesetID}`);
      } catch (error) {
        console.error("Error submitting ruleset:", error);
      }
    }
  };

  return (
    <>
      <ApplicationSiderMenu
        company={companyName}
        appID={app_id}
        rulesetID={ruleset_id}
      />
      <Layout style={{ padding: "0 0 0 20px" }}>
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
            {
              title: "Ruleset",
              onClick: () => {
                router.push(`/applications/${app_id}/rulesets/${ruleset_id}`);
              },
            },
            { title: "Edit" },
          ]}
          style={{ margin: "16px 0" }}
        />
        <Content
          style={{
            // padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          {ruleset && (
            <>
              <RulesetForm
                formData={ruleset.ruleset}
                onFormChange={handleFormChange}
              />
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Save Changes
              </button>
            </>
          )}
        </Content>
      </Layout>
    </>
  );
}