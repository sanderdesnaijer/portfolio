export const getChevronClasses = (
  size: string = "10",
  marginTop: string = "1.5"
): string =>
  `after:absolute after:mt-${marginTop} after:h-${size} after:w-${size} after:bg-black after:transition-all after:duration-150 after:[mask-image:url(/icons/chevron-rigt.svg)] group-hover/item:after:translate-x-1 dark:after:bg-white`;
