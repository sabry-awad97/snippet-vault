type TimeUnit =
  | 'year'
  | 'month'
  | 'week'
  | 'day'
  | 'hour'
  | 'minute'
  | 'second';

interface TimeConversion {
  value: number;
  unit: TimeUnit;
}

const TIME_CONVERSIONS: TimeConversion[] = [
  { value: 60 * 60 * 24 * 365, unit: 'year' },
  { value: 60 * 60 * 24 * 30, unit: 'month' },
  { value: 60 * 60 * 24 * 7, unit: 'week' },
  { value: 60 * 60 * 24, unit: 'day' },
  { value: 60 * 60, unit: 'hour' },
  { value: 60, unit: 'minute' },
  { value: 1, unit: 'second' },
];

export function human(seconds: number | Date): string {
  if (seconds instanceof Date) {
    seconds = Math.round((Date.now() - seconds.getTime()) / 1000);
  }

  const suffix = seconds < 0 ? 'from now' : 'ago';
  seconds = Math.abs(seconds);

  for (const { value, unit } of TIME_CONVERSIONS) {
    const time = Math.floor(seconds / value);
    if (time >= 1) {
      return `${time} ${unit}${time > 1 ? 's' : ''} ${suffix}`;
    }
  }

  return `0 seconds ${suffix}`;
}
