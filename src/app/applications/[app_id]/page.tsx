"use client"

import React from "react";
import AppDisplay from "./AppDisplay";
import AppLayout from "@/app/components/AppLayout";
import { getServerSession } from "next-auth/next";
import { options } from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default async function Page() {
  const { identity } = useAuth();

  if (!identity) {
    redirect("/");
  }
  return (
    <AppLayout hasSider hasBreadcrumb>
      <AppDisplay />
    </AppLayout>
  );
}
