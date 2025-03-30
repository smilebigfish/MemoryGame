import type React from "react"
import type { Metadata } from "next"
import { Noto_Sans_TC } from "next/font/google"
import "./globals.css"

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
})

export const metadata: Metadata = {
  title: "兒童記憶配對遊戲",
  description: "適合兒童的有趣記憶卡片遊戲",
  icons: {
    icon: "/images/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={notoSansTC.className} suppressHydrationWarning>{children}</body>
    </html>
  )
}