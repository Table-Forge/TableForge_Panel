import {
  imageUrlOptional,
  numberOptional,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";
import { z } from "zod";

export const BannerSchema = z.object({
  id: numberOptional,
  tag: stringOptional,
  title: stringRequired,
  description: stringRequired,
  link: stringOptional,
  order: numberOptional,
  imageId: numberOptional,
  imageUrl: imageUrlOptional,
});

export type IBanner = z.infer<typeof BannerSchema>;

export const BannerCreateFormSchema = BannerSchema.omit({
  id: true,
  imageUrl: true,
});

export type IBannerCreate = z.infer<typeof BannerCreateFormSchema>;
