import { Link, useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';
import { buttonVariants } from '../animations/buttons';
import { useEffect, useMemo } from 'react';
import { FeatherTimeline } from '../components/dashboard/FeatherTimeline';
import { getWeatherMetadata } from '../services/weatherEngine';
import { getRecommendations } from '../services/recommendationEngine';

export const Dashboard = () => {
  const { assessmentHistory, studentToken, streakCount } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentToken) {
      navigate('/onboarding');
    }
  }, [studentToken, navigate]);

  const latestAssessment = assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null;
  const latestScore = latestAssessment ? latestAssessment.score : 0;
  const weatherCategory = latestAssessment?.weatherCategory || 'Sunny';
  
  // Weather Engine
  const weatherMeta = getWeatherMetadata(weatherCategory);

  // Recommendations Engine
  const recommendations = useMemo(() => {
    return getRecommendations(weatherMeta.category, streakCount, assessmentHistory).slice(0, 3);
  }, [weatherMeta.category, streakCount, assessmentHistory]);
  
  // Calculate Wellness Score: 0 is best, 36 is worst stress score.
  // Transform to 0-100 scale: (36 - score) / 36 * 100
  const wellnessScore = latestAssessment ? Math.round(((36 - latestScore) / 36) * 100) : 100;

  // Calculate Stress Trend
  let stressTrend = 'Stable';
  let trendIcon = 'trending_flat';
  let trendColor = 'text-outline';
  if (assessmentHistory.length >= 2) {
    const prevScore = assessmentHistory[assessmentHistory.length - 2].score;
    if (latestScore < prevScore) {
      stressTrend = 'Decreasing';
      trendIcon = 'trending_down';
      trendColor = 'text-secondary';
    } else if (latestScore > prevScore) {
      stressTrend = 'Increasing';
      trendIcon = 'trending_up';
      trendColor = 'text-error';
    }
  }

  // Calculate Mood Stability
  let moodStability = 92;
  if (assessmentHistory.length >= 2) {
    const differences = [];
    for (let i = 1; i < assessmentHistory.length; i++) {
      differences.push(Math.abs(assessmentHistory[i].score - assessmentHistory[i - 1].score));
    }
    const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
    moodStability = Math.round(100 - (avgDiff / 36) * 60);
  }

  // Data-driven cards
  const vitalsCards = [
    {
      id: 'wellness_score',
      label: 'Wellness Score',
      value: wellnessScore,
      isCircular: true,
      colorClass: 'text-primary'
    },
    {
      id: 'stress_trend',
      label: 'Stress Trend',
      value: stressTrend,
      icon: trendIcon,
      colorClass: trendColor,
      isCircular: false
    },
    {
      id: 'mood_stability',
      label: 'Mood Stability',
      value: `${moodStability}%`,
      isCircular: true,
      colorClass: 'text-inverse-primary'
    },
    {
      id: 'energy_level',
      label: 'Energy Level',
      value: weatherMeta.energyLevel,
      icon: 'bolt',
      colorClass: weatherMeta.energyColor,
      isCircular: false
    }
  ];

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden"
    >
      {/* TopAppBar */}
      <header className="bg-white/40 dark:bg-surface-container/40 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm flex justify-between items-center px-margin-desktop py-4 w-full z-50 top-0 sticky">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold tracking-tighter text-2xl text-primary md:text-3xl">MANAS</Link>
          <nav className="hidden md:flex gap-6 ml-8">
            <Link to="/dashboard" className="text-primary font-bold border-b-2 border-primary pb-1 px-2">Weather</Link>
            <Link to="/games" className="text-on-surface-variant font-body-md hover:text-primary transition-colors px-2 rounded">Games</Link>
            <Link to="/breathing" className="text-on-surface-variant font-body-md hover:text-primary transition-colors px-2 rounded">Breathing</Link>
            <Link to="/counseling" className="text-on-surface-variant font-body-md hover:text-primary transition-colors px-2 rounded">Counseling</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1 bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant/30">
              <span className="text-lg">🔥</span>
              <span className="font-bold text-primary">{streakCount} Day{streakCount !== 1 ? 's' : ''}</span>
            </div>
            <Link to="/counseling">
              <motion.button 
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="flex items-center justify-center bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps shadow-[0_4px_14px_0_rgba(0,104,122,0.39)]"
              >
                Get Help
              </motion.button>
            </Link>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-white shadow-sm flex-shrink-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface-variant">person</span>
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 pb-32 flex-grow">
        {/* Hero Section */}
        <section className="mb-12 relative flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-2/3 glass-card rounded-3xl p-8 relative overflow-hidden bg-white/60 backdrop-blur-md border border-white/40">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-container rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface-variant mb-2">Today's Emotional Forecast</h2>
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${weatherMeta.themeColor} text-4xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {weatherMeta.icon}
                  </span>
                  <h3 className={`font-display-lg text-display-lg-mobile md:text-display-lg ${weatherMeta.themeColor} tracking-tight`}>{weatherMeta.category}</h3>
                </div>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface max-w-xl">
                {weatherMeta.description}
              </p>
              <div className="flex gap-4 mt-2">
                <Link to="/assessment" className="bg-primary hover:bg-on-primary-container text-on-primary px-6 py-2 rounded-full font-label-caps text-xs shadow-md transition-all">
                  New stress check
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center relative z-20 h-64 md:h-auto">
            <Mascot state={weatherMeta.category} className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl" />
          </div>
        </section>

        {/* Wellness Metrics */}
        <section className="mb-12">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Current Vitals</h3>
          <motion.div 
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
          >
            {vitalsCards.map((card) => (
              <motion.div key={card.id} variants={cardVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm">
                {card.isCircular ? (
                  <div className="relative w-20 h-20 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                      <path 
                        className={`${card.colorClass} stroke-current`} 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        strokeDasharray={`${typeof card.value === 'number' ? card.value : parseInt(card.value.toString())}, 100`} 
                        strokeLinecap="round" 
                        strokeWidth="3"
                      ></path>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-headline-md text-headline-md text-primary">{card.value}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-surface-variant/30 flex items-center justify-center mb-4">
                    <span className={`material-symbols-outlined ${card.colorClass} text-3xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      {card.icon}
                    </span>
                  </div>
                )}
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">{card.label}</span>
                {!card.isCircular && <span className={`font-body-md text-body-md ${card.colorClass} mt-1 font-medium`}>{card.value}</span>}
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Weekly Journey Timeline */}
        <section className="mb-12">
          <FeatherTimeline assessmentHistory={assessmentHistory} />
        </section>

        {/* Suggested Actions (Bento Grid) */}
        <section>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Suggested Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendations.map((rec) => (
              <Link key={rec.id} to={rec.path} className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white/40 border border-white/40 shadow-sm cursor-pointer">
                <div>
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>{rec.icon}</span>
                  </div>
                  <h4 className="font-headline-md text-[20px] leading-[28px] text-on-surface mb-2">{rec.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{rec.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                  <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 dark:bg-surface-container/40 backdrop-blur-xl border-t border-outline-variant/30 w-full py-8 flex flex-col md:flex-row justify-between items-center px-margin-desktop mt-auto">
        <div className="font-bold font-label-caps text-label-caps text-on-surface-variant mb-4 md:mb-0">
          © 2024 MANAS Wellness. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link className="text-on-surface-variant hover:underline font-label-caps text-label-caps" to="#">Privacy Policy</Link>
          <Link className="text-on-surface-variant hover:underline font-label-caps text-label-caps" to="#">Terms of Service</Link>
          <Link className="text-on-surface-variant hover:underline font-label-caps text-label-caps" to="#">Support</Link>
        </div>
      </footer>
    </motion.div>
  );
};
