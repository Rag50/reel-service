import { load } from "cheerio";

import {
  getPostPageHTML,
  getPostGraphqlData,
} from "@/services/instagram/requests";

import { VideoInfo } from "@/types";
import { HTTPError } from "@/lib/errors";

import { INSTAGRAM_CONFIGS } from "./constants";
import { formatGraphqlJson, formatPageJson, getPostIdFromUrl } from "./utils";

const getVideoJsonFromHTML = async (postId: string) => {
  const data = await getPostPageHTML({ postId });

  const postHtml = load(data);
  
  // Check if we got a login page instead of the actual post
  const loginPage = postHtml("title").text().includes("Instagram") && 
                   (postHtml("body").text().includes("Log In") || 
                    postHtml("body").text().includes("Sign Up") ||
                    postHtml("body").text().includes("login"));
  
  if (loginPage) {
    throw new HTTPError("This content requires authentication. Instagram now requires users to be logged in to access most content.", 401);
  }

  const videoElement = postHtml("meta[property='og:video']");

  if (videoElement.length === 0) {
    // Check if this is a private post or not a video
    const privateContent = postHtml("body").text().includes("This content is not available") ||
                          postHtml("body").text().includes("Sorry, this page isn't available") ||
                          postHtml("body").text().includes("Page Not Found");
    
    if (privateContent) {
      throw new HTTPError("This content is private or not available. The post may be from a private account or has been deleted.", 403);
    }
    
    return null;
  }

  const videoInfo = formatPageJson(postHtml);
  return videoInfo;
};

const getVideoJSONFromGraphQL = async (postId: string) => {
  const data = await getPostGraphqlData({ postId });

  const mediaData = data.data?.xdt_shortcode_media;

  if (!mediaData) {
    // Check for authentication errors in GraphQL response
    if (data.errors && data.errors.length > 0) {
      const error = data.errors[0];
      if (error.message?.includes("login") || error.message?.includes("authentication")) {
        throw new HTTPError("This content requires authentication. Instagram now requires users to be logged in to access most content.", 401);
      }
    }
    return null;
  }

  if (!mediaData.is_video) {
    throw new HTTPError("This post is not a video", 400);
  }

  const videoInfo = formatGraphqlJson(mediaData);
  return videoInfo;
};

export const getVideoInfo = async (postId: string) => {
  let videoInfo: VideoInfo | null = null;
  let lastError: Error | null = null;

  if (INSTAGRAM_CONFIGS.enableWebpage) {
    try {
      videoInfo = await getVideoJsonFromHTML(postId);
      if (videoInfo) return videoInfo;
    } catch (error) {
      lastError = error as Error;
      // If it's an authentication error, don't try GraphQL
      if (error instanceof HTTPError && error.status === 401) {
        throw error;
      }
    }
  }

  if (INSTAGRAM_CONFIGS.enableGraphQL) {
    try {
      videoInfo = await getVideoJSONFromGraphQL(postId);
      if (videoInfo) return videoInfo;
    } catch (error) {
      lastError = error as Error;
      // If it's an authentication error, throw it
      if (error instanceof HTTPError && error.status === 401) {
        throw error;
      }
    }
  }

  // If we have a specific error, throw it
  if (lastError instanceof HTTPError) {
    throw lastError;
  }

  throw new HTTPError("Unable to access this content. This may be due to:\n1. The post is from a private account\n2. The content has been deleted\n3. Instagram requires authentication to access this content\n4. The post is not a video", 404);
};
