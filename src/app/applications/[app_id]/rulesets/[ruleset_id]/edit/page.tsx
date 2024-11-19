"use client";

import React from "react";
import RulesetEditor from "./RulesetEditor";
import AppLayout from "@/app/components/AppLayout";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { currentApplicationAtom } from "@/jotai/Navigation";

export default function Page() {
  // Destructure parameters using useParams from next/navigation
  const { app_id, ruleset_id } = useParams();
  const appId = Array.isArray(app_id) ? app_id[0] : app_id;
  const rulesetId = Array.isArray(ruleset_id) ? ruleset_id[0] : ruleset_id;

  const [currentApplication, setCurrentApplication] = useAtom(currentApplicationAtom);

  // Set current application
  // setCurrentApplication(
  //   {
  //     ...currentApplication,
  //     appId: appId,
  //     rulesetId: rulesetId
  //   }
  // );

  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetEditor appId={appId} rulesetId={rulesetId} />
    </AppLayout>
  );
}
