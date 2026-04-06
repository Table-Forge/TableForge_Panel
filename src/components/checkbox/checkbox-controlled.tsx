import { type FieldValues, useController, type PathValue } from "react-hook-form";
import { Info } from "@/src/components/info/info";
import type { ICheckboxControlled } from "./checkbox.interfaces";
import { Label } from "@/src/components/label/label";

export function CheckboxControlled<TFieldValues extends FieldValues>({
  label,
  name,
  disabled,
  infoText,
  hookForm,
  defaultValue = false,
}: ICheckboxControlled<TFieldValues>) {
  const {
    field: { value, onChange, ref },
  } = useController({
    name,
    control: hookForm.control,
    defaultValue: defaultValue as PathValue<TFieldValues, typeof name>,
  });

  return (
    <label
      className={`group relative flex items-center gap-3 leading-tight ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
    >
      <div className="relative h-5 w-5 min-w-[20px]">
        <input
          ref={ref}
          type="checkbox"
          disabled={disabled}
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 z-10 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        />
        <span
          className="
            absolute inset-0 rounded-md border border-white/35 bg-background transition
            peer-checked:border-secondary peer-checked:bg-secondary
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
}
