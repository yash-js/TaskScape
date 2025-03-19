import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner'
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import Progress from "@/components/progress-bar";

function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Progress />
            <ClerkProvider>
                <QueryProvider>
                    <Toaster position="top-center" />
                    <ModalProvider />
                    {children}
                </QueryProvider>
            </ClerkProvider>
        </>
    );
}

export default PlatformLayout;