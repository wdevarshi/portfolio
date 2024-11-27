import './globals.css'
import type {Metadata} from 'next'
import {Inter} from 'next/font/google'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
    title: 'Devarshi Waghela - Portfolio',
    description: 'Senior Software Engineer Portfolio',
    icons: {
        icon: [
            {
                url: '/favicon.ico',
                sizes: 'any',
            },
            {
                url: '/favicon.svg',
                type: 'image/svg+xml',
            }
        ],
        apple: '/apple-touch-icon.png',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>{children}</body>
        </html>
    )
}