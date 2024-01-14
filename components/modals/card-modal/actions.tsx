"use client"

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModal } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface Props {
    data: CardWithList
}

function Actions({ data }: Props) {
    const params = useParams()
    const { execute: executeCopyCard, isLoading: copyLoading } = useAction(copyCard, {
        onSuccess: () => {
            toast.success(`Card "${data?.title}" Copied!`)
            cardModal.onClose()
        },
        onError: err => toast.error(err)
    })
    const { execute: executeDeleteCard, isLoading: deleteLoading } = useAction(deleteCard, {
        onSuccess: data => {
            toast.success(`Card "${data?.title}" Deleted!`)
            cardModal.onClose()
        },
        onError: err => toast.error(err)
    })

    const cardModal = useCardModal()

    const onCopy = () => {
        const boardId = params.boardId as string
        executeCopyCard({
            id: data?.id,
            boardId
        })
    }
    const OnDelete = () => {
        const boardId = params.boardId as string
        executeDeleteCard({
            id: data?.id,
            boardId
        })
    }
    return (
        <div className="space-y-2 mt-2">
            <p className="text-xs font-semibold">
                Actions
            </p>
            <Button
                type="button"
                variant='gray'
                className="w-full justify-start"
                size={'inline'}
                onClick={onCopy}
                disabled={copyLoading}
            >
                <Copy
                    className="h-4 w-4 mr-2"
                />
                Copy
            </Button>
            <Button
                onClick={OnDelete}
                type="button"
                variant='gray'
                className="w-full justify-start"
                size={'inline'}
                disabled={deleteLoading}
            >
                <Trash
                    className="h-4 w-4 mr-2"
                />
                Delete
            </Button>
        </div>
    );
}
Actions.Skeleton = function ActionSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton
                className="w-20 h-4 bg-neutral-200"
            />
            <Skeleton
                className="w-full h-8 bg-neutral-200"
            />
            <Skeleton
                className="w-full h-8 bg-neutral-200"
            />
        </div>
    )
}

export default Actions;