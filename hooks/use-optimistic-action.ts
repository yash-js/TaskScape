import { useAction } from "./use-action"
import { useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

interface UseOptimisticActionOptions<TInput, TOutput> {
  onSuccess?: (data: TOutput) => void
  onError?: (error: string) => void
  onComplete?: () => void
  queryKey?: string[]
  optimisticUpdate?: (input: TInput) => void
  rollbackUpdate?: (input: TInput) => void
}

export const useOptimisticAction = <TInput, TOutput>(
  action: any,
  options: UseOptimisticActionOptions<TInput, TOutput> = {}
) => {
  const queryClient = useQueryClient()
  const { queryKey, optimisticUpdate, rollbackUpdate } = options

  const { execute, fieldErrors, setFieldErrors, error, data, isLoading } = useAction(action, {
    onSuccess: (data) => {
      // Invalidate queries to refetch fresh data
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey })
      }
      options.onSuccess?.(data as TOutput)
    },
    onError: (error) => {
      // Rollback optimistic update on error
      if (rollbackUpdate) {
        rollbackUpdate(options.optimisticUpdate as any)
      }
      options.onError?.(error)
    },
    onComplete: options.onComplete
  })

  const executeOptimistic = useCallback(async (input: TInput) => {
    // Apply optimistic update immediately
    if (optimisticUpdate) {
      optimisticUpdate(input)
    }
    
    // Execute the actual action
    await execute(input)
  }, [execute, optimisticUpdate])

  return {
    execute: executeOptimistic,
    fieldErrors,
    setFieldErrors,
    error,
    data,
    isLoading
  }
}
