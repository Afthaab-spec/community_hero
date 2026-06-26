CREATE TABLE `badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon` varchar(255),
	`unlockCondition` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `issueStatusHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` int NOT NULL,
	`fromStatus` enum('Open','InProgress','Resolved') NOT NULL,
	`toStatus` enum('Open','InProgress','Resolved') NOT NULL,
	`changedBy` int,
	`notes` text,
	`photoUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `issueStatusHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`category` enum('Roads','Water','Electricity','Sanitation','PublicSafety','GreenSpaces','Other') NOT NULL,
	`aiGeneratedSummary` text,
	`severityScore` int NOT NULL DEFAULT 5,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`address` varchar(512),
	`photoUrl` varchar(512),
	`photoKey` varchar(255),
	`status` enum('Open','InProgress','Resolved') NOT NULL DEFAULT 'Open',
	`isAnonymous` boolean NOT NULL DEFAULT false,
	`verificationCount` int NOT NULL DEFAULT 0,
	`upvoteCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`resolvedAt` timestamp,
	CONSTRAINT `issues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`issueId` int,
	`type` enum('high_severity','critical_severity','status_update','verification') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text,
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pointsLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`points` int NOT NULL,
	`reason` varchar(255) NOT NULL,
	`relatedIssueId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pointsLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`currentStreak` int NOT NULL DEFAULT 0,
	`longestStreak` int NOT NULL DEFAULT 0,
	`lastActivityDate` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `streaks_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `userBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`badgeId` int NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBadges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` int NOT NULL,
	`userId` int NOT NULL,
	`verificationType` enum('upvote','confirm','flag') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `totalPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `currentStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `longestStreak` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastActivityDate` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `location` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar` varchar(512);