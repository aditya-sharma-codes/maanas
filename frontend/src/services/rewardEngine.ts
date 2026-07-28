import confetti from 'canvas-confetti';

export const triggerConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00687A', '#004A58', '#4DD9E6', '#FFC107']
  });
};

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export const getRewards = (streak: number, completedGames: number, completedBreathing: number): Reward[] => {
  return [
    {
      id: 'daily_feather',
      name: 'Daily Feather',
      description: 'Awarded for completing your first activity of the day.',
      icon: 'spa',
      unlocked: streak > 0,
    },
    {
      id: 'calm_feather',
      name: 'Calm Feather Collection',
      description: 'Awarded for completing 3 breathing exercises.',
      icon: 'air',
      unlocked: completedBreathing >= 3,
    },
    {
      id: 'weekly_badge',
      name: 'Weekly Wellness Badge',
      description: 'Awarded for a 7-day streak.',
      icon: 'military_tech',
      unlocked: streak >= 7,
    },
    {
      id: 'game_master',
      name: 'Mindful Gamer',
      description: 'Awarded for completing 5 relaxation games.',
      icon: 'toys',
      unlocked: completedGames >= 5,
    }
  ];
};
