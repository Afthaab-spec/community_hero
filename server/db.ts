import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  issues,
  InsertIssue,
  verifications,
  InsertVerification,
  pointsLog,
  InsertPointsLog,
  userBadges,
  badges,
  issueStatusHistory,
  InsertIssueStatusHistory,
  notifications,
  InsertNotification,
  config,
  InsertConfig,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ===== Issues =====

export async function createIssue(issue: InsertIssue) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(issues).values(issue);
  return result[0];
}

export async function deleteIssue(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(verifications).where(eq(verifications.issueId, id));
  await db.delete(issueStatusHistory).where(eq(issueStatusHistory.issueId, id));
  await db.delete(issues).where(eq(issues.id, id));
}

export async function getIssueById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(issues).where(eq(issues.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getIssues(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(issues)
    .orderBy(desc(issues.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getIssuesByStatus(status: string, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(issues)
    .where(eq(issues.status, status as any))
    .orderBy(desc(issues.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getIssuesByCategory(category: string, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(issues)
    .where(eq(issues.category, category as any))
    .orderBy(desc(issues.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getIssuesFiltered(
  filters: { status?: string; category?: string },
  limit: number = 50,
  offset: number = 0
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [];
  if (filters.status) conditions.push(eq(issues.status, filters.status as any));
  if (filters.category) conditions.push(eq(issues.category, filters.category as any));

  if (conditions.length === 0) {
    return await db.select().from(issues).orderBy(desc(issues.createdAt)).limit(limit).offset(offset);
  }

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
  return await db.select().from(issues).where(whereClause).orderBy(desc(issues.createdAt)).limit(limit).offset(offset);
}

export async function getIssuesByReporter(reporterId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(issues)
    .where(eq(issues.reporterId, reporterId))
    .orderBy(desc(issues.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function updateIssueStatus(issueId: number, newStatus: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(issues)
    .set({
      status: newStatus as any,
      updatedAt: new Date(),
      resolvedAt: newStatus === "Resolved" ? new Date() : null,
    })
    .where(eq(issues.id, issueId));
}

export async function updateIssueVerificationCount(issueId: number, count: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(issues)
    .set({ verificationCount: count, updatedAt: new Date() })
    .where(eq(issues.id, issueId));
}

// ===== Verifications =====

export async function createVerification(verification: InsertVerification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(verifications).values(verification);
}

export async function getVerificationsForIssue(issueId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(verifications)
    .where(eq(verifications.issueId, issueId));
}

export async function getUserVerificationForIssue(issueId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(verifications)
    .where(and(eq(verifications.issueId, issueId), eq(verifications.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function deleteVerification(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(verifications).where(eq(verifications.id, id));
}

// ===== Points & Gamification =====

export async function addPoints(pointsEntry: InsertPointsLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(pointsLog).values(pointsEntry);

  // Update user's total points
  const result = await db
    .select({ total: sql<number>`SUM(points)` })
    .from(pointsLog)
    .where(eq(pointsLog.userId, pointsEntry.userId));

  const totalPoints = result[0]?.total || 0;

  await db
    .update(users)
    .set({ totalPoints })
    .where(eq(users.id, pointsEntry.userId));

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split("T")[0];

  const user = await getUserById(pointsEntry.userId);
  if (!user) return;

  const lastActivity = user.lastActivityDate;
  const lastStr = lastActivity ? new Date(lastActivity).toISOString().split("T")[0] : null;

  if (lastStr === todayStr) {
    // Already active today, no streak change
    return;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  let newStreak = 1;
  let longestStreak = user.longestStreak || 0;

  if (lastStr === yesterdayStr) {
    // Consecutive day
    newStreak = (user.currentStreak || 0) + 1;
  }

  longestStreak = Math.max(longestStreak, newStreak);

  await db
    .update(users)
    .set({
      currentStreak: newStreak,
      longestStreak,
      lastActivityDate: today,
    })
    .where(eq(users.id, pointsEntry.userId));
}

export async function getPointsLog(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(pointsLog)
    .where(eq(pointsLog.userId, userId))
    .orderBy(desc(pointsLog.createdAt))
    .limit(limit);
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      badge: badges,
      unlockedAt: userBadges.unlockedAt,
    })
    .from(userBadges)
    .innerJoin(badges, eq(userBadges.badgeId, badges.id))
    .where(eq(userBadges.userId, userId));
}

export async function awardBadge(userId: number, badgeId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already has this badge
  const existing = await db
    .select()
    .from(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badgeId)))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(userBadges).values({ userId, badgeId });
  }
}

// ===== Issue Status History =====

export async function createStatusHistory(history: InsertIssueStatusHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(issueStatusHistory).values(history);
}

export async function getIssueStatusHistory(issueId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(issueStatusHistory)
    .where(eq(issueStatusHistory.issueId, issueId))
    .orderBy(desc(issueStatusHistory.createdAt));
}

// ===== Notifications =====

export async function createNotification(notification: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(notifications).values(notification);
}

export async function getNotifications(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function markNotificationAsRead(notificationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, notificationId));
}

// ===== Leaderboard =====

export async function getLeaderboard(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      id: users.id,
      name: users.name,
      avatar: users.avatar,
      totalPoints: users.totalPoints,
    })
    .from(users)
    .orderBy(desc(users.totalPoints))
    .limit(limit);
}

export async function getHeatmapData() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select({
      latitude: sql<number>`ROUND(CAST(${issues.latitude} AS DECIMAL(10,4)), 4)`,
      longitude: sql<number>`ROUND(CAST(${issues.longitude} AS DECIMAL(11,4)), 4)`,
      count: sql<number>`COUNT(*) as count`,
    })
    .from(issues)
    .groupBy(sql`ROUND(CAST(${issues.latitude} AS DECIMAL(10,4)), 4), ROUND(CAST(${issues.longitude} AS DECIMAL(11,4)), 4)`);
}

// ===== Auth =====

export async function getUserCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(users);
  return result[0]?.count ?? 0;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ===== Config =====

export async function getConfig(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(config)
    .where(eq(config.key, key))
    .limit(1);

  return result.length > 0 ? result[0].value : null;
}

export async function getAllConfig(): Promise<Record<string, string | null>> {
  const db = await getDb();
  if (!db) return {};

  const rows = await db.select().from(config);
  const result: Record<string, string | null> = {};
  for (const row of rows) {
    result[row.key] = row.value;
  }
  return result;
}

export async function setConfig(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const insert: InsertConfig = { key, value };
  await db.insert(config).values(insert).onDuplicateKeyUpdate({
    set: { value },
  });
}
