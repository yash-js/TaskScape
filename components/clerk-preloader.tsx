"use client";

import { useEffect } from "react";

export function ClerkPreloader() {
    useEffect(() => {
        // Preload Clerk components when the component mounts
        const preloadClerk = async () => {
            try {
                // Preload the Clerk module
                await import("@clerk/nextjs");
            } catch (error) {
                console.warn("Failed to preload Clerk:", error);
            }
        };

        // Preload after a short delay to not block initial page load
        const timeoutId = setTimeout(preloadClerk, 1000);
        
        return () => clearTimeout(timeoutId);
    }, []);

    return null;
}
