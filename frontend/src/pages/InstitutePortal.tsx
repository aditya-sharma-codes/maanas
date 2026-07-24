import { useState } from 'react';
import { loginInstitute } from '../api/auth';
import { fetchDashboardStats } from '../api/dashboard';
import apiClient from '../api/client';
import { motion } from 'framer-motion';
import { pageVariants, containerVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';

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
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="bg-background min-h-screen flex items-center justify-center p-4"
      >
        <form onSubmit={handleLogin} className="glass-card p-12 rounded-3xl w-full max-w-md flex flex-col gap-6">
          <div className="text-center mb-4">
            <h1 className="font-display-lg text-primary text-3xl mb-2">MANAS Portal</h1>
            <p className="text-on-surface-variant font-body-md">Institute Administrator Login</p>
          </div>
          
          {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">{error}</div>}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/50 border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/50 border border-outline-variant rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <button type="submit" className="glass-button-primary py-4 font-bold text-lg mt-4">
            Secure Login
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background min-h-screen font-body-md"
    >
      <header className="bg-primary text-on-primary p-4 shadow-md flex justify-between items-center">
        <h1 className="font-bold text-xl uppercase tracking-wider">MANAS Institute Portal</h1>
        <button onClick={() => setIsLoggedIn(false)} className="text-on-primary/80 hover:text-white font-bold">Logout</button>
      </header>

      <main className="p-margin-desktop max-w-container-max mx-auto">
        <h2 className="font-headline-md text-on-surface text-3xl mb-8">Dashboard Overview</h2>
        
        {stats ? (
          <motion.div 
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <motion.div variants={cardVariants} className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
               <span className="material-symbols-outlined text-4xl text-primary mb-2">psychology</span>
               <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.totalAssessments}</div>
               <div className="text-on-surface-variant">Total Stress Checks</div>
            </motion.div>
            <motion.div variants={cardVariants} className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
               <span className="material-symbols-outlined text-4xl text-secondary mb-2">devices</span>
               <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.uniqueDevices}</div>
               <div className="text-on-surface-variant">Unique Students</div>
            </motion.div>
            <motion.div variants={cardVariants} className="glass-card p-8 rounded-2xl flex flex-col items-center justify-center text-center">
               <span className="material-symbols-outlined text-4xl text-tertiary mb-2">calendar_month</span>
               <div className="font-display-lg text-4xl font-bold text-on-surface">{stats.appointments}</div>
               <div className="text-on-surface-variant">Counseling Appointments</div>
            </motion.div>
          </motion.div>
        ) : (
          <div>Loading stats...</div>
        )}

        <div className="glass-card p-8 rounded-3xl">
          <h3 className="font-headline-md text-on-surface mb-6">Recent Anonymous Assessments</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant">
                <th className="py-3 px-4 font-bold text-on-surface-variant">Date</th>
                <th className="py-3 px-4 font-bold text-on-surface-variant">Department</th>
                <th className="py-3 px-4 font-bold text-on-surface-variant">Score</th>
                <th className="py-3 px-4 font-bold text-on-surface-variant">Category</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentAssessments?.map((a: any) => (
                <tr key={a.id} className="border-b border-outline-variant/50 hover:bg-white/40">
                  <td className="py-3 px-4">{new Date(a.timestamp).toLocaleString()}</td>
                  <td className="py-3 px-4">{a.department}</td>
                  <td className="py-3 px-4">{a.score}</td>
                  <td className="py-3 px-4 font-bold">{a.weatherCategory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </motion.div>
  );
};
