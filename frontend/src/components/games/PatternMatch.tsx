import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    // Initialize cards
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, id) => ({ id, icon, isFlipped: false, isMatched: false }));
    setCards(deck);
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].icon === newCards[secondIndex].icon) {
        // Match!
        setTimeout(() => {
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          setCards(newCards);
          setFlippedIndices([]);
          setIsLocked(false);
          
          // Check win
          if (newCards.every(c => c.isMatched)) {
            setTimeout(() => onComplete(), 1500);
          }
        }, 500);
      } else {
        // No match
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

  return (
    <div className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center rounded-3xl bg-primary-container/10 border border-white/20 p-4 md:p-8">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-lg">
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
                >
                  {card.icon}
                </motion.span>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {cards.length > 0 && cards.every(c => c.isMatched) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10"
          >
            <div className="glass-card p-8 rounded-3xl text-center shadow-xl">
              <span className="material-symbols-outlined text-5xl text-secondary mb-4 block">spa</span>
              <h3 className="font-headline-md text-primary text-2xl mb-2">Beautiful harmony!</h3>
              <p className="text-on-surface-variant font-body-md">You've matched all the patterns.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
