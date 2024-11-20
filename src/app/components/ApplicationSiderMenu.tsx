import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
type MenuItem = Required<MenuProps>["items"][number];
import { PieChartOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  AppDetailsWithID,
  ApplicationApi,
  Host,
  HostApi,
  RulesetApi,
  RulesetWithRulesetJson,
} from "@inquisico/ruleset-editor-api";
import { useAppContext } from "./AppContext";
import configuration from "../services/apiConfig";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ItemType } from "antd/es/menu/interface";

export default function ApplicationSiderMenu() {
  const { companyID, appID, rulesetID } = useAppContext();
  const applicationApi = new ApplicationApi(configuration());
  const rulesetApi = new RulesetApi(configuration());
  const hostApi = new HostApi(configuration());

  const { data: applications } = useQuery({
    queryKey: ["applications", companyID],
    queryFn: () => {
      return companyID ? applicationApi.getApplications(companyID) : undefined;
    },
    enabled: !!companyID,
  });
  interface RulesetWithHost {
    ruleset: RulesetWithRulesetJson;
    host: Host;
  }

  const { data: rulesetsID } = useQuery({
    queryKey: ["rulesetsID", companyID, appID],
    queryFn: () => {
      return companyID ? rulesetApi.getRulesets(companyID, appID) : undefined;
    },
    enabled: !!companyID && !!appID,
  });

  const fetchRulesetAndHost = async (
    companyID: string,
    appID: string,
    rulesetID: string
  ): Promise<RulesetWithHost> => {
    const [rulesetResponse, hostResponse] = await Promise.all([
      rulesetApi.getRulesetById(companyID, appID, rulesetID),
      hostApi.getHostByRulesetId(companyID, appID, rulesetID),
    ]);

    return {
      ruleset: { ...rulesetResponse },
      host: { ...hostResponse },
    };
  };

  const rulesetWithHostItem: ItemType[] = useQueries({
    queries:
      companyID && rulesetsID
        ? rulesetsID.map((rulesetID: string) => ({
            queryKey: ["rulesetsAndHost", companyID, appID, rulesetID],
            queryFn: () => fetchRulesetAndHost(companyID, appID, rulesetID),
          }))
        : [],
  })
    .map((query) => {
      const data = query.data;
      if (!data) {
        return;
      }
      return getItem(
        data.host.host,
        data.ruleset.id,
        <PieChartOutlined />,
        undefined,
        `/applications/${appID}/rulesets/${data.ruleset.id}`
      );
    })
    .filter((item): item is ItemType => item !== undefined);

  const createMenuItem = (app: AppDetailsWithID): ItemType => {
    if (app.id !== appID) {
      // Return a menu item for a different app
      return getItem(
        app.appName, // Use the app name as the label
        app.id, // Use the app ID as the key
        <PieChartOutlined />, // Use a pie chart icon
        undefined, // No children
        `/applications/${app.id}` // Link to the app
      );
    }

    if (rulesetsID && rulesetsID.length > 0) {
      return getItem(
        app.appName,
        appID,
        <PieChartOutlined />,
        rulesetWithHostItem
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

  return (
    <Sider width={220}>
      {applications && (
        <Menu
          mode="inline"
          defaultSelectedKeys={[appID, rulesetID ?? ""]}
          defaultOpenKeys={[appID]}
          style={{ height: "100%", borderRight: 0 }}
          items={applications.map(createMenuItem)}
        />
      )}
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
