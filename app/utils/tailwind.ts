// add w- and h- when using this classnames
export const getChevronClasses = (): string =>
  `after:absolute after:bg-black after:transition-all after:duration-150 after:[mask-image:url(/icons/chevron-right.svg)] group-hover/item:after:translate-x-1 dark:after:bg-white`;
