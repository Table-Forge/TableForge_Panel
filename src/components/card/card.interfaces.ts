import type { HTMLAttributes } from "react";

export type TCardVariant = "default" | "surface" | "highlighted";
export type TCardPadding = "none" | "sm" | "md";
export type TCardCut = "sm" | "md" | "lg";

export interface ICard extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "article" | "aside" | "header";
  variant?: TCardVariant;
  padding?: TCardPadding;
  cut?: TCardCut;
  brackets?: boolean;
  interactive?: boolean;
}
