import { ErrorMessage } from "@/src/components/error-message/error-message";
import type { IControlledDateInput } from "./input.intefaces";
import { getInputClasses, inputInnerClasses } from "./input.styles";
import { MaskedInput } from "./input.masked";
import { type FieldValues, type Path, type PathValue, useController } from "react-hook-form";
import type { ReactNode } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BiCalendar } from "react-icons/bi";
import { ptBR } from "date-fns/locale";
import { parseISO } from "date-fns";

const toTwoDigits = (value: number) => String(value).padStart(2, "0");

const serializeDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = toTwoDigits(date.getMonth() + 1);
  const day = toTwoDigits(date.getDate());

  return `${year}-${month}-${day}`;
};

const serializeDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = toTwoDigits(date.getMonth() + 1);
  const day = toTwoDigits(date.getDate());
  const hour = toTwoDigits(date.getHours());
  const minute = toTwoDigits(date.getMinutes());
  const seconds = toTwoDigits(date.getSeconds());

  return `${year}-${month}-${day}T${hour}:${minute}:${seconds}`;
};

const parseDateValue = (value: unknown): Date | null => {
  if (value === null || value === undefined || value === "") return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    const parsed = value.toDate();
    return parsed instanceof Date && !Number.isNaN(parsed.getTime())
      ? parsed
      : null;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const regex =
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/;
  const match = trimmed.match(regex);

  if (match) {
    const [, year, month, day, hour = "12", minute = "00", second = "00"] =
      match;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  const parsed = parseISO(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const parseDateValueOrUndefined = (value: unknown): Date | undefined =>
  parseDateValue(value) ?? undefined;

export function DateInput<TFieldValues extends FieldValues>({
  hookForm,
  name,
  placeholder,
  disabled,
  isLoading,
  minDate,
  maxDate,
  className,
  showYearDropdown = false,
  defaultValue,
  selectsStart,
  selectsEnd,
  startDate,
  endDate,
  showTime = false,
  error: externalError,
}: IControlledDateInput<TFieldValues>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
    defaultValue: (defaultValue ?? undefined) as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >,
  });

  const errorMessage = externalError || error?.message;
  const dateFormat = showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy";
  const mask = showTime ? "99/99/9999 99:99" : "99/99/9999";
  const placeholderText =
    placeholder || (showTime ? "DD/MM/AAAA HH:mm" : "DD/MM/AAAA");

  const onChangeDate = (date: Date | null) => {
    if (!date) {
      onChange(null);
      return;
    }

    if (showTime) {
      onChange(serializeDateTime(date));
      return;
    }

    onChange(serializeDateOnly(date));
  };

  return (
    <div className={`flex w-full flex-col gap-1 ${className ?? ""}`}>
      <div className={getInputClasses(errorMessage, isLoading, disabled)}>
        {isLoading ? (
          <div className="px-3 text-xs text-grays-100">Carregando...</div>
        ) : (
          <div className="relative flex h-full w-full items-center" data-portal="true">
            <DatePicker
              selected={parseDateValue(value)}
              onChange={(date: Date | null) => onChangeDate(date)}
              disabled={disabled || isLoading}
              dateFormat={dateFormat}
              placeholderText={placeholderText}
              showTimeSelect={showTime}
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Hora"
              locale={ptBR}
              showYearDropdown={showYearDropdown}
              minDate={parseDateValueOrUndefined(minDate)}
              maxDate={parseDateValueOrUndefined(maxDate)}
              selectsStart={selectsStart}
              selectsEnd={selectsEnd}
              startDate={parseDateValueOrUndefined(startDate)}
              endDate={parseDateValueOrUndefined(endDate)}
              todayButton="Data atual"
              portalId="root-portal"
              popperClassName="tf-datepicker-popper"
              calendarClassName="tf-datepicker-calendar"
              wrapperClassName="tf-datepicker-wrapper"
              calendarContainer={(props: { children?: ReactNode }) => (
                <div data-portal="true" className="tf-datepicker-calendar-container">
                  {props.children}
                </div>
              )}
              customInput={
                <MaskedInput
                  name={String(name)}
                  mask={mask}
                  data-portal="true"
                  style={{ border: "none" }}
                  className={`${inputInnerClasses} pr-11`}
                />
              }
            />
            <div className="pointer-events-none absolute right-3 text-white">
              <BiCalendar size={20} />
            </div>
          </div>
        )}
      </div>

      {errorMessage ? <ErrorMessage>{errorMessage}</ErrorMessage> : null}
    </div>
  );
}

DateInput.displayName = "DateInput";
