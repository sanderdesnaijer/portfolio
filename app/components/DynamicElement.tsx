const sizeClasses = {
  "5": "after:h-5 after:w-5",
  "11": "after:h-11 after:w-11 after:mt-0.5",
};
const chevronClasses =
  "transition-transform after:absolute after:bg-black  after:transition-all after:duration-150 after:[mask-image:url(/icons/chevron-right.svg)] group-hover/item:after:translate-x-1 hover:after:translate-x-1 dark:after:bg-white";

export const DynamicElement: React.FC<{
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  size?: "5" | "11";
  [key: string]: unknown;
}> = ({
  as: Component = "div",
  children,
  className,
  size = "5",
  ...restProps
}) => {
  const classes = `${chevronClasses} ${sizeClasses[size]} ${className}`;

  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
};
