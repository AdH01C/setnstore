"use client";

import { Breadcrumb, Layout } from "antd";
import { Header, Footer, Content } from "antd/es/layout/layout";
import ApplicationSiderMenu from "./ApplicationSiderMenu";
import { useParams, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";
import { AppProvider } from "./AppContext";
import Link from "next/link";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const companyName = getCookie("username") as string;
  const { app_id, ruleset_id } = useParams<{
    app_id: string;
    ruleset_id?: string;
  }>();
  const pathname = usePathname();

  return (
    <AppProvider
      appID={app_id}
      companyName={companyName}
      rulesetID={ruleset_id}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Header className="flex items-center"></Header>
        <Layout>
          <ApplicationSiderMenu
            company={companyName}
            appID={app_id}
            rulesetID={ruleset_id}
          />
          <Layout>
            <Content
              style={{
                padding: "0 24px 24px",
                margin: 0,
                minHeight: 280,
              }}
            >
              <Breadcrumb
                itemRender={itemRender}
                style={{ padding: "16px 0" }}
                items={generateBreadCrumb(pathname).map((routeData) => ({
                  title: routeData.title,
                  href: routeData.route ? routeData.route : undefined,
                }))}
              />
              {children}
            </Content>
          </Layout>
        </Layout>
        <Footer className="text-center">
          Inquisico ©{new Date().getFullYear()} Created by Adrians Worker
        </Footer>
      </Layout>
    </AppProvider>
  );
}

function itemRender(
  route: any,
  params: any,
  routes: any,
  paths: any
): ReactNode {
  const isLast = route?.title === routes[routes.title - 1]?.path;
  return isLast || route.href === undefined ? (
    <span>{route.title}</span>
  ) : (
    <Link href={route.href}>{route.title}</Link>
  );
}

const generateBreadCrumb = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean); // Remove empty segments

  const items = [];

  // Base item for Dashboard
  items.push({
    title: "Dashboard",
    route: "/dashboard",
  });

  // Handle Applications segment
  const appIDMatch = segments.find((segment) =>
    segment.startsWith("applications")
  );
  if (appIDMatch) {
    const appID = segments[1];

    items.push({
      title: "Applications",
      route: segments.length > 2 ? `/applications/${appID}` : undefined,
    });

    // Handle Ruleset segments
    if (segments[2] === "rulesets") {
      const rulesetAction = segments[3];
      if (rulesetAction === "new") {
        items.push({ title: "New" });
      } else {
        const rulesetID = rulesetAction;
        items.push({
          title: "Ruleset",
          route:
            segments.length > 4
              ? `/applications/${appID}/rulesets/${rulesetID}`
              : undefined,
        });
      }
    } else if (segments[2] === "rulesets" && segments[3]) {
      const rulesetID = segments[3];
      items.push({
        title: "Ruleset",
        route: `/applications/${appID}/rulesets/${rulesetID}`,
      });
    }

    if (segments[4] === "edit") {
      items.push({ title: "Edit" });
    }
  }

  return items;
};
