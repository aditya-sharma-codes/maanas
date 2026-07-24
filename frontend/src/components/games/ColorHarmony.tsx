import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// A calming teal/blue gradient sequence
const TARGET_COLORS = [
  '#e0f7fa',
  '#b2ebf2',
  '#80deea',
  '#4dd0e1',
  '#26c6da',
  '#00bcd4',
  '#00acc1',
];

export const ColorHarmony = ({ onComplete }: { onComplete: () => void }) => {
  const [colors, setColors] = useState<{ id: string; color: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    // Shuffle the target colors to start
    const shuffled = [...TARGET_COLORS]
      .map(color => ({ id: Math.random().toString(), color }))
      .sort(() => Math.random() - 0.5);
    setColors(shuffled);
  }, []);

  const handleColorClick = (index: number) => {
    if (isWon) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex !== index) {
        // Swap colors
        const newColors = [...colors];
        const temp = newColors[selectedIndex];
        newColors[selectedIndex] = newColors[index];
        newColors[index] = temp;
        setColors(newColors);

        // Check win condition
        const isSorted = newColors.every((c, i) => c.color === TARGET_COLORS[i]);
        if (isSorted) {
          setIsWon(true);
          setTimeout(() => onComplete(), 2000);
        }
      }
      setSelectedIndex(null);
    }
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] flex flex-col items-center justify-center rounded-3xl bg-primary-container/10 border border-white/20 p-8">
      <p className="text-on-surface-variant font-body-md mb-8 text-center">
        Tap a color, then tap another to swap them. Organize them from lightest to darkest.
      </p>

      <div className="flex w-full max-w-2xl h-32 md:h-48 rounded-2xl overflow-hidden shadow-inner border border-outline-variant/30 bg-white/40 p-2 gap-2">
        {colors.map((item, index) => {
          const isSelected = selectedIndex === index;
          return (
            <motion.button
              key={item.id}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={() => handleColorClick(index)}
              className="flex-1 rounded-xl relative overflow-hidden"
              style={{ backgroundColor: item.color }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSelected && (
                <motion.div 
                  layoutId="outline"
                  className="absolute inset-0 border-4 border-primary rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {isWon && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10 rounded-3xl"
          >
            <div className="glass-card p-8 rounded-3xl text-center shadow-xl">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 block">palette</span>
              <h3 className="font-headline-md text-primary text-2xl mb-2">Perfect Harmony!</h3>
              <p className="text-on-surface-variant font-body-md">You've restored the balance.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
