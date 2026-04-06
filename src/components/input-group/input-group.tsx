export const InputGroup = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`flex min-w-[135px] flex-1 flex-col gap-1.5 ${className ?? ""}`}>{children}</div>;
};
