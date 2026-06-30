interface BrandNameProps {
  className?: string;
  sizeClassName?: string;
}

export function BrandName({ className = "", sizeClassName = "text-4xl" }: BrandNameProps) {
  return (
    <h1
      className={`select-none font-black uppercase tracking-tight ${sizeClassName} ${className}`.trim()}
    >
      <span className="text-white [text-shadow:0_0_10px_rgba(250,243,224,0.25)]">Table</span>
      <span className="text-tertiary [text-shadow:0_0_24px_rgba(255,36,0,0.55)]">Forge</span>
    </h1>
  );
}
