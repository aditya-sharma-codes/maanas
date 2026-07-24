import { Link, useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import React, { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { gameCardVariants, cardVariants } from '../animations/cards';
import { buttonVariants } from '../animations/buttons';
import { useAppStore } from '../store/useAppStore';

const BubblePop = React.lazy(() => import('../components/games/BubblePop').then(m => ({ default: m.BubblePop })));
const PatternMatch = React.lazy(() => import('../components/games/PatternMatch').then(m => ({ default: m.PatternMatch })));
const ColorHarmony = React.lazy(() => import('../components/games/ColorHarmony').then(m => ({ default: m.ColorHarmony })));

type GameType = 'bubble' | 'pattern' | 'color' | null;

export const Games = () => {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [justFinished, setJustFinished] = useState<string | null>(null);
  const { deviceId } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!deviceId) {
      navigate('/onboarding');
    }
  }, [deviceId, navigate]);

  const gamesList = [
    { id: 'bubble', title: 'Bubble Pop', desc: 'Pop endless bubbles to release tension.', icon: 'radio_button_unchecked' },
    { id: 'pattern', title: 'Pattern Match', desc: 'Focus your mind on a simple matching puzzle.', icon: 'extension' },
    { id: 'color', title: 'Color Harmony', desc: 'Organize colors to restore inner order.', icon: 'palette' }
  ] as const;

  const handleGameComplete = (gameTitle: string) => {
    setActiveGame(null);
    setJustFinished(gameTitle);
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background min-h-screen flex flex-col font-body-md overflow-x-hidden"
    >
      <header className="bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-3xl text-primary tracking-tight uppercase">MANAS</Link>
        </div>
        <Link to="/dashboard" className="text-primary hover:underline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span> Back to Weather
        </Link>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10 w-full pt-28 max-w-container-max mx-auto h-full">
        <AnimatePresence mode="wait">
          {!activeGame ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              <div className="text-center mb-12">
                <h1 className="font-headline-md text-primary text-4xl mb-4">Mental Resets</h1>
                <p className="text-on-surface-variant font-body-lg">Quick mini-games to break rumination loops.</p>
              </div>

              <motion.div 
                variants={containerVariants}
                initial="initial"
                animate="animate"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-16"
              >
                {gamesList.map((game) => (
                  <motion.div 
                    variants={gameCardVariants}
                    key={game.id} 
                    onClick={() => setActiveGame(game.id as GameType)}
                    className="glass-card p-8 rounded-3xl flex flex-col items-center text-center cursor-pointer group bg-white/40"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                      <span className="material-symbols-outlined text-3xl">{game.icon}</span>
                    </div>
                    <h3 className="font-headline-md text-on-surface text-xl mb-2">{game.title}</h3>
                    <p className="text-on-surface-variant text-sm mb-6 flex-grow">{game.desc}</p>
                    <button className="glass-button-primary px-6 py-2 w-full font-bold pointer-events-none">Play Now</button>
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div variants={cardVariants} className="bg-surface-container-low/50 backdrop-blur-md p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 w-full max-w-3xl border border-white/40 shadow-sm">
                 <Mascot state="Games" className="w-32 h-32" />
                 <div>
                    <h3 className="font-headline-md text-primary mb-2 text-xl">
                      {justFinished ? `Wonderful job completing ${justFinished}!` : 'Great job taking a break!'}
                    </h3>
                    <p className="text-on-surface-variant font-body-md">
                      {justFinished 
                        ? "Every small moment of calm matters. Ready for another relaxing activity?" 
                        : "Did you know that taking just 3 minutes to redirect your focus can lower cortisol levels?"}
                    </p>
                 </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              key="game"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
              className="w-full flex flex-col items-center max-w-5xl"
            >
              <div className="w-full flex justify-between items-center mb-8">
                <h2 className="font-headline-md text-primary text-2xl">
                  {gamesList.find(g => g.id === activeGame)?.title}
                </h2>
                <motion.button 
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => setActiveGame(null)}
                  className="text-primary hover:bg-primary/10 px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span> Exit Game
                </motion.button>
              </div>

              <div className="w-full bg-white/40 backdrop-blur-md rounded-[2.5rem] shadow-lg border border-white/50 p-4 md:p-8">
                <Suspense fallback={
                  <div className="w-full h-[60vh] flex flex-col items-center justify-center text-primary">
                     <span className="material-symbols-outlined text-4xl animate-spin mb-4">progress_activity</span>
                     Loading...
                  </div>
                }>
                  {activeGame === 'bubble' && <BubblePop onComplete={() => handleGameComplete('Bubble Pop')} />}
                  {activeGame === 'pattern' && <PatternMatch onComplete={() => handleGameComplete('Pattern Match')} />}
                  {activeGame === 'color' && <ColorHarmony onComplete={() => handleGameComplete('Color Harmony')} />}
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </motion.div>
  );
};
