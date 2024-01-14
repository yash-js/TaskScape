"use client"

import { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import FormErrors from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextAreaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
    ({
        id,
        label,
        placeholder,
        required,
        disabled,
        errors,
        className,
        onBlur,
        onClick,
        onKeyDown,
        defaultValue
    }, ref) => {
        const { pending } = useFormStatus()
        return <div className="space-y-2 w-full">
            <div className="space-y-2 w-fu">
                {label ? <Label
                    htmlFor={id}
                    className="text-xs font-semibold text-neutral-700"
                >
                    {label}
                </Label> : null}
                <Textarea
                    onKeyDown={onKeyDown}
                    onBlur={onBlur}
                    onClick={onClick}
                    ref={ref}
                    required={required}
                    disabled={disabled}
                    placeholder={placeholder}
                    name={id}
                    id={id}
                    className={cn('resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 outline-none shadow-sm ', className)}
                    aria-describedby={`${id}-error`}
                    defaultValue={defaultValue}
                />
            </div>
            <FormErrors
                id={id}
                errors={errors}
            />
        </div>
    }
)

FormTextarea.displayName = 'FormTextarea'