"use client"
import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import { FormSubmit } from "@/components/form/forn-submit";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverClose, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { ElementRef, useRef } from "react";
import { toast } from "sonner";
import { useIsomorphicLayoutEffect } from "usehooks-ts";

interface ListOptionsProps {
    data: List;
    onAddCard: () => void;
}
function ListOptions({ data, onAddCard }: ListOptionsProps) {
    const closeRef = useRef<ElementRef<'button'>>(null)
    const { execute: executeDelete } = useAction(deleteList, {
        onSuccess: data => {
            toast.success(`List "${data?.title}" Deleted!`)
            closeRef?.current?.click()
        },
        onError: err => {
            toast.error(err)
        }
    })
    const { execute: executeCopy } = useAction(copyList, {
        onSuccess: data => {
            toast.success(`List "${data?.title}" Copied!`)
            closeRef?.current?.click()
        },
        onError: err => {
            toast.error(err)
        }
    })

    const onDelete = (formData: FormData) => {
        const id = formData.get('id') as string
        const boardId = formData.get('boardId') as string
        executeDelete({ id, boardId })
    }

    const onCopy = (formData: FormData) => {
        const id = formData.get('id') as string
        const boardId = formData.get('boardId') as string
        executeCopy({ id, boardId })
    }


    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="h-auto w-auto p-2" variant={'ghost'}>
                    <MoreHorizontal
                        className="h-4 w-4 "
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="px-0 pt-3 pb-3 drop-shadow-md"
                side="bottom"
                align="start"
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    List Actions
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 "
                        variant={'ghost'}
                    >
                        <X className='w-4 h-4' />
                    </Button>
                </PopoverClose>
                <Button
                    onClick={onAddCard}
                    className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                    variant={'ghost'}
                >
                    Add Card
                </Button>
                <form action={onCopy}>
                    <input type="text" hidden name="id" id="id" value={data?.id} />
                    <input type="text" hidden name="boardId" id="boardId" value={data?.boardId} />
                    <FormSubmit
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                        variant="ghost"
                    >
                        Copy List
                    </FormSubmit>
                </form>
                <Separator />
                <form action={onDelete}>
                    <input type="text" hidden name="id" id="id" value={data?.id} />
                    <input type="text" hidden name="boardId" id="boardId" value={data?.boardId} />
                    <FormSubmit
                        className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
                        variant="ghost"
                    >
                        Delete this list
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    );
}

export default ListOptions;