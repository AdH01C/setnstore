"use client";

import { AppLayout } from "@/app/components/AppLayout";

import { RulesetEditor } from "./RulesetEditor";

export default function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetEditor />
    </AppLayout>
  );
}
