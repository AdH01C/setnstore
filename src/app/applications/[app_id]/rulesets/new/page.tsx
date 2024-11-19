"use client"

import React from "react";
import RulesetCreator from "./RulesetCreator";
import AppLayout from "@/app/components/AppLayout";
import { useParams } from "next/navigation";

export default function Page() {
  // Destructure parameters using useParams from next/navigation
  const { app_id } = useParams();
  const appId = Array.isArray(app_id) ? app_id[0] : app_id;

  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetCreator
        appId={appId} 
      />
    </AppLayout>
  );
}
