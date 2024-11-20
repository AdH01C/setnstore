import { PieChartOutlined } from "@ant-design/icons";
import {
  AppDetailsWithID,
  ApplicationApi,
  Host,
  HostApi,
  RulesetApi,
  RulesetWithRulesetJson,
} from "@inquisico/ruleset-editor-api";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import Link from "next/link";

import { useAppContext } from "./AppContext";
import configuration from "../constants/apiConfig";

type MenuItem = Required<MenuProps>["items"][number];

function ApplicationSiderMenu() {
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

  const fetchRulesetAndHost = async (companyID: string, appID: string, rulesetID: string): Promise<RulesetWithHost> => {
    const [rulesetResponse, hostResponse] = await Promise.all([
      rulesetApi.getRulesetById(companyID, appID, rulesetID),
      hostApi.getHostByRulesetId(companyID, appID, rulesetID),
    ]);

    return {
      ruleset: { ...rulesetResponse },
      host: { ...hostResponse },
    };
  };

  const rulesetWithHostItem = useQueries({
    queries:
      companyID && rulesetsID
        ? rulesetsID.map((rulesetID: string) => ({
            queryKey: ["rulesetsAndHost", companyID, appID, rulesetID],
            queryFn: () => fetchRulesetAndHost(companyID, appID, rulesetID),
          }))
        : [],
  })
    .map(query => {
      const data = query.data;
      if (!data) {
        return;
      }
      return getItem(
        data.host.host,
        data.ruleset.id,
        <PieChartOutlined />,
        undefined,
        `/applications/${appID}/rulesets/${data.ruleset.id}`,
      );
    })
    .filter((item): item is MenuItem => item !== undefined);

  const createMenuItem = (app: AppDetailsWithID) => {
    if (app.id !== appID) {
      // Return a menu item for a different app
      return getItem(app.appName, app.id, <PieChartOutlined />, undefined, `/applications/${app.id}`);
    }

    if (rulesetsID && rulesetsID.length > 0) {
      return getItem(app.appName, appID, <PieChartOutlined />, rulesetWithHostItem);
    }

    // Default case: No ruleset, add "Add a Ruleset" menu item
    return getItem(app.appName, appID, <PieChartOutlined />, [
      getItem("Add a Ruleset", "0", <PieChartOutlined />, undefined, `/applications/${appID}/rulesets/new`),
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
  url?: string,
): MenuItem {
  return {
    label: url ? <Link href={url}>{label}</Link> : <span>{label}</span>,
    key,
    icon,
    children,
  } as MenuItem;
}

export { ApplicationSiderMenu };
