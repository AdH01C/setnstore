"use client"

import { currentlySelectedAtom } from "@/jotai/Navigation";
import { useAtom } from 'jotai'
import Dashboard from "./Dashboard";
import Ruleset from "./Ruleset";

export default function Contents() {
    const [currentlySelected, setCurrentlySelected] = useAtom(currentlySelectedAtom);

    return (
        <>
        {currentlySelected === "Dashboard" && (
            <Dashboard />
        )}
        {currentlySelected === "Ruleset Management" && (
            <Ruleset />
        )}
        {currentlySelected === "Application Status" && (
            <div className="flex justify-center items-center w-full h-full text-4xl py-2 rounded-lg font-bold bg-secondary">
                <h1>Application Status</h1>
            </div>
        )}
        </>
    );
}