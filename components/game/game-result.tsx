"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface GameResultProps {
  gameTime: number;
  turns: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
  onBackToThemes?: () => void;
}

export function GameResult({ gameTime, turns, onPlayAgain, onGoHome, onBackToThemes }: GameResultProps) {
  // 格式化時間
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FFF5E1] to-[#D0F0F0]">
      <Card className="w-full max-w-xs sm:max-w-sm p-4 sm:p-5 bg-white/80 backdrop-blur-sm rounded-xl shadow-md text-center">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-[#6B4226]">遊戲完成！ 🎉</h1>

          <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-[#FFE599] rounded-full mb-1">
            <span className="text-2xl sm:text-3xl">🏆</span>
          </div>

          <div className="space-y-1">
            <p className="text-lg font-semibold text-[#6B4226]">花費時間：{formatTime(gameTime)}</p>
            <p className="text-base text-[#6B4226]">回合數：{turns}</p>
            
            <div className="text-xs sm:text-sm text-[#4A4A4A] mt-1 bg-[#A2D2FF]/20 p-1 rounded">
              {turns <= 10 ? 
                "太厲害了！你的記憶力真棒！" : 
                turns <= 20 ? 
                  "很棒的表現！繼續練習吧！" : 
                  "加油！下次一定會更好！"
              }
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 justify-center">
            <Button
              onClick={onPlayAgain}
              className="h-8 sm:h-9 px-3 text-sm rounded-full bg-[#6FCF97] hover:bg-[#5DBF87] text-[#4A4A4A]"
            >
              再玩一次
            </Button>

            {onBackToThemes && (
              <Button
                onClick={onBackToThemes}
                className="h-8 sm:h-9 px-3 text-sm rounded-full bg-[#A2D2FF] hover:bg-[#8BC0F0] text-[#4A4A4A]"
              >
                返回主題
              </Button>
            )}

            <Button
              onClick={onGoHome}
              className="h-8 sm:h-9 px-3 text-sm rounded-full bg-[#FF6F61] hover:bg-[#FF5A4C] text-white"
            >
              回首頁
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
} 