"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function NavigationLoading() {
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // Show loading when navigating to auth pages
        if (pathname === '/sign-in' || pathname === '/sign-up') {
            setIsLoading(true);
            // Hide loading after a short delay to allow page to load
            const timer = setTimeout(() => {
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        } else {
            setIsLoading(false);
        }
        return undefined;
    }, [pathname]);

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
    );
}