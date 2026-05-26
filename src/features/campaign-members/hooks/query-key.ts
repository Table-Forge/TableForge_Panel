export const CAMPAIGN_MEMBER_KEYS = {
  all: ["campaign-members"] as const,
  enums: () => [...CAMPAIGN_MEMBER_KEYS.all, "enums"] as const,
  roleEnum: () => [...CAMPAIGN_MEMBER_KEYS.enums(), "role"] as const,
};
