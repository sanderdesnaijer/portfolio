export const convertDate = (date: string) => {
  const format: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-GB", format);
};
