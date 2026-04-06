interface ErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export function ErrorMessage({ children, className = "" }: ErrorMessageProps) {
  return (
    <div
      className={`flex items-start gap-1 px-1 text-[10px] font-medium uppercase tracking-wider text-danger ${className}`}
    >
      <div className="flex flex-col [&_span]:normal-case [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mt-0.5">
        {children}
      </div>
    </div>
  );
}
