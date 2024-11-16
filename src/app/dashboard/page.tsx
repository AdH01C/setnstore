"use client"

import Dashboard from "./Dashboard";
import AppLayout from "../components/AppLayout";
import companyDataService from "@/app/services/NewCompanyDataService";
import applicationDataService from "../services/NewAppDataService";
import { AppDetailsWithID } from "@inquisico/ruleset-editor-api";
import { userDetailsAtom } from "@/jotai/User";
import { useAtom } from "jotai";
import identityDataService from "../services/IdentityDataService";

export default async function Page() {
  const applications: AppDetailsWithID[] = [];
  // const [userDetails, setUserDetails] = useAtom(userDetailsAtom);
  
  await identityDataService.getIdentity()
  .then(async (identity) => {
    if (!identity) {
      console.error("No identity found");
      return;
    } else {
      console.log("Fetching company details...", identity.id);
      await companyDataService.getCompanyByUserId(identity.id)
      .then(async (companyDetails) => {
        if (!companyDetails) {
          console.error("No company details found");
          return;
        }
        console.log("Fetching applications for company...", companyDetails.id);
 
        await applicationDataService.getApplications(companyDetails.id)
        .then((apps) => {
          apps.forEach((app) => {
            applications.push(app);
          });
        });
      }).catch((error) => {
        console.error("**", error);
      });
    }
  }).catch((error) => {
    console.error("*", error);
  });

  return (
    <AppLayout>
      <Dashboard apps={applications} />
    </AppLayout>
  );
}
