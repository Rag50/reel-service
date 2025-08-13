"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getHttpErrorMessage } from "@/lib/http";
import { useVideoInfo } from "@/services/api/queries";
import { downloadFile } from "@/embeddable/utils";

const formSchema = z.object({
  postUrl: z.string().url({ message: "Provide a valid Instagram post link" }),
});

export type InstagramReelDownloaderProps = {
  className?: string;
  placeholder?: string;
  buttonText?: string;
};

export function InstagramReelDownloader(props: InstagramReelDownloaderProps) {
  const { className, placeholder = "Paste your Instagram link here...", buttonText = "Download" } = props;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { postUrl: "" },
  });

  const { error, isPending, mutateAsync: getVideoInfo } = useVideoInfo();
  const httpError = getHttpErrorMessage(error);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    const videoInfo = await getVideoInfo({ postUrl });
    const { filename, videoUrl } = videoInfo;
    await downloadFile(videoUrl, filename);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={className ?? "flex w-full max-w-2xl flex-col items-center gap-2"}>
      <div className="min-h-6 w-full text-start text-red-500 text-sm">{httpError}</div>
      <div className="relative flex w-full flex-col items-center gap-3 sm:flex-row">
        <div className="w-full">
          <input
            {...form.register("postUrl")}
            type="url"
            placeholder={placeholder}
            disabled={isPending}
            className="h-12 w-full rounded border px-3"
          />
          <p className="mt-1 text-xs text-red-500">{form.formState.errors.postUrl?.message}</p>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="right-1 top-1 w-full rounded bg-primary px-4 py-2 text-white sm:absolute sm:w-fit disabled:opacity-60"
        >
          {isPending ? "Processing..." : buttonText}
        </button>
      </div>
      <p className="text-muted-foreground text-center text-xs">
        If the download opens a new page, right click the video and then click Save as video.
      </p>
    </form>
  );
} 