import React from "react";
import AppDisplay from "./AppDisplay";
import AppLayout from "@/app/components/AppLayout";
import { getServerSession } from "next-auth/next";
import { options } from "../../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/");
  }
  return (
    <AppLayout hasSider hasBreadcrumb>
      <AppDisplay />
    </AppLayout>
  );
}
