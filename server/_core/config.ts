import * as db from "../db";

const CONFIG_KEYS = [
  "openai_api_key",
  "google_maps_api_key",
  "aws_access_key_id",
  "aws_secret_access_key",
  "aws_region",
  "aws_s3_bucket",
  "jwt_secret",
  "site_name",
  "admin_email",
] as const;

const ENV_MAP: Record<string, string> = {
  openai_api_key: "OPENAI_API_KEY",
  google_maps_api_key: "GOOGLE_MAPS_API_KEY",
  aws_access_key_id: "AWS_ACCESS_KEY_ID",
  aws_secret_access_key: "AWS_SECRET_ACCESS_KEY",
  aws_region: "AWS_REGION",
  aws_s3_bucket: "AWS_S3_BUCKET",
  jwt_secret: "JWT_SECRET",
};

export type ConfigKey = typeof CONFIG_KEYS[number];

const DEFAULT_VALUES: Record<string, string> = {
  site_name: "Community Hero",
  aws_region: "us-east-1",
};

let cache: Record<string, string | null> = {};
let cacheTime = 0;
const CACHE_TTL = 5000;

export async function getConfig(key: string): Promise<string | null> {
  const now = Date.now();
  if (now - cacheTime > CACHE_TTL) {
    cache = {};
    cacheTime = now;
  }
  if (key in cache) return cache[key];

  // Check env var first (so .env takes precedence)
  const envKey = ENV_MAP[key];
  if (envKey && process.env[envKey]) {
    cache[key] = process.env[envKey]!;
    return cache[key];
  }

  const val = await db.getConfig(key);
  cache[key] = val ?? DEFAULT_VALUES[key] ?? null;
  return cache[key];
}

export async function setConfig(key: string, value: string): Promise<void> {
  await db.setConfig(key, value);
  cache[key] = value;
}

export async function getAllConfig(): Promise<Record<string, string | null>> {
  const entries = await db.getAllConfig();
  const result: Record<string, string | null> = {};
  for (const k of CONFIG_KEYS) {
    result[k] = entries[k] ?? DEFAULT_VALUES[k] ?? null;
  }
  return result;
}

export async function getOpenAiKey(): Promise<string | null> {
  return getConfig("openai_api_key");
}

export async function getGoogleMapsKey(): Promise<string | null> {
  return getConfig("google_maps_api_key");
}

export async function getAwsConfig(): Promise<{ accessKeyId: string; secretAccessKey: string; region: string; bucket: string } | null> {
  const [accessKeyId, secretAccessKey, region, bucket] = await Promise.all([
    getConfig("aws_access_key_id"),
    getConfig("aws_secret_access_key"),
    getConfig("aws_region"),
    getConfig("aws_s3_bucket"),
  ]);
  if (!accessKeyId || !secretAccessKey || !bucket) return null;
  return { accessKeyId, secretAccessKey, region: region || "us-east-1", bucket };
}

export async function getJwtSecret(): Promise<string> {
  const secret = await getConfig("jwt_secret");
  if (secret && secret !== "change-me-to-a-random-secret") return secret;
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret !== "change-this-to-a-random-secret-in-production") return envSecret;
  const crypto = await import("crypto");
  const generated = crypto.randomBytes(32).toString("hex");
  console.warn("[Config] No JWT_SECRET configured. Using random secret for this session. Tokens will not survive restarts.");
  return generated;
}
