import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
type MenuItem = Required<MenuProps>["items"][number];
import { useEffect, useState } from "react";
import applicationDataService from "../services/NewAppDataService";
import RulesetDataService from "../services/NewRulesetDataService";
import { useRouter } from "next/navigation";
import { PieChartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAppContext } from "./AppContext";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import hostDataService from "../services/HostDataService";

export default function ApplicationSiderMenu() {
  const router = useRouter();
  const { appID, companyId, rulesetID } = useAppContext();
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch applications and rulesetIDs in parallel
        const [applications, rulesetIDs] = await Promise.all([
          applicationDataService.getApplications(companyId),
          RulesetDataService.getRulesets(companyId, appID),
        ]);

        const createMenuItem = async (
          app: AppDetailsWithID
        ): Promise<MenuItem> => {
          if (app.id !== appID) {
            // Return a menu item for a different app
            return getItem(
              app.appName,
              app.id,
              <PieChartOutlined />,
              undefined,
              `/applications/${app.id}`
            );
          }

          if (rulesetIDs.length > 0) {
            // Fetch hosts for the rulesetIDs and create menu items
            const rulesetMenuItems = await Promise.all(
              rulesetIDs.map(async (rulesetID: string): Promise<MenuItem> => {
                const host = await hostDataService.getHostByRulesetID(
                  companyId,
                  appID,
                  rulesetID
                );
                return getItem(
                  host,
                  rulesetID,
                  <PieChartOutlined />,
                  undefined,
                  `/applications/${appID}/rulesets/${rulesetID}`
                );
              })
            );

            return getItem(
              app.appName,
              appID,
              <PieChartOutlined />,
              rulesetMenuItems
            );
          }

          // Default case: No ruleset, add "Add a Ruleset" menu item
          return getItem(app.appName, appID, <PieChartOutlined />, [
            getItem(
              "Add a Ruleset",
              "0",
              <PieChartOutlined />,
              undefined,
              `/applications/${appID}/rulesets/new`
            ),
          ]);
        };

        // Create menu items for all applications
        const menuItems: MenuItem[] = await Promise.all(
          applications.map(createMenuItem)
        );

        // Set the menu items in state
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
