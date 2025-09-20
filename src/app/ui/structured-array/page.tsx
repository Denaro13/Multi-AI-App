"use client";
import { pokemonUISchema } from "@/app/api/structured-array/schema";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import React, { useState } from "react";

const Page = () => {
  const [type, setType] = useState("");
  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ type });
    setType("");
  };
  return (
    <div className="flex flex-col w-full max-w-3xl py-24 mx-auto stretch ">
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {/* {isLoading && <div>Loading....</div>} */}
      <div className="space-y-8">
        {object?.map((pokemon) => {
          return (
            <div
              key={pokemon?.name}
              className="bg-zinc-200 dark:bg-zinc-800 p-6 rounded-lg shadow-sm"
            >
              <h2 className="text-2xl font-bold mb-4">{pokemon?.name}</h2>
              <div className="grid grid-cols-2 gap-4">
                {pokemon?.abilities?.map((ability) => (
                  <div
                    key={ability}
                    className="bg-zinc-50 dark:bg-zinc-700 p-3 rounded-md "
                  >
                    {ability}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-3xl mx-auto left-0 right-0 p-4 bg-gray-50 dark"
      >
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 dark:bg-gray-800 p-2 border border-gray-300 dark:border-gray-800"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter a type..."
          />
          {isLoading ? (
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
          )}
        </div>
      </form>
    </div>
  );
};

export default Page;
