import { motion } from 'framer-motion';
import type { AssessmentData } from '../../store/useAppStore';
import { useRef, useEffect } from 'react';

interface FeatherTimelineProps {
  assessmentHistory: AssessmentData[];
}

export const FeatherTimeline = ({ assessmentHistory }: FeatherTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to rightmost (latest) on load
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [assessmentHistory]);

  // Generate timeline: We want to show past N days. Let's show last 30 days.
  const timelineDays = [];
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today.getTime());
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Find assessment for this date
    const record = assessmentHistory.find(r => r.date.startsWith(dateStr));
    
    timelineDays.push({
      dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
      record
    });
  }

  const getFeatherColorClass = (category: string) => {
    switch(category) {
      case 'Sunny': return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'; // Golden
      case 'Partly Cloudy': return 'text-sky-300 drop-shadow-[0_0_8px_rgba(125,211,252,0.8)]'; // Light Blue
      case 'Cloudy': return 'text-gray-400 drop-shadow-[0_0_8px_rgba(156,163,175,0.8)]'; // Grey
      case 'Stormy': return 'text-purple-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'; // Purple
      default: return 'text-gray-200';
    }
  };

  return (
    <div className="glass-card rounded-3xl p-8 w-full relative bg-white/60 backdrop-blur-md border border-white/40">
      <h3 className="font-headline-md text-headline-md text-on-surface mb-8">Feather Journey</h3>
      <div 
        ref={scrollRef}
        className="relative py-4 overflow-x-auto scrollbar-hide flex items-center scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Curve Line background */}
        <div className="absolute top-1/2 left-0 w-[200%] h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent z-0 pointer-events-none"></div>
        
        <div className="flex gap-6 relative z-10 min-w-max px-4">
          {timelineDays.map((day, index) => {
            const hasRecord = !!day.record;
            
            return (
              <div key={index} className={`flex flex-col items-center gap-2 ${day.isToday ? 'transform -translate-y-2' : ''}`}>
                <span className={`text-xs ${day.isToday ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                  {day.isToday ? 'Today' : day.dayName}
                </span>
                
                {hasRecord ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className={`w-12 h-12 rounded-full bg-white/80 shadow-sm flex items-center justify-center border border-white ${day.isToday ? 'ring-2 ring-primary ring-offset-2 bg-primary/5' : ''}`}
                  >
                    <span className={`material-symbols-outlined text-2xl ${getFeatherColorClass(day.record!.weatherCategory)}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                      spa
                    </span>
                  </motion.div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/30 border border-dashed border-outline-variant/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline-variant/20 text-sm">spa</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
