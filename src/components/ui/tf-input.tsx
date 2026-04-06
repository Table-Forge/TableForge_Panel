import { Eye, EyeOff, Lock } from "lucide-react";
import {
  forwardRef,
  useMemo,
  useState,
  type ForwardedRef,
  type InputHTMLAttributes,
} from "react";

interface TFInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

function TFInputComponent(
  {
    label,
    error,
    isPassword = false,
    disabled,
    className = "",
    type,
    ...props
  }: TFInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = useMemo(() => {
    if (!isPassword) return type ?? "text";
    return showPassword ? "text" : "password";
  }, [isPassword, showPassword, type]);

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
          type={resolvedType}
          disabled={disabled}
          className={[
            "h-full w-full bg-transparent text-base text-white outline-none placeholder:text-white/30",
            disabled ? "text-white/40" : "",
            className,
          ].join(" ")}
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            disabled={disabled}
            className="ml-2 cursor-pointer rounded-md p-1 text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:text-white/35"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {disabled ? (
              <Lock size={18} />
            ) : showPassword ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>
        ) : null}
      </span>

      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export const TFInput = forwardRef(TFInputComponent);
TFInput.displayName = "TFInput";
