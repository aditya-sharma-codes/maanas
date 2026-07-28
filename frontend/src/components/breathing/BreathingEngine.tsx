import { useState, useEffect } from 'react';
import { Mascot } from '../Mascot';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

export interface BreathingPhase {
  name: string;
  duration: number; // in seconds
  instruction: string;
  colorClass: string;
  scaleInhale?: boolean; // if true, circle grows
  scaleExhale?: boolean; // if true, circle shrinks
}

export interface BreathingEngineProps {
  title: string;
  description: string;
  phases: BreathingPhase[];
  onComplete?: () => void;
}

export const BreathingEngine = ({ title, description, phases, onComplete }: BreathingEngineProps) => {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(phases[0].duration);
  const [cycles, setCycles] = useState(0);
  const { recordActivity } = useAppStore();
  
  const currentPhase = phases[phaseIndex];

  // Phase transitions
  useEffect(() => {
    if (!isActive) {
      setPhaseIndex(0);
      setTimeLeft(phases[0].duration);
      setCycles(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          let nextIndex = phaseIndex + 1;
          if (nextIndex >= phases.length) {
            nextIndex = 0;
            const newCycles = cycles + 1;
            setCycles(newCycles);
            if (newCycles >= 3) {
              // Mark as completed after 3 cycles (example threshold)
              recordActivity('breathing');
              if (onComplete) onComplete();
            }
          }
          setPhaseIndex(nextIndex);
          return phases[nextIndex].duration;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, phaseIndex, phases, cycles, recordActivity, onComplete]);

  // SVG dash offset calculation
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((currentPhase.duration - timeLeft) / currentPhase.duration) * circumference;

  const getScale = () => {
    if (!isActive) return 1;
    if (currentPhase.scaleInhale) return 1.15;
    if (currentPhase.scaleExhale) return 1;
    // Hold phase uses previous scale
    const prevPhase = phaseIndex > 0 ? phases[phaseIndex - 1] : phases[phases.length - 1];
    if (prevPhase.scaleInhale) return 1.15;
    return 1;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-center mb-8">
        <h1 className="font-headline-md text-primary text-4xl mb-4">{title}</h1>
        <p className="text-on-surface-variant font-body-lg max-w-md mx-auto">
          {description}
        </p>
      </div>

      {/* Breathing Circle Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-square mb-10">
        <AnimatePresence>
          {isActive && (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.3 }}
                animate={{ 
                  scale: getScale() * 1.2,
                  opacity: currentPhase.scaleExhale ? 0.1 : 0.4
                }}
                transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
                className="absolute w-72 h-72 rounded-full bg-primary/10 border border-primary/20 -z-10"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Breathing Ring */}
        <motion.div 
          animate={{ 
            scale: getScale(),
            boxShadow: isActive ? '0 20px 40px rgba(47, 107, 135, 0.15)' : '0 10px 20px rgba(47, 107, 135, 0.05)'
          }}
          transition={{ duration: currentPhase.duration, ease: "easeInOut" }}
          className="w-80 h-80 rounded-full glass-card flex flex-col items-center justify-center p-8 relative border-2 border-white/60 bg-white/50 backdrop-blur-xl"
        >
          {isActive && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={radius} fill="none" className="text-surface-container stroke-current" strokeWidth="1.5" />
              <motion.circle 
                cx="60" cy="60" r={radius} fill="none" className="text-primary stroke-current" strokeWidth="2.5" strokeLinecap="round"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset,
                  transition: 'stroke-dashoffset 1s linear'
                }}
              />
            </svg>
          )}

          <div className="w-40 h-40 flex items-center justify-center z-10">
            <Mascot state={isActive ? 'Breathing' : 'Partly Cloudy'} className="w-32 h-32" />
          </div>
        </motion.div>
      </div>

      {/* Phase Details / Instructions */}
      <div className="text-center min-h-[120px] flex flex-col justify-center items-center px-4 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isActive ? currentPhase.name : 'inactive'}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {isActive ? (
              <>
                <h2 className={`font-headline-md text-3xl font-bold uppercase tracking-wider mb-2 ${currentPhase.colorClass}`}>
                  {currentPhase.name}
                </h2>
                <p className="text-on-surface-variant font-body-md text-base leading-relaxed">
                  {currentPhase.instruction}
                </p>
                <span className="font-display-lg text-4xl text-primary font-bold mt-4 bg-primary-container/20 w-12 h-12 flex items-center justify-center rounded-full">
                  {timeLeft}
                </span>
              </>
            ) : (
              <p className="text-on-surface-variant font-body-lg text-base">
                Click below to begin your calming session.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-center z-20">
        {!isActive ? (
          <motion.button 
            onClick={() => setIsActive(true)} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-on-primary font-body-md px-10 py-4 rounded-full shadow-lg font-bold hover:bg-surface-tint transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">play_arrow</span> Start Session
          </motion.button>
        ) : (
          <motion.button 
            onClick={() => setIsActive(false)} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-surface-variant text-on-surface hover:bg-surface-container-highest px-8 py-3 rounded-full font-bold flex items-center gap-2 border border-outline-variant/30 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">stop</span> End Session
          </motion.button>
        )}
      </div>
    </div>
  );
};
