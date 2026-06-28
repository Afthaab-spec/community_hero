import { getOpenAiKey } from "./config";

export type GenerateImageOptions = {
  prompt: string;
};

export async function generateImage(options: GenerateImageOptions): Promise<{ url?: string }> {
  const apiKey = await getOpenAiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Go to /admin/settings.");
  }

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: options.prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText);
    throw new Error(`OpenAI Image API error (${response.status}): ${error}`);
  }

  const data = await response.json() as { data: Array<{ url: string }> };
  return { url: data.data[0]?.url };
}
