import { z } from "zod";

export const NotificationSchema = z.object({
  id: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  userId: z.number(),
  type: z.string(),
  message: z.string(),
  relatedLink: z.string().optional().nullable(),
  read: z.boolean(),
});

export type INotification = z.infer<typeof NotificationSchema>;
