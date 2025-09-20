import { generateText } from "ai";
// import { openai } from '@ai-sdk/openai';
import { google } from "@ai-sdk/google";

const model = google("gemini-2.5-flash");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const { text } = await generateText({
      model,
      prompt,
    });

    return Response.json({ text });
  } catch (error) {
    console.log("Error generating text:", error);
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
