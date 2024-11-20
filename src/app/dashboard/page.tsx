import React from "react";
import Dashboard from "./Dashboard";
import AppLayout from "../components/AppLayout";

export default function Page() {
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
