"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { themes } from "@/lib/mockData/data"

export default function ThemesPage() {
  const router = useRouter()

  const handleSelectTheme = (themeName: string) => {
    // 儲存選擇的主題
    localStorage.setItem("selectedTheme", themeName)
    // 導向難度選擇頁面
    router.push("/difficulty")
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-pink-100 via-blue-100 to-green-100">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <div className="flex justify-between w-full">
          <Link href="/">
            <Button className="rounded-full bg-red-400 hover:bg-red-500 text-black">← 返回</Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-primary">選擇主題</h1>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {themes.map((theme) => (
            <Card
              key={theme.id}
              className={`p-6 ${theme.color} backdrop-blur-sm rounded-3xl shadow-lg border-2 ${theme.borderColor} hover:shadow-xl transition-all hover:scale-105 cursor-pointer`}
              onClick={() => handleSelectTheme(theme.name)}
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-4xl shadow-md">
                    {theme.emoji}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{theme.name}</h3>
                    <p className="text-sm text-gray-600">{theme.cards.length} 種不同的卡片</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-5 gap-2">
                  {theme.cards.slice(0, 5).map((card, idx) => (
                    <div key={idx} className="relative aspect-square w-full rounded-md overflow-hidden border bg-white">
                      <Image 
                        src={card.imageUrl} 
                        alt={card.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

