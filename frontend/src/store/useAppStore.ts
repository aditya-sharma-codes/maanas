import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AssessmentData {
  id?: string;
  date: string;
  score: number;
  weatherCategory: string;
}

interface AppState {
  deviceId: string | null;
  department: string | null;
  academicYear: string | null;
  theme: 'light' | 'dark';
  assessmentHistory: AssessmentData[];
  weatherHistory: string[];
  gameProgress: Record<string, any>;
  breathingProgress: Record<string, any>;
  lastAssessment: string | null;
  preferences: Record<string, any>;
  setDeviceInfo: (deviceId: string, department: string, academicYear: string) => void;
  addAssessment: (assessment: AssessmentData) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      deviceId: null,
      department: null,
      academicYear: null,
      theme: 'light',
      assessmentHistory: [],
      weatherHistory: [],
      gameProgress: {},
      breathingProgress: {},
      lastAssessment: null,
      preferences: {},
      setDeviceInfo: (deviceId, department, academicYear) =>
        set({ deviceId, department, academicYear }),
      addAssessment: (assessment) =>
        set((state) => ({
          assessmentHistory: [...state.assessmentHistory, assessment],
          weatherHistory: [...state.weatherHistory, assessment.weatherCategory],
          lastAssessment: new Date().toISOString(),
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'manas-storage',
    }
  )
);
