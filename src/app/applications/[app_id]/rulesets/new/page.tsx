import { AppLayout } from "@/app/components/AppLayout";

import { RulesetCreator } from "./RulesetCreator";

export default function Page() {
  return (
    <AppLayout hasSider hasBreadcrumb contentPadding="0 0 24px 24px">
      <RulesetCreator />
    </AppLayout>
  );
}
