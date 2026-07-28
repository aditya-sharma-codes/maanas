import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { useAppStore } from '../store/useAppStore';
import { submitAssessment } from '../api/assessment';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page';

const questions = [
  "I felt overwhelmed by my academic or personal responsibilities.",
  "I had trouble falling asleep or staying asleep.",
  "I felt little interest or pleasure in doing things I usually enjoy.",
  "I felt nervous, anxious, or on edge.",
  "I felt down, depressed, or hopeless.",
  "I had trouble concentrating on things, such as reading or studying.",
  "I felt unusually tired or had little energy.",
  "I felt bad about myself - or that I am a failure.",
  "I felt unable to control or stop worrying."
];

const options = [
  { label: 'Never', icon: 'sentiment_satisfied', score: 0 },
  { label: 'Rarely', icon: 'sentiment_neutral', score: 1 },
  { label: 'Sometimes', icon: 'sentiment_dissatisfied', score: 2 },
  { label: 'Often', icon: 'mood_bad', score: 3 },
  { label: 'Almost Always', icon: 'sick', score: 4 },
];

export const Assessment = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // From store
  const { deviceId, department, academicYear, addAssessment } = useAppStore();

  useState(() => {
    if (!deviceId) {
      navigate('/onboarding');
    }
  });

  const handleSelect = (score: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = score;
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Submit
      setIsSubmitting(true);
      try {
        const totalScore = answers.reduce((a, b) => a + b, 0);
        let weatherCategory: any = 'Sunny';
        if (totalScore > 20) weatherCategory = 'Stormy';
        else if (totalScore > 12) weatherCategory = 'Cloudy';
        else if (totalScore > 6) weatherCategory = 'Partly Cloudy';

        try {
          await submitAssessment({
            deviceId: deviceId || 'anonymous',
            department: department || 'General',
            academicYear: academicYear || '1',
            score: totalScore,
            weatherCategory
          });
        } catch (error) {
          console.warn("Backend offline or DB error, saving assessment state locally:", error);
        }

        addAssessment({
          date: new Date().toISOString(),
          score: totalScore,
          weatherCategory
        });

        navigate('/dashboard');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isNextDisabled = answers[currentIndex] === -1 || isSubmitting;

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden"
    >
      <header className="bg-white/40 dark:bg-surface-container/40 backdrop-blur-xl border-b border-white/20 shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-3xl text-primary tracking-tight uppercase">MANAS</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md">Weather</Link>
            <Link to="/games" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Games</Link>
            <Link to="/breathing" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Breathing</Link>
            <Link to="/counseling" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Counseling</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-primary text-on-primary px-6 py-2 rounded-full font-body-md font-medium hover:shadow-lg">
            Get Help
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10 w-full max-w-container-max mx-auto h-full pt-24">
        <div className="w-full max-w-2xl text-center mb-12">
          <h1 className="font-headline-md text-primary mb-4">Student Stress Check</h1>
          <p className="font-body-lg text-on-surface-variant">Over the last 2 weeks, how often have you experienced the following?</p>
        </div>

        <div className="flex flex-col md:flex-row items-end md:items-start justify-center gap-8 w-full max-w-4xl relative">
          <div className="hidden md:flex flex-col items-center gap-4 w-48 float-animation shrink-0">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-sm relative after:absolute after:top-1/2 after:-right-2 after:-translate-y-1/2 after:border-8 after:border-transparent after:border-l-white/80">
              <p className="font-body-md text-primary font-medium text-center">You're doing great!</p>
            </div>
            <Mascot className="w-32 h-32 drop-shadow-xl" state="Partly Cloudy" />
          </div>

          <div className="glass-card rounded-3xl p-8 md:p-12 w-full max-w-2xl relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-2 bg-surface-container-high">
              <div 
                className="h-full bg-gradient-to-r from-primary-container to-secondary-container rounded-r-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center mb-8 mt-4">
              <span className="font-label-caps text-primary tracking-widest uppercase">Question {currentIndex + 1} of {questions.length}</span>
              <span className="font-label-caps text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full">{Math.round(progress)}% Complete</span>
            </div>

            <h2 className="font-headline-md text-on-surface mb-10 min-h-[96px] flex items-center">
              {questions[currentIndex]}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
              {options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.score;
                return (
                  <button 
                    key={opt.score}
                    onClick={() => handleSelect(opt.score)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 group
                      ${isSelected ? 'bg-primary-container/30 border-primary shadow-md' : 'border-outline-variant bg-white/40 hover:bg-white/80 hover:border-primary-container'}
                    `}
                  >
                    <span className={`material-symbols-outlined mb-2 text-3xl font-light ${isSelected ? 'text-primary' : 'text-outline group-hover:text-primary'}`}>
                      {opt.icon}
                    </span>
                    <span className={`font-body-md text-sm text-center ${isSelected ? 'text-primary font-medium' : 'text-on-surface-variant group-hover:text-primary'}`}>
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-outline-variant/30">
              <button 
                onClick={handleBack}
                disabled={currentIndex === 0}
                className={`font-body-md px-4 py-2 rounded-full flex items-center gap-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed text-on-surface-variant' : 'text-primary hover:bg-primary-container/20'}`}
              >
                <span className="material-symbols-outlined">arrow_back</span> Back
              </button>
              <button 
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`font-body-md px-8 py-3 rounded-full flex items-center gap-2 transition-all transform
                  ${isNextDisabled ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed' : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:-translate-y-0.5'}
                `}
              >
                {isSubmitting ? 'Submitting...' : currentIndex === questions.length - 1 ? 'Complete' : 'Next'}
                {!isSubmitting && <span className="material-symbols-outlined">arrow_forward</span>}
              </button>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
