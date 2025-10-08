import { FormPopover } from "@/components/form/form-popover";
import { Hint } from "@/components/hint";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { boardService, orgService } from "@/lib/db-service";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { HelpCircle, HelpCircleIcon, User2, Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

async function BoardList() {
    const { orgId } = auth()

    if (!orgId) return redirect('/select-org')


    // Use optimized service with caching
    const [boards, orgLimit, isPro] = await Promise.all([
        boardService.getOrgBoards(orgId),
        orgService.getOrgLimit(orgId),
        checkSubscription()
    ])

    const availableCount = orgLimit?.count || 0


    return (<div className="space-y-4">
        <div className="flex items-center font-semibold text-lg text-neutral-700">
            <User2
                className="h-6 w-6 mr-2"
            />
            Your Boards
        </div>
        <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {boards.map((board) => <Link
                key={board.id}
                href={`/board/${board.id}`}
                style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
                className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden hover:scale-105 transition-transform duration-200"
            >
                <div
                    className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition"
                />
                <p className="relative font-semibold text-white">
                    {board?.title}
                </p>
            </Link>
            )}
            <FormPopover side="bottom" sideOffset={10}>
                <div role="button" className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition hover:scale-105 duration-200">
                    <p className="text-sm">
                        Create new Board
                    </p>
                    <span className="text-xs">
                        {isPro ? "Unlimited" :`${MAX_FREE_BOARDS - availableCount} remaining`}
                    </span>
                    <Hint
                        sideOffset={40}
                        description={`
                    Free Workspaces can have upto 5 open boards. For unlimited boards, upgrade this workspace.
                `}
                    >
                        <HelpCircleIcon
                            className="absolute bottom-2 right-2 h-[14px] w-[14px]"
                        />
                    </Hint>
                </div>
            </FormPopover>
        </div>
    </div>);
}

export default BoardList;

BoardList.Skeleton = function BoardlistSkeleton() {
    return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
        <Skeleton
            className="aspect-video h-full w-full p-2"
        />
    </div>

}