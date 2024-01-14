import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Navbar() {
    return (
        <div className="fixed top-0  w-full h-14 border-b shadow-sm bg-white flex items-center">
            <div className="md:max-w-screen-2xl  mx-auto flex items-center w-full justify-between">
                <Logo />
                <div className="space-x-4 md:block md:w-auto items-center flex justify-between w-full">
                    <Button variant={'outline'} size={'sm'}>
                        <Link href='/sign-in'>
                            Login
                        </Link>

                    </Button>
                    <Button>
                        <Link href='/sign-up'>
                            Get TaskScape for Free
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}