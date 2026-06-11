import { Check, X } from "lucide-react";
import { PASSWORD_RULES } from "@/src/utils/custom-schema-validations";

export function PasswordRequirements({ value }: { value?: string }) {
  const password = value ?? "";

  return (
    <ul className="mt-2 flex flex-col gap-1">
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
  );
}
