"use client";

import { Breadcrumb, Layout } from "antd";
import { Header, Footer, Content } from "antd/es/layout/layout";
import ApplicationSiderMenu from "./ApplicationSiderMenu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { AppProvider } from "../components/AppContext";
import userDataService from "../services/UserDataService";
import companyDataService from "../services/CompanyDataService";
import { getSession } from "next-auth/react";
import { redirect } from "next/navigation";

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

  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const checkAndSetUser = async () => {
      const session = await getSession();
      try {
        if (session?.user?.email) {
          const email = session.user.email;
          const googleId = session.user.sub;

          // Try fetching the existing user
          let existingUser;
          try {
            existingUser = await userDataService.getUserByUsername(email);
          } catch (error: any) {
            // Check if the error is a 404 (user not found)
            if (error.response && error.response.status === 404) {
              // No existing user, proceed to create one
              const newUser = {
                username: email,
                email: email,
                full_name: session.user.name,
                google_id: googleId,
                password: "password",
              };
              const userResponse = await userDataService.createUser(newUser);
              console.log(userResponse);

              // Create a company for the new user
              const companyData = {
                company_name: session.user.name + "'s company",
              };
              const companyResponse = await companyDataService.createCompany(
                userResponse.data.id,
                companyData
              );
              console.log(companyResponse);

              // Store company details in state
              setCompanyId(companyResponse.data.id);
              setCompanyName(companyResponse.data.company_name);
            } else {
              // If the error is not 404, rethrow it to be caught by the outer catch
              throw error;
            }
          }

          // If user exists, get company information
          if (existingUser?.data) {
            const companyResponse = await userDataService.getCompanyByUserId(
              existingUser.data.id
            );
            setCompanyId(companyResponse.data.id);
            setCompanyName(companyResponse.data.company_name);
          }
        } else {
          console.error("No session or email found. Redirect to login.");
          redirect("/");
        }
      } catch (error) {
        console.error("Error during user check/creation:", error);
        throw error;
      }
    };

    checkAndSetUser();
  }, [companyId, companyName]);

  return (
    <AppProvider companyId={companyId} companyName={companyName}>
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
