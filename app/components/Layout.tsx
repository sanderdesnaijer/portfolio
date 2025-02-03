import Menu from "@/app/components/Menu";

export const Layout: React.FC<{
  children?: React.ReactNode;
  title: string;
}> = ({ children, title }) => {
  return (
    <div className="grid grid-cols-9 container mx-auto">
      <div className="col-span-2 sticky top-0 h-screen flex justify-end p-6">
        <Menu />
      </div>
      <main className="prose prose-xl dark:prose-invert col-span-5 max-w-fit py-24 relative">
        <h1 className="font-bold text-8xl mb-10">{title}</h1>
        {children}
      </main>
    </div>
  );
};
