import React from "react";
import { Info } from "@/src/components/info/info";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  spaced?: boolean;
  isRequired?: boolean;
  infoText?: string;
}

export const Label: React.FC<LabelProps> = ({
  children,
  htmlFor,
  spaced,
  isRequired = false,
  infoText,
  className,
  ...props
}) => {
  return (
    <label
      {...props}
      htmlFor={htmlFor}
      className={`flex w-full items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-grays-200 ${
        spaced ? "justify-between" : "justify-start"
      } ${className ?? ""}`}
    >
      {children}
      {isRequired ? <span className="text-danger">*</span> : null}
      {infoText ? <Info text={infoText} /> : null}
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
