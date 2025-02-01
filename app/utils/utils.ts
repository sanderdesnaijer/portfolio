export const convertDate = (date: string, shouldShowDay = true) => {
  const format: Intl.DateTimeFormatOptions = {
    ...(shouldShowDay && {
      day: "numeric",
    }),
    month: "short",
    year: "numeric",
  };

  return new Date(date).toLocaleDateString("en-GB", format);
};
