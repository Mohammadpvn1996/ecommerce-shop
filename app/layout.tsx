import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/lib/providers"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Salona App",
  description: "Salona application with React, Tailwind, and Ant Design",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
