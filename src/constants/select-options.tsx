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

export const PAGE_SIZE: TSelectOptions<number>[] = [
  { value: 20, name: "20 por página" },
  { value: 50, name: "50 por página" },
  { value: 70, name: "70 por página" },
  { value: 100, name: "100 por página" },
];
