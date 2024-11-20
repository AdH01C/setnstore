import { AppLayout } from "@/app/components/AppLayout";

import { RulesetDisplay } from "./RulesetDisplay";

export default function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb>
      <RulesetDisplay />
    </AppLayout>
  );
}
