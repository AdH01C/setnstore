"use client";

import RulesetTable from "@/app/applications/[app_id]/RulesetTable";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/components/AppContext";

export default function AppDisplay() {
  const { companyID, appID } = useAppContext();
  const router = useRouter();

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          router.push(`/applications/${appID}/rulesets/new`);
        }}
        style={{ marginBottom: 16, marginTop: 16 }}
      >
        Add Ruleset
      </Button>
      {companyID && <RulesetTable companyID={companyID} appID={appID} />}
    </>
  );
}
