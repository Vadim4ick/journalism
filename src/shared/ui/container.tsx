import { cn } from "cn";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("mx-auto max-w-[1792px] px-6", className)}>
      {children}
    </div>
  );
};

export { Container };
