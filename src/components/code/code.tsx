interface ICode {
  children: React.ReactNode;
  className?: string;
}

export function Code({ children, className = "" }: ICode) {
  return (
    <pre
      className={`max-h-[40vh] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-white/10 bg-background/80 p-3 font-mono text-xs text-white ${className}`}
    >
      {children}
    </pre>
  );
}
