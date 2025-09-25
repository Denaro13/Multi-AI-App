"use client";
import { ChatMessage } from "@/app/api/api-tool/route";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import React, { useState } from "react";
import WeatherCard from "./weatherCard";

const Page = () => {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/api-tool",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {messages.map((message) => {
        return (
          <div
            key={message.id}
            className={`mb-4  ${message.role === "user" ? "flex justify-end " : ""}`}
          >
            <div
              className={`${message.role === "user" ? "max-w-[70%] bg-gray-200 px-3 rounded-xl py-3" : ""}`}
            >
              {/* <h4 className="font-semibold">
                {message.role === "user" ? "You:" : "AI"}
              </h4> */}
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case "text":
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="whitespace-pre-wrap"
                      >
                        {part.text}
                      </div>
                    );
                  case "tool-getWeather":
                    switch (part.state) {
                      case "input-streaming":
                        return (
                          <div
                            key={`${message.id}-getWeather-${index}`}
                            className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                          >
                            <div className="text-sm text-zinc-500">
                              🌤️ Receiving weather request...
                            </div>
                            <pre className="text-xs text-zinc-600 mt-1">
                              {JSON.stringify(part.input, null, 2)}
                            </pre>
                          </div>
                        );
                      case "input-available":
                        return (
                          <div
                            key={`${message.id}-getWeather-${index}`}
                            className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                          >
                            <div className="text-sm text-zinc-400">
                              🌤️ Getting weather for {part.input.city}...
                            </div>
                          </div>
                        );
                      case "output-available":
                        return (
                          // <div
                          //   key={`${message.id}-getWeather-${index}`}
                          //   className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                          // >
                          //   <div className="text-sm text-zinc-400">
                          //     🌤️ Weather
                          //   </div>
                          //   <div className="text-sm text-zinc-300">
                          //     <div>{part.output.location.name}</div>
                          //     <div>{part.output.current.temp_c}</div>
                          //     <div>{part.output.current.condition.text}</div>
                          //   </div>
                          // </div>
                          <div
                            key={`${message.id}-getWeather-${index}`}
                            className="mt-1 mb-2"
                          >
                            <WeatherCard weatherData={part.output} />
                          </div>
                        );
                      case "output-error":
                        return (
                          <div
                            key={`${message.id}-getWeather-${index}`}
                            className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                          >
                            <div className="text-sm text-red-400">
                              Error: {part.errorText}
                            </div>
                          </div>
                        );
                      default:
                        return null;
                    }
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        );
      })}

      {status === "submitted" ||
        (status == "streaming" && (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
            </div>
          </div>
        ))}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you?"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={status !== "ready"}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
