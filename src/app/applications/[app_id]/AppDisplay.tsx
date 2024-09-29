"use client";

import { Menu, Layout, Breadcrumb } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";
import type { MenuProps } from "antd";
import React, { useEffect, useState } from "react";
import MenuItem from "antd/es/menu/MenuItem";
import applicationDataService from "../../services/ApplicationDataService";
import RulesetDataService from "../../services/RulesetDataService";
import { useParams, useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function AppDisplay() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [ruleset, setRuleset] = useState<Ruleset>();
  const params = useParams();
  const companyName = getCookie("username") as string;

  const generateMenuItems = (projects: Project[]): MenuItem[] => {
    return projects.map((project, index) => ({
      key: project.appId,
      label: project.name,

      children: [
        ...project.rulesets.map((rulesetid, childIndex) => ({
          onClick: async () => {
            router.push(`/applications/${project.appId}/rulesets/${rulesetid}`);
          },
          key: `${project.appId}-${rulesetid}`,
          label: rulesetid,
          meta: { appId: project.appId },
        })),
      ],
    }));
  };

  useEffect(() => {
    // Fetch rulesets and populate the sidebar
    const fetchProjects = async () => {
      try {
        const response =
          await applicationDataService.getAllApplicationsByCompanyName(
            companyName
          );

        const projects: Project[] = await Promise.all(
          response.data.map(async (application: any) => {
            const rulesetResponse = await RulesetDataService.getRulesetsByAppId(
              companyName,
              params.app_id as string
            );
            return {
              name: application.app_name,
              rulesets: rulesetResponse.data,
              appId: application.id,
            };
          })
        );
        const generatedItems = generateMenuItems(projects);
        setItems(generatedItems);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjects();

    // Allow time for render
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
        />
      </Sider>
      <Layout style={{ padding: "0 24px 24px" }}>
        <Breadcrumb
          items={[{ title: "Home" }, { title: "List" }, { title: "App" }]}
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
            <div>
              <pre>{JSON.stringify(ruleset.ruleset_json, null, 2)}</pre>
              <button
                onClick={() => {
                  router.push(
                    `/applications/${ruleset.app_id}/rulesets/${ruleset.id}`
                  );
                }}
              >
                Click to View
              </button>
              <button
                onClick={() => {
                  router.push(
                    `/applications/${ruleset.app_id}/rulesets/${ruleset.id}/edit`
                  );
                }}
              >
                Click to Edit
              </button>
            </div>
          )}
        </Content>
      </Layout>
    </>
  );
}
// Define interface for the fetched project data
interface Project {
  name: string;
  appId: string;
  rulesets: string[];
}

interface Ruleset {
  id: string;
  app_id: string;
  last_modified_datetime: Date;
  ruleset_json: any;
}

// Antd Sidebar MenuItem type
type MenuItem = Required<MenuProps>["items"][number];
