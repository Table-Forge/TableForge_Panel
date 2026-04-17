import type { TSelectOptions } from "../components";

export const IMAGE_TYPE_VALUES = ["CampaignBanner", "UserProfile"] as const;

export const IMAGE_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "CampaignBanner", name: "Banner de campanha" },
  { value: "UserProfile", name: "Foto de perfil" },
];

export const USER_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "Admin", name: "Administrador" },
  { value: "Player", name: "Jogador" },
];
