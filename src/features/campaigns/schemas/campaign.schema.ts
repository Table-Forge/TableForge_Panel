import { z } from "zod";

export const CampaignPlayerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  avatar: z.string(),
});

export const SessionScheduleSchema = z.object({
  day: z.string(),
  time: z.string(),
});

export const CampaignSchema = z.object({
  id: z.number(),
  title: z.string(),
  image: z.string(),
  system: z.string(),
  gameMaster: z.string(),
  location: z.string(),
  level: z.string(),
  summary: z.string(),
  fullDescription: z.string(),
  currentPartySize: z.number(),
  maxPartySize: z.number(),
  players: CampaignPlayerSchema.array().optional(),
  frequency: z.string().optional(),
  nextSession: SessionScheduleSchema.optional(),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
export type IPlayer = z.infer<typeof CampaignPlayerSchema>;
export type ISessionSchedule = z.infer<typeof SessionScheduleSchema>;
