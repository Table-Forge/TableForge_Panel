import { createPortal } from "react-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type FieldValues, useController } from "react-hook-form";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import type { FocusEvent, KeyboardEvent } from "react";

import { ButtonIcon } from "@/src/components/button-icon/button-icon";
import { ERROR_MESSAGE } from "@/src/components/error-message/error-message.constants";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { getInputClasses } from "@/src/components/input/input.styles";
import { Input } from "@/src/components/input/input.default";
import { useDropdownPosition } from "@/src/hooks/utils/useDropdownPosition";
import { normalizeString } from "@/src/utils/format";

import type {
  IMultiSelect,
  TMultiSelectOption,
} from "./multi-select.interfaces";

const areValuesEqual = (first: unknown, second: unknown) => {
  if (first === second) return true;

  if (typeof first === "string" && typeof second === "string") {
    return normalizeString(first) === normalizeString(second);
  }

  return false;
};

const includesValue = (values: readonly unknown[], target: unknown) =>
  values.some((item) => areValuesEqual(item, target));

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
    field: { value, onChange },
    fieldState,
  } = useController({
    name,
    control: hookForm.control,
    defaultValue: [] as never,
  });

  const selectedValues = (Array.isArray(value) ? value : []) as Array<
    string | number | boolean
  >;

  const [listOpen, setListOpen] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [newOptionError, setNewOptionError] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [customOptions, setCustomOptions] = useState<TMultiSelectOption[]>([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const headerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const newOptionInputRef = useRef<HTMLInputElement>(null);
  const shouldFocusSearchRef = useRef(false);
  const searchRequestIdRef = useRef(0);

  const options = useMemo(() => {
    const merged = [...initialOptions, ...customOptions];

    return merged.filter(
      (option, index) =>
        merged.findIndex((candidate) =>
          areValuesEqual(candidate.value, option.value),
        ) === index,
    );
  }, [customOptions, initialOptions]);

  const displayedOptions = useMemo(() => {
    if (!inputSearch.trim()) return options;

    const normalizedSearch = normalizeString(inputSearch);
    return options.filter((option) =>
      normalizeString(`${option.name ?? option.label ?? ""}`).includes(
        normalizedSearch,
      ),
    );
  }, [inputSearch, options]);

  const selectedItems = useMemo(
    () =>
      selectedValues.map((selectedValue) => {
        const matchedOption = options.find((option) =>
          areValuesEqual(option.value, selectedValue),
        );

        return {
          value: selectedValue,
          name:
            matchedOption?.name ??
            matchedOption?.label ??
            String(selectedValue),
        };
      }),
    [options, selectedValues],
  );

  const fieldError = error ?? fieldState.error?.message;
  const isComponentLoading = isLoading || isTyping;

  const {
    listStyle,
    listDirection,
    isSettling,
    prepareOpenPosition,
    resetDropdownPosition,
  } = useDropdownPosition({
    triggerRef: headerRef,
    listRef,
    isOpen: listOpen,
    watchDeps: [
      displayedOptions.length,
      allowNewOption,
      inputSearch,
      allowSelectAll,
      isComponentLoading,
    ],
    offsetTop: 2,
    offsetLeft: -1,
    widthOffset: 2,
  });

  const getNextSelectableIndex = (startIndex: number, direction: 1 | -1) => {
    let nextIndex = startIndex + direction;

    while (nextIndex >= 0 && nextIndex < displayedOptions.length) {
      if (displayedOptions[nextIndex]?.allowSelect !== false) return nextIndex;
      nextIndex += direction;
    }

    return startIndex;
  };

  const toggleSelection = useCallback(
    (option: TMultiSelectOption) => {
      const selectedValue = option.value;
      const isSelected = includesValue(selectedValues, selectedValue);

      if (!isSelected && option.allowSelect === false) {
        return;
      }

      if (isSelected) {
        onChange(
          selectedValues.filter((item) => !areValuesEqual(item, selectedValue)),
        );
        return;
      }

      onChange([...selectedValues, selectedValue]);
    },
    [onChange, selectedValues],
  );

  const removeSelection = useCallback(
    (selectedValue: string | number | boolean) => {
      onChange(
        selectedValues.filter((item) => !areValuesEqual(item, selectedValue)),
      );
    },
    [onChange, selectedValues],
  );

  const handleOpenList = (open: boolean) => {
    if (open) prepareOpenPosition();
    setListOpen(open);

    if (!open) {
      setFocusedIndex(-1);
      shouldFocusSearchRef.current = false;
      resetDropdownPosition();
    }
  };

  const selectableDisplayedValues = useMemo(
    () =>
      displayedOptions
        .filter((option) => option.allowSelect !== false)
        .map((option) => option.value),
    [displayedOptions],
  );

  const toggleAllSelected = () => {
    const isAllSelected =
      selectableDisplayedValues.length > 0 &&
      selectableDisplayedValues.every((optionValue) =>
        includesValue(selectedValues, optionValue),
      );

    if (isAllSelected) {
      onChange(
        selectedValues.filter(
          (item) => !includesValue(selectableDisplayedValues, item),
        ),
      );
      return;
    }

    const valuesToAdd = selectableDisplayedValues.filter(
      (optionValue) => !includesValue(selectedValues, optionValue),
    );

    onChange([...selectedValues, ...valuesToAdd]);
  };

  const handleAddOption = () => {
    const normalized = newOption.trim();

    if (!normalized) {
      setNewOptionError(ERROR_MESSAGE.empty);
      return;
    }

    const exists = options.some((item) =>
      areValuesEqual(item.value, normalized),
    );
    if (exists) {
      setNewOptionError(ERROR_MESSAGE.duplicate);
      return;
    }

    const nextOption = { value: normalized, name: normalized };
    setCustomOptions((current) => [...current, nextOption]);
    onChange([...selectedValues, normalized]);
    setNewOption("");
    setNewOptionError("");
  };

  useEffect(() => {
    if (!onChangeInputSearch) return;

    const normalizedInput = inputSearch.trim();
    if (normalizedInput.length < 3) {
      setIsTyping(false);
      return;
    }

    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;
    setIsTyping(true);

    const timeoutId = window.setTimeout(async () => {
      try {
        await onChangeInputSearch(normalizedInput);
      } finally {
        if (searchRequestIdRef.current === requestId) {
          setIsTyping(false);
        }
      }
    }, 800);

    return () => window.clearTimeout(timeoutId);
  }, [inputSearch, onChangeInputSearch]);

  useEffect(() => {
    if (!selectedValues.length) return;

    setCustomOptions((previous) => {
      const knownOptions = [...initialOptions, ...previous];

      const missing = selectedValues
        .filter(
          (selectedValue) =>
            !knownOptions.some((option) =>
              areValuesEqual(option.value, selectedValue),
            ),
        )
        .map((selectedValue) => ({
          value: selectedValue,
          name: String(selectedValue),
        }));

      return missing.length > 0 ? [...previous, ...missing] : previous;
    });
  }, [initialOptions, selectedValues]);

  useEffect(() => {
    if (focusedIndex < 0 || !listRef.current) return;

    const option = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${focusedIndex}"]`,
    );
    option?.scrollIntoView({ block: "nearest" });
  }, [focusedIndex]);

  useEffect(() => {
    if (!listOpen || !searchInput || !shouldFocusSearchRef.current) return;

    const frameId = requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });

    shouldFocusSearchRef.current = false;
    return () => cancelAnimationFrame(frameId);
  }, [listOpen, searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        headerRef.current?.contains(target) ||
        listRef.current?.contains(target)
      ) {
        return;
      }

      handleOpenList(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!listOpen) {
      if (
        event.key === "Enter" ||
        event.key === " " ||
        event.key === "ArrowDown"
      ) {
        event.preventDefault();
        if (searchInput) shouldFocusSearchRef.current = true;
        handleOpenList(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedIndex((previous) => getNextSelectableIndex(previous, 1));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedIndex((previous) => {
        const start = previous < 0 ? displayedOptions.length : previous;
        return getNextSelectableIndex(start, -1);
      });
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (focusedIndex >= 0) {
        const option = displayedOptions[focusedIndex];
        if (option) toggleSelection(option);
      }
      return;
    }

    if (event.key === "Escape" || event.key === "Tab") {
      handleOpenList(false);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLButtonElement>) => {
    const nextFocus = event.relatedTarget as Node | null;

    const isInternalFocus =
      (nextFocus && headerRef.current?.contains(nextFocus)) ||
      (nextFocus && listRef.current?.contains(nextFocus)) ||
      (nextFocus && searchInputRef.current?.contains(nextFocus)) ||
      (nextFocus && newOptionInputRef.current?.contains(nextFocus));

    if (nextFocus && isInternalFocus) {
      return;
    }

    setTimeout(() => {
      const currentFocus = document.activeElement as Node | null;

      const stillInternalFocus =
        (currentFocus && headerRef.current?.contains(currentFocus)) ||
        (currentFocus && listRef.current?.contains(currentFocus)) ||
        (currentFocus && searchInputRef.current?.contains(currentFocus)) ||
        (currentFocus && newOptionInputRef.current?.contains(currentFocus));

      if (!stillInternalFocus) {
        handleOpenList(false);
      }
    }, 100);
  };

  const searchElement = searchInput ? (
    <div className="border-b border-white/10 p-2">
      <div className="relative">
        <Input
          ref={searchInputRef}
          value={inputSearch}
          onChange={(event) => {
            setInputSearch(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setFocusedIndex(getNextSelectableIndex(-1, 1));
              headerRef.current?.focus();
            }
          }}
          placeholder={
            searchPlaceholder ||
            (onChangeInputSearch
              ? "Digite 3 caracteres para pesquisar"
              : "Pesquisar...")
          }
          autoComplete="off"
          wrapperClassName="w-full"
          className="pr-8"
        />
        <Search
          size={15}
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/60"
        />
      </div>
    </div>
  ) : null;

  const newOptionElement = allowNewOption ? (
    <div className="flex gap-2 border-b border-white/10 p-2">
      <Input
        ref={newOptionInputRef}
        value={newOption}
        onChange={(event) => {
          setNewOption(event.target.value);
          setNewOptionError("");
        }}
        placeholder="Adicionar novo..."
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            handleAddOption();
          }
        }}
        wrapperClassName="flex-1"
        error={newOptionError || undefined}
      />
      <ButtonIcon
        onMouseDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          handleAddOption();
        }}
        size="48px"
        className="border border-secondary bg-secondary text-white"
      >
        <Plus size={18} />
      </ButtonIcon>
    </div>
  ) : null;

  const selectAllElement = allowSelectAll ? (
    <button
      type="button"
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleAllSelected();
      }}
      className="flex w-full items-center justify-between border-b border-white/10 px-3 py-2 text-left text-xs font-bold tracking-wide text-white hover:bg-white/10"
    >
      Selecionar todos
      {selectableDisplayedValues.length > 0 &&
      selectableDisplayedValues.every((optionValue) =>
        includesValue(selectedValues, optionValue),
      ) ? (
        <Check size={14} />
      ) : null}
    </button>
  ) : null;

  const optionsElement = (
    <ul className="max-h-56 overflow-auto p-1">
      {isComponentLoading ? (
        <li className="px-3 py-4 text-center text-xs tracking-wide text-white/55">
          Carregando...
        </li>
      ) : displayedOptions.length > 0 ? (
        displayedOptions.map((option, index) => {
          const isSelected = includesValue(selectedValues, option.value);
          const isFocused = focusedIndex === index;
          const isSelectable = option.allowSelect !== false;

          return (
            <li key={String(option.id ?? option.value ?? index)}>
              <button
                type="button"
                data-option-index={index}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                  isSelected
                    ? "bg-secondary/20 text-white"
                    : "text-white/85 hover:bg-white/10"
                } ${isFocused ? "ring-1 ring-secondary/45" : ""} ${
                  isSelectable || isSelected ? "opacity-100" : "opacity-50"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (!isSelectable && !isSelected) return;
                  toggleSelection(option);
                }}
              >
                {option.name ?? option.label ?? String(option.value)}
                {isSelected ? <Check size={14} /> : null}
              </button>
            </li>
          );
        })
      ) : (
        <li className="px-3 py-4 text-center text-xs tracking-wide text-white/55">
          Nenhuma opção encontrada
        </li>
      )}
    </ul>
  );

  const listElement =
    listOpen && listStyle.top > 0
      ? createPortal(
          <div
            ref={listRef}
            data-portal="true"
            className="absolute z-[1300] overflow-hidden rounded-2xl border border-white/15 bg-primary shadow-xl"
            style={{
              top: `${listStyle.top}px`,
              left: `${listStyle.left}px`,
              width: `${listStyle.width}px`,
              opacity: isSettling ? 0 : 1,
              pointerEvents: isSettling ? "none" : "auto",
            }}
          >
            {listDirection === "up" ? (
              <>
                {optionsElement}
                {selectAllElement}
                {newOptionElement}
                {searchElement}
              </>
            ) : (
              <>
                {searchElement}
                {newOptionElement}
                {selectAllElement}
                {optionsElement}
              </>
            )}
          </div>,
          document.body,
        )
      : null;

  return (
    <div className={`relative flex w-full flex-col gap-1 ${className ?? ""}`}>
      <button
        ref={headerRef}
        type="button"
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseDown={(event) => {
          if (disabled) return;

          event.preventDefault();
          if (!listOpen && searchInput) {
            shouldFocusSearchRef.current = true;
          }
          handleOpenList(!listOpen);
          headerRef.current?.focus();
        }}
        disabled={disabled}
        className={`${getInputClasses(fieldError, isComponentLoading, disabled)} min-h-12 px-3`}
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div
            className={`flex flex-wrap gap-1 text-left text-xs ${selectedItems.length ? "text-white" : "text-white/45"}`}
          >
            {selectedItems.length > 0
              ? selectedItems.map((item) => (
                  <span
                    key={String(item.value)}
                    className="inline-flex items-center gap-1 rounded-lg border border-secondary/30 bg-secondary/15 px-2 py-1"
                  >
                    {item.name}
                    <span
                      onMouseDown={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeSelection(item.value);
                      }}
                      className="cursor-pointer text-white/70 hover:text-white"
                    >
                      <X size={12} />
                    </span>
                  </span>
                ))
              : title}
          </div>

          <div className="flex items-center gap-2 text-white/70">
            {selectedValues.length > 0 ? (
              <span
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onChange([]);
                }}
                className="cursor-pointer rounded-md p-0.5 transition hover:bg-white/10 hover:text-white"
              >
                <X size={14} />
              </span>
            ) : null}
            <ChevronDown
              size={18}
              className={`transition ${listOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </button>

      {listElement}

      {fieldError ? <ErrorMessage>{fieldError}</ErrorMessage> : null}
    </div>
  );
}
