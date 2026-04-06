import { useMemo, useState } from "react";
import { type FieldValues, useController } from "react-hook-form";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import type { IMultiSelect, TMultiSelectOption } from "./multi-select.interfaces";
import { ERROR_MESSAGE } from "@/src/components/error-message/error-message.constants";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { getInputClasses, inputInnerClasses } from "@/src/components/input/input.styles";

export function MultiSelect<TFieldValues extends FieldValues>({
  initialOptions,
  title,
  disabled = false,
  searchInput = false,
  name,
  hookForm,
  className,
  allowNewOption = true,
  allowSelectAll = false,
  onChangeInputSearch,
  searchPlaceholder,
  isLoading = false,
  error,
}: IMultiSelect<TFieldValues>) {
  const {
    field: { value = [], onChange },
    fieldState,
  } = useController({
    name,
    control: hookForm.control as never,
    defaultValue: [] as never,
  });

  const selectedValues = (Array.isArray(value) ? value : []) as Array<string | number | boolean>;
  const [listOpen, setListOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [newOptionError, setNewOptionError] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [extraOptions, setExtraOptions] = useState<TMultiSelectOption[]>([]);

  const options = useMemo(() => [...initialOptions, ...extraOptions], [extraOptions, initialOptions]);

  const displayedOptions = useMemo(() => {
    if (!inputSearch.trim()) return options;
    const normalized = inputSearch.toLowerCase();
    return options.filter((opt) => opt.name.toLowerCase().includes(normalized));
  }, [inputSearch, options]);

  const selectedItems = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value)),
    [options, selectedValues],
  );

  const fieldError = error ?? fieldState.error?.message ?? newOptionError;

  const toggleSelection = (selectedValue: string | number | boolean) => {
    if (selectedValues.includes(selectedValue)) {
      onChange(selectedValues.filter((item) => item !== selectedValue));
      return;
    }
    onChange([...selectedValues, selectedValue]);
  };

  const toggleAllSelected = () => {
    const allValues = options.map((opt) => opt.value);
    const allSelected = allValues.every((option) => selectedValues.includes(option));
    onChange(allSelected ? [] : allValues);
  };

  const handleAddOption = () => {
    const normalized = newOption.trim();

    if (!normalized) {
      setNewOptionError(ERROR_MESSAGE.empty);
      return;
    }

    if (options.some((item) => String(item.value) === normalized)) {
      setNewOptionError(ERROR_MESSAGE.duplicate);
      return;
    }

    const nextOption = { value: normalized, name: normalized };
    setExtraOptions((current) => [...current, nextOption]);
    onChange([...selectedValues, normalized]);
    setNewOption("");
    setNewOptionError("");
  };

  return (
    <div className={`relative flex w-full flex-col gap-1 ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => !disabled && setListOpen((state) => !state)}
        disabled={disabled}
        className={`${getInputClasses(fieldError, isLoading, disabled)} min-h-12 px-3`}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className={`flex flex-wrap gap-1 text-left text-xs uppercase ${selectedItems.length ? "text-white" : "text-white/45"}`}>
            {selectedItems.length > 0 ? (
              selectedItems.map((item) => (
                <span
                  key={String(item.value)}
                  className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 bg-secondary/15 px-2 py-1"
                >
                  {item.name}
                  <span
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleSelection(item.value);
                    }}
                    className="cursor-pointer text-white/70 hover:text-white"
                  >
                    <X size={12} />
                  </span>
                </span>
              ))
            ) : (
              title
            )}
          </div>
          <ChevronDown size={18} className={`text-white/70 transition ${listOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {listOpen ? (
        <div className="absolute top-[calc(100%+6px)] z-40 w-full overflow-hidden rounded-2xl border border-white/15 bg-primary shadow-xl">
          {allowNewOption ? (
            <div className="flex gap-2 border-b border-white/10 p-2">
              <div className={getInputClasses(undefined, false, false)}>
                <input
                  value={newOption}
                  onChange={(event) => {
                    setNewOption(event.target.value);
                    setNewOptionError("");
                  }}
                  placeholder="Adicionar novo..."
                  className={inputInnerClasses}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleAddOption();
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-secondary bg-secondary text-white"
              >
                <Plus size={18} />
              </button>
            </div>
          ) : null}

          {allowSelectAll ? (
            <button
              type="button"
              onClick={toggleAllSelected}
              className="flex w-full items-center justify-between border-b border-white/10 px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-white hover:bg-white/10"
            >
              Selecionar todos
              {selectedValues.length === options.length && options.length > 0 ? <Check size={14} /> : null}
            </button>
          ) : null}

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
            {isLoading ? (
              <li className="px-3 py-4 text-center text-xs uppercase tracking-wide text-white/55">Carregando...</li>
            ) : displayedOptions.length > 0 ? (
              displayedOptions.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <li key={String(option.value)}>
                    <button
                      type="button"
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs uppercase transition ${
                        isSelected ? "bg-secondary/20 text-white" : "text-white/85 hover:bg-white/10"
                      }`}
                      onClick={() => toggleSelection(option.value)}
                    >
                      {option.name || option.label}
                      {isSelected ? <Check size={14} /> : null}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-4 text-center text-xs uppercase tracking-wide text-white/55">
                Nenhuma opção encontrada
              </li>
            )}
          </ul>
        </div>
      ) : null}

      {fieldError ? <ErrorMessage>{fieldError}</ErrorMessage> : null}
    </div>
  );
}
