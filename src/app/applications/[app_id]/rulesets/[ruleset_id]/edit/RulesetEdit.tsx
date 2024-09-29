"use client";

import ApplicationSiderMenu from "@/app/components/ApplicationSiderMenu";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { Layout, Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import rulesetDataService from "@/app/services/RulesetDataService";
import RulesetForm from "./RulesetForm";

interface Ruleset {
  rulesetID: string;
  host: string;
  dateLastModified: Date;
  ruleset: any;
}

export default function RulesetEdit() {
  const router = useRouter();
  const companyName = getCookie("username") as string;
  const params = useParams<{ app_id: string; ruleset_id: string }>();
  const [ruleset, setRuleset] = useState<Ruleset>();

  useEffect(() => {
    const fetchRuleset = async () => {
      const response = await rulesetDataService.getRulesetByRulesetId(
        companyName,
        params.app_id,
        params.ruleset_id
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
  }, [companyName]);

  return (
    <>
      <ApplicationSiderMenu
        company={companyName}
        appID={params.app_id}
        rulesetID={params.ruleset_id}
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
                router.push(`/applications/${params.app_id}`);
              },
            },
            {
              title: "Ruleset",
              onClick: () => {
                router.push(
                  `/applications/${params.app_id}/rulesets/${params.ruleset_id}`
                );
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
            <RulesetForm
              company={companyName}
              appID={params.app_id}
              ruleset={ruleset}
            />
          )}
        </Content>
      </Layout>
    </>
  );
}
