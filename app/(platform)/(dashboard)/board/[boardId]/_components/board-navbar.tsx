import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Board } from "@prisma/client";
import BoardTitleForm from "./board-title-form";
import BoardOptions from "./board-options";

interface BoardNavbarProps {
    board: Board;

}
async function BoardNavbar({ board }: BoardNavbarProps) {
    return (<div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center text-white gap-x-4 px-6">
        <BoardTitleForm data={board} />
        <div className="ml-auto">
            <BoardOptions id={board?.id} />
        </div>
    </div>);
}

export default BoardNavbar;