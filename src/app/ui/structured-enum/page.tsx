"use client";
import React, { useState } from "react";

const Page = () => {
  const [text, setText] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setText("");
    try {
      const res = await fetch("/api/structured-enum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      setSentiment(data);
    } catch (error) {
      console.log("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col w-full max-w-lg py-24 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading ? (
        <div className="text-center">Analyzing sentiment...</div>
      ) : sentiment ? (
        <div className="text-center">
          <div className="">
            {sentiment === "positive" && "☺️ Positive"}
            {sentiment === "negative" && "😔 Negative"}
            {sentiment === "neutral" && "⚖️ Neutral"}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={analyzeSentiment}
        className="fixed bottom-0 w-full max-w-lg mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-800"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter a type..."
          />
          {/* {isLoading ? (
            <button
              onClick={stop}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !type}
            >
              Generate
            </button>
          )} */}
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !text.trim()}
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
