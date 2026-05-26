import { forwardRef, type ForwardedRef, type InputHTMLAttributes } from "react";

interface TFInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

function TFInputComponent(
  {
    label,
    error,
    disabled,
    className = "",
    ...props
  }: TFInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <label className="flex w-full flex-col gap-2">
      {label ? (
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-grays-100">
          {label}
        </span>
      ) : null}

      <span
        className={[
          "flex h-12 items-center rounded-2xl border px-3",
          error ? "border-danger" : "border-white/85",
          disabled ? "border-white/20 bg-white/5" : "bg-transparent",
        ].join(" ")}
      >
        <input
          ref={ref}
          type="text"
          disabled={disabled}
          className={[
            "h-full w-full bg-transparent text-base text-white outline-none placeholder:text-white/30",
            disabled ? "text-white/40" : "",
            className,
          ].join(" ")}
          {...props}
        />
      </span>

      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export const TFInput = forwardRef(TFInputComponent);
TFInput.displayName = "TFInput";
