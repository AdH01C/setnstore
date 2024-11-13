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
    <AppLayout
      title="Dashboard"
      subtitle="View all information regarding your services and application."
      contentPadding="50px 150px 0 150px"
    >
      <Dashboard />
    </AppLayout>
  );
}
