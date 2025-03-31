"use client"

import { motion } from "framer-motion"
import Image from "next/image"

// 基本卡片數據接口
export interface CardData {
  id: string;
  name: string;
  en_name: string;
  imageUrl: string;
  alt?: string;
  matched: boolean;
  hideEnglish?: boolean;
}

// 擴展接口，可以包含任何額外屬性
export interface CardProps extends CardData {
  [key: string]: any;
}

interface MemoryCardProps {
  card: CardProps;
  flipped: boolean;
  handleChoice: (card: CardProps) => void;
  disabled: boolean;
  themeColor?: string;
  textColor?: string;
  borderColor?: string;
  showLabel?: boolean;
  customCardColor?: string;
}

export function MemoryCard({ 
  card, 
  flipped, 
  handleChoice, 
  disabled, 
  themeColor = "from-blue-400 to-purple-400", 
  textColor = "text-blue-700",
  borderColor = "border-blue-300",
  showLabel = true,
  customCardColor
}: MemoryCardProps) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card)
    }
  }

  // 使用自定義顏色或主題顏色
  const cardGradient = customCardColor || themeColor;

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: '0.9', maxHeight: 'calc(100vh / 5)' }}>
      <motion.div
        className="w-full h-full cursor-pointer"
        onClick={handleClick}
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 380, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 卡牌正面 (未翻轉時顯示) */}
        <div
          className={`absolute w-full h-full rounded-lg bg-gradient-to-br ${cardGradient} border-2 border-[#FFE599] flex items-center justify-center shadow-md ${
            flipped ? "backface-hidden" : ""
          }`}
        >
        </div>

        {/* 卡牌背面 (翻轉時顯示) */}
        <div
          className={`absolute w-full h-full rounded-lg bg-white border-2 ${borderColor} flex flex-col items-center justify-between shadow-md overflow-hidden ${
            flipped ? "" : "backface-hidden"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* 使用圖片URL */}
          {card.imageUrl && (
            <div className="relative w-full h-full flex flex-col">
              <div className="relative flex-grow flex items-center justify-center p-1">
                <Image 
                  src={card.imageUrl} 
                  alt={card.alt || `${card.name} 圖片`} 
                  fill 
                  priority
                  sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-contain"
                />
              </div>
              
              {/* 卡片名稱 */}
              {showLabel && (
                <div className={`w-full py-1 px-1 text-center font-bold ${textColor || "text-[#6B4226]"} drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)] truncate bg-white/90 backdrop-blur-[2px]`}>
                  <div className="text-[10px] xxs:text-xs sm:text-sm md:text-base truncate leading-tight">{card.name}</div>
                  <div className={`text-[8px] xxs:text-[10px] sm:text-xs md:text-sm italic opacity-80 truncate leading-tight ${card.hideEnglish ? 'hidden sm:block' : ''}`}>{card.en_name}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* 匹配成功的動畫效果 */}
      {card.matched && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl md:text-2xl">✨</span>
          </div>
        </motion.div>
      )}
    </div>
  )
} 