"use client"

import { useState, useEffect } from "react"

interface GameTimerProps {
  isRunning: boolean;
  startTime: Date | null;
  className?: string;
}

export function GameTimer({ isRunning, startTime, className = "" }: GameTimerProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && startTime) {
      // 更新計時器
      intervalId = setInterval(() => {
        const currentTime = new Date();
        const timeElapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
        setElapsedTime(timeElapsed);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  // 格式化時間
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center justify-center whitespace-nowrap ${className}`}>
      <span className="font-mono font-bold bg-[#FFE599]/80 px-1.5 py-0.5 rounded-md text-[#6B4226]">{formatTime(elapsedTime)}</span>
    </div>
  );
} 