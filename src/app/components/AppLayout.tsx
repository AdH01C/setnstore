"use client";

import { UserOutlined } from "@ant-design/icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Breadcrumb, Dropdown, Layout, MenuProps, Typography } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";

import { ApplicationSiderMenu } from "./ApplicationSiderMenu";
import { AppProvider } from "../components/AppContext";
import { addTrailingSlash } from "../utils/common";
const { Title } = Typography;

function itemRender(route: ItemType, routes: ItemType[]): ReactNode {
  const isLast = route?.title === routes[routes.length - 1]?.path;
  return isLast || route.href === undefined ? <span>{route.title}</span> : <Link href={route.href}>{route.title}</Link>;
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
  const appIDMatch = segments.find(segment => segment.startsWith("applications"));
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
          href: segments.length > 4 ? `/applications/${appID}/rulesets/${rulesetID}` : undefined,
        });
      }
    }

    if (segments[4] === "edit") {
      items.push({ title: "Edit" });
    }
  }

  return items;
};

interface AppLayoutProps {
  children: React.ReactNode;
  contentPadding?: string;
  title?: string;
  subtitle?: string;
  hasSider?: boolean;
  hasBreadcrumb?: boolean;
}

function AppLayout({
  children,
  contentPadding = "0 24px 24px",
  title,
  subtitle,
  hasSider = false,
  hasBreadcrumb = false,
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const items: MenuProps["items"] = [
    //   {
    //     key: "1",
    //     label: <a>Profile</a>,
    //   },
    //   {
    //     key: "2",
    //     label: <a>Permissions</a>,
    //     disabled: true,
    //   },
    //   {
    //     key: "3",
    //     label: <a>Settings</a>,
    //     disabled: true,
    //   },
    {
      key: "1",
      danger: true,
      label: "Log out",
      onClick: () => {
        void router.push(addTrailingSlash(process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? "") + "logout_unified");
      },
    },
  ];
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider forceSignin={true}>
        <Layout style={{ minHeight: "100vh" }}>
          <Header className="flex items-center justify-between">
            <Link href="/dashboard" className="text-2xl font-bold text-white">
              Inquisico
            </Link>

            <Dropdown menu={{ items }}>
              <a onClick={e => e.preventDefault()}>
                <UserOutlined className="text-2xl hover:cursor-pointer" />
              </a>
            </Dropdown>
          </Header>
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
                {title && <Title level={2}>{title}</Title>}
                {subtitle && <Typography.Text>{subtitle}</Typography.Text>}
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
          <Footer className="text-center">Inquisico ©{new Date().getFullYear()} Created by Adrians Worker</Footer>
        </Layout>
      </AppProvider>
    </QueryClientProvider>
  );
}

export { AppLayout };
