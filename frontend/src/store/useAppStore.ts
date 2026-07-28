import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeatherCategory } from '../services/weatherEngine';

export interface AssessmentData {
  id: string;
  date: string;       // ISO Date string
  timestamp: number;  // Epoch timestamp for easier sorting/filtering
  score: number;
  weatherCategory: WeatherCategory;
  recommendationLevel: number; // Derived priority level (1-5) based on score
}

export interface GameMetrics {
  moves: number;
  timeElapsed: number;
  matches: number;
  bestScore?: number;
  completedAt?: number;
}

interface AppState {
  // Core Identity
  studentToken: string | null;
  deviceId: string | null; // Kept for backward compatibility
  department: string | null; // Kept for backward compatibility
  academicYear: string | null; // Kept for backward compatibility

  theme: 'light' | 'dark';
  
  // History & Tracking
  assessmentHistory: AssessmentData[];
  weatherHistory: string[]; // Kept for backward compatibility, though assessmentHistory is better
  lastAssessment: string | null;
  
  // Progress & Streaks
  streakCount: number;
  lastActivityDate: string | null; // YYYY-MM-DD local timezone string
  completedGames: number;
  completedBreathing: number;

  // Specific Game Progress
  gameProgress: Record<string, GameMetrics>;
  breathingProgress: Record<string, any>;
  preferences: Record<string, any>;

  // Actions
  initializeToken: () => void;
  setDeviceInfo: (deviceId: string, department: string, academicYear: string) => void;
  addAssessment: (assessment: Omit<AssessmentData, 'id' | 'timestamp' | 'recommendationLevel'>) => void;
  recordActivity: (type: 'assessment' | 'game' | 'breathing') => void;
  updateGameMetrics: (gameId: string, metrics: GameMetrics) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const getLocalISODate = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0]; // Returns YYYY-MM-DD in local time
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // State
      studentToken: null,
      deviceId: null,
      department: null,
      academicYear: null,
      theme: 'light',
      assessmentHistory: [],
      weatherHistory: [],
      lastAssessment: null,
      streakCount: 0,
      lastActivityDate: null,
      completedGames: 0,
      completedBreathing: 0,
      gameProgress: {},
      breathingProgress: {},
      preferences: {},

      // Actions
      initializeToken: () => {
        const state = get();
        if (!state.studentToken) {
          // If deviceId exists, use it as a base or just generate a new proper MN- token
          const newToken = `MN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          set({ studentToken: newToken });
        }
      },

      setDeviceInfo: (deviceId, department, academicYear) =>
        set({ deviceId, department, academicYear }),

      addAssessment: (assessment) => {
        const timestamp = Date.now();
        // Calculate a recommendation level based on score (0-36)
        // 0-6: 1, 7-12: 2, 13-20: 3, 21-28: 4, 29-36: 5
        let level = 1;
        if (assessment.score > 28) level = 5;
        else if (assessment.score > 20) level = 4;
        else if (assessment.score > 12) level = 3;
        else if (assessment.score > 6) level = 2;

        const fullAssessment: AssessmentData = {
          ...assessment,
          id: `assess_${timestamp}`,
          timestamp,
          recommendationLevel: level,
        };

        set((state) => ({
          assessmentHistory: [...state.assessmentHistory, fullAssessment],
          weatherHistory: [...state.weatherHistory, assessment.weatherCategory],
          lastAssessment: assessment.date,
        }));
        get().recordActivity('assessment');
      },

      recordActivity: (type) => {
        const today = getLocalISODate();
        const state = get();
        const lastDate = state.lastActivityDate;
        
        let newStreak = state.streakCount;

        if (lastDate !== today) {
          if (lastDate) {
            // Check if lastDate was exactly yesterday
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setMinutes(yesterday.getMinutes() - yesterday.getTimezoneOffset());
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (lastDate === yesterdayStr) {
              newStreak += 1;
            } else {
              newStreak = 1; // missed a day, reset streak
            }
          } else {
            newStreak = 1; // first activity ever
          }
        }

        const updates: Partial<AppState> = {
          lastActivityDate: today,
          streakCount: newStreak,
        };

        if (type === 'game') updates.completedGames = state.completedGames + 1;
        if (type === 'breathing') updates.completedBreathing = state.completedBreathing + 1;

        set(updates);
      },

      updateGameMetrics: (gameId, metrics) =>
        set((state) => {
          const existing = state.gameProgress[gameId];
          let bestScore = metrics.bestScore || metrics.moves;
          if (existing && existing.bestScore) {
            // Lower moves is better in memory match
            bestScore = Math.min(existing.bestScore, bestScore);
          }
          return {
            gameProgress: {
              ...state.gameProgress,
              [gameId]: { ...metrics, bestScore },
            },
          };
        }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'manas-storage',
      version: 1, // Start tracking version for potential migrations
      migrate: (persistedState: any, version: number) => {
        // Handle migration if needed in the future
        if (version === 0) {
          // If we had no version, maybe they have deviceId but no studentToken
          if (persistedState.deviceId && !persistedState.studentToken) {
            persistedState.studentToken = `MN-${persistedState.deviceId.substring(0, 6).toUpperCase()}`;
          }
        }
        return persistedState as AppState;
      },
    }
  )
);
