'use client'

import { defaultImages } from "@/constants/images";
import { unsplash } from "@/lib/unspalsh";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import FormErrors from "./form-errors";

interface FormPickerProps {
    id: string;
    errors?: Record<string, string[] | undefined>
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
    const { pending } = useFormStatus()
    const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages)
    const [isLoading, setLoading] = useState(true)
    const [selectImageId, setSelectedImageId] = useState(null)
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const result = await unsplash.photos.getRandom({
                    collectionIds: ['317099'],
                    count: 9
                })

                if (result && result.response) {
                    const newImages = (result.response as Array<Record<string, any>>)
                    setImages(newImages)
                } else {
                    console.error("Failed to get images")
                }
            } catch (error) {
                setImages(defaultImages)
            } finally {
                setLoading(false)
            }
        }
        fetchImages()
    }, [])

    if (isLoading) {
        return <div className="p-6 flex items-center justify-center">
            <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
        </div>
    }
    return <div className="relative ">
        <div className="grid grid-cols-3 gap-2 mb-2">
            {images?.map((image) => (
                <div key={image?.id} className={cn('cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted', pending && 'opacity-50 hover:opacity-50 cursor-auto')}
                    onClick={() => {
                        if (pending) return
                        setSelectedImageId(image?.id)
                    }}
                >
                    <input type="radio" name={id} id={id}
                        className="hidden"
                        checked={selectImageId == image?.id}
                        disabled={pending}
                        value={`${image.id}|${image.urls.thumb}|${image?.urls.full}|${image.links.html}|${image.user.name}`}
                    />
                    <Image
                        fill
                        alt='Image'
                        src={image?.urls?.thumb}
                        className={'object-cover rounded-sm'}
                    />
                    {selectImageId == image.id &&
                        <div className="absolute inset-y-0 h-full w-full flex items-center bg-black/50 justify-center">
                            <Check
                                className="h-4 w-4 text-white"
                            />
                        </div>
                    }
                    <Link href={image.links.html} target="_blank" className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline bg-black/100 text-center">
                        {image.user.name}
                    </Link>
                </div>
            ))}
        </div>
        <FormErrors
            id="image"
            errors={errors}
        />
    </div>
}