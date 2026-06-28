import type { Express } from "express";
import { getAwsConfig } from "./config";

export function registerStorageProxy(app: Express) {
  app.get("/api/storage/*", async (req, res) => {
    const key = (req.params as Record<string, string>)[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }

    const awsConfig = await getAwsConfig();
    if (!awsConfig) {
      res.status(503).send("Storage not configured. Ask an admin to set up AWS S3 in Settings.");
      return;
    }

    try {
      const { storageGet } = await import("../storage");
      const { url } = await storageGet(key);
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage error");
    }
  });
}
