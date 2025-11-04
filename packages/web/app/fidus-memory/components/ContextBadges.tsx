'use client';

/**
 * ContextBadges - Displays context factors as compact badges
 * Used in PreferenceViewer to show situational context
 */

interface ContextBadgesProps {
  factors: Record<string, string>;
  maxDisplay?: number;
}

const FACTOR_ICONS: Record<string, string> = {
  time_of_day: '🕐',
  day_of_week: '📅',
  season: '🍂',
  weather: '☁️',
  temperature: '🌡️',
  mood: '😊',
  activity: '🏃',
  location: '📍',
  is_weekend: '🎉',
  is_work_hours: '💼',
  meal_preference: '🍽️',
  food_type: '🍕',
  drink_type: '☕',
  music_genre: '🎵',
  artist: '🎤',
};

const formatFactorName = (key: string): string => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function ContextBadges({ factors, maxDisplay = 3 }: ContextBadgesProps) {
  const entries = Object.entries(factors);
  const displayed = entries.slice(0, maxDisplay);
  const remaining = entries.length - maxDisplay;

  return (
    <div className="flex flex-wrap gap-1">
      {displayed.map(([key, value]) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs"
          title={`${formatFactorName(key)}: ${value}`}
        >
          <span>{FACTOR_ICONS[key] || '🔹'}</span>
          <span className="font-medium">{formatFactorName(key)}:</span>
          <span>{value}</span>
        </span>
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
          +{remaining} more
        </span>
      )}
    </div>
  );
}
