import { getOpenAiKey } from "./config";

export type TranscribeOptions = {
  audioUrl: string;
  language?: string;
};

export type TranscriptionResponse = {
  text: string;
  language: string;
  duration: number;
};

export async function transcribeAudio(options: TranscribeOptions): Promise<TranscriptionResponse> {
  const apiKey = await getOpenAiKey();
  if (!apiKey) {
    throw new Error("OpenAI API key not configured. Go to /admin/settings.");
  }

  const audioResp = await fetch(options.audioUrl);
  if (!audioResp.ok) throw new Error("Failed to download audio file");
  const audioBuffer = await audioResp.arrayBuffer();

  const formData = new FormData();
  const blob = new Blob([audioBuffer], { type: "audio/webm" });
  formData.append("file", blob, "audio.webm");
  formData.append("model", "whisper-1");
  if (options.language) formData.append("language", options.language);
  formData.append("response_format", "verbose_json");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text().catch(() => response.statusText);
    throw new Error(`Whisper API error (${response.status}): ${error}`);
  }

  return response.json() as Promise<TranscriptionResponse>;
}
