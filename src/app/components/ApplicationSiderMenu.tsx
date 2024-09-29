import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
type MenuItem = Required<MenuProps>["items"][number];
import { useEffect, useState } from "react";
import applicationDataService from "../services/ApplicationDataService";
import RulesetDataService from "../services/RulesetDataService";
import { useRouter } from "next/navigation";
import { PieChartOutlined } from "@ant-design/icons";

export default function ApplicationSiderMenu({
  company,
  appID,
}: {
  company: string;
  appID: string;
}) {
  const router = useRouter();

  const [items, setItems] = useState<MenuItem[]>([]);
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    onClick?: () => void
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children,
      onClick,
    } as MenuItem;
  }
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const applications =
          await applicationDataService.getAllApplicationsByCompanyName(company);
        const rulesetsID = await RulesetDataService.getRulesetsByAppId(
          company,
          appID
        );

        const menuItems: MenuItem[] = applications.data.map((app) => {
          if (app.id === appID) {
            return getItem(
              app.app_name,
              appID,
              <PieChartOutlined />,
              rulesetsID.data.length > 0
                ? rulesetsID.data.map((rulesetID) =>
                    getItem(
                      rulesetID,
                      rulesetID,
                      <PieChartOutlined />,
                      undefined,
                      () => {
                        router.push(
                          `/applications/${appID}/rulesets/${rulesetID}`
                        );
                      }
                    )
                  )
                : [
                    getItem(
                      "Add a Ruleset",
                      "0",
                      <PieChartOutlined />,
                      undefined,
                      () => {
                        router.push(`/applications/${appID}/rulesets/new`);
                      }
                    ),
                  ]
            );
          }
          return getItem(
            app.app_name,
            app.id,
            <PieChartOutlined />,
            undefined,
            () => {
              router.push(`/applications/${app.id}`);
            }
          );
        });

        setItems(menuItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchMenuItems();
  }, [company]);
  return (
    <Sider width={200}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[appID]}
        defaultOpenKeys={[appID]}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
}
