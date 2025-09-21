"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Upload } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { Document, Page as PDFPage } from "react-pdf";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const Page = () => {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  return (
    <div className="flex flex-col w-full max-w-md pt-12 pb-36 mx-auto stretch ">
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
                  case "file":
                    if (part.mediaType.startsWith("image/")) {
                      return (
                        <Image
                          key={`${message.id}-${index}`}
                          src={part.url}
                          alt={part.filename ?? `attachment-${index}`}
                          width={500}
                          height={500}
                        />
                      );
                    }
                    if (part.mediaType.startsWith("application/pdf")) {
                      return (
                        <div key={`${message.id}-${index}`}>
                          {/* <iframe
                            key={`${message.id}-${index}`}
                            src={part.url}
                            title={part.filename ?? `attachment-${index}`}
                            width="500"
                            height="600"
                            //   type="application/pdf"
                          /> */}
                          <div>
                            <Document
                              file={part.url}
                              onLoadSuccess={({ numPages }) =>
                                setNumPages(numPages)
                              }
                              className="w-full h-80 overflow-y-auto"
                            >
                              <PDFPage pageNumber={numPages} />
                            </Document>
                            <p>
                              Page {pageNumber} of {numPages}
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
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
        <div className=" flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Upload />
              {files?.length
                ? `${files.length} file(s) attached`
                : "Attach files"}
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(e.target.files);
                }
              }}
              multiple
              ref={fileInputRef}
            />
          </div>
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
        </div>
      </form>
    </div>
  );
};

export default Page;
