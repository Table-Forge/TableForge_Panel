import type { TSide } from "@/src/components/info/info";

interface ITooltip extends ITooltipStyles {
  children?: React.ReactNode;
  text: string | number;
  style?: React.CSSProperties;
  forcePointer?: boolean;
}

interface ITooltipStyles {
  overflowed?: boolean;
  side?: TSide;
  uppercase?: boolean;
}

export type { ITooltip, ITooltipStyles };
