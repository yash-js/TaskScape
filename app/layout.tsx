import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { siteConfig } from '@/config/site'
import Progress from "@/components/progress-bar";
import { SocketProvider } from "@/components/providers/socket-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner'
import { NavigationLoading } from "@/components/navigation-loading";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/logo.svg',
      href: "/logo.svg"
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <SocketProvider>
            <Progress />
            <Toaster position="top-center" />
            <NavigationLoading />
            {children}
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
