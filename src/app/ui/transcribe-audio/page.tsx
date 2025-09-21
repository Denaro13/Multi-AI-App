"use client";
import React, { useRef, useState } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds: number;
}
const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select an audio file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to transcribe audio");
      }
      const data = await response.json();
      setTranscript(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setError(null);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTranscript(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isLoading && (
        <div className="text-center mb-4">Transcribing audio...</div>
      )}
      {transcript && !isLoading && (
        <div className="mb-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h3 className="font-semibold mb-2">Transcript:</h3>
          <p className="whitespace-pre-wrap">{transcript.text}</p>

          {transcript.language && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Language: {transcript.language}
            </p>
          )}

          {transcript.durationInSeconds && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Duration: {transcript.durationInSeconds.toFixed(1)} seconds
            </p>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex flex-col gap-2">
          {selectedFile && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-800">
              <span>Selected: {selectedFile.name}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-600"
                onClick={resetForm}
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              type="file"
              id="audio-upload"
              className="hidden"
              accept="audio/*"
              onChange={handleFileChange}
            />
            <label
              className="flex-1 dark:bg-zinc-800 p-2 border-zinc-300 dark:border-zinc-500"
              htmlFor="audio-upload"
            >
              {selectedFile ? "Change File" : "Select audio file"}
            </label>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              Transcribe
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
