import { z } from "zod";
import {
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const CampaignPlayerSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: stringRequired,
  avatar: stringOptional,
});

export const SessionScheduleSchema = z.object({
  day: stringRequired,
  time: stringRequired,
});

export const CampaignSchema = z.object({
  id: numberOptional,
  title: stringRequired,
  image: stringOptional,
  system: stringRequired,
  gameMaster: stringRequired,
  location: stringRequired,
  level: stringOptional,
  summary: stringOptional,
  fullDescription: stringOptional,
  currentPartySize: z.coerce.number().min(0),
  maxPartySize: z.coerce.number().min(0),
  players: CampaignPlayerSchema.array().optional(),
  frequency: stringOptional,
  nextSession: SessionScheduleSchema.optional(),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
export type IPlayer = z.infer<typeof CampaignPlayerSchema>;
export type ISessionSchedule = z.infer<typeof SessionScheduleSchema>;
