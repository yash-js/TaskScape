"use client"
import { createBoard } from "@/actions/create-board";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { FormInput } from "./form-input";
import { FormSubmit } from "./forn-submit";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";
import { FormPicker } from "./form-picker";
import { ElementRef, useRef } from "react";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/user-pro-modal";

interface FormPopoverProps {
    children: React.ReactNode;
    side?: 'left' | "right" | 'top' | 'bottom';
    align?: "start" | "center" | "end";
    sideOffset?: number
}

export function FormPopover({
    children,
    side = 'bottom',
    align,
    sideOffset = 0
}: FormPopoverProps) {
    const router = useRouter()
    const closeRef = useRef<ElementRef<"button">>(null)
    const proModal = useProModal()
    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success('Board Created!')
            closeRef.current?.click()
            router.push(`/board/${data?.id}`)
        },
        onError: err => {
            toast.error(err)
            proModal.onOpen()
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string
        const image = formData.get('image') as string
        execute({ title, image })
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3 ml-2"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create Board</div>
                <PopoverClose ref={closeRef} asChild>
                    <Button className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600" variant={'ghost'}>
                        <X
                            className="h-4 w-4"
                        />
                    </Button>
                </PopoverClose>
                <form action={onSubmit} className="space-y-4">
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id='title'
                            label="Board Title"
                            type="text"
                            errors={fieldErrors}
                        />
                    </div>
                    <FormSubmit className="w-full">
                        Create
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>);
}
