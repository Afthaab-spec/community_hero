import { SignJWT, jwtVerify } from "jose";
import { ONE_YEAR_MS } from "@shared/const";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { getJwtSecret } from "./config";
import { parseCookies } from "./cookies";
import { COOKIE_NAME } from "@shared/const";

async function getSecretKey(): Promise<Uint8Array> {
  const secret = await getJwtSecret();
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(user: User): Promise<string> {
  const secretKey = await getSecretKey();
  const issuedAt = Date.now();
  return new SignJWT({
    openId: user.openId,
    userId: user.id,
    role: user.role,
    name: user.name || "",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(Math.floor((issuedAt + ONE_YEAR_MS) / 1000))
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<{ openId: string; userId: number; role: string; name: string } | null> {
  try {
    const secretKey = await getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
    const { openId, userId, role, name } = payload as Record<string, unknown>;
    if (typeof openId !== "string" || typeof userId !== "number") return null;
    return { openId, userId, role: String(role || "user"), name: String(name || "") };
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: any): Promise<User | null> {
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies.get(COOKIE_NAME);

  if (!token) {
    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }

  if (!token) return null;

  const session = await verifySessionToken(token);
  if (!session) return null;

  const user = await db.getUserByOpenId(session.openId);
  return user || null;
}
