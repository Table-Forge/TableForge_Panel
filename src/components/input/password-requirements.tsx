import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/src/utils/custom-schema-validations";

export function PasswordRequirements({ value }: { value?: string }) {
  const password = value ?? "";

  if (!password) return null;

  return (
    <div className="absolute left-0 top-[calc(100%+4px)] z-50 w-full rounded-md border border-white/10 bg-primary p-3 shadow-2xl">
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
