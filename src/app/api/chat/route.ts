import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";

// "You are a Math Tutor to students in jss1 up to ss3. Keep response clear precise for accurate solution. Your solution should be in a step-by-step format such as: `Step 1: Evaluate the equation`, then you provide the step content. Ensure you end with a final step like `Final Answer: The correct answer is 20.`",

export async function POST(req: Response) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-1.5-flash"),
      messages: [
        {
          role: "system",
          content:
            "Help students solve maths question in a clear way by providing a step-by-step solution using latex.",
        },
        { role: "user", content: "Solve the equation 2x=20" },
        {
          role: "assistant",
          content:
            "Great!, the equation $2x+4=20$ can be solved as follows: Step 1: Divide both sides by $2$. dividing both sides of the equation by $2$ gives $$x=\frac{20}{2}$$ `Step 2: Simplify the equation` Simplifying gives $$x=10$$ `Final Answer:` The correct answer is $10$.",
        },
        // {
        //   role: "system",
        //   content:
        //     "You are a Math Tutor to students in jss1 up to ss3. Keep response clear precise for accurate solution. Your solution should be in a step-by-step format such as: `Step 1: Evaluate the equation`, then you provide the step content. Ensure you end with a final step like `Final Answer: The correct answer is 20.`",
        // },
        ...convertToModelMessages(messages),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.log("Error streaming chat completion:", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
