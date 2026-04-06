interface MatrixTagProps {
  matrixName: string;
  lineColor?: string;
}

export const MatrixTag = ({ matrixName, lineColor }: MatrixTagProps) => {
  if (!lineColor) {
    return (
      <span className="rounded border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-bold uppercase text-white/80">
        {matrixName}
      </span>
    );
  }

  return (
    <span
      className="rounded border px-2 py-0.5 text-[10px] font-bold uppercase"
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
