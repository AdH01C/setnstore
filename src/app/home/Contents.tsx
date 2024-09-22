"use client";

import { currentlySelectedAtom } from "@/jotai/Navigation";
import { useAtom } from "jotai";
import Dashboard from "./Dashboard";
import Ruleset from "./Ruleset";

export default function Contents() {
  const [currentlySelected, setCurrentlySelected] = useAtom(
    currentlySelectedAtom
  );

  return (
    <>
      {currentlySelected.type === "Dashboard" && <Dashboard />}
      {currentlySelected.type === "Ruleset Management" && (
        <Ruleset
          companyName={currentlySelected.companyName || ""}
          appId={currentlySelected.appId || ""}
        />
      )}
      {currentlySelected.type === "Application Status" && (
        <div className="flex justify-center items-center w-full h-full text-4xl py-2 rounded-lg font-bold bg-secondary">
          <h1>Application Status</h1>
        </div>
      )}
    </>
  );
}
