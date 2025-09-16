export const getProgressPercentage = (
  completed: number,
  total: number,
): number => {
  if (!total || !completed) return 0;
  return Math.min(100, Math.max(0, Math.round((completed / total) * 100)));
};
