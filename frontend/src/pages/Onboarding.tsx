import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Mascot } from '../components/Mascot';
import { motion } from 'framer-motion';
import { pageVariants } from '../animations/page';

export const Onboarding = () => {
  const [department, setDepartment] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const navigate = useNavigate();
  const setDeviceInfo = useAppStore(s => s.setDeviceInfo);

  const handleStart = () => {
    if (department && academicYear) {
      const newDeviceId = 'device_' + Math.random().toString(36).substring(7);
      setDeviceInfo(newDeviceId, department, academicYear);
      navigate('/assessment');
    }
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
        
        <h1 className="font-display-lg-mobile text-primary mb-4">Let's Get Started</h1>
        <p className="text-on-surface-variant mb-10 font-body-lg">
          To provide anonymous department-wise analytics, please select your context. No personal data is collected.
        </p>

        <div className="w-full flex flex-col gap-6 text-left">
          <div>
            <label className="block text-on-surface font-bold mb-2 ml-2">Department</label>
            <select 
              className="w-full bg-white/60 border border-outline-variant rounded-full px-6 py-4 focus:outline-none focus:border-primary appearance-none text-on-surface font-body-md shadow-sm"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            >
              <option value="" disabled>Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mechanical">Mechanical Engineering</option>
              <option value="Electrical">Electrical Engineering</option>
              <option value="Civil">Civil Engineering</option>
              <option value="Business">Business Administration</option>
            </select>
          </div>

          <div>
            <label className="block text-on-surface font-bold mb-2 ml-2">Academic Year</label>
            <select 
              className="w-full bg-white/60 border border-outline-variant rounded-full px-6 py-4 focus:outline-none focus:border-primary appearance-none text-on-surface font-body-md shadow-sm"
              value={academicYear}
              onChange={e => setAcademicYear(e.target.value)}
            >
              <option value="" disabled>Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleStart}
          disabled={!department || !academicYear}
          className={`mt-10 px-12 py-4 rounded-full font-bold text-lg w-full transition-all flex justify-center items-center gap-2
            ${department && academicYear 
              ? 'glass-button-primary' 
              : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'}`}
        >
          Continue <span className="material-symbols-outlined">arrow_forward</span>
        </button>

        <div className="mt-8 flex items-center gap-2 text-on-surface-variant text-sm bg-white/40 px-4 py-2 rounded-full border border-white/50">
          <span className="material-symbols-outlined text-sm">lock</span>
          100% Anonymous. Your privacy is guaranteed.
        </div>
      </div>
    </motion.div>
  );
};
