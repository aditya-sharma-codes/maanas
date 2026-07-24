import { Link, useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations/page';
import { useAppStore } from '../store/useAppStore';

type PhaseType = 'Inhale' | 'Hold' | 'Exhale' | 'Hold (Empty)';

export const Breathing = () => {
  const [phase, setPhase] = useState<PhaseType>('Inhale');
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(4);
  const { deviceId } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!deviceId) {
      navigate('/onboarding');
    }
  }, [deviceId, navigate]);

  // Phase transitions
  useEffect(() => {
    if (!isActive) {
      setPhase('Inhale');
      setTimeLeft(4);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Switch phase
          setPhase((currentPhase) => {
            switch (currentPhase) {
              case 'Inhale': return 'Hold';
              case 'Hold': return 'Exhale';
              case 'Exhale': return 'Hold (Empty)';
              case 'Hold (Empty)': return 'Inhale';
              default: return 'Inhale';
            }
          });
          return 4; // Reset phase duration to 4 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const getPhaseInstruction = (p: PhaseType) => {
    switch (p) {
      case 'Inhale': return 'Breathe in slowly through your nose.';
      case 'Hold': return 'Hold your breath and stay still.';
      case 'Exhale': return 'Release the air gently through your mouth.';
      case 'Hold (Empty)': return 'Rest and wait for the next cycle.';
    }
  };

  const getPhaseColor = (p: PhaseType) => {
    switch (p) {
      case 'Inhale': return 'text-primary';
      case 'Hold': return 'text-secondary';
      case 'Exhale': return 'text-tertiary';
      case 'Hold (Empty)': return 'text-outline';
    }
  };

  // SVG dash offset calculation for the 4-second countdown
  // 360px perimeter -> 2 * Math.PI * r (radius = 57) approx 358px
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - ((4 - timeLeft) / 4) * circumference;

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden"
    >
      {/* Navbar */}
      <header className="bg-white/40 dark:bg-surface-container/40 backdrop-blur-xl border-b border-white/20 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-3xl text-primary tracking-tight uppercase">MANAS</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Weather</Link>
            <Link to="/games" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Games</Link>
            <Link to="/breathing" className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md">Breathing</Link>
            <Link to="/counseling" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Counseling</Link>
          </nav>
        </div>
        <Link to="/dashboard" className="text-primary hover:underline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span> Back to Weather
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-margin-desktop relative z-10 w-full pt-28 max-w-container-max mx-auto h-full">
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-primary text-4xl mb-4">Box Breathing</h1>
          <p className="text-on-surface-variant font-body-lg max-w-md mx-auto">
            Regulate your autonomic nervous system using the classic 4-4-4-4 technique.
          </p>
        </div>

        {/* Breathing Circle Container */}
        <div className="relative flex flex-col items-center justify-center w-full max-w-md aspect-square mb-10">
          {/* External Pulsing Rings (Visual Atmosphere) */}
          <AnimatePresence>
            {isActive && (
              <>
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.3 }}
                  animate={{ 
                    scale: phase === 'Inhale' ? 1.4 : phase === 'Hold' ? 1.4 : 0.8,
                    opacity: phase === 'Exhale' ? 0.1 : 0.4
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute w-72 h-72 rounded-full bg-primary/10 border border-primary/20 -z-10"
                />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0.15 }}
                  animate={{ 
                    scale: phase === 'Inhale' ? 1.6 : phase === 'Hold' ? 1.6 : 0.9,
                    opacity: phase === 'Exhale' ? 0.05 : 0.2
                  }}
                  transition={{ duration: 4, ease: "easeInOut", delay: 0.2 }}
                  className="absolute w-72 h-72 rounded-full bg-secondary/5 border border-secondary/10 -z-10"
                />
              </>
            )}
          </AnimatePresence>

          {/* Main Breathing Ring */}
          <motion.div 
            animate={{ 
              scale: phase === 'Inhale' ? 1.15 : phase === 'Hold' ? 1.15 : 1,
              boxShadow: phase === 'Hold' 
                ? '0 0 40px rgba(47, 107, 135, 0.2)' 
                : '0 20px 40px rgba(47, 107, 135, 0.08)'
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="w-80 h-80 rounded-full glass-card flex flex-col items-center justify-center p-8 relative border-2 border-white/60 bg-white/50 backdrop-blur-xl"
          >
            {/* SVG Progress Circle wrapper */}
            {isActive && (
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="none" 
                  className="text-surface-container stroke-current" 
                  strokeWidth="1.5" 
                />
                <motion.circle 
                  cx="60" 
                  cy="60" 
                  r={radius} 
                  fill="none" 
                  className="text-primary stroke-current" 
                  strokeWidth="2.5" 
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                    transition: 'stroke-dashoffset 1s linear'
                  }}
                />
              </svg>
            )}

            {/* Mascot in the Center */}
            <div className="w-40 h-40 flex items-center justify-center z-10">
              <Mascot state={isActive ? 'Breathing' : 'Partly Cloudy'} className="w-32 h-32" />
            </div>
          </motion.div>
        </div>

        {/* Phase Details / Instructions */}
        <div className="text-center min-h-[120px] flex flex-col justify-center items-center px-4 max-w-md">
          <AnimatePresence mode="wait">
            <motion.div
              key={isActive ? phase : 'inactive'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center"
            >
              {isActive ? (
                <>
                  <h2 className={`font-headline-md text-3xl font-bold uppercase tracking-wider mb-2 ${getPhaseColor(phase)}`}>
                    {phase === 'Hold (Empty)' ? 'Hold' : phase}
                  </h2>
                  <p className="text-on-surface-variant font-body-md text-base leading-relaxed">
                    {getPhaseInstruction(phase)}
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
      </main>
    </motion.div>
  );
};
