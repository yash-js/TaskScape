"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'primary' | 'link';
    loadingText?: string;
}


export const FormSubmit = ({
    children,
    disabled, 
    className, 
    variant = 'primary',
    loadingText = "Creating..."
}: FormSubmitProps) => {
    const { pending } = useFormStatus()

    return <Button
        disabled={pending || disabled}
        type="submit"
        variant={variant}
        size={'sm'}
        className={cn(className)}
    >
        {pending ? (
            <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loadingText}
            </>
        ) : (
            children
        )}
    </Button>
}