import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LandingPage } from './pages/LandingPage';
import { Onboarding } from './pages/Onboarding';
import { Assessment } from './pages/Assessment';
import { Dashboard } from './pages/Dashboard';
import { Breathing } from './pages/Breathing';
import { Games } from './pages/Games';
import { Counseling } from './pages/Counseling';
import { InstitutePortal } from './pages/InstitutePortal';

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/breathing" element={<Breathing />} />
        <Route path="/games" element={<Games />} />
        <Route path="/counseling" element={<Counseling />} />
        <Route path="/institute" element={<InstitutePortal />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
