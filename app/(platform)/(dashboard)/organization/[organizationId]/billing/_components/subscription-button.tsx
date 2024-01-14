"use client"

import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/user-pro-modal";
import { toast } from "sonner";

interface SubscriptionButtonProps {
    isPro: boolean
}

function SubscriptionButton({ isPro }: SubscriptionButtonProps) {
    const proModal = useProModal()
    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: data => {
            window.location.href = data

        },
        onError: err => toast.error(err)
    })

    const onClick = () => {
        if (isPro) {
            execute({})
        } else {
            proModal.onOpen()
        }
    }
    return (
        <Button
            disabled={isLoading}
            variant={'primary'}
            onClick={onClick}
        >
            {isPro ? "Manage Subscription" : "Upgrade to Pro"}
        </Button>
    );
}

export default SubscriptionButton;