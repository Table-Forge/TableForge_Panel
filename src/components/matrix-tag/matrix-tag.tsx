interface MatrixTagProps {
  matrixName: string;
  lineColor?: string;
}

export const MatrixTag = ({ matrixName, lineColor }: MatrixTagProps) => {
  if (!lineColor) {
    return (
      <span className="inline-flex items-center justify-center whitespace-nowrap rounded border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-bold uppercase text-white/80">
        {matrixName}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center whitespace-nowrap rounded border px-2.5 py-1 text-[11px] font-bold uppercase"
      style={{
        color: lineColor,
        backgroundColor: `${lineColor}20`,
        borderColor: `${lineColor}60`,
      }}
    >
      {matrixName}
    </span>
  );
};
