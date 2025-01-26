export const convertDate = (date: string, shouldShowDay = true) => {
  return new Date(date).toLocaleDateString("en-GB", {
    ...(shouldShowDay && {
      day: "numeric",
    }),
    month: "short",
    year: "numeric",
  });
};
