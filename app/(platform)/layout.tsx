import React from "react";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <ModalProvider />
            {children}
        </QueryProvider>
    );
}

export default PlatformLayout;