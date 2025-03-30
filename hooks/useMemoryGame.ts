import { useState, useEffect, useCallback } from 'react';
import { CardProps } from '@/components/game/memory-card';
import { difficulties, themes } from '@/lib/mockData/data';

// 擴展 CardProps 接口，添加 pairId 屬性
export interface GameCard extends CardProps {
  pairId: string;
}

interface UseMemoryGameProps {
  initialTheme?: string;
  initialDifficulty?: number;
}

interface UseMemoryGameReturn {
  cards: GameCard[];
  turns: number;
  choiceOne: GameCard | null;
  choiceTwo: GameCard | null;
  disabled: boolean;
  gameComplete: boolean;
  isPreview: boolean;
  startTime: Date | null;
  gameTime: number;
  selectedTheme: string;
  selectedDifficulty: number;
  difficultyPairs: number;
  currentThemeObj: any;
  handleChoice: (card: CardProps) => void;
  shuffleCards: (themeObj?: any, pairs?: number) => void;
  resetGame: () => void;
  endPreview: () => void;
}

export function useMemoryGame({
  initialTheme = '動物',
  initialDifficulty = 1
}: UseMemoryGameProps = {}): UseMemoryGameReturn {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<GameCard | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<GameCard | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<string>(initialTheme);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(initialDifficulty);
  const [difficultyPairs, setDifficultyPairs] = useState<number>(8);
  const [currentThemeObj, setCurrentThemeObj] = useState(themes[0]);
  const [hasRecorded, setHasRecorded] = useState(false);

  // 載入選擇的主題和難度
  useEffect(() => {
    const theme = localStorage.getItem("selectedTheme");
    const difficulty = localStorage.getItem("selectedDifficulty");
    
    const themeObj = themes.find(t => t.name === (theme || selectedTheme)) || themes[0];
    setCurrentThemeObj(themeObj);
    
    if (theme) setSelectedTheme(theme);
    if (difficulty) setSelectedDifficulty(parseInt(difficulty));
    
    // 獲取難度的卡牌對數
    const difficultyObj = difficulties.find(d => d.id === (difficulty ? parseInt(difficulty) : 1));
    if (difficultyObj) setDifficultyPairs(difficultyObj.pairs);
    
  }, [selectedTheme]);

  // 準備卡牌
  const shuffleCards = useCallback((themeObj = currentThemeObj, pairs = difficultyPairs) => {
    // 獲取選擇的主題和相應的卡片
    const availableCards = [...themeObj.cards].sort(() => Math.random() - 0.5).slice(0, pairs);
    
    // 判斷是否屬於高難度模式，在高難度下隱藏英文
    // 現在只有在專家模式(20對)下才會在小螢幕隱藏英文
    const isHighDifficulty = pairs >= 20;
    
    // 複製卡牌創建配對並打亂順序
    const shuffledCards = availableCards.flatMap((card, index) => {
      // 為每對卡牌創建兩個副本，但具有相同的pairId以便匹配
      const pairId = `pair-${index}`;
      return [
        { ...card, id: `${card.id}-a`, pairId, matched: false, hideEnglish: isHighDifficulty },
        { ...card, id: `${card.id}-b`, pairId, matched: false, hideEnglish: isHighDifficulty }
      ];
    }).sort(() => Math.random() - 0.5);

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    setTurns(0);
    setGameComplete(false);
    setIsPreview(true);
    setGameTime(0);
    setStartTime(null);
    setHasRecorded(false);
  }, [currentThemeObj, difficultyPairs]);

  // 初始化遊戲
  useEffect(() => {
    shuffleCards();
  }, [shuffleCards]);

  // 處理卡牌選擇
  const handleChoice = useCallback((card: CardProps) => {
    if (isPreview || disabled) return; // 預覽期間或已禁用時阻止卡牌選擇

    if (choiceOne && choiceOne.id !== card.id) {
      setChoiceTwo(card as GameCard);
    } else if (!choiceOne) {
      setChoiceOne(card as GameCard);
    }
  }, [choiceOne, isPreview, disabled]);

  // 重置選擇並增加回合數
  const resetTurn = useCallback(() => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  }, []);

  // 比較選擇的卡牌
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.pairId === choiceTwo.pairId) {
        // 找到匹配
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.pairId === choiceOne.pairId) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setTimeout(() => resetTurn(), 1000);
      } else {
        // 沒有匹配
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo, resetTurn]);

  // 檢查遊戲是否完成
  useEffect(() => {
    if (!isPreview && cards.length > 0 && cards.every((card) => card.matched) && !hasRecorded) {
      setGameComplete(true);
      if (startTime) {
        const endTime = new Date();
        const timeDiff = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        setGameTime(timeDiff);

        // 保存到localStorage
        try {
          const records = JSON.parse(localStorage.getItem("gameRecords") || "[]");
          records.push({
            theme: selectedTheme,
            difficulty: difficulties.find(d => d.id === selectedDifficulty)?.name || "超簡單",
            time: timeDiff,
            turns,
            date: new Date().toISOString(),
          });
          localStorage.setItem("gameRecords", JSON.stringify(records));
          setHasRecorded(true);
        } catch (error) {
          console.error("保存遊戲紀錄失敗", error);
        }
      }
    }
  }, [cards, startTime, isPreview, selectedTheme, selectedDifficulty, turns, hasRecorded]);

  // 重置遊戲
  const resetGame = useCallback(() => {
    shuffleCards();
  }, [shuffleCards]);

  // 結束預覽
  const endPreview = useCallback(() => {
    setIsPreview(false);
    setStartTime(new Date());
  }, []);

  return {
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
    handleChoice,
    shuffleCards,
    resetGame,
    endPreview
  };
} 