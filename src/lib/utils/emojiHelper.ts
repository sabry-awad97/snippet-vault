const emojiMap: { [key: string]: string } = {
  work: '💼',
  personal: '🏠',
  hobby: '🎨',
  travel: '✈️',
  finance: '💰',
  health: '🏥',
  food: '🍔',
  music: '🎵',
  sports: '⚽',
  tech: '💻',
  // Add more mappings as needed
};

export function getEmoji(tagName: string): string {
  const lowercaseTag = tagName.toLowerCase();
  for (const [key, emoji] of Object.entries(emojiMap)) {
    if (lowercaseTag.includes(key)) {
      return emoji;
    }
  }
  return '🏷️'; // Default emoji for tags without a specific match
}

export const getRandomEmoji = (): string => {
  const emojis = [
    '🏷️',
    '🔖',
    '📌',
    '🔑',
    '🎯',
    '💡',
    '🚀',
    '🌟',
    '🔮',
    '📊',
    '🧩',
    '🎨',
    '📚',
    '💼',
    '🔬',
    '🔧',
    '📈',
    '🏆',
    '🎭',
    '🌈',
    '🦄',
    '🍀',
    '🔔',
    '💎',
    '🎁',
    '🔍',
    '🧠',
    '💻',
    '🌱',
    '🌍',
  ];

  return emojis[Math.floor(Math.random() * emojis.length)];
};
