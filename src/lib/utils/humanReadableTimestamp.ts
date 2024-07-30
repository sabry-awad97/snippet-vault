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

interface HumanReadableTimestampOptions {
  maxUnits?: number;
  pastSuffix?: string;
  futureSuffix?: string;
  localize?: boolean;
  customUnits?: Partial<Record<TimeUnit, string>>;
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

const DEFAULT_UNITS: Record<TimeUnit, string> = {
  year: 'year',
  month: 'month',
  week: 'week',
  day: 'day',
  hour: 'hour',
  minute: 'minute',
  second: 'second',
};

/**
 * Converts seconds or a Date object into a human-readable relative time string.
 *
 * @param {number | Date} input - The number of seconds or a Date object to convert.
 * @param {object} options - Configuration options.
 * @param {number} [options.maxUnits=1] - Maximum number of time units to display.
 * @param {string} [options.pastSuffix='ago'] - Suffix for past times.
 * @param {string} [options.futureSuffix='from now'] - Suffix for future times.
 * @param {boolean} [options.localize=false] - Whether to localize the output string.
 * @param {Partial<Record<TimeUnit, string>>} [options.customUnits] - Custom time unit labels.
 * @returns {string} - A human-readable relative time string.
 */
export function humanReadableTimestamp(
  input: number | Date,
  options: HumanReadableTimestampOptions = {},
): string {
  const {
    maxUnits = 1,
    pastSuffix = 'ago',
    futureSuffix = 'from now',
    localize = false,
    customUnits = {},
  } = options;

  let seconds: number;

  if (input instanceof Date) {
    seconds = Math.round((Date.now() - input.getTime()) / 1000);
  } else if (typeof input === 'number' && !isNaN(input)) {
    seconds = input;
  } else {
    throw new Error(
      'Invalid input: input must be a number representing seconds or a Date object.',
    );
  }

  const suffix = seconds < 0 ? futureSuffix : pastSuffix;
  seconds = Math.abs(seconds);

  const timeUnits: string[] = [];

  for (const { value, unit } of TIME_CONVERSIONS) {
    const time = Math.floor(seconds / value);
    if (time >= 1) {
      const unitLabel = customUnits[unit] || DEFAULT_UNITS[unit];
      const formattedTime = localize
        ? new Intl.NumberFormat().format(time)
        : time.toString();
      timeUnits.push(`${formattedTime} ${unitLabel}${time > 1 ? 's' : ''}`);
      seconds -= time * value;
      if (timeUnits.length >= maxUnits) break;
    }
  }

  if (timeUnits.length === 0) {
    const formattedZero = localize ? new Intl.NumberFormat().format(0) : '0';
    timeUnits.push(
      `${formattedZero} ${customUnits.second || DEFAULT_UNITS.second}s`,
    );
  }

  return timeUnits.join(', ') + ' ' + suffix;
}
