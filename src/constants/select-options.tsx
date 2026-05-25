import type { TSelectOptions } from "@/src/components/select/select.interfaces";

export const IMAGE_TYPE_VALUES = [
  "CampaignBanner",
  "UserProfile",
  "GameSystem",
] as const;

export const IMAGE_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "CampaignBanner", name: "Banner de campanha" },
  { value: "UserProfile", name: "Foto de perfil" },
  { value: "GameSystem", name: "Sistema de jogo" },
];

export const USER_TYPE_OPTIONS: TSelectOptions[] = [
  { value: "Admin", name: "Administrador" },
  { value: "Player", name: "Jogador" },
];

export const CAMPAIGN_DIFFICULTY_OPTIONS: TSelectOptions[] = [
  { value: "Low", name: "Baixo" },
  { value: "Medium", name: "Moderado" },
  { value: "High", name: "Alto" },
  { value: "Insane", name: "Insano" },
];

export const CAMPAIGN_STATUS_OPTIONS: TSelectOptions[] = [
  { value: "Draft", name: "Rascunho" },
  { value: "Active", name: "Ativo" },
  { value: "Frozen", name: "Congelado" },
  { value: "Closed", name: "Fechado" },
];

export const PAGE_SIZE: TSelectOptions<number>[] = [
  { value: 20, name: "20 por página" },
  { value: 50, name: "50 por página" },
  { value: 70, name: "70 por página" },
  { value: 100, name: "100 por página" },
];
