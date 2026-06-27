import type { TSelectOptions } from "@/src/components/select/select.interfaces";

export const IMAGE_TYPE_VALUES = [
  "CampaignBanner",
  "UserProfile",
  "GameSystem",
  "CharacterAvatar",
] as const;

export const PAGE_SIZE: TSelectOptions<number>[] = [
  { value: 20, name: "20 por página" },
  { value: 50, name: "50 por página" },
  { value: 70, name: "70 por página" },
  { value: 100, name: "100 por página" },
];
