"use client"

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ClerkPreloader } from "@/components/clerk-preloader";

export function Navbar() {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState<string | null>(null);

    const handleNavigation = (path: string) => {
        setIsNavigating(path);
        // Add a small delay to show loading state
        setTimeout(() => {
            router.push(path);
        }, 100);
    };

    return (
        <>
            <ClerkPreloader />
            <div className="fixed top-0  w-full h-14 border-b shadow-sm bg-white flex items-center z-50">
                <div className="md:max-w-screen-2xl  mx-auto flex items-center w-full justify-between">
                    <Logo />
                    <div className="space-x-4 md:block md:w-auto items-center flex justify-between w-full">
                        <Button 
                            variant={'outline'} 
                            size={'sm'}
                            onClick={() => handleNavigation('/sign-in')}
                            disabled={isNavigating !== null}
                        >
                            {isNavigating === '/sign-in' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Login'
                            )}
                        </Button>
                        <Button 
                            onClick={() => handleNavigation('/sign-up')}
                            disabled={isNavigating !== null}
                        >
                            {isNavigating === '/sign-up' ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                'Get TaskScape for Free'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}