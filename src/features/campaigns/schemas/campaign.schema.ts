import { z } from "zod";
import {
  numberOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const CampaignSchema = z.object({
  id: numberOptional,
  title: stringRequired,
  description: stringRequired,
  difficulty: stringRequired,
  playersLimit: z.coerce.number().min(0),
  status: stringRequired,
  isPrivate: z.coerce.boolean(),
  isChatEnabled: z.coerce.boolean(),
  creatorId: z.coerce.number().min(0),
  locationId: z.coerce.number().min(0),
  bannerId: z.coerce.number().min(0),
  gameSystemId: z.coerce.number().min(0),
});

export type ICampaign = z.infer<typeof CampaignSchema>;
