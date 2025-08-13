import { HTTPError } from "./errors.js";
import { makeErrorResponse, makeSuccessResponse } from "./http.js";
import type { VideoInfo } from "./types.js";
import { getPostIdFromUrl, getVideoInfo } from "./instagram.js";

export async function instagramVideoGET(request: Request): Promise<Response> {
  try {
    console.log('🔍 Server function called with URL:', request.url);
    
    const url = new URL(request.url);
    const postUrl = url.searchParams.get("postUrl");
    console.log('📝 Post URL from query params:', postUrl);
    
    if (!postUrl) {
      console.log('❌ No postUrl provided in query parameters');
      const body = JSON.stringify(makeErrorResponse("Post URL is required"));
      return new Response(body, { status: 400, headers: { "Content-Type": "application/json" } });
    }

    console.log('🔄 Getting post ID from URL:', postUrl);
    const postId = await getPostIdFromUrl(postUrl);
    console.log('🆔 Post ID extracted:', postId);
    
    console.log('📹 Getting video info for post ID:', postId);
    const video = await getVideoInfo(postId);
    console.log('✅ Video info retrieved:', video);

    const body = JSON.stringify(makeSuccessResponse<VideoInfo>(video));
    return new Response(body, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    console.error('❌ Error in instagramVideoGET:');
    console.error('  Error name:', (error as Error).name);
    console.error('  Error message:', (error as Error).message);
    console.error('  Error stack:', (error as Error).stack);
    
    if (error instanceof HTTPError) {
      console.log('📋 HTTPError caught, returning status:', error.status);
      const body = JSON.stringify(makeErrorResponse(error.message));
      return new Response(body, { status: error.status, headers: { "Content-Type": "application/json" } });
    }
    
    console.log('📋 Generic error caught, returning 500');
    const body = JSON.stringify(makeErrorResponse());
    return new Response(body, { status: 500, headers: { "Content-Type": "application/json" } });
  }
} 