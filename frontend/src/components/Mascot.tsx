import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';

import sunnyImg from '../assets/mascots/sunny.jpg';
import partlyCloudyImg from '../assets/mascots/partly_cloudy.jpg';
import cloudyImg from '../assets/mascots/cloudy.jpg';
import stormyImg from '../assets/mascots/stormy.jpg';
import idleImg from '../assets/mascots/idle.jpg';

interface MascotProps {
  state?: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Stormy' | 'Breathing' | 'Games' | 'Loading';
  className?: string;
}

export const Mascot = ({ state, className = '' }: MascotProps) => {
  const storeState = useAppStore((s) => s.assessmentHistory);
  const latestWeather = storeState.length > 0 ? storeState[storeState.length - 1].weatherCategory : 'Loading';
  
  const activeState = state || latestWeather;

  let imageSrc = idleImg;
  let animationProps = {};
  const prefersReducedMotion = useReducedMotion();

  switch (activeState) {
    case 'Sunny':
    case 'Games': // Celebration
      imageSrc = sunnyImg;
      animationProps = {
        animate: { y: [0, -12, 0], scale: [1, 1.01, 1] },
        transition: { duration: 6, ease: 'easeOut' },
      };
      break;
    case 'Partly Cloudy':
      imageSrc = partlyCloudyImg;
      animationProps = {
        animate: { y: [0, -8, 0] },
        transition: { duration: 5, ease: 'easeOut' },
      };
      break;
    case 'Cloudy':
      imageSrc = cloudyImg;
      animationProps = {
        animate: { y: [0, -4, 0], scale: [1, 1.01, 1] },
        transition: { duration: 7, ease: 'easeOut' },
      };
      break;
    case 'Stormy':
      imageSrc = stormyImg;
      animationProps = {
        animate: { y: [0, 4, -2, 0], x: [0, 2, -2, 0] },
        transition: { duration: 4, ease: 'easeOut' },
      };
      break;
    case 'Breathing':
      imageSrc = partlyCloudyImg;
      animationProps = {
        animate: { scale: [1, 1.1, 1] },
        transition: { duration: 4, ease: 'easeOut' }, // 4-4-4-4 sync roughly
      };
      break;
    case 'Loading':
    default:
      imageSrc = idleImg;
      animationProps = {
        animate: { y: [0, -10, 0] },
        transition: { duration: 5, ease: 'easeOut' },
      };
      break;
  }

  if (prefersReducedMotion) {
    animationProps = {};
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <AnimatePresence mode="wait">
        <motion.img
          key={activeState}
          src={imageSrc}
          alt={`Mascot - ${activeState}`}
          className="max-w-full max-h-full object-contain rounded-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, ...((animationProps as any).animate || {}) }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5, ...((animationProps as any).transition || {}) }}
        />
      </AnimatePresence>
    </div>
  );
};
