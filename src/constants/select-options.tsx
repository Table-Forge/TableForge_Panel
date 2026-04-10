import type { TSelectOptions } from "../components";

export const IMAGE_TYPE_VALUES = ["CampaignBanner", "UserProfile"] as const;

export const IMAGE_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "CampaignBanner", name: "CampaignBanner" },
  { value: "UserProfile", name: "UserProfile" },
];

export const GENDER_OPTIONS: TSelectOptions[] = [
  { name: "Feminino", value: "feminino" },
  { name: "Masculino", value: "masculino" },
  { name: "Não-binário", value: "nao_binario" },
  { name: "Prefiro não responder", value: "prefiro_nao_responder" },
  { name: "Outro", value: "outro" },
];
