import { Link, useNavigate } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { useAppStore } from '../store/useAppStore';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';
import { buttonVariants } from '../animations/buttons';
import { useEffect } from 'react';

export const Dashboard = () => {
  const { assessmentHistory, deviceId } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!deviceId) {
      navigate('/onboarding');
    }
  }, [deviceId, navigate]);

  const latestAssessment = assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null;
  const latestScore = latestAssessment ? latestAssessment.score : 0;
  
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
    // Map avgDiff (0 to 36) to stability (100 down to 40)
    moodStability = Math.round(100 - (avgDiff / 36) * 60);
  }

  // Energy Level mapping
  let energyLevel = 'High';
  let energyColor = 'text-primary';
  const weather = latestAssessment?.weatherCategory || 'Sunny';
  if (weather === 'Partly Cloudy') {
    energyLevel = 'Moderate';
    energyColor = 'text-secondary';
  } else if (weather === 'Cloudy') {
    energyLevel = 'Low';
    energyColor = 'text-outline';
  } else if (weather === 'Stormy') {
    energyLevel = 'Low';
    energyColor = 'text-error';
  }

  // Weather description mapping
  let weatherDesc = "You're feeling balanced and emotionally positive today. Keep riding this wave of clear skies!";
  if (weather === 'Partly Cloudy') {
    weatherDesc = "A gentle blend of clouds and sunshine. A great day to pause and practice self-care.";
  } else if (weather === 'Cloudy') {
    weatherDesc = "It feels a bit overcast inside today. Be gentle with yourself; the sun is still behind the clouds.";
  } else if (weather === 'Stormy') {
    weatherDesc = "Your emotional weather is quite stormy today. Remember to breathe and reach out if you need support.";
  }

  // Map weather category to material symbols
  const getWeatherIcon = (category: string) => {
    switch (category) {
      case 'Sunny': return 'wb_sunny';
      case 'Partly Cloudy': return 'partly_cloudy_day';
      case 'Cloudy': return 'cloud';
      case 'Stormy': return 'thunderstorm';
      default: return 'wb_sunny';
    }
  };

  // Generate week timeline
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayIndex = new Date().getDay();

  // Create list of 7 days around today
  const timelineDays = Array.from({ length: 7 }).map((_, i) => {
    const offset = i - 3; // 3 days ago to 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + offset);
    const dayName = daysOfWeek[d.getDay()];
    const isToday = offset === 0;
    const isPast = offset < 0;

    // Find if we have an assessment on this date (simple check)
    const dateStr = d.toDateString();
    const record = assessmentHistory.find(r => new Date(r.date).toDateString() === dateStr);

    return {
      dayName,
      isToday,
      isPast,
      weatherCategory: record?.weatherCategory || null,
    };
  });

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
          <div className="w-10 h-10 rounded-full bg-surface-variant overflow-hidden border-2 border-white shadow-sm flex-shrink-0 cursor-pointer">
            <img alt="Student avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIjL72ioEswgfi158w_3xau4UaSRuKYOHqJ28XwGq_MWZsLRP8WQT5Pub8GLZiJCZCDG4T6627fNXgqtLO9hCdZFQ_z1UR2oqwXw21uiw_qqSaBDSi0qTgt8sRTmdgnjXZmwep3bBZQg36CalhLswrdVYzIPt5l5Dsjx8w7-VOeztGyE6uoDyDP3UCeS3FZTLCw34fT_RL3GKkASrX-SxG75zeRaGGTRZWfiq9W9-fNd-VICpvygLC" />
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
                  <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {getWeatherIcon(weather)}
                  </span>
                  <h3 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary tracking-tight">{weather}</h3>
                </div>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface max-w-xl">
                {weatherDesc}
              </p>
              <div className="flex gap-4 mt-2">
                <Link to="/assessment" className="bg-primary hover:bg-on-primary-container text-on-primary px-6 py-2 rounded-full font-label-caps text-xs shadow-md transition-all">
                  New stress check
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center items-center relative z-20 h-64 md:h-auto">
            <Mascot state={weather as any} className="w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl" />
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
            {/* Metric 1 */}
            <motion.div variants={cardVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer">
              <div className="relative w-20 h-20 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                  <path 
                    className="text-primary stroke-current" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    strokeDasharray={`${wellnessScore}, 100`} 
                    strokeLinecap="round" 
                    strokeWidth="3"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline-md text-headline-md text-primary">{wellnessScore}</span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Wellness Score</span>
            </motion.div>

            {/* Metric 2 */}
            <motion.div variants={cardVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mb-4">
                <span className={`material-symbols-outlined ${trendColor} text-3xl`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {trendIcon}
                </span>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Stress Trend</span>
              <span className={`font-body-md text-body-md ${trendColor} mt-1 font-medium`}>{stressTrend}</span>
            </motion.div>

            {/* Metric 3 */}
            <motion.div variants={cardVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer">
              <div className="relative w-20 h-20 mb-4">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container stroke-current" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3"></path>
                  <path 
                    className="text-inverse-primary stroke-current" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    fill="none" 
                    strokeDasharray={`${moodStability}, 100`} 
                    strokeLinecap="round" 
                    strokeWidth="3"
                  ></path>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-headline-md text-headline-md text-primary">{moodStability}%</span>
                </div>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Mood Stability</span>
            </motion.div>

            {/* Metric 4 */}
            <motion.div variants={cardVariants} className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-white/40 backdrop-blur-md border border-white/40 shadow-sm cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-on-tertiary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
              </div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider text-xs">Energy Level</span>
              <span className={`font-body-md text-body-md ${energyColor} mt-1 font-medium`}>{energyLevel}</span>
            </motion.div>
          </motion.div>
        </section>

        {/* Weekly Journey Timeline */}
        <section className="mb-12">
          <div className="glass-card rounded-3xl p-8 w-full overflow-x-auto relative bg-white/60 backdrop-blur-md border border-white/40">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-8 sticky left-0">Weekly Journey</h3>
            <div className="relative min-w-[600px] py-4">
              {/* Curve Line background */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0"></div>
              
              <div className="flex justify-between relative z-10">
                {timelineDays.map((day, index) => {
                  return (
                    <div key={index} className={`flex flex-col items-center gap-2 ${day.isToday ? 'transform -translate-y-2' : ''}`}>
                      <span className={`font-label-caps text-label-caps ${day.isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                        {day.isToday ? 'Today' : day.dayName}
                      </span>
                      
                      {day.isToday ? (
                        <div className="w-14 h-14 rounded-full bg-primary-container shadow-md flex items-center justify-center border-2 border-primary animate-pulse">
                          <span className="material-symbols-outlined text-on-primary-container text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {getWeatherIcon(weather)}
                          </span>
                        </div>
                      ) : day.weatherCategory ? (
                        <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-white/50">
                          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {getWeatherIcon(day.weatherCategory)}
                          </span>
                        </div>
                      ) : day.isPast ? (
                        <div className="w-12 h-12 rounded-full bg-white/50 border border-outline-variant/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant text-sm">remove</span>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-white/30 border-2 border-dashed border-outline-variant/50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-outline-variant/40">wb_sunny</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Suggested Actions (Bento Grid) */}
        <section>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Suggested Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Action 1 */}
            <Link to="/breathing" className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white/40 border border-white/40 shadow-sm cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>air</span>
                </div>
                <h4 className="font-headline-md text-[20px] leading-[28px] text-on-surface mb-2">Breathing Session</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Center yourself with a quick guided breathing exercise.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>

            {/* Action 2 */}
            <Link to="/games" className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white/40 border border-white/40 shadow-sm cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>toys</span>
                </div>
                <h4 className="font-headline-md text-[20px] leading-[28px] text-on-surface mb-2">Stress Relief Game</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Play relaxing mini-games to distract and reset your focus.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <span className="material-symbols-outlined text-tertiary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>

            {/* Action 3 */}
            <Link to="/counseling" className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all bg-white/40 border border-white/40 shadow-sm cursor-pointer">
              <div>
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-on-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>forum</span>
                </div>
                <h4 className="font-headline-md text-[20px] leading-[28px] text-on-surface mb-2">Talk to Counselor</h4>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Connect with a MANAS professional for anonymous support.</p>
              </div>
              <div className="mt-6 flex justify-end">
                <span className="material-symbols-outlined text-secondary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </Link>
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
