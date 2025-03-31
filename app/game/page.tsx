"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MemoryCard } from "@/components/game/memory-card"
import { GameTimer } from "@/components/game/game-timer"
import { PreviewCountdown } from "@/components/game/preview-countdown"
import { GameResult } from "@/components/game/game-result"
import { MemoryAlert } from "@/components/game/memory-alert"
import { useMemoryGame, GamePhase } from "@/hooks/useMemoryGame"
import { difficulties } from "@/lib/mockData/data"

export default function GamePage() {
  const router = useRouter()
  
  const {
    cards,
    turns,
    choiceOne,
    choiceTwo,
    disabled,
    gameComplete,
    isPreview,
    startTime,
    gameTime,
    selectedTheme,
    selectedDifficulty,
    difficultyPairs,
    currentThemeObj,
    previewTime,
    gamePhase,
    handleChoice,
    shuffleCards,
    resetGame,
    endPreview,
    startPreview
  } = useMemoryGame()

  // 計算網格布局 - 根據難度調整列數
  const getGridCols = () => {
    // 超簡單
    if (difficultyPairs <= 4) return "grid-cols-4"
    // 簡單
    if (difficultyPairs <= 8) return "grid-cols-4 md:grid-cols-4"
    // 中等
    if (difficultyPairs <= 10) return "grid-cols-4 sm:grid-cols-5"
    // 困難
    if (difficultyPairs <= 12) return "grid-cols-4 sm:grid-cols-4 md:grid-cols-6"
    // 專家
    return "grid-cols-4 sm:grid-cols-5 lg:grid-cols-8"
  }

  // 計算卡片容器高度 - 根據難度調整
  const getContainerHeight = () => {
    if (difficultyPairs <= 4) return "h-[65vh] md:h-[70vh]"
    if (difficultyPairs <= 8) return "h-auto min-h-[65vh] md:min-h-[70vh]" // 改為自適應高度
    if (difficultyPairs <= 10) return "h-auto min-h-[70vh] md:min-h-[75vh]" // 改為自適應高度
    if (difficultyPairs <= 12) return "h-auto min-h-[75vh] md:min-h-[78vh]" // 改為自適應高度
    if (difficultyPairs <= 15) return "h-auto min-h-[75vh] md:min-h-[80vh]" // 改為自適應高度
    return "h-auto min-h-[80vh] md:min-h-[85vh]" // 改為自適應高度
  }

  // 計算卡片大小 - 根據卡片數量調整縮放比例
  const getCardSize = () => {
    if (difficultyPairs <= 4) return "transform-none" 
    if (difficultyPairs <= 8) return "transform-none"
    if (difficultyPairs <= 10) return "transform-none"
    if (difficultyPairs <= 12) return "transform-none md:scale-95"
    if (difficultyPairs <= 15) return "transform-none sm:scale-95"
    return "transform-none sm:scale-95 md:scale-90"
  }

  // 計算每行卡片數量 (用於計算行數)
  const getRowCount = () => {
    const cols = difficultyPairs <= 4 ? 4 : 
                 difficultyPairs <= 8 ? 4 : 
                 difficultyPairs <= 10 ? 5 : 
                 difficultyPairs <= 12 ? 6 : 
                 difficultyPairs <= 15 ? 5 : 5;
    
    return Math.ceil((difficultyPairs * 2) / cols);
  }

  // 計算卡片間距
  const getGapSize = () => {
    if (difficultyPairs <= 8) return "gap-3 md:gap-4"
    if (difficultyPairs <= 12) return "gap-2 md:gap-3"
    return "gap-1.5 md:gap-2"
  }

  // 根據難度限制容器最大寬度
  const getContainerMaxWidth = () => {
    // 對於『超簡單，簡單，中等』難度，限制最大寬度為1024px
    if (selectedDifficulty <= 3) {
      return "max-w-[95vw] sm:max-w-[90vw] md:max-w-screen-md"
    }
    // 對於更高難度，允許更寬的容器
    return "max-w-[95vw] 2xl:max-w-[85vw]"
  }

  // 處理遊戲完成
  if (gameComplete) {
    return (
      <GameResult 
        gameTime={gameTime}
        turns={turns}
        onPlayAgain={resetGame}
        onGoHome={() => router.push("/")}
        onBackToThemes={() => router.push("/themes")}
      />
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-3 bg-gradient-to-b from-[#FFF5E1] to-[#D0F0F0]">
      {/* 初始彈窗提示 */}
      {gamePhase === GamePhase.INITIAL_ALERT && (
        <MemoryAlert 
          previewTime={previewTime} 
          onComplete={startPreview} 
          showDuration={3} 
        />
      )}

      <div className={`w-full ${getContainerMaxWidth()} flex flex-col`}>
        <div className="flex flex-wrap justify-between items-center w-full gap-2 mb-1">
          <Button onClick={() => router.push("/")} className="rounded-full bg-[#FF6F61] hover:bg-[#FF5A4C] text-white px-2 py-0.5 h-7 text-xs sm:text-sm">
            ← 返回
          </Button>

          <div className="flex flex-wrap items-center gap-1 sm:gap-2">
            <Card className={`px-2 py-0.5 ${currentThemeObj.color} backdrop-blur-sm rounded-lg bg-[#A2D2FF]`}>
              <p className="text-xs flex items-center gap-1 text-[#4A4A4A]">
                <span className="text-base">{currentThemeObj.emoji}</span>
                <span className="font-bold">{selectedTheme}</span>
              </p>
            </Card>
            
            <Card className="px-2 py-0.5 bg-[#FFE599]/80 backdrop-blur-sm rounded-lg">
              <p className="text-xs text-[#6B4226]">難度：<span className="font-bold">
                {difficulties.find(d => d.id === selectedDifficulty)?.name || "超簡單"}
              </span></p>
            </Card>

            <Button onClick={resetGame} className="rounded-full bg-[#6FCF97] hover:bg-[#5DBF87] text-[#4A4A4A] px-2 py-0.5 h-7 text-xs sm:text-sm">
              新遊戲
            </Button>
          </div>
        </div>

        {gamePhase === GamePhase.PREVIEW ? (
          <PreviewCountdown 
            initialCount={previewTime} 
            onComplete={endPreview}
            className="mb-1" 
          />
        ) : gamePhase === GamePhase.PLAYING ? (
          <div className="w-full flex justify-between items-center px-1 mb-1">
            <p className="text-xs text-[#6B4226]">回合數：<span className="font-bold">{turns}</span></p>
            <GameTimer 
              isRunning={true} 
              startTime={startTime}
              className="text-xs sm:text-sm" 
            />
          </div>
        ) : (
          <div className="w-full h-6 mb-1"></div> // 空白佔位，保持佈局一致
        )}

        <div className={`${getContainerHeight()} w-full flex items-center justify-center overflow-y-auto py-2`}>
          <div className={`grid ${getGridCols()} ${getGapSize()} w-full ${getCardSize()}`} 
               style={{ 
                 minHeight: '1px',
                 alignContent: 'start' // 確保卡片從頂部開始排列
               }}>
            {cards.map((card) => (
              <MemoryCard
                key={card.id}
                card={card}
                flipped={
                  gamePhase === GamePhase.INITIAL_ALERT ? false :
                  gamePhase === GamePhase.PREVIEW ? true :
                  card === choiceOne || card === choiceTwo || card.matched
                }
                handleChoice={handleChoice}
                disabled={gamePhase !== GamePhase.PLAYING || disabled}
                themeColor={`from-${currentThemeObj.color.split('-')[1]} to-${currentThemeObj.color.split('-')[1]}-400`}
                textColor={currentThemeObj.cardTextColor}
                borderColor={currentThemeObj.borderColor}
                customCardColor="from-[#A2D2FF] to-[#6FCF97]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

