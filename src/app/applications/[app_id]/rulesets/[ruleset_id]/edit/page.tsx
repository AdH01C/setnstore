"use client";

import React from "react";
import RulesetEditor from "./RulesetEditor";
import AppLayout from "@/app/components/AppLayout";

export default function Page() {

  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetEditor/>
    </AppLayout>
  );
}
