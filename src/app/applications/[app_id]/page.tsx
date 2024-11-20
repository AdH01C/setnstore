import { AppLayout } from "@/app/components/AppLayout";

import { AppDisplay } from "./AppDisplay";

export default function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb>
      <AppDisplay />
    </AppLayout>
  );
}
