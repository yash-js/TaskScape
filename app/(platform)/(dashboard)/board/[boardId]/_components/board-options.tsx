"use client"


import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, Trash, X } from "lucide-react";
import { toast } from "sonner";

interface BoardOptionsProps {
    id: string;
}


function BoardOptions({ id }: BoardOptionsProps) {
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: error => {
            toast.error(error)
        }
    })
    const onDelete = () => {
        execute({ id })
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="h-auto w-auto p-2"
                    variant={'transparent'}
                >
                    <MoreHorizontal
                        className="h-4 w-4"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3 mr-2"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Board Actions
                </div>
                <PopoverClose asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant={'ghost'}
                    >
                        <X
                            className="h-4 w-4"
                        />
                    </Button>
                </PopoverClose>
                <Button
                    variant={'ghost'}
                    onClick={onDelete}
                    disabled={isLoading}
                    className="rounded-none w-full h-auto p-2 px-5 font-normal text-sm flex justify-between"
                >
                    Delete this Board
                    <Trash
                    className="h-4 w-4 rounded-sm "
                    />
                </Button>
            </PopoverContent>
        </Popover>
    );
}

export default BoardOptions;