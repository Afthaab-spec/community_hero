import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with gamification and profile fields.
 * Supports both local auth (email/password) and external OAuth.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  // Gamification fields
  totalPoints: int("totalPoints").default(0).notNull(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  
  // Profile
  location: varchar("location", { length: 255 }),
  bio: text("bio"),
  avatar: varchar("avatar", { length: 512 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Issues reported by citizens
 */
export const issues = mysqlTable("issues", {
  id: int("id").autoincrement().primaryKey(),
  reporterId: int("reporterId").notNull(),
  
  // Issue details
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", [
    "Roads",
    "Water",
    "Electricity",
    "Sanitation",
    "PublicSafety",
    "GreenSpaces",
    "Other",
  ]).notNull(),
  
  // AI-generated fields
  aiGeneratedSummary: text("aiGeneratedSummary"),
  severityScore: int("severityScore").default(5).notNull(), // 1-10
  
  // Location
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: varchar("address", { length: 512 }),
  
  // Photo
  photoUrl: text("photoUrl"),
  photoKey: varchar("photoKey", { length: 255 }),
  
  // Status
  status: mysqlEnum("status", ["Open", "InProgress", "Resolved"]).default("Open").notNull(),
  isAnonymous: boolean("isAnonymous").default(false).notNull(),
  
  // Engagement
  verificationCount: int("verificationCount").default(0).notNull(),
  upvoteCount: int("upvoteCount").default(0).notNull(),
  
  // Metadata
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  resolvedAt: timestamp("resolvedAt"),
});

export type Issue = typeof issues.$inferSelect;
export type InsertIssue = typeof issues.$inferInsert;

/**
 * Issue status history for tracking lifecycle
 */
export const issueStatusHistory = mysqlTable("issueStatusHistory", {
  id: int("id").autoincrement().primaryKey(),
  issueId: int("issueId").notNull(),
  fromStatus: mysqlEnum("fromStatus", ["Open", "InProgress", "Resolved"]).notNull(),
  toStatus: mysqlEnum("toStatus", ["Open", "InProgress", "Resolved"]).notNull(),
  changedBy: int("changedBy"),
  notes: text("notes"),
  photoUrl: text("photoUrl"), // Progress photo
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IssueStatusHistory = typeof issueStatusHistory.$inferSelect;
export type InsertIssueStatusHistory = typeof issueStatusHistory.$inferInsert;

/**
 * Community verifications/upvotes for issues
 */
export const verifications = mysqlTable("verifications", {
  id: int("id").autoincrement().primaryKey(),
  issueId: int("issueId").notNull(),
  userId: int("userId").notNull(),
  verificationType: mysqlEnum("verificationType", ["upvote", "confirm", "flag"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => [
  uniqueIndex("uniqueUserIssue").on(t.issueId, t.userId),
]);

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = typeof verifications.$inferInsert;

/**
 * Gamification: Badges earned by users
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
  unlockCondition: varchar("unlockCondition", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * User badge achievements
 */
export const userBadges = mysqlTable("userBadges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  badgeId: int("badgeId").notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
});

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = typeof userBadges.$inferInsert;

/**
 * Gamification: Points transactions
 */
export const pointsLog = mysqlTable("pointsLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  points: int("points").notNull(),
  reason: varchar("reason", { length: 255 }).notNull(), // "issue_reported", "issue_verified", "issue_resolved", etc.
  relatedIssueId: int("relatedIssueId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PointsLog = typeof pointsLog.$inferSelect;
export type InsertPointsLog = typeof pointsLog.$inferInsert;

/**
 * Activity streaks for users
 */
export const streaks = mysqlTable("streaks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  currentStreak: int("currentStreak").default(0).notNull(),
  longestStreak: int("longestStreak").default(0).notNull(),
  lastActivityDate: timestamp("lastActivityDate"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

/**
 * Notifications log for owner alerts
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  issueId: int("issueId"),
  type: mysqlEnum("type", ["high_severity", "critical_severity", "status_update", "verification"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * App configuration key-value store for API keys and settings
 */
export const config = mysqlTable("config", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Config = typeof config.$inferSelect;
export type InsertConfig = typeof config.$inferInsert;
