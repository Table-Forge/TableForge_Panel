import { zodResolver } from "@hookform/resolvers/zod";
import { Shield } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/src/components/button/button";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { ControlledPasswordInput } from "@/src/components/input/input.password.controlled";
import { Label } from "@/src/components/label/label";
import { BrandName } from "@/src/components/ui/brand-name";
import {
  PasswordRecoveryFormSchema,
  RECOVERY_CODE_LENGTH,
  type IPasswordRecoveryForm,
} from "@/src/features/auth/schemas/auth.schema";
import { useAuthMutation } from "@/src/features/auth/hooks/use-auth-mutations";
import { useBoundStore } from "@/src/store";

const normalizeCode = (value: string) =>
  value.replace(/\D/g, "").slice(0, RECOVERY_CODE_LENGTH);

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const addToast = useBoundStore((state) => state.addToast);
  const {
    sendRecoveryCodeMutation,
    validateRecoveryCodeMutation,
    updateRecoveryPasswordMutation,
  } = useAuthMutation();

  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const [lastAttemptedCode, setLastAttemptedCode] = useState("");

  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const form = useForm<IPasswordRecoveryForm, unknown, IPasswordRecoveryForm>({
    resolver: zodResolver(PasswordRecoveryFormSchema) as Resolver<
      IPasswordRecoveryForm,
      unknown,
      IPasswordRecoveryForm
    >,
    mode: "onChange",
    defaultValues: {
      step: 1,
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = form;

  const step = watch("step");
  const email = watch("email");
  const code = normalizeCode(watch("code") ?? "");

  const codeDigits = useMemo(
    () =>
      Array.from(
        { length: RECOVERY_CODE_LENGTH },
        (_, index) => code[index] ?? "",
      ),
    [code],
  );

  useEffect(() => {
    if (step !== 2) return;
    if (code.length !== RECOVERY_CODE_LENGTH) return;
    if (validateRecoveryCodeMutation.isPending) return;
    if (!email?.trim()) return;
    if (lastAttemptedCode === code) return;

    setLastAttemptedCode(code);
    validateRecoveryCodeMutation.mutate(
      {
        email: email.trim(),
        code,
      },
      {
        onSuccess: () => {
          setIsCodeInvalid(false);
          clearErrors("code");
          setValue("step", 3, { shouldDirty: false, shouldTouch: false });
          addToast("success", "Código válido. Defina sua nova senha.");
        },
        onError: () => {
          setIsCodeInvalid(true);
          setShakeTick((prev) => prev + 1);
          setError("code", {
            type: "manual",
            message: "Código inválido. Verifique e tente novamente.",
          });
        },
      },
    );
  }, [
    step,
    code,
    email,
    lastAttemptedCode,
    validateRecoveryCodeMutation,
    validateRecoveryCodeMutation.isPending,
    clearErrors,
    setValue,
    setError,
    addToast,
  ]);

  useEffect(() => {
    if (!isCodeInvalid) return;
    if (code === lastAttemptedCode) return;
    setIsCodeInvalid(false);
    clearErrors("code");
  }, [clearErrors, code, isCodeInvalid, lastAttemptedCode]);

  const onSendCode = handleSubmit(async () => {
    const isValidEmail = await trigger("email");
    if (!isValidEmail) return;

    sendRecoveryCodeMutation.mutate(email.trim(), {
      onSuccess: () => {
        setValue("step", 2, { shouldDirty: false, shouldTouch: false });
        setIsCodeInvalid(false);
        setLastAttemptedCode("");
        setValue("code", "", { shouldDirty: true, shouldTouch: true });
        clearErrors(["code", "newPassword", "confirmPassword"]);
        addToast("success", "Código enviado para o e-mail informado.");
        window.setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
      },
    });
  });

  const onSavePassword = handleSubmit(async () => {
    setValue("step", 3, { shouldDirty: false, shouldTouch: false });
    const isValid = await trigger(["code", "newPassword", "confirmPassword"]);
    if (!isValid) return;

    updateRecoveryPasswordMutation.mutate(
      {
        email: email.trim(),
        code,
        newPassword: (watch("newPassword") ?? "").trim(),
      },
      {
        onSuccess: () => {
          addToast("success", "Senha atualizada com sucesso.");
          navigate("/login", { replace: true });
        },
      },
    );
  });

  const updateCodeDigit = (index: number, rawValue: string) => {
    const digits = rawValue.replace(/\D/g, "");
    const nextDigits = [...codeDigits];

    if (!digits.length) {
      nextDigits[index] = "";
      setValue("code", nextDigits.join(""), {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    const available = RECOVERY_CODE_LENGTH - index;
    const chunk = digits.slice(0, available).split("");

    chunk.forEach((digit, chunkIndex) => {
      nextDigits[index + chunkIndex] = digit;
    });

    setValue("code", nextDigits.join(""), {
      shouldDirty: true,
      shouldTouch: true,
    });

    const nextFocusIndex = Math.min(
      index + chunk.length,
      RECOVERY_CODE_LENGTH - 1,
    );
    codeInputRefs.current[nextFocusIndex]?.focus();
  };

  const handleCodeKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !codeDigits[index] && index > 0) {
      event.preventDefault();
      const nextDigits = [...codeDigits];
      nextDigits[index - 1] = "";
      setValue("code", nextDigits.join(""), {
        shouldDirty: true,
        shouldTouch: true,
      });
      codeInputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      codeInputRefs.current[index - 1]?.focus();
      return;
    }

    if (event.key === "ArrowRight" && index < RECOVERY_CODE_LENGTH - 1) {
      event.preventDefault();
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const isBusy =
    sendRecoveryCodeMutation.isPending ||
    validateRecoveryCodeMutation.isPending ||
    updateRecoveryPasswordMutation.isPending;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(126,135,226,0.28),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(251,69,1,0.24),transparent_46%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-secondary/25 bg-primary/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <header className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-2 border-tertiary bg-primary shadow-[0_0_20px_rgba(251,69,1,0.35)]">
            <Shield className="text-tertiary" size={44} />
          </div>

          <BrandName />
          <p className="mt-2 max-w-[280px] text-center text-sm text-grays-100">
            Recuperação de senha em 3 etapas.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2, 3].map((item, index) => {
            const isActive = step === item;
            const isDone = (step === 2 && item === 1) || (step === 3 && item !== 3);
            return (
              <span
                key={item}
                className={`h-2 w-16 rounded-full transition ${
                  isActive || isDone ? "bg-secondary" : "bg-white/15"
                } ${index === 2 ? "mr-0" : ""}`}
              />
            );
          })}
        </div>

        <form onSubmit={(event) => event.preventDefault()} className="space-y-5">
          {step === 1 ? (
            <>
              <p className="text-sm text-grays-100">
                Informe seu e-mail para receber o código de recuperação.
              </p>

              <InputGroup>
                <Label htmlFor="email">E-mail</Label>
                <ControlledInput<IPasswordRecoveryForm>
                  hookForm={form}
                  name="email"
                  placeholder="Digite seu e-mail"
                  autoComplete="email"
                  sanitizeEmail
                  removeSpaces
                  disabled={isBusy}
                  error={errors.email?.message}
                />
              </InputGroup>

              <Button
                type="button"
                buttonStyle="secondary"
                maxWidth
                isLoading={sendRecoveryCodeMutation.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  onSendCode();
                }}
              >
                Enviar código
              </Button>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <p className="text-sm text-grays-100">
                Digite os {RECOVERY_CODE_LENGTH} dígitos enviados para{" "}
                <strong className="text-white">{email}</strong>.
              </p>

              <div
                key={shakeTick}
                className={isCodeInvalid ? "animate-recovery-shake" : ""}
              >
                <div className="flex items-center justify-center gap-2">
                  {codeDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        codeInputRefs.current[index] = element;
                      }}
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={RECOVERY_CODE_LENGTH}
                      value={digit}
                      onChange={(event) =>
                        updateCodeDigit(index, event.target.value)
                      }
                      onKeyDown={(event) => handleCodeKeyDown(event, index)}
                      onPaste={(event) => {
                        event.preventDefault();
                        updateCodeDigit(
                          index,
                          event.clipboardData.getData("text"),
                        );
                      }}
                      className={`h-14 w-12 rounded-xl border bg-background/50 text-center text-2xl font-bold outline-none transition ${
                        isCodeInvalid
                          ? "border-danger text-danger"
                          : "border-white/20 text-white focus:border-secondary"
                      }`}
                    />
                  ))}
                </div>

                {errors.code?.message ? (
                  <p className="mt-2 text-center text-xs text-danger">
                    {errors.code.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setValue("step", 1, { shouldDirty: false, shouldTouch: false });
                  }}
                  className="text-grays-100 transition hover:text-white"
                  disabled={isBusy}
                >
                  Alterar e-mail
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    sendRecoveryCodeMutation.mutate(email.trim());
                  }}
                  className="text-secondary transition hover:brightness-110"
                  disabled={isBusy}
                >
                  Reenviar código
                </button>
              </div>

              {validateRecoveryCodeMutation.isPending ? (
                <p className="text-center text-xs text-grays-100">
                  Validando código...
                </p>
              ) : null}
            </>
          ) : null}

          {step === 3 ? (
            <>
              <p className="text-sm text-grays-100">
                Agora defina sua nova senha.
              </p>

              <InputGroup>
                <Label htmlFor="newPassword">Nova senha</Label>
                <ControlledPasswordInput<IPasswordRecoveryForm>
                  hookForm={form}
                  name="newPassword"
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                  disabled={isBusy}
                  error={errors.newPassword?.message}
                />
              </InputGroup>

              <InputGroup>
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <ControlledPasswordInput<IPasswordRecoveryForm>
                  hookForm={form}
                  name="confirmPassword"
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                  disabled={isBusy}
                  error={errors.confirmPassword?.message}
                />
              </InputGroup>

              <Button
                type="button"
                buttonStyle="secondary"
                maxWidth
                isLoading={updateRecoveryPasswordMutation.isPending}
                onClick={(event) => {
                  event.preventDefault();
                  onSavePassword();
                }}
              >
                Salvar nova senha
              </Button>
            </>
          ) : null}
        </form>

        <div className="mt-6 text-center text-xs text-grays-100">
          Lembrou sua senha?{" "}
          <Link
            to="/login"
            className="font-semibold text-secondary hover:brightness-110"
          >
            Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  );
}
