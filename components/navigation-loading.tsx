"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function NavigationLoading() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_1s_ease-in-out_infinite]"></div>
      </div>
    </div>
  )
}
