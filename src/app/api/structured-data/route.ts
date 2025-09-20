import { google } from "@ai-sdk/google";
import { streamObject } from "ai";
import { recipeSchema } from "./schema";

export async function POST(req: Response) {
  try {
    const { dish } = await req.json();
    const result = streamObject({
      model: google("gemini-1.5-flash"),
      schema: recipeSchema,
      prompt: `Generate a recipe for ${dish}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.log("Error generating recipe:", error);
    return new Response("Failed to generate recipe", { status: 500 });
  }
}
