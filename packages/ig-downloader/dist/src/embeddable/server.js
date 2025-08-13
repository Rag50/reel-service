import { NextResponse } from "next/server";
import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";
import { getVideoInfo } from "@/features/instagram";
import { getPostIdFromUrl } from "@/features/instagram/utils";
function handleError(error) {
    if (error instanceof HTTPError) {
        const response = makeErrorResponse(error.message);
        return NextResponse.json(response, { status: error.status });
    }
    else {
        console.error(error);
        const response = makeErrorResponse();
        return NextResponse.json(response, { status: 500 });
    }
}
export async function instagramVideoGET(request) {
    const postUrl = new URL(request.url).searchParams.get("postUrl");
    if (!postUrl) {
        const badRequestResponse = makeErrorResponse("Post URL is required");
        return NextResponse.json(badRequestResponse, { status: 400 });
    }
    const postId = await getPostIdFromUrl(postUrl);
    if (!postId) {
        const noPostIdResponse = makeErrorResponse("Invalid Post URL");
        return NextResponse.json(noPostIdResponse, { status: 400 });
    }
    try {
        const postJson = await getVideoInfo(postId);
        const response = makeSuccessResponse(postJson);
        return NextResponse.json(response, { status: 200 });
    }
    catch (error) {
        return handleError(error);
    }
}
