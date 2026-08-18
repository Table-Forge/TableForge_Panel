import { z } from "zod";
import {
  numberOptional,
  numberRequired,
  stringOptional,
  stringRequired,
} from "@/src/utils/custom-schema-validations";

// --- SpaceListDto ---
export interface ISpaceList {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  ownerName: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  openTime?: string;
  closeTime?: string;
  workingDays?: string;
  workingDayList?: string[];
  bannerUrl?: string;
  status: string;
  activeTableCount: number;
}

// --- SpaceImageDto ---
export interface ISpaceImage {
  id: number;
  spaceId: number;
  imageId: number;
  url: string;
  createdAt: string;
}

// --- SpaceTableDto ---
export interface ISpaceTable {
  id: number;
  spaceId: number;
  spaceName: string;
  name: string;
  description?: string;
  shape: string;
  seatCount: number;
  supportedGames?: string;
  supportedGameList?: string[];
  hourlyRate?: number;
  isFree: boolean;
  isActive: boolean;
}

// --- SpaceDto ---
export interface ISpace extends ISpaceList {
  tables: ISpaceTable[];
  images: ISpaceImage[];
  ownerCompanyName?: string;
  ownerAvatarUrl?: string;
}

// --- SpaceBookingDto ---
export interface ISpaceBooking {
  id: number;
  spaceTableId: number;
  userId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  playerCount: number;
  intendedGames?: string;
  notes?: string;
  statusReason?: string;
  status: string;

  // Computed backend properties
  startsAt: string;
  endsAt: string;
  durationHours: number;
  estimatedPrice?: number;
  spaceOwnerId: number;
  intendedGameList?: string[];

  // Extras
  userName?: string;
  userAvatarUrl?: string;
}

// --- BookingChatMessageDto ---
export interface IBookingChatMessage {
  id: number;
  spaceBookingId: number;
  userId: number;
  content: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

// --- SCHEMAS PARA FORMULÁRIOS ---

export const SpaceCreateSchema = z.object({
  name: stringRequired,
  description: stringRequired,
  address: stringRequired,
  latitude: numberRequired,
  longitude: numberRequired,
  phoneNumber: stringOptional,
  openTime: stringOptional,
  closeTime: stringOptional,
  workingDays: stringOptional,
  bannerId: numberOptional,
  status: stringOptional,
});

export type ISpaceCreate = z.infer<typeof SpaceCreateSchema>;

export const SpaceUpdateSchema = SpaceCreateSchema;
export type ISpaceUpdate = z.infer<typeof SpaceUpdateSchema>;

export const SpaceTableCreateSchema = z.object({
  name: stringRequired,
  description: stringOptional,
  shape: stringRequired,
  seatCount: numberRequired,
  supportedGames: stringOptional,
  hourlyRate: numberOptional,
  isActive: z.boolean().default(true),
});

export type ISpaceTableCreate = z.infer<typeof SpaceTableCreateSchema>;

export const SpaceTableUpdateSchema = SpaceTableCreateSchema;
export type ISpaceTableUpdate = z.infer<typeof SpaceTableUpdateSchema>;

export const SpaceBookingStatusSchema = z.object({
  status: stringRequired,
  statusReason: stringOptional,
});

export type ISpaceBookingStatusUpdate = z.infer<typeof SpaceBookingStatusSchema>;
