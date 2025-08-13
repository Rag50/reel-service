"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getHttpErrorMessage } from "./http.js";
import type { APIResponse, VideoInfo } from "./types.js";

export async function downloadFile(videoUrl: string, filename: string) {
  const res = await fetch(videoUrl);
  if (!res.ok) throw new Error("Failed to fetch file");
  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(blobUrl);
}

const formSchema = z.object({
  postUrl: z.string().url({ message: "Provide a valid Instagram post link" }),
});

export type WidgetProps = {
  endpoint?: string; // default "/api/video"
  className?: string;
  placeholder?: string;
  buttonText?: string;
};

export function InstagramReelDownloader(props: WidgetProps) {
  const { endpoint = "/api/video", className, placeholder = "Paste your Instagram link here...", buttonText = "Download" } = props;

  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema), defaultValues: { postUrl: "" } });

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    setPending(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams({ postUrl });
      const res = await fetch(`${endpoint}?${searchParams.toString()}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const json = (await res.json()) as APIResponse<VideoInfo>;
      if (json.status === "error") throw new Error(json.message);
      const { filename, videoUrl } = json.data;
      await downloadFile(videoUrl, filename);
    } catch (e) {
      setError(getHttpErrorMessage(e));
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className ?? "flex w-full max-w-2xl flex-col items-center gap-2"}>
      <div className="min-h-6 w-full text-start text-red-500 text-sm">{error}</div>
      <div className="relative flex w-full flex-col items-center gap-3 sm:flex-row">
        <div className="w-full">
          <input
            {...form.register("postUrl")}
            type="url"
            placeholder={placeholder}
            disabled={pending}
            className="h-12 w-full rounded border px-3"
          />
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.postUrl?.message}</p>
        </div>
        <button type="submit" disabled={pending} className="right-1 top-1 w-full rounded bg-blue-600 px-4 py-2 text-white sm:absolute sm:w-fit disabled:opacity-60">
          {pending ? "Processing..." : buttonText}
        </button>
      </div>
      <p className="text-muted-foreground text-center text-xs">If the download opens a new page, right click the video and then click Save as video.</p>
    </form>
  );
} 