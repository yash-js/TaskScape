import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import BoardNavbar from "./_components/board-navbar";


export async function generateMetadata({ params }: {
    params: { boardId: string }
}) {
    const { orgId } = auth()
    if (!orgId) {
        return {
            title: "Board"
        }
    }
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })

    return {
        title: board?.title || 'Board'
    }
}

async function BoardIdLayout({ children, params }: { children: React.ReactNode, params: { boardId: string } }) {
    const { orgId } = auth()

    if (!orgId) return redirect('/select-org')
    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId
        }
    })
    if (!board) {
        return notFound()
    }
    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{
                backgroundImage: `url(${board.imageFullUrl})`
            }}>
            <BoardNavbar board={board} />
            <div
                className="absolute inset-0 bg-black/10"
            />
            <main className="pt-28 relative h-full">
                {children}
            </main>
        </div>
    );
}

export default BoardIdLayout;