import React from "react";
import RulesetCreator from "./RulesetCreator";
import AppLayout from "@/app/components/AppLayout";

export default function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetCreator />
    </AppLayout>
  );
}
