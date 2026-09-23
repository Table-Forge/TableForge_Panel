import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/src/utils/custom-schema-validations";

export function PasswordRequirements({ value }: { value?: string }) {
  const password = value ?? "";

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-50 hidden w-full chamfer-sm border border-white/10 bg-surface p-3 group-focus-within:block">
      <ul className="flex flex-col gap-1.5">
        {PASSWORD_RULES.map((rule) => {
          const isValid = rule.test(password);

          return (
            <li
              key={rule.label}
              className={`flex items-center gap-1.5 text-xs transition ${
                isValid ? "text-green-500" : "text-danger"
              }`}
            >
              {isValid ? <Check size={14} /> : <X size={14} />}
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
