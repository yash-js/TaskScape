"use client"

import { updateCard } from "@/actions/update-card";
import { FormTextarea } from "@/components/form/form-textara";
import { FormSubmit } from "@/components/form/forn-submit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, KeyboardEvent, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface Props {
    data: CardWithList
}


function Description({ data }: Props) {
    const params = useParams()
    const queryClient = useQueryClient()
    const [isEditing, setIsEditing] = useState(false)
    const textAreaRef = useRef<ElementRef<'textarea'>>(null)
    const formRef = useRef<ElementRef<'form'>>(null)

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            textAreaRef.current?.focus()
        });
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const onKeyDown = (event: { key: string; }) => {
        if (event.key == 'Escape') {
            disableEditing()
        }
    }

    useOnClickOutside(formRef, disableEditing);

    
    useEventListener('keydown', onKeyDown)

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: data => {
            queryClient.invalidateQueries({
                queryKey: ['card', data?.id]
            })
            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            });
            toast.success(`Card "${data.title}" updated!`)
            disableEditing()
        },
        onError: err => toast.error(err)
    })

    const onSubmit = (formData: FormData) => {
        const description = formData.get('description') as string
        const boardId = params.boardId as string

        execute({
            id: data?.id,
            description,
            boardId
        })

    }
    return (
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft
                className="h-5 w-5 mt-0.5 text-neutral-700"
            />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>
                {isEditing ?
                    <form
                        action={onSubmit} ref={formRef} className="space-y-2">
                        <FormTextarea
                            errors={fieldErrors}
                            id="description"
                            className="w-full mt-2"
                            placeholder="Add more detailed description..."
                            defaultValue={data?.description || undefined}
                            ref={textAreaRef}
                        />

                        <div className="flex items-center gap-x-2 ">
                            <FormSubmit>
                                Save
                            </FormSubmit>
                            <Button
                                type="button"
                                onClick={disableEditing}
                                size={'sm'}
                                variant={'ghost'}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                    : <div
                        onClick={enableEditing}
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                        role='button'
                    >
                        {data?.description || 'Add more detailed description...'}
                    </div>
                }
            </div>
        </div >
    );
}

export default Description;


Description.Skeleton = function DescriptionSkeleton() {
    return <div className="flex items-start gap-x-3 w-full">
        <Skeleton
            className="h-6 w-6 bg-neutral-200 "
        />
        <div className="w-full">
            <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
            <Skeleton className="h-[78px] w-full mb-2 bg-neutral-200" />
        </div>
    </div>
}