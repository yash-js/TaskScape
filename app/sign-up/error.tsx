"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Sign-up error:", error);
    }, [error]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center space-y-4">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                <h2 className="text-2xl font-semibold text-gray-900">
                    Something went wrong!
                </h2>
                <p className="text-gray-600 max-w-md">
                    There was an error loading the sign-up page. This might be due to missing environment variables or network issues.
                </p>
                <div className="space-x-4">
                    <Button onClick={reset} variant="outline">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try again
                    </Button>
                    <Button onClick={() => window.location.href = "/"}>
                        Go home
                    </Button>
                </div>
            </div>
        </div>
    );
}
