import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { triggerConfetti } from '../../services/rewardEngine';

const ICONS = ['eco', 'cloud', 'star', 'local_florist', 'wb_sunny', 'water_drop'];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const PatternMatch = ({ onComplete }: { onComplete: () => void }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  
  const { updateGameMetrics, gameProgress, recordActivity } = useAppStore();
  const bestScore = gameProgress['pattern_match']?.bestScore;

  const initializeGame = () => {
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, isFlipped: false, isMatched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setIsLocked(false);
    setMoves(0);
    setMatches(0);
    setTimeElapsed(0);
    setIsFinished(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleCardClick = (index: number) => {
    // Disable interaction if cards are locked, already flipped, or matched
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true); // Disable further clicks
      setMoves(prev => prev + 1);
      
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        // Match!
        setTimeout(() => {
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          setCards(newCards);
          setFlippedIndices([]);
          setIsLocked(false);
          
          const newMatches = matches + 1;
          setMatches(newMatches);
          
          // Check win
          if (newMatches === ICONS.length) {
            handleWin();
          }
        }, 500);
      } else {
        // No match - Wait briefly, then flip back
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  const handleWin = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFinished(true);
    triggerConfetti();
    
    // Save to store
    updateGameMetrics('pattern_match', {
      moves: moves + 1, // include the last move
      timeElapsed,
      matches: ICONS.length,
      completedAt: Date.now()
    });
    recordActivity('game');
    
    setTimeout(() => onComplete(), 3000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative w-full min-h-[60vh] flex flex-col items-center justify-center rounded-3xl bg-primary-container/10 border border-white/20 p-4 md:p-8">
      {/* Game Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 px-2">
        <div className="flex flex-col">
          <span className="font-label-caps text-on-surface-variant uppercase text-xs">Moves</span>
          <span className="font-headline-md text-primary">{moves}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-label-caps text-on-surface-variant uppercase text-xs">Time</span>
          <span className="font-headline-md text-primary">{formatTime(timeElapsed)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-label-caps text-on-surface-variant uppercase text-xs">Best (Moves)</span>
          <span className="font-headline-md text-primary">{bestScore || '-'}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-lg mb-8 relative z-10">
        {cards.map((card, idx) => (
          <div key={card.id} className="relative w-full aspect-square perspective-1000">
            <motion.div
              className="w-full h-full relative preserve-3d cursor-pointer"
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              onClick={() => handleCardClick(idx)}
              whileHover={!card.isFlipped && !card.isMatched && !isLocked ? { scale: 1.05 } : {}}
              whileTap={!card.isFlipped && !card.isMatched && !isLocked ? { scale: 0.95 } : {}}
            >
              {/* Front (Hidden) */}
              <div className="absolute inset-0 backface-hidden bg-white/40 border border-white/40 rounded-2xl flex items-center justify-center shadow-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10"></div>
              </div>
              
              {/* Back (Revealed) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border border-primary/20 rounded-2xl flex items-center justify-center shadow-md">
                <motion.span 
                  className={`material-symbols-outlined text-4xl ${card.isMatched ? 'text-secondary' : 'text-primary'}`}
                  animate={card.isMatched ? { scale: [1, 1.2, 1], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(1)'] } : {}}
                  transition={{ duration: 0.5 }}
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {card.icon}
                </motion.span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <button 
        onClick={initializeGame}
        className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label-caps text-sm bg-white/50 px-4 py-2 rounded-full border border-outline-variant/30 relative z-20"
      >
        <span className="material-symbols-outlined text-sm">refresh</span>
        Restart Game
      </button>

      {/* Completion Overlay */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md z-30 rounded-3xl"
          >
            <div className="glass-card p-10 rounded-3xl text-center shadow-2xl flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-secondary mb-4 block" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <h3 className="font-headline-md text-primary text-3xl mb-2">Beautiful harmony!</h3>
              <p className="text-on-surface-variant font-body-md mb-6">You've matched all the patterns in {moves} moves.</p>
              <div className="flex gap-4 w-full">
                <div className="flex-1 bg-surface-container py-2 rounded-xl text-center">
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Time</div>
                  <div className="text-primary font-bold">{formatTime(timeElapsed)}</div>
                </div>
                <div className="flex-1 bg-surface-container py-2 rounded-xl text-center">
                  <div className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">Moves</div>
                  <div className="text-primary font-bold">{moves}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
