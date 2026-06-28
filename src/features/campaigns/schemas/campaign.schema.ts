import { z } from "zod";
import {
  dateOptional,
  imageUrlOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

export const CampaignSchema = z.object({
  id: numberOptional,
  createdAt: dateOptional,
  updatedAt: dateOptional,
  title: stringRequired,
  description: stringOptional,
  difficulty: stringRequired,
  playersLimit: z.coerce.number().min(0),
  status: stringRequired,
  isPrivate: z.coerce.boolean(),
  isChatEnabled: z.coerce.boolean(),
  creatorId: z.coerce.number().min(0),
  creatorUsername: stringOptional,
  locationName: stringOptional,
  address: stringOptional,
  latitude: numberOptional,
  longitude: numberOptional,
  creationLatitude: numberOptional,
  creationLongitude: numberOptional,
  bannerId: numberOptional,
  bannerUrl: imageUrlOptional,
  gameSystemId: numberOptional,
  gameSystemName: stringOptional,
  bannerContent: imageUrlOptional,
  membersCount: numberOptional,
});

export type ICampaign = z.infer<typeof CampaignSchema>;
