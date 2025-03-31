"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface MemoryAlertProps {
  previewTime: number;
  onComplete: () => void;
  showDuration?: number; // 彈窗顯示時間，預設3秒
}

export function MemoryAlert({ previewTime, onComplete, showDuration = 3 }: MemoryAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 彈窗顯示指定時間後自動關閉
    const timer = setTimeout(() => {
      setVisible(false);
      // 動畫結束後執行 onComplete 回調
      setTimeout(onComplete, 500); // 考慮到動畫時間
    }, showDuration * 1000);

    return () => clearTimeout(timer);
  }, [onComplete, showDuration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full border-2 border-[#FFE599]"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">⏱️</span>
              </div>
              <h2 className="text-xl font-bold text-[#6B4226] mb-2">準備記憶卡片位置</h2>
              <p className="text-[#6B4226] mb-4">
                您有 <span className="font-bold text-xl bg-yellow-100 px-2 py-1 rounded">{previewTime}秒</span> 的時間記憶所有卡片
              </p>
              <p className="text-sm text-[#6B4226]/70">
                提示將在 {showDuration} 秒後自動關閉
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 