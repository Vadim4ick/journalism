import { cn } from "cn";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mx-auto max-w-[1792px] px-4", className)}>
      {children}
    </div>
  );
};

export { Container };
