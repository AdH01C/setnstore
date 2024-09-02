"use client"

import { currentlySelectedAtom } from "@/jotai/Navigation";
import { useAtom } from 'jotai'

export default function Contents() {
    const [currentlySelected, setCurrentlySelected] = useAtom(currentlySelectedAtom);

    return (
        <div className="flex justify-center items-center w-full h-full text-4xl font-bold bg-secondary">
            <h1>{currentlySelected}</h1>
        </div>
    );
}