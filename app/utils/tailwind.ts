export const getChevronClasses = (
  size: number = 10,
  marginTop: number = 1.5
): string =>
  `after:absolute after:mt-${marginTop.toString()} after:h-${size.toString()} after:w-${size.toString()} after:bg-black after:transition-all after:duration-150 after:[mask-image:url(/icons/chevron-rigt.svg)] group-hover/item:after:translate-x-1 dark:after:bg-white`.toString();
