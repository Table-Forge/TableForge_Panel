import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  spaced?: boolean;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  spaced,
  className,
  ...props
}) => {
  return (
    <label
      {...props}
      htmlFor={htmlFor}
      className={`flex w-full items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-grays-100 ${
        spaced ? "justify-between" : "justify-start"
      } ${className ?? ""}`}
    >
      {children}
    </label>
  );
};

export const LabelStatusMessage: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <span {...props} className={`text-[10px] uppercase tracking-wide text-grays-100 ${className ?? ""}`}>
      {children}
    </span>
  );
};
