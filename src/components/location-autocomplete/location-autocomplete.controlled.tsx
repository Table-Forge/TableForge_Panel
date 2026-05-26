import {
  type FieldValues,
  type Path,
  type UseFormReturn,
  useController,
} from "react-hook-form";
import {
  LocationAutocomplete,
  type SelectedLocation,
} from "./location-autocomplete";

interface ControlledLocationAutocompleteProps<
  TFieldValues extends FieldValues,
> {
  disabled?: boolean;
  hasSelectionError?: boolean;
  hookForm: UseFormReturn<TFieldValues>;
  isSelectionValid?: boolean;
  name: Path<TFieldValues>;
  onClearSelection: () => void;
  onSelectLocation: (location: SelectedLocation) => void;
}

export function ControlledLocationAutocomplete<
  TFieldValues extends FieldValues = FieldValues,
>({
  disabled,
  hasSelectionError,
  hookForm,
  isSelectionValid,
  name,
  onClearSelection,
  onSelectLocation,
}: ControlledLocationAutocompleteProps<TFieldValues>) {
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: hookForm.control,
  });

  return (
    <LocationAutocomplete
      disabled={disabled}
      error={error?.message}
      hasSelectionError={hasSelectionError}
      isSelectionValid={isSelectionValid}
      value={value?.toString() ?? ""}
      onChangeText={onChange}
      onClearSelection={onClearSelection}
      onSelectLocation={(location) => {
        onChange(location.locationName);
        onSelectLocation(location);
      }}
    />
  );
}
