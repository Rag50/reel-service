"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getHttpErrorMessage } from "@/lib/http";
import { useVideoInfo } from "@/services/api/queries";
import { downloadFile } from "@/embeddable/utils";
const formSchema = z.object({
    postUrl: z.string().url({ message: "Provide a valid Instagram post link" }),
});
export function InstagramReelDownloader(props) {
    var _a;
    const { className, placeholder = "Paste your Instagram link here...", buttonText = "Download" } = props;
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { postUrl: "" },
    });
    const { error, isPending, mutateAsync: getVideoInfo } = useVideoInfo();
    const httpError = getHttpErrorMessage(error);
    async function onSubmit(values) {
        const { postUrl } = values;
        const videoInfo = await getVideoInfo({ postUrl });
        const { filename, videoUrl } = videoInfo;
        await downloadFile(videoUrl, filename);
    }
    return (_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: className !== null && className !== void 0 ? className : "flex w-full max-w-2xl flex-col items-center gap-2", children: [_jsx("div", { className: "min-h-6 w-full text-start text-red-500 text-sm", children: httpError }), _jsxs("div", { className: "relative flex w-full flex-col items-center gap-3 sm:flex-row", children: [_jsxs("div", { className: "w-full", children: [_jsx("input", { ...form.register("postUrl"), type: "url", placeholder: placeholder, disabled: isPending, className: "h-12 w-full rounded border px-3" }), _jsx("p", { className: "mt-1 text-xs text-red-500", children: (_a = form.formState.errors.postUrl) === null || _a === void 0 ? void 0 : _a.message })] }), _jsx("button", { type: "submit", disabled: isPending, className: "right-1 top-1 w-full rounded bg-primary px-4 py-2 text-white sm:absolute sm:w-fit disabled:opacity-60", children: isPending ? "Processing..." : buttonText })] }), _jsx("p", { className: "text-muted-foreground text-center text-xs", children: "If the download opens a new page, right click the video and then click Save as video." })] }));
}
