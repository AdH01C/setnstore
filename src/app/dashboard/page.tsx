"use client"

import Dashboard from "./Dashboard";
import AppLayout from "../components/AppLayout";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export default async function Page() {
  const router = useRouter();
  const { isFetching, identity } = useAuth({ forceRefetch: false });


  if (!identity) {
    router.push("/");
  } else {
    return (
      <AppLayout>
        <Dashboard id={identity.id} />
      </AppLayout>
    );
    }

}
