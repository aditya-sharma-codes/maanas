import { Link } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';
import { buttonVariants } from '../animations/buttons';
import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const LandingPage = () => {
  const initializeToken = useAppStore(state => state.initializeToken);

  useEffect(() => {
    initializeToken();
  }, [initializeToken]);

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background text-on-surface font-body-md overflow-x-hidden min-h-screen relative"
    >
      {/* Animated Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none"></div>

      {/* Main Content Container */}
      <div className="relative z-10">
        <nav className="bg-white/40 dark:bg-surface-container/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
          <div className="font-bold tracking-tighter text-2xl text-primary">MANAS</div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1">Weather</Link>
            <Link to="/games" className="text-on-surface-variant font-body-md hover:bg-white/20 transition-colors">Games</Link>
            <Link to="/breathing" className="text-on-surface-variant font-body-md hover:bg-white/20 transition-colors">Breathing</Link>
            <Link to="/counseling" className="text-on-surface-variant font-body-md hover:bg-white/20 transition-colors">Counseling</Link>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              className="bg-primary text-on-primary font-body-md px-6 py-2 rounded-full shadow-sm"
            >
              Get Help
            </motion.button>
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-32 flex flex-col md:flex-row items-center justify-between gap-12 min-h-[90vh]">
          <div className="flex-1 flex flex-col items-start gap-8 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-primary font-label-caps">
              <span className="material-symbols-outlined text-sm">security</span>
              No Login Required. Department-wise Anonymous Analytics.
            </div>
            <h1 className="font-display-lg-mobile md:font-display-lg text-primary max-w-2xl">
              Welcome to MANAS
            </h1>
            <p className="font-body-lg text-on-surface-variant max-w-xl">
              Your Daily Wellness Forecast. A safe harbor designed to help you navigate your mind with clarity and calm.
            </p>
            <motion.div 
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link to="/onboarding" className="bg-primary hover:bg-on-primary-container text-on-primary font-body-lg px-8 py-4 rounded-full shadow-lg flex items-center gap-3">
                Start Stress Check
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </motion.div>
          </div>

          {/* Mascot Integration */}
          <div className="flex-1 w-full max-w-md relative z-10 flex justify-center items-center">
            <div className="absolute inset-0 bg-primary-container/20 rounded-full blur-3xl glass-glow"></div>
            <Mascot className="w-full h-auto float-animation drop-shadow-2xl relative z-20" state="Sunny" />
          </div>
        </main>

        {/* Features Bento Grid */}
        <section className="w-full bg-surface-container-low/50 backdrop-blur-md py-32 rounded-t-[4rem] relative z-20 border-t border-white/40">
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="text-center mb-16">
              <h2 className="font-headline-md text-primary mb-4">Discover Your Safe Harbor</h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl mx-auto">Tools designed to help you understand and improve your mental wellbeing, securely and intuitively.</p>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Feature 1 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <h3 className="font-headline-md text-on-surface text-xl">Anonymous & Privacy First</h3>
                <p className="font-body-md text-on-surface-variant text-sm">No login, no tracking. Your emotional data stays on your device or is strictly aggregated anonymously.</p>
              </motion.div>
              {/* Feature 2 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4 lg:col-span-2 lg:bg-gradient-to-br lg:from-primary-container/20 lg:to-transparent">
                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined">partly_cloudy_day</span>
                </div>
                <h3 className="font-headline-md text-on-surface text-xl">Emotional Weather Forecast</h3>
                <p className="font-body-md text-on-surface-variant text-sm max-w-md">Understand your mind through intuitive weather metaphors. Are you feeling stormy or sunny today? Track it simply.</p>
              </motion.div>
              {/* Feature 3 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined">air</span>
                </div>
                <h3 className="font-headline-md text-on-surface text-xl">Guided Breathing Exercises</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Mascot-led sessions designed for instant calm and nervous system regulation.</p>
              </motion.div>
              {/* Feature 4 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-tint/10 text-primary flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined">sports_esports</span>
                </div>
                <h3 className="font-headline-md text-on-surface text-xl">Stress Relief Games</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Science-backed micro-games to break ruminating thoughts and provide quick mental resets.</p>
              </motion.div>
              {/* Feature 5 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <h3 className="font-headline-md text-on-surface text-xl">Counselor Support</h3>
                <p className="font-body-md text-on-surface-variant text-sm">Easy, confidential access to professional help right when you need a human connection.</p>
              </motion.div>
              {/* Feature 6 */}
              <motion.div variants={cardVariants} className="glass-card rounded-3xl p-8 flex flex-col gap-4 lg:col-span-3 flex-row items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-surface-bright text-primary flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-3xl">query_stats</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-on-surface text-xl">Personal Wellness Journey</h3>
                    <p className="font-body-md text-on-surface-variant text-sm">Track your emotional trends over time and gain insights into your unique mental landscape.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 bg-surface dark:bg-surface-dim flex flex-col md:flex-row justify-between items-center px-margin-desktop border-t border-outline-variant relative z-20">
          <div className="font-bold font-label-caps text-label-caps text-primary mb-4 md:mb-0">
            MANAS
          </div>
          <div className="font-label-caps text-label-caps text-on-surface-variant text-center md:text-left mb-4 md:mb-0">
            © 2024 MANAS Wellness. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:underline transition-all" to="#">Privacy Policy</Link>
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:underline transition-all" to="#">Terms of Service</Link>
            <Link className="font-label-caps text-label-caps text-on-surface-variant hover:underline transition-all" to="#">Support</Link>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};
