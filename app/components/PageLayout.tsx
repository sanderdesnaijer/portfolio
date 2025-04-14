export const PageLayout: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <>
    <h1 className="relative text-5xl font-bold after:absolute after:right-0 after:-bottom-5 after:-left-10 after:h-px after:w-[100vw] after:bg-current md:my-10 md:text-8xl md:after:-bottom-10 md:after:left-[-196px] after:dark:bg-white">
      {title}
    </h1>
    <div className="relative flex-1 after:absolute after:top-0 after:right-0 after:bottom-0 after:left-[-196px] after:w-px after:bg-black md:pt-0 md:pb-6 dark:after:bg-white">
      {children}
    </div>
  </>
);
