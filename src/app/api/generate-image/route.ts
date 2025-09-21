// import { google } from "@ai-sdk/google"
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { experimental_generateImage as generateImage } from "ai";

export async function POST(req: Request) {
  console.log("I GOT HERE");

  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: google.imageModel(""),
      // model: google.image("imagen-3.0-generate-002"),
      prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return Response.json(image.base64);
  } catch (error) {
    console.log("Error generating image:", error);
    throw new Response("Failed to generate image:", { status: 500 });
  }
}
