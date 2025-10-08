"use client"

import { Button } from "@/components/ui/button";
import localFont from 'next/font/local'
import { Medal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { useState } from "react";

const headingFont = localFont({
    src: "../../public/fonts/font.woff2"
})
const textFont = Poppins({
    subsets: ['latin'],
    weight: [
        '100', '200', '300',
        '400', '500', '600',
        '700', '800', '900'
    ]
})

function MarketingPage() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    const handleGetStarted = () => {
        setIsNavigating(true);
        router.push('/sign-up');
    };

    return (
        <div className="flex items-center justify-center flex-col">
            <div className={cn("flex items-center justify-center flex-col", headingFont.className)}>
                <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
                    <Medal className="h-6 w-6 mr-2" />
                    No.1 Task Manager
                </div>
                <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
                    TaskScape helps team move
                </h1>
                <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md  w-fit">
                    work forward.
                </div>
            </div>
            <div className={cn("text-sm md:text-xl text-neutral-400 mt-4 max-w-xs md:max-w-2xl text-center", textFont.className)}>
                Collaborate, Manage Projects, and Reach New Productivity peaks. From high rises to home office, the way your team works in unique - accomplish it all with TaskScape.
            </div>
            <Button 
                className="mt-6" 
                size={'lg'} 
                onClick={handleGetStarted}
                disabled={isNavigating}
            >
                {isNavigating ? (
                    <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Getting Started...
                    </>
                ) : (
                    'Get TaskScape For Free!'
                )}
            </Button>
        </div>
    );
}

export default MarketingPage;