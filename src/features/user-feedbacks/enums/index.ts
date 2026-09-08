export const UserFeedbackCategory = {
  Suggestion: "Suggestion",
  Bug: "Bug",
  Experience: "Experience",
  Compliment: "Compliment",
  Complaint: "Complaint",
  Question: "Question",
  Other: "Other",
} as const;

export type UserFeedbackCategory = typeof UserFeedbackCategory[keyof typeof UserFeedbackCategory];

export const UserFeedbackStatus = {
  New: "New",
  InAnalysis: "InAnalysis",
  Planned: "Planned",
  Resolved: "Resolved",
  Declined: "Declined",
  Duplicated: "Duplicated",
} as const;

export type UserFeedbackStatus = typeof UserFeedbackStatus[keyof typeof UserFeedbackStatus];

export const UserFeedbackPriority = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical",
  None: "None",
} as const;

export type UserFeedbackPriority = typeof UserFeedbackPriority[keyof typeof UserFeedbackPriority];

export const UserFeedbackPlatform = {
  Android: "Android",
  IOS: "IOS",
  Web: "Web",
  Unknown: "Unknown",
} as const;

export type UserFeedbackPlatform = typeof UserFeedbackPlatform[keyof typeof UserFeedbackPlatform];
