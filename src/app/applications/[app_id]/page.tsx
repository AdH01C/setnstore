"use client"

import React from "react";
import AppDisplay from "./AppDisplay";
import AppLayout from "@/app/components/AppLayout";
import { getServerSession } from "next-auth/next";
import { options } from "../../api/auth/[...nextauth]/options";
import { redirect, useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { currentApplicationAtom } from "@/jotai/Navigation";
import { useAtom } from "jotai";

export default async function Page() {
  const { identity } = useAuth();
  const [currentApplication, setCurrentApplication] = useAtom(currentApplicationAtom);

  // Destructure parameters using useParams from next/navigation
  const { app_id } = useParams();
  const appId = Array.isArray(app_id) ? app_id[0] : app_id;

  // Set current application
  // setCurrentApplication(
  //   {
  //     ...currentApplication,
  //     appId: appId
  //   }
  // );

  if (!identity) {
    redirect("/");
  }
  return (
    <AppLayout hasSider hasBreadcrumb>
      <AppDisplay
        appId={appId}
       />
    </AppLayout>
  );
}
