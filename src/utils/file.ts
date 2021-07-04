export const getExetention = (path: string): string => {
  return path.split('.').pop()!;
};
