import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page';
import { useAppStore } from '../store/useAppStore';
import { BreathingEngine } from '../components/breathing/BreathingEngine';
import type { BreathingPhase } from '../components/breathing/BreathingEngine';

interface BreathingExercise {
  id: string;
  title: string;
  description: string;
  icon: string;
  phases: BreathingPhase[];
}

const EXERCISES: BreathingExercise[] = [
  {
    id: 'box',
    title: 'Box Breathing',
    description: 'Regulate your autonomic nervous system using the classic 4-4-4-4 technique.',
    icon: 'crop_square',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Breathe in slowly through your nose.', colorClass: 'text-primary', scaleInhale: true },
      { name: 'Hold', duration: 4, instruction: 'Hold your breath and stay still.', colorClass: 'text-secondary' },
      { name: 'Exhale', duration: 4, instruction: 'Release the air gently through your mouth.', colorClass: 'text-tertiary', scaleExhale: true },
      { name: 'Hold Empty', duration: 4, instruction: 'Rest and wait for the next cycle.', colorClass: 'text-outline' },
    ]
  },
  {
    id: '478',
    title: '4-7-8 Breathing',
    description: 'A natural tranquilizer for the nervous system to help you relax or fall asleep.',
    icon: 'snooze',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Quietly inhale through your nose.', colorClass: 'text-primary', scaleInhale: true },
      { name: 'Hold', duration: 7, instruction: 'Hold your breath.', colorClass: 'text-secondary' },
      { name: 'Exhale', duration: 8, instruction: 'Exhale completely through your mouth, making a whoosh sound.', colorClass: 'text-tertiary', scaleExhale: true },
    ]
  },
  {
    id: 'equal',
    title: 'Equal Breathing',
    description: 'Focus on making your inhales and exhales the same length (Sama Vritti).',
    icon: 'balance',
    phases: [
      { name: 'Inhale', duration: 5, instruction: 'Inhale slowly and steadily.', colorClass: 'text-primary', scaleInhale: true },
      { name: 'Exhale', duration: 5, instruction: 'Exhale slowly and steadily.', colorClass: 'text-tertiary', scaleExhale: true },
    ]
  },
  {
    id: 'belly',
    title: 'Belly Breathing',
    description: 'Deep diaphragmatic breathing to reduce your heart rate.',
    icon: 'self_improvement',
    phases: [
      { name: 'Inhale', duration: 4, instruction: 'Let your belly expand as you breathe in.', colorClass: 'text-primary', scaleInhale: true },
      { name: 'Exhale', duration: 6, instruction: 'Let your belly fall as you breathe out.', colorClass: 'text-tertiary', scaleExhale: true },
    ]
  },
  {
    id: 'resonance',
    title: 'Resonance Breathing',
    description: 'Breathe at a rate of 5 to 6 breaths per minute to maximize heart rate variability.',
    icon: 'waves',
    phases: [
      { name: 'Inhale', duration: 5, instruction: 'Inhale deeply.', colorClass: 'text-primary', scaleInhale: true },
      { name: 'Exhale', duration: 5, instruction: 'Exhale fully.', colorClass: 'text-tertiary', scaleExhale: true },
    ]
  }
];

export const Breathing = () => {
  const { studentToken } = useAppStore();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('box');

  useEffect(() => {
    if (!studentToken) {
      navigate('/onboarding');
    }
  }, [studentToken, navigate]);

  const selectedExercise = EXERCISES.find(e => e.id === selectedId)!;

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

      <main className="flex-grow flex flex-col md:flex-row p-margin-desktop relative z-10 w-full pt-28 max-w-[1200px] mx-auto gap-8 h-full">
        {/* Sidebar Selector */}
        <aside className="w-full md:w-1/3 flex flex-col gap-4">
          <h2 className="font-headline-md text-xl text-primary mb-2">Techniques</h2>
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
            {EXERCISES.map(ex => {
              const isSelected = selectedId === ex.id;
              return (
                <button
                  key={ex.id}
                  onClick={() => setSelectedId(ex.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl text-left transition-all min-w-[200px] md:min-w-0 border shadow-sm
                    ${isSelected 
                      ? 'bg-primary-container text-on-primary-container border-primary shadow-md scale-105 md:scale-100 md:-translate-y-1' 
                      : 'bg-white/60 border-outline-variant/30 hover:bg-surface-variant text-on-surface-variant hover:shadow'}`}
                >
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {ex.icon}
                  </span>
                  <div>
                    <h3 className={`font-bold ${isSelected ? 'text-primary' : ''}`}>{ex.title}</h3>
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Breathing Engine */}
        <section className="w-full md:w-2/3 flex justify-center items-start pt-4">
          {/* Key on BreathingEngine forces unmount/remount when switching exercises, resetting timer state */}
          <BreathingEngine 
            key={selectedExercise.id}
            title={selectedExercise.title}
            description={selectedExercise.description}
            phases={selectedExercise.phases}
          />
        </section>
      </main>
    </motion.div>
  );
};
