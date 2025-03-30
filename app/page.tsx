import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { themes } from "@/lib/mockData/data"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-pink-100 via-blue-100 to-green-100">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary drop-shadow-sm">記憶配對遊戲</h1>
        <p className="text-xl text-muted-foreground">適合兒童的有趣記憶遊戲！訓練專注力和記憶力</p>

        <Card className="w-full p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="flex flex-col gap-4">
            <Link href="/themes">
              <Button className="w-full h-16 text-xl rounded-full bg-yellow-400 hover:bg-yellow-500 text-black">
                <span className="mr-2">🎮</span> 開始遊戲
              </Button>
            </Link>

            <Link href="/records">
              <Button className="w-full h-16 text-xl rounded-full bg-green-400 hover:bg-green-500 text-black">
                <span className="mr-2">📊</span> 查看紀錄
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="w-full p-5 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
          <div className="text-left">
            <h2 className="text-xl font-bold mb-2">遊戲說明</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>選擇你喜歡的主題和難度等級</li>
              <li>仔細記住每張卡片的位置</li>
              <li>點擊卡片找到配對的圖案</li>
              <li>找出所有配對即可通過遊戲</li>
              <li>挑戰自己，用最少的回合完成！</li>
            </ul>
          </div>
        </Card>
      </div>
    </main>
  )
}

