"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table"

interface GameRecord {
  theme: string
  difficulty: string
  time: number
  turns?: number
  date: string
  formattedDate?: string
  formattedTime?: string
}

export default function RecordsPage() {
  const [records, setRecords] = useState<GameRecord[]>([])
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  useEffect(() => {
    // 從localStorage載入記錄
    const savedRecords = JSON.parse(localStorage.getItem("gameRecords") || "[]")
    // 按日期降序排序，最新的記錄排前面
    const sortedRecords = savedRecords
      .sort((a: GameRecord, b: GameRecord) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .map((record: GameRecord) => ({
        ...record,
        formattedDate: new Date(record.date).toLocaleDateString(),
        formattedTime: new Date(record.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }));
    
    setRecords(sortedRecords)
  }, [])

  // 獲取主題圖標
  const getThemeIcon = (theme: string) => {
    switch (theme.toLowerCase()) {
      case "動物":
        return "🐶"
      case "植物":
        return "🌸"
      case "交通工具":
        return "🚗"
      case "水果":
        return "🍎"
      default:
        return "🎮"
    }
  }

  // 格式化時間
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes > 0 ? `${minutes}分` : ""}${remainingSeconds}秒`
  }

  // 清除所有記錄
  const clearAllRecords = () => {
    if (window.confirm("確定要清除所有遊戲記錄嗎？此操作無法恢復。")) {
      localStorage.removeItem("gameRecords")
      setRecords([])
    }
  }

  // 獲取難度對應的背景色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "超簡單":
        return "bg-yellow-100 text-yellow-700"
      case "簡單":
        return "bg-green-100 text-green-700"
      case "中等":
        return "bg-blue-100 text-blue-700"
      case "困難":
        return "bg-orange-100 text-orange-700"
      case "專家":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-gradient-to-b from-pink-100 via-blue-100 to-green-100">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <div className="flex justify-between w-full">
          <Link href="/">
            <Button className="rounded-full bg-red-400 hover:bg-red-500 text-black">← 返回</Button>
          </Link>
          {records.length > 0 && (
            <div className="flex gap-2">
              <Button 
                className={`rounded-full ${viewMode === 'cards' ? 'bg-purple-400 hover:bg-purple-500' : 'bg-gray-300 hover:bg-gray-400'} text-black`}
                onClick={() => setViewMode('cards')}
              >
                卡片視圖
              </Button>
              <Button 
                className={`rounded-full ${viewMode === 'table' ? 'bg-purple-400 hover:bg-purple-500' : 'bg-gray-300 hover:bg-gray-400'} text-black`}
                onClick={() => setViewMode('table')}
              >
                表格視圖
              </Button>
              <Button 
                className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-black"
                onClick={clearAllRecords}
              >
                清除記錄
              </Button>
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-primary">遊戲紀錄</h1>

        {records.length === 0 ? (
          <Card className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg text-center w-full">
            <p className="text-lg">尚無遊戲紀錄。玩一場遊戲來查看您的紀錄！</p>
            <div className="mt-4">
              <Link href="/themes">
                <Button className="bg-green-400 hover:bg-green-500 text-black">
                  開始新遊戲
                </Button>
              </Link>
            </div>
          </Card>
        ) : viewMode === 'cards' ? (
          <div className="w-full space-y-4">
            {records.map((record, index) => (
              <Card
                key={index}
                className="p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-3xl shadow-md">
                    {getThemeIcon(record.theme)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                      {record.theme}
                      <span className={`text-sm px-2 py-0.5 rounded-full ${getDifficultyColor(record.difficulty)}`}>
                        {record.difficulty}
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                      <p>{record.formattedDate} {record.formattedTime}</p>
                      {record.turns && <p>回合數: {record.turns}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatTime(record.time)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="w-full p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>主題</TableHead>
                  <TableHead>難度</TableHead>
                  <TableHead>回合數</TableHead>
                  <TableHead>時間</TableHead>
                  <TableHead>日期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center gap-2">
                      <span className="text-xl">{getThemeIcon(record.theme)}</span>
                      {record.theme}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(record.difficulty)}`}>
                        {record.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>{record.turns || "-"}</TableCell>
                    <TableCell>{formatTime(record.time)}</TableCell>
                    <TableCell>{record.formattedDate} {record.formattedTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  )
}

