export const timeFormat = (date: Date) => {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month}月${day}日${hours}時${minutes}分`;
};
