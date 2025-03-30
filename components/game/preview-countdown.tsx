"use client"

import { useState, useEffect } from "react"

interface PreviewCountdownProps {
  initialCount: number;
  onComplete: () => void;
  className?: string;
}

export function PreviewCountdown({ initialCount, onComplete, className = "" }: PreviewCountdownProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // 創建倒計時邏輯
    const timer = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 0);
          return 0;
        }
        return prevCount - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialCount, onComplete]);

  return (
    <div className={`bg-[#FFE599] py-1 px-2 rounded-lg text-center w-full ${className}`}>
      <p className="text-xs font-bold text-[#6B4226]">記住卡片位置，<span className="font-mono text-sm bg-[#FFF5E1] px-1 rounded">{count}</span> 秒後開始</p>
    </div>
  );
} 