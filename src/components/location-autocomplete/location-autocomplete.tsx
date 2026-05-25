import { ErrorMessage } from "@/src/components/error-message/error-message";
import { useEffect, useState } from "react";
import { getInputClasses, inputInnerClasses } from "../input/input.styles";

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY as
  | string
  | undefined;
const LOCATION_SUGGESTIONS_RADIUS_METERS = 50000;

export type SelectedLocation = {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
};

type GeoapifyLocationSuggestion = {
  address_line1?: string;
  address_line2?: string;
  distance?: number;
  formatted: string;
  lat: number;
  lon: number;
  name?: string;
  place_id: string;
};

type UserCoordinates = {
  latitude: number;
  longitude: number;
};

interface LocationAutocompleteProps {
  disabled?: boolean;
  error?: string;
  hasSelectionError?: boolean;
  onChangeText: (value: string) => void;
  onClearSelection: () => void;
  onSelectLocation: (location: SelectedLocation) => void;
  value: string;
}

export function LocationAutocomplete({
  disabled,
  error,
  hasSelectionError = false,
  onChangeText,
  onClearSelection,
  onSelectLocation,
  value,
}: LocationAutocompleteProps) {
  const [search, setSearch] = useState(value);
  const [suggestions, setSuggestions] = useState<GeoapifyLocationSuggestion[]>(
    [],
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates>();

  useEffect(() => {
    setSearch(value);
  }, [value]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setUserCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    });
  }, []);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (trimmedSearch.length < 2 || !GEOAPIFY_API_KEY) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoadingSuggestions(true);

      try {
        const autocompleteParams = new URLSearchParams({
          text: trimmedSearch,
          format: "json",
          limit: "5",
          lang: "pt",
          apiKey: GEOAPIFY_API_KEY,
        });

        if (userCoordinates) {
          autocompleteParams.set(
            "filter",
            `circle:${userCoordinates.longitude},${userCoordinates.latitude},${LOCATION_SUGGESTIONS_RADIUS_METERS}`,
          );
          autocompleteParams.set(
            "bias",
            `proximity:${userCoordinates.longitude},${userCoordinates.latitude}`,
          );
        }

        const autocompleteResponse = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?${autocompleteParams.toString()}`,
          { signal: abortController.signal },
        );

        if (!autocompleteResponse.ok) {
          throw new Error("Falha na busca de localização.");
        }

        const autocompleteData = (await autocompleteResponse.json()) as {
          results?: GeoapifyLocationSuggestion[];
        };
        const sortedSuggestions = (autocompleteData.results ?? [])
          .map((suggestion) => ({
            ...suggestion,
            distance:
              suggestion.distance ??
              (userCoordinates
                ? calculateDistanceInMeters(userCoordinates, {
                    latitude: suggestion.lat,
                    longitude: suggestion.lon,
                  })
                : undefined),
          }))
          .filter(
            (suggestion) =>
              !userCoordinates ||
              (typeof suggestion.distance === "number" &&
                suggestion.distance <= LOCATION_SUGGESTIONS_RADIUS_METERS),
          )
          .sort((first, second) => {
            if (first.distance === undefined) return 1;
            if (second.distance === undefined) return -1;
            return first.distance - second.distance;
          });

        setSuggestions(
          Array.from(
            new Map(
              sortedSuggestions.map((suggestion) => [
                suggestion.place_id,
                suggestion,
              ]),
            ).values(),
          ).slice(0, 5),
        );
      } catch {
        if (!abortController.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoadingSuggestions(false);
        }
      }
    }, 300);

    return () => {
      abortController.abort();
      window.clearTimeout(timeoutId);
    };
  }, [search, userCoordinates]);

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onChangeText(nextValue);
    setSearch(nextValue);
    onClearSelection();
  };

  const handleSelectSuggestion = (suggestion: GeoapifyLocationSuggestion) => {
    const locationName =
      suggestion.name || suggestion.address_line1 || suggestion.formatted;

    onChangeText(locationName);
    setSearch(locationName);
    setSuggestions([]);
    onSelectLocation({
      locationName,
      address: suggestion.formatted,
      latitude: suggestion.lat,
      longitude: suggestion.lon,
    });
  };

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="flex w-full flex-col gap-1">
      <div className="relative">
        <div
          className={getInputClasses(
            error || hasSelectionError ? "Erro" : undefined,
            isLoadingSuggestions,
            disabled,
          )}
        >
          <input
            id="locationName"
            value={value}
            onChange={handleChangeText}
            onBlur={() => window.setTimeout(() => setIsFocused(false), 150)}
            onFocus={() => setIsFocused(true)}
            disabled={disabled}
            placeholder="Digite o nome ou endereço do local"
            className={inputInnerClasses}
          />
        </div>

        {showSuggestions ? (
          <div className="absolute z-30 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-white/15 bg-primary shadow-xl">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="flex w-full flex-col gap-1 border-b border-white/10 px-3 py-2 text-left last:border-b-0 hover:bg-white/10"
              >
                <span className="text-sm font-semibold text-white">
                  {suggestion.name ||
                    suggestion.address_line1 ||
                    suggestion.formatted}
                </span>
                {suggestion.address_line2 ? (
                  <span className="text-xs text-grays-100">
                    {suggestion.address_line2}
                  </span>
                ) : null}
                {typeof suggestion.distance === "number" ? (
                  <span className="text-[10px] font-bold uppercase text-secondary">
                    {formatDistance(suggestion.distance)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {!GEOAPIFY_API_KEY ? (
        <ErrorMessage>Configure VITE_GEOAPIFY_API_KEY para buscar localizações.</ErrorMessage>
      ) : null}
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      {hasSelectionError ? (
        <ErrorMessage>Selecione uma sugestão de localização válida.</ErrorMessage>
      ) : null}
    </div>
  );
}

function calculateDistanceInMeters(
  origin: UserCoordinates,
  destination: UserCoordinates,
) {
  const earthRadiusInMeters = 6371000;
  const originLatitude = toRadians(origin.latitude);
  const destinationLatitude = toRadians(destination.latitude);
  const latitudeDelta = toRadians(destination.latitude - origin.latitude);
  const longitudeDelta = toRadians(destination.longitude - origin.longitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(originLatitude) *
      Math.cos(destinationLatitude) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    earthRadiusInMeters *
    Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  );
}

function formatDistance(distanceInMeters: number) {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  }

  return `${(distanceInMeters / 1000).toFixed(1).replace(".", ",")} km`;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
