import { forwardRef } from "react";
import type { ICheckbox } from "./checkbox.interfaces";
import { Label } from "@/src/components/label/label";
import { Info } from "@/src/components/info/info";

export const Checkbox = forwardRef<HTMLInputElement, ICheckbox>(
  ({ label, name, disabled, checked, onChange, infoText, ...rest }, ref) => {
    return (
      <label
        className={`group relative flex items-center gap-3 leading-tight ${
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
      >
        <div className="relative h-5 w-5 min-w-[20px]">
          <input
            {...rest}
            ref={ref}
            name={name}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            onChange={onChange}
            className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          />

          <span
            className="
              absolute inset-0 rounded-lg border border-white/20 bg-primary/40 transition-all duration-200
              peer-checked:border-secondary peer-checked:bg-secondary shadow-xs
              group-hover:border-white/35
              after:absolute after:left-[6px] after:top-[2px] after:hidden after:h-[11px] after:w-[6px]
              after:rotate-45 after:border-b-[2.5px] after:border-r-[2.5px] after:border-white
              peer-checked:after:block
            "
          />
        </div>

        {label ? <Label>{label}</Label> : null}
        {infoText ? <Info text={infoText} /> : null}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
