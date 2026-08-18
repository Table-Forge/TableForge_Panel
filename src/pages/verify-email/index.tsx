import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/src/components/button/button";
import { InputGroup } from "@/src/components/input-group/input-group";
import { ControlledInput } from "@/src/components/input/input.default.controlled";
import { Label } from "@/src/components/label/label";
import {
  RECOVERY_CODE_LENGTH,
  RESEND_COOLDOWN_SECONDS,
  ValidationFormSchema,
  type IValidationForm,
} from "@/src/features/auth/schemas/auth.schema";
import { normalizeCode, formatCooldown } from "@/src/utils/format";
import { useAuthMutation } from "@/src/features/auth/hooks/use-auth-mutations";
import { useCountdown } from "@/src/hooks/utils/use-countdown";
import { useBoundStore } from "@/src/store";
import { useLogo } from "@/src/constants/logos";



export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const logo = useLogo();

  const addToast = useBoundStore((state) => state.addToast);
  const {
    sendValidationCodeMutation,
    validateEmailCodeMutation,
  } = useAuthMutation();

  const [isCodeInvalid, setIsCodeInvalid] = useState(false);
  const [shakeTick, setShakeTick] = useState(0);
  const [lastAttemptedCode, setLastAttemptedCode] = useState("");

  const resendCooldown = useCountdown();

  const codeInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const form = useForm<IValidationForm, unknown, IValidationForm>({
    resolver: zodResolver(ValidationFormSchema) as Resolver<
      IValidationForm,
      unknown,
      IValidationForm
    >,
    mode: "onChange",
    defaultValues: {
      step: initialEmail ? 2 : 1,
      email: initialEmail,
      code: "",
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
  const code = normalizeCode(watch("code") ?? "", RECOVERY_CODE_LENGTH);

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
    if (validateEmailCodeMutation.isPending) return;
    if (!email?.trim()) return;
    if (lastAttemptedCode === code) return;

    setLastAttemptedCode(code);
    validateEmailCodeMutation.mutate(
      {
        email: email.trim(),
        code,
      },
      {
        onSuccess: () => {
          setIsCodeInvalid(false);
          clearErrors("code");
          addToast("success", "Conta validada com sucesso! Você já pode acessar a plataforma.");
          navigate("/login", { replace: true });
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
    validateEmailCodeMutation,
    clearErrors,
    setError,
    addToast,
    navigate,
  ]);

  useEffect(() => {
    if (!isCodeInvalid) return;
    if (code === lastAttemptedCode) return;
    setIsCodeInvalid(false);
    clearErrors("code");
  }, [clearErrors, code, isCodeInvalid, lastAttemptedCode]);

  useEffect(() => {
    if (searchParams.get("email")) {
      resendCooldown.start(RESEND_COOLDOWN_SECONDS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSendCode = handleSubmit(async () => {
    const isValidEmail = await trigger("email");
    if (!isValidEmail) return;

    sendValidationCodeMutation.mutate(email.trim(), {
      onSuccess: () => {
        setValue("step", 2, { shouldDirty: false, shouldTouch: false });
        setIsCodeInvalid(false);
        setLastAttemptedCode("");
        setValue("code", "", { shouldDirty: true, shouldTouch: true });
        clearErrors(["code"]);
        addToast("success", "Código enviado para o e-mail informado.");
        resendCooldown.start(RESEND_COOLDOWN_SECONDS);
        window.setTimeout(() => codeInputRefs.current[0]?.focus(), 50);
      },
    });
  });

  const onResendCode = () => {
    if (resendCooldown.isActive) return;

    resendCooldown.start(RESEND_COOLDOWN_SECONDS);
    sendValidationCodeMutation.mutate(email.trim(), {
      onSuccess: () => {
        addToast("success", "Código reenviado para o e-mail informado.");
      },
      onError: (error) => {
        const status = (error as { response?: { status?: number } })?.response
          ?.status;
        if (status === 400) {
          resendCooldown.reset();
        }
      },
    });
  };

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
    sendValidationCodeMutation.isPending ||
    validateEmailCodeMutation.isPending;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-8 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,36,0,0.28),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,36,0,0.24),transparent_46%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-secondary/25 bg-primary/80 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur">
        <header className="mb-6 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center ">
            <img
              src={logo.vertical}
              alt="TableForge Logo"
              width={180}
              height={180}
              className="object-contain"
            />
          </div>

          <p className="mt-2 max-w-[280px] text-center text-sm text-grays-100">
            Verificação de e-mail em 2 etapas.
          </p>
        </header>

        <div className="mb-6 flex items-center justify-center gap-2">
          {[1, 2].map((item, index) => {
            const isActive = step === item;
            const isDone = step === 2 && item === 1;
            return (
              <span
                key={item}
                className={`h-2 w-16 rounded-full transition ${isActive || isDone ? "bg-secondary" : "bg-white/15"
                  } ${index === 1 ? "mr-0" : ""}`}
              />
            );
          })}
        </div>

        <form
          onSubmit={(event) => event.preventDefault()}
          className="space-y-5"
        >
          {step === 1 ? (
            <>
              <p className="text-sm text-grays-100">
                Informe seu e-mail cadastrado para receber o código de verificação.
              </p>

              <InputGroup>
                <Label htmlFor="email">E-mail</Label>
                <ControlledInput<IValidationForm>
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
                isLoading={sendValidationCodeMutation.isPending}
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
              <p className="text-sm text-grays-100 text-center">
                Digite os {RECOVERY_CODE_LENGTH} dígitos enviados para{" "}
                <strong className="text-white">o e-mail cadastrado em {email}</strong>.
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
                      className={`h-14 w-12 rounded-xl border bg-background/50 text-center text-2xl font-bold outline-none transition ${isCodeInvalid
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

              <div className="flex items-center justify-end text-xs">                <Button
                  type="button"
                  buttonStyle="soft"
                  size="xs"
                  disabled={isBusy || resendCooldown.isActive}
                  onClick={(event) => {
                    event.preventDefault();
                    onResendCode();
                  }}
                >
                  {resendCooldown.isActive
                    ? `Reenviar em ${formatCooldown(resendCooldown.secondsLeft)}`
                    : "Reenviar código"}
                </Button>
              </div>

              {validateEmailCodeMutation.isPending ? (
                <p className="text-center text-xs text-grays-100">
                  Validando código...
                </p>
              ) : null}
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
