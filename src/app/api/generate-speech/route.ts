import { openai } from "@ai-sdk/openai";
import { experimental_generateSpeech as generateSpeech } from "ai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      text,
    });

    const fixAudio = new Uint8Array(audio.uint8Array);

    return new Response(new Blob([fixAudio]), {
      headers: { "Content-Type": audio.mediaType || "audio/mpeg" },
    });
  } catch (error) {
    console.log("Error generating speech:", error);
    return new Response("Failed to generate speech", { status: 500 });
  }
}
