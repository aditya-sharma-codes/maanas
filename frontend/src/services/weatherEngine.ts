export type WeatherCategory = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Stormy';
export type EnergyLevel = 'High' | 'Moderate' | 'Low';

export interface WeatherMetadata {
  category: WeatherCategory;
  icon: string;
  themeColor: string;
  description: string;
  energyLevel: EnergyLevel;
  energyColor: string;
}

/**
 * Calculates the weather category based on the stress score (0-36)
 */
export const calculateWeatherFromScore = (score: number): WeatherCategory => {
  if (score > 20) return 'Stormy';
  if (score > 12) return 'Cloudy';
  if (score > 6) return 'Partly Cloudy';
  return 'Sunny';
};

/**
 * Returns complete metadata for a given weather category
 */
export const getWeatherMetadata = (category: WeatherCategory): WeatherMetadata => {
  switch (category) {
    case 'Sunny':
      return {
        category: 'Sunny',
        icon: 'wb_sunny',
        themeColor: 'text-primary',
        description: "You're feeling balanced and emotionally positive today. Keep riding this wave of clear skies!",
        energyLevel: 'High',
        energyColor: 'text-primary'
      };
    case 'Partly Cloudy':
      return {
        category: 'Partly Cloudy',
        icon: 'partly_cloudy_day',
        themeColor: 'text-secondary',
        description: "A gentle blend of clouds and sunshine. A great day to pause and practice self-care.",
        energyLevel: 'Moderate',
        energyColor: 'text-secondary'
      };
    case 'Cloudy':
      return {
        category: 'Cloudy',
        icon: 'cloud',
        themeColor: 'text-outline',
        description: "It feels a bit overcast inside today. Be gentle with yourself; the sun is still behind the clouds.",
        energyLevel: 'Low',
        energyColor: 'text-outline'
      };
    case 'Stormy':
      return {
        category: 'Stormy',
        icon: 'thunderstorm',
        themeColor: 'text-error',
        description: "Your emotional weather is quite stormy today. Remember to breathe and reach out if you need support.",
        energyLevel: 'Low',
        energyColor: 'text-error'
      };
    default:
      return getWeatherMetadata('Sunny');
  }
};
