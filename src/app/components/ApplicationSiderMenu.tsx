import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
type MenuItem = Required<MenuProps>["items"][number];
import { useEffect, useState } from "react";
import applicationDataService from "../services/ApplicationDataService";
import RulesetDataService from "../services/RulesetDataService";
import { useRouter } from "next/navigation";
import { PieChartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAppContext } from "./AppContext";

export default function ApplicationSiderMenu() {
  const router = useRouter();
  const { appID, companyId, rulesetID } = useAppContext();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const applications =
          await applicationDataService.getAllApplicationsByCompanyId(companyId);
        const rulesetsID = await RulesetDataService.getRulesetsByAppId(
          companyId,
          appID
        );

        const menuItems: MenuItem[] = applications.data.map((app: any) => {
          if (app.id === appID) {
            return getItem(
              app.app_name,
              appID,
              <PieChartOutlined />,
              rulesetsID.data.length > 0
                ? rulesetsID.data.map((rulesetID: string) =>
                    getItem(
                      rulesetID,
                      rulesetID,
                      <PieChartOutlined />,
                      undefined,
                      `/applications/${appID}/rulesets/${rulesetID}`
                    )
                  )
                : [
                    getItem(
                      "Add a Ruleset",
                      "0",
                      <PieChartOutlined />,
                      undefined,
                      `/applications/${appID}/rulesets/new`
                    ),
                  ]
            );
          }
          return getItem(
            app.app_name,
            app.id,
            <PieChartOutlined />,
            undefined,
            `/applications/${app.id}`
          );
        });

        setItems(menuItems);
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
      }
    };

    fetchMenuItems();
  }, [companyId, appID, router]);

  return (
    <Sider width={220}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[appID, rulesetID ?? ""]}
        defaultOpenKeys={[appID]}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  url?: string
): MenuItem {
  return {
    label: url ? <Link href={url}>{label}</Link> : <span>{label}</span>,
    key,
    icon,
    children,
  } as MenuItem;
}
