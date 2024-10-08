"use client";

import { Breadcrumb, Layout } from "antd";
import { Header, Footer, Content } from "antd/es/layout/layout";
import ApplicationSiderMenu from "./ApplicationSiderMenu";
import { usePathname } from "next/navigation";
import { AppProvider } from "./AppContext";
import Link from "next/link";
import { ReactNode } from "react";

export default function AppLayout({
  children,
  contentPadding = "0 24px 24px",
  hasSider = false,
  hasBreadcrumb = false,
}: {
  children: React.ReactNode;
  contentPadding?: string;
  hasSider?: boolean;
  hasBreadcrumb?: boolean;
}) {
  const pathname = usePathname();

  return (
    <AppProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Header className="flex items-center"></Header>
        <Layout hasSider>
          {hasSider && <ApplicationSiderMenu />}
          <Layout>
            <Content
              style={{
                padding: contentPadding,
                margin: 0,
                minHeight: 280,
              }}
            >
              {hasBreadcrumb && (
                <Breadcrumb
                  itemRender={itemRender}
                  style={{ padding: "16px 0" }}
                  items={generateBreadCrumb(pathname)}
                />
              )}
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
    href: "/dashboard",
  });

  // Handle Applications segment
  const appIDMatch = segments.find((segment) =>
    segment.startsWith("applications")
  );
  if (appIDMatch) {
    const appID = segments[1];

    items.push({
      title: "Applications",
      href: segments.length > 2 ? `/applications/${appID}` : undefined,
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
          href:
            segments.length > 4
              ? `/applications/${appID}/rulesets/${rulesetID}`
              : undefined,
        });
      }
    } else if (segments[2] === "rulesets" && segments[3]) {
      const rulesetID = segments[3];
      items.push({
        title: "Ruleset",
        href: `/applications/${appID}/rulesets/${rulesetID}`,
      });
    }

    if (segments[4] === "edit") {
      items.push({ title: "Edit" });
    }
  }

  return items;
};