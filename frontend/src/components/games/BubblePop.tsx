import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BubblePop = ({ onComplete }: { onComplete: () => void }) => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [popped, setPopped] = useState<number[]>([]);
  const totalBubbles = 15;

  useEffect(() => {
    // Generate initial bubbles
    const newBubbles = Array.from({ length: totalBubbles }).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10% to 90% width
      y: Math.random() * 60 + 20, // 20% to 80% height
      size: Math.random() * 40 + 40, // 40px to 80px
    }));
    setBubbles(newBubbles);
  }, []);

  const handlePop = (id: number) => {
    if (!popped.includes(id)) {
      const newPopped = [...popped, id];
      setPopped(newPopped);
      if (newPopped.length === totalBubbles) {
        setTimeout(() => onComplete(), 1500);
      }
    }
  };

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden rounded-3xl bg-primary-container/10 border border-white/20">
      <div className="absolute top-4 left-4 font-label-caps text-primary bg-white/50 px-4 py-1 rounded-full">
        {popped.length} / {totalBubbles} Popped
      </div>
      
      <AnimatePresence>
        {bubbles.map(bubble => {
          if (popped.includes(bubble.id)) return null;
          return (
            <motion.button
              key={bubble.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 0.8,
                y: [0, -20, 20, 0],
                x: [0, 10, -10, 0]
              }}
              exit={{ scale: 2, opacity: 0, filter: "blur(4px)" }}
              transition={{ 
                scale: { type: "spring", stiffness: 200, damping: 20 },
                y: { duration: 4 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                x: { duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" },
                exit: { duration: 0.3 }
              }}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => handlePop(bubble.id)}
              className="absolute rounded-full border border-primary/20 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm shadow-sm flex items-center justify-center group"
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: bubble.size,
                height: bubble.size,
              }}
            >
              <div className="w-1/3 h-1/3 bg-white/40 rounded-full absolute top-2 right-2 blur-[2px] group-hover:bg-white/60 transition-colors"></div>
            </motion.button>
          )
        })}
      </AnimatePresence>

      <AnimatePresence>
        {popped.length === totalBubbles && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-10"
          >
            <div className="glass-card p-8 rounded-3xl text-center shadow-xl">
              <span className="material-symbols-outlined text-5xl text-primary mb-4 block">self_improvement</span>
              <h3 className="font-headline-md text-primary text-2xl mb-2">Great job!</h3>
              <p className="text-on-surface-variant font-body-md">Take a deep breath.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
