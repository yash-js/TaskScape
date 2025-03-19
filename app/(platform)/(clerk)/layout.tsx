
import Progress from "@/components/progress-bar";
function layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Progress />
            <div className="h-full flex items-center justify-center">

                {children}
            </div>
        </>
    );
}

export default layout;