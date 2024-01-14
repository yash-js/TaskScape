import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import localFont from 'next/font/local'

const headingFont = localFont({
    src: "../public/fonts/font.woff2"
})
function Logo() {
    return (
        <Link href={'/'}>
            <div className="hover:opacity-75 transition gap-x-2 items-center hidden md:flex">
                <Image
                    alt="Logo"
                    src={'/logo.svg'}
                    height={30}
                    width={30}
                />
                <p className={cn("text-lg pb-1", headingFont.className)}>TaskScape</p>
            </div></Link>
    );
}

export default Logo;