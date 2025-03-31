"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { difficulties, themes, previewTimerSettings } from "@/lib/mockData/data"

export default function DifficultyPage() {
  const router = useRouter()
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [themeObj, setThemeObj] = useState<any>(null)
  const [previewTime, setPreviewTime] = useState<number>(previewTimerSettings.default)

  useEffect(() => {
    // 獲取從主題頁面選擇的主題
    const theme = localStorage.getItem("selectedTheme")
    // 讀取已保存的倒數時間設置（如果有）
    const savedPreviewTime = localStorage.getItem("previewTime")
    
    if (theme) {
      setSelectedTheme(theme)
      const foundTheme = themes.find(t => t.name === theme)
      if (foundTheme) {
        setThemeObj(foundTheme)
      }
    } else {
      // 如果沒有選擇主題，返回主題選擇頁面
      router.push("/themes")
    }
    
    // 設置倒數時間，如果有保存則使用保存的值，否則使用默認值
    if (savedPreviewTime) {
      setPreviewTime(parseInt(savedPreviewTime))
    }
  }, [router])

  const handleSelectDifficulty = (difficultyId: number) => {
    // 儲存選擇的難度
    localStorage.setItem("selectedDifficulty", String(difficultyId))
    // 儲存預覽倒數時間
    localStorage.setItem("previewTime", String(previewTime))
    // 導向遊戲頁面
    router.push("/game")
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-pink-100 via-blue-100 to-green-100">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <div className="flex justify-between w-full">
          <Link href="/themes">
            <Button className="rounded-full bg-red-400 hover:bg-red-500 text-black">← 返回</Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-primary">選擇難度</h1>
        
        {themeObj && (
          <Card className={`w-full p-6 ${themeObj.color} backdrop-blur-sm rounded-3xl shadow-lg text-center border-2 ${themeObj.borderColor}`}>
            <div className="flex items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-md">
                {themeObj.emoji}
              </div>
              <div>
                <h2 className="text-2xl font-bold">已選擇主題: {themeObj.name}</h2>
                <p className="text-sm mt-1">共有 {themeObj.cards.length} 種不同卡片</p>
              </div>
            </div>
          </Card>
        )}
        
        {/* 倒數秒數設置 */}
        <Card className="w-full p-6 bg-yellow-100 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-yellow-300">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">記憶倒數時間</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm text-yellow-700">
              <span>{previewTimerSettings.min}秒</span>
              <span className="font-bold text-2xl text-yellow-800">{previewTime}秒</span>
              <span>{previewTimerSettings.max}秒</span>
            </div>
            <Slider
              value={[previewTime]}
              min={previewTimerSettings.min}
              max={previewTimerSettings.max}
              step={1}
              onValueChange={(value) => setPreviewTime(value[0])}
              className="py-2"
            />
            <p className="text-sm text-yellow-700 text-center mt-1">設置記住卡片的倒數秒數，時間越短難度越高</p>
          </div>
        </Card>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
          {difficulties.map((difficulty) => {
            // 計算可用的卡片數量
            const availableCards = themeObj?.cards.length || 0
            const isDisabled = difficulty.pairs > availableCards
            
            return (
              <Card
                key={difficulty.id}
                className={`p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all 
                  ${!isDisabled ? 'hover:scale-105 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                onClick={() => !isDisabled && handleSelectDifficulty(difficulty.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-md ${getDifficultyColor(difficulty.name)}`}>
                    {difficulty.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold">{difficulty.name}</h3>
                    <p className="text-lg text-muted-foreground">{difficulty.label}</p>
                    {isDisabled && <p className="text-sm text-red-500 mt-1">此主題卡片不足，無法選擇此難度</p>}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// 獲取難度對應的背景色
function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "超簡單":
      return "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
    case "簡單":
      return "bg-green-100 text-green-800 border-2 border-green-300"
    case "中等":
      return "bg-blue-100 text-blue-800 border-2 border-blue-300"
    case "困難":
      return "bg-orange-100 text-orange-800 border-2 border-orange-300"
    case "專家":
      return "bg-red-100 text-red-800 border-2 border-red-300"
    default:
      return "bg-gray-100 text-gray-800 border-2 border-gray-300"
  }
} 