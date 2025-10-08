"use client"

import { useSocket } from "@/components/providers/socket-provider"
import { useEffect, useCallback } from "react"
import { toast } from "sonner"
import { realtimeCache } from "@/lib/realtime-cache"

interface RealtimeBoardOptions {
  boardId: string
  onListCreated?: (data: any) => void
  onListUpdated?: (data: any) => void
  onListDeleted?: (data: any) => void
  onCardCreated?: (data: any) => void
  onCardUpdated?: (data: any) => void
  onCardDeleted?: (data: any) => void
  onCardMoved?: (data: any) => void
  onListMoved?: (data: any) => void
  onCursorMove?: (data: any) => void
  showNotifications?: boolean
}

export const useRealtimeBoard = (options: RealtimeBoardOptions) => {
  const { socket, isConnected } = useSocket()
  const {
    boardId,
    onListCreated,
    onListUpdated,
    onListDeleted,
    onCardCreated,
    onCardUpdated,
    onCardDeleted,
    onCardMoved,
    onListMoved,
    onCursorMove,
    showNotifications = true
  } = options

  // Join board room when connected
  useEffect(() => {
    if (socket && isConnected && boardId) {
      socket.emit("join-board", boardId)
      
      return () => {
        socket.emit("leave-board", boardId)
      }
    }
    
    return () => {
      // Cleanup function for when socket is not available
    }
  }, [socket, isConnected, boardId])

  // Set up event listeners
  useEffect(() => {
    if (!socket) return

    const cleanup = () => {
      // Cleanup function
    }

    const handleListCreated = (data: any) => {
      if (showNotifications) {
        toast.success(`List "${data.title}" created`)
      }
      onListCreated?.(data)
    }

    const handleListUpdated = (data: any) => {
      if (showNotifications) {
        toast.success(`List "${data.title}" updated`)
      }
      onListUpdated?.(data)
    }

    const handleListDeleted = (data: any) => {
      if (showNotifications) {
        toast.success(`List "${data.title}" deleted`)
      }
      onListDeleted?.(data)
    }

    const handleCardCreated = (data: any) => {
      if (showNotifications) {
        toast.success(`Card "${data.title}" created`)
      }
      onCardCreated?.(data)
    }

    const handleCardUpdated = (data: any) => {
      if (showNotifications) {
        toast.success(`Card "${data.title}" updated`)
      }
      onCardUpdated?.(data)
    }

    const handleCardDeleted = (data: any) => {
      if (showNotifications) {
        toast.success(`Card "${data.title}" deleted`)
      }
      onCardDeleted?.(data)
    }

    const handleCardMoved = (data: any) => {
      onCardMoved?.(data)
    }

    const handleListMoved = (data: any) => {
      onListMoved?.(data)
    }

    const handleCursorMove = (data: any) => {
      onCursorMove?.(data)
    }

    // Register event listeners
    socket.on("list-created", handleListCreated)
    socket.on("list-updated", handleListUpdated)
    socket.on("list-deleted", handleListDeleted)
    socket.on("card-created", handleCardCreated)
    socket.on("card-updated", handleCardUpdated)
    socket.on("card-deleted", handleCardDeleted)
    socket.on("card-moved", handleCardMoved)
    socket.on("list-moved", handleListMoved)
    socket.on("cursor-move", handleCursorMove)

    // Cleanup
    return () => {
      socket.off("list-created", handleListCreated)
      socket.off("list-updated", handleListUpdated)
      socket.off("list-deleted", handleListDeleted)
      socket.off("card-created", handleCardCreated)
      socket.off("card-updated", handleCardUpdated)
      socket.off("card-deleted", handleCardDeleted)
      socket.off("card-moved", handleCardMoved)
      socket.off("list-moved", handleListMoved)
      socket.off("cursor-move", handleCursorMove)
    }
  }, [socket, onListCreated, onListUpdated, onListDeleted, onCardCreated, onCardUpdated, onCardDeleted, onCardMoved, onListMoved, onCursorMove, showNotifications])

  // Emit functions
  const emitListCreated = useCallback((data: any) => {
    if (socket) {
      socket.emit("list-created", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitListUpdated = useCallback((data: any) => {
    if (socket) {
      socket.emit("list-updated", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitListDeleted = useCallback((data: any) => {
    if (socket) {
      socket.emit("list-deleted", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitCardCreated = useCallback((data: any) => {
    if (socket) {
      socket.emit("card-created", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitCardUpdated = useCallback((data: any) => {
    if (socket) {
      socket.emit("card-updated", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitCardDeleted = useCallback((data: any) => {
    if (socket) {
      socket.emit("card-deleted", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitCardMoved = useCallback((data: any) => {
    if (socket) {
      socket.emit("card-moved", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitListMoved = useCallback((data: any) => {
    if (socket) {
      socket.emit("list-moved", { ...data, boardId })
    }
  }, [socket, boardId])

  const emitCursorMove = useCallback((data: any) => {
    if (socket) {
      socket.emit("cursor-move", { ...data, boardId })
    }
  }, [socket, boardId])

  return {
    isConnected,
    emitListCreated,
    emitListUpdated,
    emitListDeleted,
    emitCardCreated,
    emitCardUpdated,
    emitCardDeleted,
    emitCardMoved,
    emitListMoved,
    emitCursorMove,
  }
}
