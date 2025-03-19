import Navbar from "./_components/navbar";

import Progress from "@/components/progress-bar";
function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Progress />
            <div className="h-full">
                <Navbar />
                {children}
            </div>
        </>
    );
}

export default DashboardLayout;