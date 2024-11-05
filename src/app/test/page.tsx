"use client"

import { useAuth } from "@/hooks/useAuth";
import { use, useEffect } from "react";

export default function Test() {
    
    const { identity } = useAuth();

    useEffect(() => {
        console.log("Identity", identity);
    });
    
    return (
        <div>
            <h1>Test</h1>
        </div>
    );
}