import { getOpenAiKey } from "./config";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type InvokeParams = {
  messages: Message[];
  model?: string;
  maxTokens?: number;
};

export type InvokeResult = {
  choices: Array<{
    message: { content: string };
  }>;
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiKey = await getOpenAiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Go to /admin/settings to set it up.");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: params.model || "gpt-4o-mini",
      messages: params.messages,
      max_tokens: params.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText);
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<InvokeResult>;
}
