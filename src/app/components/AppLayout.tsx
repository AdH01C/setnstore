"use client";

import { Layout, Typography } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { usePathname } from "next/navigation";

import { ApplicationHeader } from "./ApplicationHeader";
import { ApplicationSiderMenu } from "./ApplicationSiderMenu";
import { ApplicationBreadcrumb } from "./ApplicationBreadcrumb";

const { Title } = Typography;

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <ApplicationHeader />
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
            {hasBreadcrumb && <ApplicationBreadcrumb pathname={pathname} />}
            {children}
          </Content>
        </Layout>
      </Layout>
      <Footer className="text-center">Inquisico ©{new Date().getFullYear()} Created by Adrians Worker</Footer>
    </Layout>
  );
}

export { AppLayout };
