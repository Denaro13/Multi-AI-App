import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  streamText,
  UIMessage,
  InferUITools,
  UIDataTypes,
  tool,
  stepCountIs,
} from "ai";
import z from "zod";

const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Lagos city") {
        return "70F and cloudy";
      } else if (city === "Abuja") {
        return "80F and sunny";
      } else {
        return "Unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Response) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: convertToModelMessages(messages),
      tools,
      toolChoice: "auto",
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
