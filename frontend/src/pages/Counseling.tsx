import { Link } from 'react-router-dom';
import { Mascot } from '../components/Mascot';
import { useState, useEffect } from 'react';
import { fetchCounselors, bookAppointment } from '../api/appointment';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { pageVariants } from '../animations/page';
import { cardVariants } from '../animations/cards';

const MOCK_COUNSELORS = [
  { id: 'c1', name: 'Dr. Ananya Sharma', specialty: 'Academic Stress & Anxiety', available: true },
  { id: 'c2', name: 'Dr. Vikram Malhotra', specialty: 'Relationship & Social Wellness', available: true },
  { id: 'c3', name: 'Prof. Sneha Deshmukh', specialty: 'Mindfulness & Meditation', available: false },
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

const GOV_HELPLINES = [
  { name: 'KIRAN Mental Health', number: '1800-599-0019', desc: '24/7 Toll-free Helpline' },
  { name: 'Vandrevala Foundation', number: '9999 666 555', desc: 'Crisis Intervention' },
  { name: 'AASRA', number: '9820466726', desc: 'Emotional Support' }
];

type CounselingTab = 'Appointments' | 'Video' | 'Voice' | 'Helplines';

export const Counseling = () => {
  const [activeTab, setActiveTab] = useState<CounselingTab>('Appointments');
  const [counselors, setCounselors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Booking state
  const [selectedCounselor, setSelectedCounselor] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track booked appointments locally for demo
  const [myAppointments, setMyAppointments] = useState<any[]>([]);

  const { studentToken } = useAppStore();

  useEffect(() => {
    fetchCounselors()
      .then(res => {
        setCounselors(res.data && res.data.length > 0 ? res.data : MOCK_COUNSELORS);
        setLoading(false);
      })
      .catch(() => {
        setCounselors(MOCK_COUNSELORS);
        setLoading(false);
      });
  }, []);

  const handleBookClick = (counselor: any) => {
    setSelectedCounselor(counselor);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split('T')[0]);
    setBookingTime('');
    setIsSuccess(false);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCounselor || !bookingTime || !bookingDate) return;

    setIsSubmitting(true);
    const dateStr = `${bookingDate}T${bookingTime}:00.000Z`;

    try {
      await bookAppointment({
        deviceId: studentToken || 'anonymous_user',
        counselorId: selectedCounselor.id,
        date: dateStr,
      });
    } catch (err) {
      console.warn('Backend offline, simulating appointment booking locally.');
    }

    setTimeout(() => {
      setMyAppointments(prev => [...prev, {
        id: Date.now(),
        counselor: selectedCounselor,
        date: bookingDate,
        time: bookingTime
      }]);
      setIsSuccess(true);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCancelAppointment = (id: number) => {
    setMyAppointments(prev => prev.filter(a => a.id !== id));
  };

  return (
    <motion.div 
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-background min-h-screen flex flex-col font-body-md overflow-x-hidden"
    >
      <header className="bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-sm fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-bold text-3xl text-primary tracking-tight uppercase">MANAS</Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/dashboard" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Weather</Link>
            <Link to="/games" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Games</Link>
            <Link to="/breathing" className="text-on-surface-variant font-body-md hover:text-primary transition-colors">Breathing</Link>
            <Link to="/counseling" className="text-primary font-bold border-b-2 border-primary pb-1 font-body-md">Counseling</Link>
          </nav>
        </div>
        <Link to="/dashboard" className="text-primary hover:underline font-bold flex items-center gap-2">
          <span className="material-symbols-outlined">arrow_back</span> Back
        </Link>
      </header>

      <main className="flex-grow flex flex-col p-margin-desktop relative z-10 w-full pt-28 max-w-[1200px] mx-auto h-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="font-headline-md text-primary text-4xl mb-4">Professional Support</h1>
            <p className="text-on-surface-variant font-body-lg max-w-xl">
              Book an anonymous session, connect instantly via video/voice, or reach out to government helplines.
            </p>
          </div>
          <Mascot state="Cloudy" className="w-24 h-24 drop-shadow-xl" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide border-b border-outline-variant/30">
          {(['Appointments', 'Video', 'Voice', 'Helplines'] as CounselingTab[]).map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold text-sm whitespace-nowrap rounded-t-2xl transition-all ${activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-variant/50 text-on-surface-variant hover:bg-surface-variant'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          {activeTab === 'Appointments' && (
            <div className="flex flex-col gap-8">
              {/* My Appointments */}
              {myAppointments.length > 0 && (
                <div className="glass-card p-6 rounded-3xl border border-primary/20 bg-primary/5">
                  <h3 className="font-headline-md text-primary mb-4">Your Upcoming Sessions</h3>
                  <div className="flex flex-col gap-4">
                    {myAppointments.map(app => (
                      <div key={app.id} className="flex justify-between items-center bg-white/60 p-4 rounded-xl shadow-sm border border-white/40">
                        <div>
                          <p className="font-bold text-on-surface">{app.counselor.name}</p>
                          <p className="text-on-surface-variant text-sm">{app.date} at {app.time}</p>
                        </div>
                        <button onClick={() => handleCancelAppointment(app.id)} className="text-error font-bold text-sm hover:underline px-4 py-2">
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Counselors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full text-center text-on-surface-variant py-12">Loading counselors...</div>
                ) : counselors.length > 0 ? (
                  counselors.map(c => (
                    <motion.div variants={cardVariants} key={c.id} className="glass-card p-6 rounded-3xl flex flex-col relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xl">
                          {c.name.charAt(0)}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.available ? 'bg-secondary/20 text-secondary' : 'bg-surface-variant text-on-surface-variant'}`}>
                          {c.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                      <h3 className="font-headline-md text-on-surface text-lg">{c.name}</h3>
                      <p className="text-on-surface-variant font-body-sm mb-6 flex-grow">{c.specialty || 'General Counselor'}</p>
                      <button 
                        onClick={() => handleBookClick(c)}
                        disabled={!c.available} 
                        className={`w-full py-2 rounded-full font-bold transition-all text-sm ${c.available ? 'glass-button-primary' : 'bg-surface-variant text-on-surface-variant cursor-not-allowed'}`}
                      >
                        Book Session
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center text-on-surface-variant py-12">
                    <span className="material-symbols-outlined text-4xl mb-4 block">event_busy</span>
                    No counselors available at the moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Video' && (
            <div className="glass-card p-12 rounded-3xl text-center max-w-2xl mx-auto border border-primary/20">
              <span className="material-symbols-outlined text-6xl text-primary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>videocam</span>
              <h2 className="font-headline-md text-2xl mb-4 text-on-surface">Instant Video Session</h2>
              <p className="text-on-surface-variant font-body-md mb-8">Connect securely via video with the next available counselor. Wait times may vary.</p>
              <button className="glass-button-primary px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto">
                <span className="material-symbols-outlined">video_call</span> Join Waiting Room
              </button>
            </div>
          )}

          {activeTab === 'Voice' && (
            <div className="glass-card p-12 rounded-3xl text-center max-w-2xl mx-auto border border-secondary/20">
              <span className="material-symbols-outlined text-6xl text-secondary mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              <h2 className="font-headline-md text-2xl mb-4 text-on-surface">Anonymous Voice Call</h2>
              <p className="text-on-surface-variant font-body-md mb-8">Speak with a counselor without turning on your camera. Your identity remains hidden.</p>
              <button className="bg-secondary text-on-secondary hover:bg-secondary/90 px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto shadow-md">
                <span className="material-symbols-outlined">phone_in_talk</span> Start Call
              </button>
            </div>
          )}

          {activeTab === 'Helplines' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {GOV_HELPLINES.map(line => (
                <div key={line.number} className="glass-card p-6 rounded-3xl flex flex-col items-start border border-error/20 bg-error/5">
                  <span className="material-symbols-outlined text-error mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                  <h3 className="font-headline-md text-on-surface text-lg mb-1">{line.name}</h3>
                  <p className="text-on-surface-variant font-body-sm mb-4">{line.desc}</p>
                  <a href={`tel:${line.number}`} className="mt-auto bg-error text-on-error px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg transition-shadow flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">call</span> {line.number}
                  </a>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      {/* Booking Overlay Modal */}
      <AnimatePresence>
        {selectedCounselor && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-surface-container p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl relative"
            >
              {!isSuccess ? (
                <form onSubmit={handleConfirmBooking} className="flex flex-col gap-6">
                  <h3 className="font-headline-md text-primary text-2xl">Book Appointment</h3>
                  <div className="bg-surface-container p-4 rounded-2xl">
                    <p className="font-bold text-on-surface">{selectedCounselor.name}</p>
                    <p className="text-on-surface-variant text-sm mt-1">{selectedCounselor.specialty}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-on-surface-variant">Select Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={bookingDate}
                      onChange={e => {
                        setBookingDate(e.target.value);
                        setBookingTime('');
                      }}
                      className="p-3 rounded-xl border border-outline-variant bg-surface focus:outline-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-on-surface-variant">Available Times</label>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map(time => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingTime(time)}
                          className={`py-2 rounded-lg text-sm font-bold border transition-colors
                            ${bookingTime === time 
                              ? 'bg-primary text-on-primary border-primary' 
                              : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button 
                      type="button" 
                      onClick={() => setSelectedCounselor(null)}
                      className="flex-1 py-3 rounded-full font-bold border border-outline hover:bg-surface-variant transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !bookingTime}
                      className={`flex-1 py-3 rounded-full font-bold transition-all ${isSubmitting || !bookingTime ? 'bg-surface-variant text-on-surface-variant' : 'glass-button-primary'}`}
                    >
                      {isSubmitting ? 'Booking...' : 'Confirm'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center text-center gap-4 py-8">
                  <span className="material-symbols-outlined text-7xl text-secondary animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="font-headline-md text-primary text-2xl">Appointment Booked!</h3>
                  <p className="text-on-surface-variant font-body-md mb-4">
                    Your session with <strong>{selectedCounselor.name}</strong> on <strong>{bookingDate}</strong> at <strong>{bookingTime}</strong> was scheduled successfully.
                  </p>
                  <button 
                    onClick={() => {
                      setSelectedCounselor(null);
                      setIsSuccess(false);
                    }}
                    className="glass-button-primary px-8 py-3 rounded-full font-bold w-full shadow-md"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
