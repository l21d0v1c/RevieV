export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const isFirstOfMonth = (date: Date): boolean => {
  return date.getDate() === 1;
};

export const isFirstOfQuarter = (date: Date): boolean => {
  const month = date.getMonth(); // 0-indexed
  return date.getDate() === 1 && (month === 0 || month === 3 || month === 6 || month === 9);
};

export const isJanuaryFirst = (date: Date): boolean => {
  return date.getMonth() === 0 && date.getDate() === 1;
};
