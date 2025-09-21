"use client";
import Image from "next/image";
import React, { useState } from "react";

const Page = () => {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setPrompt("");
    setError(null);
    setImageSrc(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong ");
      }

      setImageSrc(`data:image/png;base64,${data}`);
    } catch (error) {
      console.log(error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again"
      );
    }
  };
  return (
    <div className="flex flex-col w-full max-w-md pt-12 pb-36 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div className="w-full h-full animate-pulse bg-gray-300 rounded-lg"></div>
      ) : (
        imageSrc && (
          <Image
            alt="Generated image"
            src={imageSrc}
            className="w-full h-full object-cover rounded-lg shadow-lg"
            width={1024}
            height={1024}
          />
        )
      )}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-800"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image?"
          />
          {/* {status === "submitted" || status === "streaming" ? (
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
          )} */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
            disabled={isLoading}
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
