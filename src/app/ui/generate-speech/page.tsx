"use client";
import React, { useRef, useState, useEffect } from "react";

const Page = () => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAudio, setHasAudio] = useState(false);

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/generate-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      //   const blob = await response.blob();

      //   const audioUrl = URL.createObjectURL(blob);
      //   const audio = new Audio(audioUrl);

      //   audio.play();

      //   audio.addEventListener("ended", () => {
      //     URL.revokeObjectURL(audioUrl);
      //   });
      const blob = await response.blob();

      audioUrlRef.current = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrlRef.current);

      setHasAudio(true);
      audioRef.current.play();
    } catch (error) {
      console.log("Error generating audio:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && <div className="text-center mb-4">Generating audio...</div>}
      {hasAudio && !isLoading && (
        <button
          onClick={replayAudio}
          className="mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-400"
        >
          Replay Audio
        </button>
      )}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-800"
            value={text}
            placeholder="Enter text to convert speech"
            onChange={(e) => setText(e.target.value)}
            disabled={isLoading}
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
