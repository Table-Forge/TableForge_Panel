import { z } from "zod";

export const eventSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  organizerId: z.number(),
  
  isOnline: z.boolean(),
  locationName: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  
  maxAttendees: z.number().optional(),
  entryFee: z.number().optional(),
  isFree: z.boolean(),
  tags: z.string().optional(),
  tagList: z.array(z.string()).optional(),
  bannerUrl: z.string().optional(),
  status: z.string(),
  
  confirmedAttendeesCount: z.number().optional(),
  maybeAttendeesCount: z.number().optional(),
  remainingSlots: z.number().optional(),
  isFull: z.boolean().optional(),
});

export type IEvent = z.infer<typeof eventSchema>;

export const eventCreateSchema = z.object({
  title: z.string().min(1, "O título é obrigatório").max(200, "Máximo de 200 caracteres"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Data inicial é obrigatória"),
  endDate: z.string().optional(),
  isOnline: z.boolean().default(false),
  spaceId: z.number().optional(),
  locationName: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxAttendees: z.number().min(1, "Deve ser maior que 0").optional().or(z.literal(0).transform(() => undefined)),
  entryFee: z.number().min(0, "Não aceita valor negativo").optional(),
  tags: z.string().optional(),
  bannerId: z.number().optional(),
  status: z.string().default("Draft"),
});

export type IEventCreate = z.infer<typeof eventCreateSchema>;

export const eventAttendeeSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  eventId: z.number(),
  userId: z.number(),
  status: z.string(),
  username: z.string().optional(),
  userImageUrl: z.string().optional(),
});

export type IEventAttendee = z.infer<typeof eventAttendeeSchema>;
