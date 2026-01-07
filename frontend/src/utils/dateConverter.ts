export const DateFormatter = (date: any) => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
};
export const DateParser = (date: any) =>
  date instanceof Date ? date : new Date(date);
