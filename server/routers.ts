import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== Issues =====
  issues: router({
    // Create a new issue with LLM auto-fill and photo upload
    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1).max(255),
          description: z.string().min(1),
          category: z.enum([
            "Roads",
            "Water",
            "Electricity",
            "Sanitation",
            "PublicSafety",
            "GreenSpaces",
            "Other",
          ]),
          latitude: z.number(),
          longitude: z.number(),
          address: z.string().optional(),
          photoBase64: z.string().optional(), // Base64 encoded photo
          isAnonymous: z.boolean().default(false),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          let photoUrl: string | undefined;
          let photoKey: string | undefined;

          // Upload photo to S3 if provided, otherwise store as data URL
          if (input.photoBase64) {
            const buffer = Buffer.from(input.photoBase64, "base64");
            try {
              const result = await storagePut(
                `issues/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`,
                buffer,
                "image/jpeg"
              );
              photoUrl = result.url;
              photoKey = result.key;
            } catch (storageErr) {
              console.warn("[Storage] S3 unavailable, storing photo as data URL");
              const mimeType = input.photoBase64.substring(0, 20).includes("png") ? "image/png" : "image/jpeg";
              photoUrl = `data:${mimeType};base64,${input.photoBase64}`;
            }
          }

          // Call LLM to analyze and auto-fill
          let aiGeneratedSummary = "";
          let severityScore = 5;

          try {
            const llmResponse = await invokeLLM({
              model: "gpt-4o-mini",
              messages: [
                {
                  role: "user",
                  content: `Analyze this civic issue report and provide:
1. A concise summary (1-2 sentences)
2. A severity score (1-10, where 10 is most severe)

Issue Title: ${input.title}
Description: ${input.description}
Category: ${input.category}

Respond in JSON format: { "summary": "...", "severity": number }`,
                },
              ],
            });

            if (llmResponse.choices?.[0]?.message?.content) {
              try {
                const content = llmResponse.choices[0].message.content;
                const contentStr = typeof content === "string" ? content : JSON.stringify(content);
                const parsed = JSON.parse(contentStr);
                aiGeneratedSummary = parsed.summary || "";
                severityScore = Math.min(10, Math.max(1, parsed.severity || 5));
              } catch {
                aiGeneratedSummary = input.description.substring(0, 200);
              }
            }
          } catch (error) {
            console.error("LLM analysis failed:", error);
            aiGeneratedSummary = input.description.substring(0, 200);
          }

          // Create issue in database
          const issue = await db.createIssue({
            reporterId: ctx.user.id,
            title: input.title,
            description: input.description,
            category: input.category as any,
            latitude: input.latitude as any,
            longitude: input.longitude as any,
            address: input.address,
            photoUrl,
            photoKey,
            aiGeneratedSummary,
            severityScore,
            isAnonymous: input.isAnonymous,
          });

          // Award points to reporter
          await db.addPoints({
            userId: ctx.user.id,
            points: 10,
            reason: "issue_reported",
            relatedIssueId: issue.insertId as number,
          });

          // Send owner notification for high/critical severity
          if (severityScore >= 8) {
            const ownerOpenId = process.env.OWNER_OPEN_ID;
            const ownerUser = ownerOpenId ? await db.getUserByOpenId(ownerOpenId) : null;

            if (ownerUser) {
              await db.createNotification({
                userId: ownerUser.id,
                issueId: (issue.insertId as number) || 0,
                type: severityScore >= 9 ? "critical_severity" : "high_severity",
                title: `${severityScore >= 9 ? "🚨 CRITICAL" : "⚠️ HIGH SEVERITY"} Issue Reported`,
                message: `${input.title} - Severity: ${severityScore}/10`,
              });
            }
          }

          return {
            id: (issue.insertId as any) || 0,
            success: true,
          };
        } catch (error) {
          console.error("Failed to create issue:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create issue",
          });
        }
      }),

    // Get all issues with pagination
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(50),
          offset: z.number().default(0),
          status: z.enum(["Open", "InProgress", "Resolved"]).optional(),
          category: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        try {
          if (input.status || input.category) {
            return await db.getIssuesFiltered(
              { status: input.status, category: input.category },
              input.limit,
              input.offset
            );
          }
          return await db.getIssues(input.limit, input.offset);
        } catch (error) {
          console.error("Failed to fetch issues:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to fetch issues",
          });
        }
      }),

    // Get single issue by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const issue = await db.getIssueById(input.id);
        if (!issue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Issue not found",
          });
        }
        return issue;
      }),

    // Get issues by reporter
    getByReporter: publicProcedure
      .input(
        z.object({
          reporterId: z.number(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await db.getIssuesByReporter(input.reporterId, input.limit, input.offset);
      }),

    // Update issue status (admin only)
    updateStatus: protectedProcedure
      .input(
        z.object({
          issueId: z.number(),
          newStatus: z.enum(["Open", "InProgress", "Resolved"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Only admins can update issue status",
          });
        }

        const issue = await db.getIssueById(input.issueId);
        if (!issue) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Issue not found",
          });
        }

        // Update status
        await db.updateIssueStatus(input.issueId, input.newStatus);

        // Record status change
        await db.createStatusHistory({
          issueId: input.issueId,
          fromStatus: issue.status as any,
          toStatus: input.newStatus as any,
          changedBy: ctx.user.id,
          notes: input.notes,
        });

        // Award points if resolved
        if (input.newStatus === "Resolved") {
          await db.addPoints({
            userId: ctx.user.id,
            points: 25,
            reason: "issue_resolved",
            relatedIssueId: input.issueId,
          });
        }

        return { success: true };
      }),
  }),

  // ===== Verifications =====
  verifications: router({
    // Upvote/confirm an issue
    create: protectedProcedure
      .input(
        z.object({
          issueId: z.number(),
          type: z.enum(["upvote", "confirm", "flag"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Check if user already verified this issue
        const existing = await db.getUserVerificationForIssue(input.issueId, ctx.user.id);
        if (existing) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You have already verified this issue",
          });
        }

        // Create verification
        await db.createVerification({
          issueId: input.issueId,
          userId: ctx.user.id,
          verificationType: input.type as any,
        });

        // Get updated verification count
        const verifications = await db.getVerificationsForIssue(input.issueId);
        const confirmCount = verifications.filter((v) => v.verificationType === "confirm").length;

        // Update issue verification count
        await db.updateIssueVerificationCount(input.issueId, confirmCount);

        // Award points
        await db.addPoints({
          userId: ctx.user.id,
          points: 5,
          reason: "issue_verified",
          relatedIssueId: input.issueId,
        });

        return { success: true };
      }),

    // Get verifications for an issue
    getForIssue: publicProcedure
      .input(z.object({ issueId: z.number() }))
      .query(async ({ input }) => {
        return await db.getVerificationsForIssue(input.issueId);
      }),
  }),

  // ===== Gamification =====
  gamification: router({
    // Get user's points and stats
    getStats: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserById(ctx.user.id);
      const badges = await db.getUserBadges(ctx.user.id);
      const pointsLog = await db.getPointsLog(ctx.user.id, 10);

      return {
        totalPoints: user?.totalPoints || 0,
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        badges,
        recentPoints: pointsLog,
      };
    }),

    // Get leaderboard
    getLeaderboard: publicProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return await db.getLeaderboard(input.limit);
      }),
  }),

  // ===== Heatmap =====
  heatmap: router({
    // Get heatmap data for map visualization
    getData: publicProcedure.query(async () => {
      return await db.getHeatmapData();
    }),
  }),

  // ===== Notifications =====
  notifications: router({
    // Get user's notifications
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ ctx, input }) => {
        return await db.getNotifications(ctx.user.id, input.limit);
      }),

    // Mark notification as read
    markAsRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await db.markNotificationAsRead(input.notificationId);
        return { success: true };
      }),
  }),

  // ===== Config / Settings =====
  config: router({
    getAll: adminProcedure.query(async () => {
      const { getAllConfig } = await import("./_core/config");
      return await getAllConfig();
    }),

    get: adminProcedure
      .input(z.object({ key: z.string() }))
      .query(async ({ input }) => {
        return { key: input.key, value: await db.getConfig(input.key) };
      }),

    set: adminProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ input }) => {
        await db.setConfig(input.key, input.value);
        return { success: true };
      }),

    // Public endpoint for Google Maps key (needed for map rendering)
    getGoogleMapsKey: publicProcedure.query(async () => {
      const { getGoogleMapsKey } = await import("./_core/config");
      return await getGoogleMapsKey();
    }),
  }),
});

export type AppRouter = typeof appRouter;
