import { getGoogleMapsKey } from "./config";

export async function getGoogleMapsApiKey(): Promise<string | null> {
  return getGoogleMapsKey();
}
