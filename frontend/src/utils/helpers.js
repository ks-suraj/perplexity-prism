export const supportColors = {
  strong: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  light: 'bg-orange-100 text-orange-800 border-orange-200',
  none: 'bg-red-100 text-red-800 border-red-200',
};

export const formatConfidence = (score) => `${(score * 100).toFixed(1)}%`;
