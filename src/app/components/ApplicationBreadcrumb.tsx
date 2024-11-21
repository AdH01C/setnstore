import { Breadcrumb } from "antd";
import Link from "next/link";
import { ReactNode } from "react";

import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

interface ApplicationBreadcrumbProps {
  pathname: string;
}

function ApplicationBreadcrumb({ pathname }: ApplicationBreadcrumbProps) {
  function itemRender(route: ItemType, routes: ItemType[]): ReactNode {
    const isLast = route?.title === routes[routes.length - 1]?.path;
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

  return <Breadcrumb itemRender={itemRender} style={{ padding: "16px 0" }} items={generateBreadCrumb(pathname)} />;
}

export { ApplicationBreadcrumb };
