import {
  UserFeedbackCategory,
  UserFeedbackPlatform,
  UserFeedbackPriority,
  UserFeedbackStatus,
} from "../enums";

export interface IUserFeedbackImage {
  id: number;
  feedbackId: number;
  imageId: number;
  url: string;
  createdAt: string;
}

export interface IUserFeedback {
  id: number;
  createdAt: string;
  userId: number;
  userName: string;
  userEmail?: string;
  title: string;
  category: UserFeedbackCategory;
  content: string;
  rating?: number;
  status: UserFeedbackStatus;
  priority: UserFeedbackPriority;
  platform?: UserFeedbackPlatform;
  appVersion?: string;
  deviceInfo?: string;
  screenName?: string;
  adminResponse?: string;
  respondedById?: number;
  respondedByName?: string;
  respondedAt?: string;
  isEditable: boolean;
  images: IUserFeedbackImage[];
}

export interface IUserFeedbackListDto {
  id: number;
  createdAt: string;
  userId: number;
  userName: string;
  userAvatarUrl?: string;
  title: string;
  category: UserFeedbackCategory;
  status: UserFeedbackStatus;
  priority: UserFeedbackPriority;
  platform?: UserFeedbackPlatform;
  rating?: number;
  appVersion?: string;
  hasResponse: boolean;
  respondedAt?: string;
  imageCount: number;
}

export interface IUserFeedbackSummary {
  total: number;
  pending: number;
  averageRating?: number;
  ratingCount: number;
  byStatus: { value: UserFeedbackStatus; total: number }[];
  byCategory: { value: UserFeedbackCategory; total: number }[];
}

export interface IUserFeedbackFilters {
  search?: string;
  category?: UserFeedbackCategory | string;
  status?: UserFeedbackStatus | string;
  priority?: UserFeedbackPriority | string;
  platform?: UserFeedbackPlatform | string;
  userId?: number;
  appVersion?: string;
  minRating?: number;
  maxRating?: number;
  onlyWithoutResponse?: boolean;
  onlyWithImages?: boolean;
  from?: string;
  to?: string;
  page?: number;
  size?: number;
}
