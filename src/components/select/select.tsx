import { useEffect, useMemo, useState } from "react";
import { type FieldValues, useController } from "react-hook-form";
import { ChevronDown, Search } from "lucide-react";
import type { ISelect } from "./select.interfaces";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { getInputClasses, inputInnerClasses } from "@/src/components/input/input.styles";

export function Select<TFieldValues extends FieldValues = FieldValues>({
  initialOptions,
  title,
  disabled = false,
  searchInput = false,
  name,
  hookForm,
  className,
  searchPlaceholder,
  isLoading = false,
  onChangeOption,
  onChangeInputSearch,
  selected,
  firstReset,
  resetCallback,
  error,
}: ISelect<TFieldValues>) {
  const {
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control: hookForm.control,
    defaultValue: selected,
  });

  const [listOpen, setListOpen] = useState(false);
  const [inputSearch, setInputSearch] = useState("");

  const message = error ?? fieldState.error?.message;

  const displayedOptions = useMemo(() => {
    if (!inputSearch.trim()) return initialOptions;
    const normalized = inputSearch.toLowerCase();
    return initialOptions.filter((item) =>
      `${item.name ?? item.label ?? ""}`.toLowerCase().includes(normalized),
    );
  }, [initialOptions, inputSearch]);

  const selectedItem = useMemo(
    () => initialOptions.find((item) => item.value === value),
    [initialOptions, value],
  );

  useEffect(() => {
    if (!firstReset) return;
    onChange(undefined);
    resetCallback?.();
  }, [firstReset, onChange, resetCallback]);

  return (
    <div className={`relative flex w-full flex-col gap-1 ${className ?? ""}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setListOpen((state) => !state)}
        className={`flex h-12 w-full items-center justify-between rounded-2xl px-3 text-left ${
          getInputClasses(message, isLoading, disabled)
        }`}
      >
        <span className={`truncate text-sm ${selectedItem ? "text-white" : "text-white/45"}`}>
          {isLoading ? "Carregando..." : selectedItem?.name ?? selectedItem?.label ?? title}
        </span>
        <ChevronDown size={18} className={`text-white/70 transition ${listOpen ? "rotate-180" : ""}`} />
      </button>

      {listOpen ? (
        <div className="absolute top-[calc(100%+6px)] z-40 w-full overflow-hidden rounded-2xl border border-white/15 bg-primary shadow-xl">
          {searchInput ? (
            <div className="border-b border-white/10 p-2">
              <div className={getInputClasses(undefined, false, false)}>
                <input
                  value={inputSearch}
                  onChange={(event) => {
                    setInputSearch(event.target.value);
                    onChangeInputSearch?.(event.target.value);
                  }}
                  placeholder={searchPlaceholder || "Pesquisar..."}
                  className={inputInnerClasses}
                />
                <Search size={15} className="mr-2 text-white/60" />
              </div>
            </div>
          ) : null}

          <ul className="max-h-56 overflow-auto p-1">
            {displayedOptions.length > 0 ? (
              displayedOptions.map((item) => (
                <li key={String(item.value)}>
                  <button
                    type="button"
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm uppercase transition ${
                      item.value === value
                        ? "bg-secondary/20 text-white"
                        : "text-white/85 hover:bg-white/10"
                    }`}
                    onClick={() => {
                      onChange(item.value);
                      onChangeOption?.(item);
                      setListOpen(false);
                    }}
                  >
                    {item.name ?? item.label}
                  </button>
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-center text-xs uppercase tracking-wide text-white/55">
                Nenhum resultado encontrado
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {message ? <ErrorMessage>{message}</ErrorMessage> : null}
    </div>
  );
}
