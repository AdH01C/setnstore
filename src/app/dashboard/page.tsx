import Dashboard from "./Dashboard";
import AppLayout from "../components/AppLayout";
import { getServerSession } from "next-auth/next";
import { options } from "../api/auth/[...nextauth]/options";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(options);

  if (!session) {
    redirect("/");
  }

  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
