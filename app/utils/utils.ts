export const convertDate = (date: string, showDay: boolean = false) => {
  const format: Intl.DateTimeFormatOptions = {
    month: "short",
    year: "numeric",
    ...(showDay && { day: "numeric" }),
  };

  return new Date(date).toLocaleDateString("en-GB", format);
};
