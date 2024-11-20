import React from "react";
import AppDisplay from "./AppDisplay";
import AppLayout from "@/app/components/AppLayout";

export default async function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb>
      <AppDisplay />
    </AppLayout>
  );
}
