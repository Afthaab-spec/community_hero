import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getAwsConfig } from "./_core/config";

let s3Client: S3Client | null = null;
let lastConfigKey: string | null = null;

async function getClient(): Promise<{ client: S3Client; bucket: string }> {
  const awsConfig = await getAwsConfig();
  if (awsConfig) {
    const configKey = `${awsConfig.accessKeyId}:${awsConfig.region}:${awsConfig.bucket}`;
    if (!s3Client || lastConfigKey !== configKey) {
      s3Client = new S3Client({
        region: awsConfig.region,
        credentials: {
          accessKeyId: awsConfig.accessKeyId,
          secretAccessKey: awsConfig.secretAccessKey,
        },
      });
      lastConfigKey = configKey;
    }
    return { client: s3Client, bucket: awsConfig.bucket };
  }
  throw new Error("AWS S3 not configured. Go to /admin/settings to set up storage.");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const { client, bucket } = await getClient();
  const key = appendHashSuffix(relKey.replace(/^\/+/, ""));

  await client.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: data,
    ContentType: contentType,
  }));

  return { key, url: `/api/storage/${key}` };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const { client, bucket } = await getClient();
  const key = relKey.replace(/^\/+/, "");
  const command = new GetObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return { key, url };
}
