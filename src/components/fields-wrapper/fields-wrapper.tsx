export const FieldsWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`flex w-full flex-1 flex-wrap items-end gap-3 max-[560px]:flex-col ${className ?? ""}`}
    >
      {children}
    </div>
  );
};
