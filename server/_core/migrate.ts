import { sql } from "drizzle-orm";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  openId VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  passwordHash VARCHAR(255),
  loginMethod VARCHAR(64),
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  totalPoints INT NOT NULL DEFAULT 0,
  currentStreak INT NOT NULL DEFAULT 0,
  longestStreak INT NOT NULL DEFAULT 0,
  lastActivityDate TIMESTAMP NULL,
  location VARCHAR(255),
  bio TEXT,
  avatar VARCHAR(512),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS issues (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reporterId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('Roads','Water','Electricity','Sanitation','PublicSafety','GreenSpaces','Other') NOT NULL,
  aiGeneratedSummary TEXT,
  severityScore INT NOT NULL DEFAULT 5,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  address VARCHAR(512),
  photoUrl TEXT,
  photoKey VARCHAR(255),
  status ENUM('Open','InProgress','Resolved') NOT NULL DEFAULT 'Open',
  isAnonymous BOOLEAN NOT NULL DEFAULT FALSE,
  verificationCount INT NOT NULL DEFAULT 0,
  upvoteCount INT NOT NULL DEFAULT 0,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  resolvedAt TIMESTAMP NULL
);

CREATE TABLE IF NOT EXISTS issueStatusHistory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issueId INT NOT NULL,
  fromStatus ENUM('Open','InProgress','Resolved') NOT NULL,
  toStatus ENUM('Open','InProgress','Resolved') NOT NULL,
  changedBy INT,
  notes TEXT,
  photoUrl VARCHAR(512),
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  issueId INT NOT NULL,
  userId INT NOT NULL,
  verificationType ENUM('upvote','confirm','flag') NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniqueUserIssue (issueId, userId)
);

CREATE TABLE IF NOT EXISTS badges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  unlockCondition VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS userBadges (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  badgeId INT NOT NULL,
  unlockedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pointsLog (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  points INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  relatedIssueId INT,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS streaks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL UNIQUE,
  currentStreak INT NOT NULL DEFAULT 0,
  longestStreak INT NOT NULL DEFAULT 0,
  lastActivityDate TIMESTAMP NULL,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  issueId INT,
  type ENUM('high_severity','critical_severity','status_update','verification') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  \`read\` BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS config (
  id INT AUTO_INCREMENT PRIMARY KEY,
  \`key\` VARCHAR(255) NOT NULL UNIQUE,
  value TEXT,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

ALTER TABLE issues MODIFY COLUMN photoUrl TEXT;
ALTER TABLE issueStatusHistory MODIFY COLUMN photoUrl TEXT;
`;

export async function runMigrations(db: any): Promise<void> {
  const statements = MIGRATION_SQL.split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await db.execute(sql.raw(stmt));
    } catch (err: any) {
      if (!err.message?.includes("Duplicate column")) {
        console.warn("[Migration] Warning:", err.message);
      }
    }
  }
  console.log("[Migration] Database tables ensured.");
}
