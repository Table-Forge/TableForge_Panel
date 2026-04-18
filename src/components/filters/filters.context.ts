import { createContext, useContext } from "react";

type TFilterContextValue = {
  close: () => void;
};

const FilterContext = createContext<TFilterContextValue | null>(null);

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used inside <Filters>.");
  }

  return context;
};

export { FilterContext };
