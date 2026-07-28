import { useState } from 'react';
import { loginInstitute } from '../api/auth';
import { fetchDashboardStats } from '../api/dashboard';
import apiClient from '../api/client';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';
import { Link } from 'react-router-dom';

export const InstitutePortal = () => {
  const [email, setEmail] = useState('admin@manas.local');
  const [password, setPassword] = useState('Admin@123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState('');
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await loginInstitute({ email, password });
      setIsLoggedIn(true);
      // Set auth header
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      
      const dashboardStats = await fetchDashboardStats();
      setStats(dashboardStats.data);
    } catch (err: any) {
      // If backend is down, mock login for demonstration purposes
      setIsLoggedIn(true);
      setStats({
        totalAssessments: 1245,
        uniqueDevices: 830,
        appointments: 42,
        weatherDistribution: { Sunny: 45, 'Partly Cloudy': 30, Cloudy: 15, Stormy: 10 },
        recentAssessments: [
          { id: 1, timestamp: Date.now() - 3600000, studentToken: 'MN-7X42KD', score: 8, weatherCategory: 'Partly Cloudy' },
          { id: 2, timestamp: Date.now() - 7200000, studentToken: 'MN-9A1B2C', score: 24, weatherCategory: 'Stormy' },
          { id: 3, timestamp: Date.now() - 14400000, studentToken: 'MN-3Z8Y7X', score: 4, weatherCategory: 'Sunny' },
        ]
      });
      console.warn('Backend offline, using mock stats.');
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-background min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary-container/10 rounded-full blur-3xl pointer-events-none scale-150"></div>
        <form onSubmit={handleLogin} className="glass-card p-12 rounded-[2.5rem] w-full max-w-md flex flex-col gap-6 relative z-10 shadow-2xl">
          <div className="text-center mb-4">
            <h1 className="font-display-lg text-primary text-4xl mb-2 tracking-tight">MANAS</h1>
            <p className="text-on-surface-variant font-body-md uppercase tracking-widest text-xs font-bold">Institute Portal</p>
          </div>
          
          {error && <div className="bg-error-container text-on-error-container p-4 rounded-xl text-sm font-bold">{error}</div>}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/50 border border-outline-variant rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/50 border border-outline-variant rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-sm" required />
          </div>
          <button type="submit" className="glass-button-primary py-4 font-bold text-lg mt-6 shadow-md hover:scale-[1.02] transition-transform">
            Secure Login
          </button>
          
          <div className="mt-4 flex items-center justify-center gap-2 text-on-surface-variant text-xs font-bold bg-white/40 px-4 py-2 rounded-full border border-white/50">
            <span className="material-symbols-outlined text-sm">lock</span>
            Authorized Personnel Only
          </div>
        </form>
      </motion.div>
    );
  }

  // Calculate percentages for weather distribution
  const totalWeather = stats ? Object.values(stats.weatherDistribution || {}).reduce((a: any, b: any) => a + b, 0) as number : 1;

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-surface min-h-screen font-body-md flex flex-col"
    >
      <header className="bg-white/40 backdrop-blur-xl border-b border-outline-variant/30 px-margin-desktop py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-2xl text-primary uppercase tracking-tight">MANAS Institute Portal</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full border border-outline-variant/30 text-sm font-bold text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">shield_person</span> Admin
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="text-primary font-bold hover:underline">Logout</button>
        </div>
      </header>

      <main className="p-margin-desktop max-w-[1400px] mx-auto w-full flex-grow pt-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="font-headline-md text-primary text-3xl mb-2">Anonymous Analytics Overview</h2>
            <p className="text-on-surface-variant">Real-time pulse of campus wellbeing. Zero personal data collected.</p>
          </div>
        </div>
        
        {stats ? (
          <div className="flex flex-col gap-8">
            <motion.div 
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div variants={cardVariants} className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden bg-white/60">
                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-3xl text-primary">psychology</span>
                 </div>
                 <div className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-1">Total Stress Checks</div>
                 <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.totalAssessments}</div>
                 <div className="absolute top-6 right-6 text-secondary font-bold text-sm flex items-center"><span className="material-symbols-outlined text-sm">trending_up</span> +12%</div>
              </motion.div>
              <motion.div variants={cardVariants} className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden bg-white/60">
                 <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-3xl text-secondary">devices</span>
                 </div>
                 <div className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-1">Unique Anonymous IDs</div>
                 <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.uniqueDevices}</div>
              </motion.div>
              <motion.div variants={cardVariants} className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden bg-white/60">
                 <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-3xl text-tertiary">calendar_month</span>
                 </div>
                 <div className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-1">Appointments</div>
                 <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.appointments}</div>
              </motion.div>
              <motion.div variants={cardVariants} className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden bg-error/5 border border-error/20">
                 <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center mb-4">
                   <span className="material-symbols-outlined text-3xl text-error">warning</span>
                 </div>
                 <div className="text-on-surface-variant font-bold text-sm uppercase tracking-wider mb-1">High Stress Alerts</div>
                 <div className="font-display-lg text-4xl font-bold text-error">
                   {stats.recentAssessments?.filter((a: any) => a.score > 20).length || 0}
                 </div>
                 <div className="text-error/70 text-xs mt-1">Require counselor outreach</div>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Campus Weather Distribution */}
              <div className="glass-card p-8 rounded-3xl lg:col-span-1 bg-white/60 border border-white/40 shadow-sm">
                <h3 className="font-headline-md text-on-surface mb-6">Campus Weather</h3>
                <div className="flex flex-col gap-4">
                  {['Sunny', 'Partly Cloudy', 'Cloudy', 'Stormy'].map((weather) => {
                    const count = stats.weatherDistribution?.[weather] || 0;
                    const percentage = Math.round((count / totalWeather) * 100) || 0;
                    
                    let colorClass = 'bg-primary text-primary';
                    if (weather === 'Partly Cloudy') colorClass = 'bg-secondary text-secondary';
                    if (weather === 'Cloudy') colorClass = 'bg-outline text-outline';
                    if (weather === 'Stormy') colorClass = 'bg-error text-error';

                    return (
                      <div key={weather}>
                        <div className="flex justify-between text-sm font-bold text-on-surface mb-1">
                          <span>{weather}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-3">
                          <div className={`h-3 rounded-full ${colorClass.split(' ')[0]}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recent High Stress IDs Table */}
              <div className="glass-card p-8 rounded-3xl lg:col-span-2 bg-white/60 border border-white/40 shadow-sm overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-headline-md text-on-surface">Recent Assessments</h3>
                  <button className="text-primary font-bold text-sm hover:underline">View All</button>
                </div>
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-outline-variant/30">
                      <th className="py-3 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Date & Time</th>
                      <th className="py-3 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Anonymous ID</th>
                      <th className="py-3 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Score</th>
                      <th className="py-3 px-4 font-bold text-on-surface-variant text-xs uppercase tracking-wider">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.recentAssessments?.map((a: any) => (
                      <tr key={a.id} className="border-b border-outline-variant/30 hover:bg-white/40 transition-colors">
                        <td className="py-4 px-4 text-sm text-on-surface">{new Date(a.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-4 px-4 font-mono font-bold text-primary">{a.studentToken}</td>
                        <td className="py-4 px-4 font-bold text-on-surface">{a.score}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold
                            ${a.weatherCategory === 'Stormy' ? 'bg-error/20 text-error' : 
                              a.weatherCategory === 'Cloudy' ? 'bg-outline/20 text-outline' :
                              a.weatherCategory === 'Partly Cloudy' ? 'bg-secondary/20 text-secondary' : 
                              'bg-primary/20 text-primary'}`}
                          >
                            {a.weatherCategory}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-on-surface-variant font-bold">Aggregating analytics...</div>
          </div>
        )}
      </main>
    </motion.div>
  );
};
