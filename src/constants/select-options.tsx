import type { TSelectOptions } from "../components";

export const IMAGE_TYPE_VALUES = ["CampaignBanner", "UserProfile"] as const;

export const IMAGE_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "CampaignBanner", name: "CampaignBanner" },
  { value: "UserProfile", name: "UserProfile" },
];
