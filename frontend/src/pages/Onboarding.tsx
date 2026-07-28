import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Mascot } from '../components/Mascot';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page';

export const Onboarding = () => {
  const navigate = useNavigate();
  const { studentToken, initializeToken } = useAppStore();

  useEffect(() => {
    // Generate the token if it doesn't exist
    if (!studentToken) {
      initializeToken();
    }
  }, [studentToken, initializeToken]);

  const handleStart = () => {
    navigate('/assessment');
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background min-h-screen flex items-center justify-center font-body-md overflow-x-hidden relative p-4"
    >
      <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl glass-glow pointer-events-none scale-150"></div>
      
      <div className="glass-card p-12 rounded-[3rem] w-full max-w-xl relative z-10 flex flex-col items-center text-center shadow-2xl">
        <Mascot state="Sunny" className="w-32 h-32 mb-6 drop-shadow-xl" />
        
        <h1 className="font-display-lg-mobile text-primary mb-4">Welcome to MANAS</h1>
        <p className="text-on-surface-variant mb-4 font-body-lg">
          Your personal space for mental clarity and calm.
        </p>

        {studentToken && (
          <div className="bg-surface-container py-3 px-6 rounded-2xl mb-8 flex flex-col items-center border border-outline-variant/30">
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Your Anonymous ID</span>
            <span className="font-mono text-xl text-primary font-bold">{studentToken}</span>
          </div>
        )}

        <button 
          onClick={handleStart}
          className="mt-4 px-12 py-4 rounded-full font-bold text-lg w-full transition-all flex justify-center items-center gap-2 glass-button-primary hover:scale-105"
        >
          Start Stress Check <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <div className="mt-8 flex items-center gap-2 text-on-surface-variant text-sm bg-white/40 px-4 py-2 rounded-full border border-white/50">
          <span className="material-symbols-outlined text-sm">lock</span>
          100% Anonymous. Your privacy is guaranteed.
        </div>
      </div>
    </motion.div>
  );
};
