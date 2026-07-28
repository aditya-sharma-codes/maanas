import type { WeatherCategory } from './weatherEngine';

export type RecommendationType = 'Breathing' | 'Game' | 'Counseling' | 'Video' | 'Routine' | 'Reminder';

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  icon: string;
  path: string;
  priority: number;
}

const ALL_RECOMMENDATIONS: Recommendation[] = [
  { id: 'breath_box', type: 'Breathing', title: 'Breathing Session', description: 'Center yourself with a quick guided breathing exercise.', icon: 'air', path: '/breathing', priority: 1 },
  { id: 'game_relax', type: 'Game', title: 'Stress Relief Game', description: 'Play relaxing mini-games to distract and reset your focus.', icon: 'toys', path: '/games', priority: 1 },
  { id: 'counseling_talk', type: 'Counseling', title: 'Talk to Counselor', description: 'Connect with a MANAS professional for anonymous support.', icon: 'forum', path: '/counseling', priority: 1 },
  { id: 'routine_healthy', type: 'Routine', title: 'Healthy Routine', description: 'Plan your day to maintain a steady and clear mind.', icon: 'fact_check', path: '/', priority: 1 },
  { id: 'reminder_tomorrow', type: 'Reminder', title: 'Tomorrow Reminder', description: 'Set a reminder to check in again tomorrow.', icon: 'alarm', path: '/', priority: 1 },
  { id: 'counseling_appt', type: 'Counseling', title: 'Book Appointment', description: 'Schedule a session with an expert at your convenience.', icon: 'calendar_month', path: '/counseling', priority: 1 },
  { id: 'video_relax', type: 'Video', title: 'Relaxing Video', description: 'Watch a calming video to ease tension.', icon: 'smart_display', path: '/', priority: 1 },
  { id: 'voice_call', type: 'Counseling', title: 'Voice Call', description: 'Speak directly to a counselor now.', icon: 'call', path: '/counseling', priority: 1 },
  { id: 'gov_helpline', type: 'Counseling', title: 'Gov Helpline', description: 'Reach out to official mental health helplines.', icon: 'local_hospital', path: '/counseling', priority: 1 },
];

/**
 * Returns a prioritized list of recommendations based on weather and streak
 */
export const getRecommendations = (
  weather: WeatherCategory,
  _streak: number,
  _history: any[] // We can type this later with AssessmentData
): Recommendation[] => {
  // Create a deep copy to sort
  let recs = ALL_RECOMMENDATIONS.map(r => ({ ...r }));

  // Dynamic prioritization based on weather
  if (weather === 'Sunny') {
    recs.find(r => r.id === 'routine_healthy')!.priority = 10;
    recs.find(r => r.id === 'game_relax')!.priority = 9;
    recs.find(r => r.id === 'reminder_tomorrow')!.priority = 8;
  } else if (weather === 'Partly Cloudy') {
    recs.find(r => r.id === 'breath_box')!.priority = 10;
    recs.find(r => r.id === 'game_relax')!.priority = 9;
    recs.find(r => r.id === 'routine_healthy')!.priority = 8;
  } else if (weather === 'Cloudy') {
    recs.find(r => r.id === 'counseling_talk')!.priority = 10;
    recs.find(r => r.id === 'breath_box')!.priority = 9;
    recs.find(r => r.id === 'game_relax')!.priority = 8;
  } else if (weather === 'Stormy') {
    recs.find(r => r.id === 'gov_helpline')!.priority = 10;
    recs.find(r => r.id === 'counseling_talk')!.priority = 9;
    recs.find(r => r.id === 'voice_call')!.priority = 8;
    recs.find(r => r.id === 'counseling_appt')!.priority = 7;
    recs.find(r => r.id === 'video_relax')!.priority = 6;
    recs.find(r => r.id === 'breath_box')!.priority = 5;
  }

  // Sort by priority descending
  recs.sort((a, b) => b.priority - a.priority);

  // Return top 3 by default, or top N based on requirements. 
  // Let's return all but UI can slice it to 3 or 4.
  return recs;
};
