"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHttpErrorMessage } from "./http.js";
export async function downloadFile(videoUrl, filename) {
    const res = await fetch(videoUrl);
    if (!res.ok)
        throw new Error("Failed to fetch file");
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
export function InstagramReelDownloader(props) {
    var _a;
    const { endpoint = "/api/video", className, placeholder = "Paste your Instagram link here...", buttonText = "Download" } = props;
    const form = useForm({ resolver: zodResolver(formSchema), defaultValues: { postUrl: "" } });
    const [pending, setPending] = React.useState(false);
    const [error, setError] = React.useState(null);
    async function onSubmit(values) {
        const { postUrl } = values;
        setPending(true);
        setError(null);
        try {
            const searchParams = new URLSearchParams({ postUrl });
            const res = await fetch(`${endpoint}?${searchParams.toString()}`);
            if (!res.ok)
                throw new Error(`Request failed (${res.status})`);
            const json = (await res.json());
            if (json.status === "error")
                throw new Error(json.message);
            const { filename, videoUrl } = json.data;
            await downloadFile(videoUrl, filename);
        }
        catch (e) {
            setError(getHttpErrorMessage(e));
        }
        finally {
            setPending(false);
        }
    }
    return (_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: className !== null && className !== void 0 ? className : "flex w-full max-w-2xl flex-col items-center gap-2", children: [_jsx("div", { className: "min-h-6 w-full text-start text-red-500 text-sm", children: error }), _jsxs("div", { className: "relative flex w-full flex-col items-center gap-3 sm:flex-row", children: [_jsxs("div", { className: "w-full", children: [_jsx("input", { ...form.register("postUrl"), type: "url", placeholder: placeholder, disabled: pending, className: "h-12 w-full rounded border px-3" }), _jsx("p", { className: "mt-1 text-xs text-red-500", children: (_a = form.formState.errors.postUrl) === null || _a === void 0 ? void 0 : _a.message })] }), _jsx("button", { type: "submit", disabled: pending, className: "right-1 top-1 w-full rounded bg-blue-600 px-4 py-2 text-white sm:absolute sm:w-fit disabled:opacity-60", children: pending ? "Processing..." : buttonText })] }), _jsx("p", { className: "text-muted-foreground text-center text-xs", children: "If the download opens a new page, right click the video and then click Save as video." })] }));
}
