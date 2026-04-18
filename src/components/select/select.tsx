import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { type FieldValues, useController } from "react-hook-form";
import { ChevronDown, Search } from "lucide-react";
import type { FocusEvent, KeyboardEvent } from "react";
import type { ISelect } from "./select.interfaces";
import { ErrorMessage } from "@/src/components/error-message/error-message";
import { getInputClasses } from "@/src/components/input/input.styles";
import { Input } from "@/src/components/input/input.default";
import { useDropdownPosition } from "@/src/hooks/utils/useDropdownPosition";
import { normalizeString } from "@/src/utils/format";

const areValuesEqual = (first: unknown, second: unknown) => {
  if (first === second) return true;

  if (typeof first === "string" && typeof second === "string") {
    return normalizeString(first) === normalizeString(second);
  }

  return false;
};

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
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);

  const headerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const shouldFocusSearchRef = useRef(false);
  const searchRequestIdRef = useRef(0);

  const message = error ?? fieldState.error?.message;
  const currentValue = value;
  const isComponentLoading = isLoading || isTyping;

  const selectedItem = useMemo(
    () =>
      initialOptions.find((item) => areValuesEqual(item.value, currentValue)),
    [initialOptions, currentValue],
  );

  const displayedOptions = useMemo(() => {
    if (!inputSearch.trim()) return initialOptions;

    const normalizedSearch = normalizeString(inputSearch);

    const filtered = initialOptions.filter((item) =>
      normalizeString(`${item.name ?? item.label ?? ""}`).includes(
        normalizedSearch,
      ),
    );

    if (
      selectedItem &&
      !filtered.some((item) => areValuesEqual(item.value, selectedItem.value))
    ) {
      filtered.unshift(selectedItem);
    }

    return filtered;
  }, [initialOptions, inputSearch, selectedItem]);

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
    watchDeps: [displayedOptions.length, inputSearch, isComponentLoading],
  });

  useEffect(() => {
    if (!firstReset) return;
    onChange(undefined);
    resetCallback?.();
  }, [firstReset, onChange, resetCallback]);

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

  const isOptionSelectable = (index: number) =>
    displayedOptions[index]?.allowSelect !== false;

  const getNextSelectableIndex = (startIndex: number, direction: 1 | -1) => {
    let nextIndex = startIndex + direction;

    while (nextIndex >= 0 && nextIndex < displayedOptions.length) {
      if (isOptionSelectable(nextIndex)) return nextIndex;
      nextIndex += direction;
    }

    return startIndex;
  };

  const handleOpenList = (open: boolean) => {
    if (open) prepareOpenPosition();
    setListOpen(open);

    if (!open) {
      setFocusedIndex(-1);
      shouldFocusSearchRef.current = false;
      resetDropdownPosition();
    }
  };

  const handleSelect = (index: number) => {
    const item = displayedOptions[index];
    if (!item || item.allowSelect === false) return;

    onChange(item.value);
    onChangeOption?.(item);
    handleOpenList(false);
  };

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
      if (focusedIndex >= 0) handleSelect(focusedIndex);
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
      (nextFocus && searchInputRef.current?.contains(nextFocus));

    if (nextFocus && isInternalFocus) {
      return;
    }

    setTimeout(() => {
      const currentFocus = document.activeElement as Node | null;

      const stillInternalFocus =
        (currentFocus && headerRef.current?.contains(currentFocus)) ||
        (currentFocus && listRef.current?.contains(currentFocus)) ||
        (currentFocus && searchInputRef.current?.contains(currentFocus));

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

  const optionsElement = (
    <ul className="max-h-56 overflow-auto p-1">
      {isComponentLoading ? (
        <li className="px-3 py-4 text-center text-xs tracking-wide text-white/55">
          Carregando...
        </li>
      ) : displayedOptions.length > 0 ? (
        displayedOptions.map((item, index) => {
          const isSelected = areValuesEqual(item.value, currentValue);
          const isFocused = focusedIndex === index;
          const isSelectable = item.allowSelect !== false;

          return (
            <li key={String(item.id ?? item.value ?? index)}>
              <button
                type="button"
                data-option-index={index}
                disabled={!isSelectable}
                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                  isSelected
                    ? "bg-secondary/20 text-white"
                    : "text-white/85 hover:bg-white/10"
                } ${isFocused ? "ring-1 ring-secondary/45" : ""} ${
                  isSelectable ? "opacity-100" : "opacity-50"
                }`}
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleSelect(index);
                }}
              >
                {item.name ?? item.label}
              </button>
            </li>
          );
        })
      ) : (
        <li className="px-3 py-4 text-center text-xs tracking-wide text-white/55">
          Nenhum resultado encontrado
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
                {searchElement}
              </>
            ) : (
              <>
                {searchElement}
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
        disabled={disabled}
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
        className={`flex h-12 w-full items-center justify-between rounded-2xl px-3 text-left ${getInputClasses(
          message,
          isComponentLoading,
          disabled,
        )}`}
      >
        <span
          className={`truncate text-sm ${selectedItem ? "text-white" : "text-white/45"}`}
        >
          {isComponentLoading
            ? "Carregando..."
            : (selectedItem?.name ?? selectedItem?.label ?? title)}
        </span>
        <ChevronDown
          size={18}
          className={`text-white/70 transition ${listOpen ? "rotate-180" : ""}`}
        />
      </button>

      {listElement}

      {message ? <ErrorMessage>{message}</ErrorMessage> : null}
    </div>
  );
}
