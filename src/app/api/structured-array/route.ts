import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { pokemonSchema } from "./schema";

export async function POST(req: Response) {
  try {
    const { type } = await req.json();
    const result = streamObject({
      model: google("gemini-1.5-flash"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} type pokemon`,
    });
    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating pokemon:", error);
    throw new Response("Failed to generate pokemon", { status: 500 });
  }
}
