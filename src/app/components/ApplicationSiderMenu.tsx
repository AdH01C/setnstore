import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
type MenuItem = Required<MenuProps>["items"][number];
import { useEffect, useState } from "react";
import applicationDataService from "../services/NewAppDataService";
import RulesetDataService from "../services/NewRulesetDataService";
import { useRouter } from "next/navigation";
import { PieChartOutlined } from "@ant-design/icons";
import Link from "next/link";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import hostDataService from "../services/HostDataService";
import { useAtom } from "jotai";
import { userDetailsAtom } from "@/jotai/User";
import { currentApplicationAtom } from "@/jotai/Navigation";

export default function ApplicationSiderMenu() {
  const router = useRouter();
  const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  const [currentApplication, setCurrentApplication] = useAtom(currentApplicationAtom);
  const companyId = userDetails.companyId;
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        // Fetch applications and rulesetIDs in parallel
        const [applications, rulesetIDs] = await Promise.all([
          applicationDataService.getApplications(companyId),
          RulesetDataService.getRulesets(companyId, currentApplication.appId),
        ]);

        const createMenuItem = async (
          app: AppDetailsWithID
        ): Promise<MenuItem> => {
          if (app.id !== currentApplication.appId) {
            // Return a menu item for a different app
            return getItem(
              app.appName, // Use the app name as the label
              app.id, // Use the app ID as the key
              <PieChartOutlined />, // Use a pie chart icon
              undefined, // No children
              `/applications/${app.id}` // Link to the app
            );
          }

          if (rulesetIDs.length > 0) {
            // Fetch hosts for the rulesetIDs and create menu items
            const rulesetMenuItems = await Promise.all(
              rulesetIDs.map(async (rulesetID: string): Promise<MenuItem> => {
                const host = await hostDataService.getHostByRulesetID(
                  companyId,
                  currentApplication.appId,
                  rulesetID
                );
                return getItem(
                  rulesetID, // Use rulesetID as the label
                  rulesetID, // Use rulesetID as the key
                  <PieChartOutlined />, // Use a pie chart icon
                  undefined, // No children
                  `/applications/${currentApplication.appId}/rulesets/${rulesetID}` // Link to the ruleset
                );
              })
            );

            return getItem(
              app.appName,
              currentApplication.appId,
              <PieChartOutlined />,
              rulesetMenuItems
            );
          }

          // Default case: No ruleset, add "Add a Ruleset" menu item
          return getItem(app.appName, currentApplication.appId, <PieChartOutlined />, [
            getItem(
              "Add a Ruleset",
              "0",
              <PieChartOutlined />,
              undefined,
              `/applications/${currentApplication.appId}/rulesets/new`
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
  }, [companyId, currentApplication.appId, router]);

  return (
    <Sider width={220}>
      <Menu
        mode="inline"
        defaultSelectedKeys={[currentApplication.appId, currentApplication.rulesetId ?? ""]}
        defaultOpenKeys={[currentApplication.appId]}
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
