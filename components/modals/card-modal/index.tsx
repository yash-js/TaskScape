"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useCardModal } from "@/hooks/use-card-modal"
import { fetcher } from "@/lib/fetcher"
import { CardWithList } from "@/types"
import { Header } from "@/components/modals/card-modal/header"
import { useQuery } from "@tanstack/react-query"
import Description from "./description"
import Actions from "./actions"
import { AuditLog } from "@prisma/client"
import Activity from "./activity"
import { memo } from "react"

const CardModal = memo(() => {
  const id = useCardModal(state => state.id)
  const isOpen = useCardModal(state => state.isOpen)
  const onClose = useCardModal(state => state.onClose)

  const { data: cardData, isLoading: cardLoading } = useQuery<CardWithList>({
    queryKey: ['card', id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: !!id && isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  const { data: auditLogsData, isLoading: logsLoading } = useQuery<AuditLog[]>({
    queryKey: ['card-logs', id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: !!id && isOpen,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  if (!isOpen) return null;

  return <Dialog
    open={isOpen}
    onOpenChange={onClose}
  >
    <DialogContent className="max-w-4xl">
      {cardLoading || !cardData
        ? <Header.Skeleton />
        : <Header data={cardData} />
      }
      <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
        <div className="col-span-3">
          <div className="w-full space-y-6">
            {cardLoading || !cardData
              ? <Description.Skeleton />
              : <Description data={cardData} />
            }
            {logsLoading || !auditLogsData
              ? <Activity.Skeleton />
              : <Activity items={auditLogsData} />
            }
          </div>
        </div>
        {cardLoading || !cardData
          ? <Actions.Skeleton />
          : <Actions data={cardData} />
        }
      </div>
    </DialogContent>
  </Dialog>
})

CardModal.displayName = "CardModal"

export { CardModal }