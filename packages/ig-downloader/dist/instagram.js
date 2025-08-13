import { load } from "cheerio";
import querystring from "querystring";
import { HTTPError } from "./errors.js";
const InstagramEndpoints = {
    GetByPost: `/p`,
    GetByGraphQL: `/api/graphql`,
};
export async function getPostPageHTML(postId) {
    const res = await fetch(`https://www.instagram.com${InstagramEndpoints.GetByPost}/${postId}`, {
        headers: {
            accept: "*/*",
            referer: "https://www.instagram.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
        },
    });
    return await res.text();
}
function encodeGraphqlRequestData(shortcode) {
    const requestData = {
        av: "0",
        __d: "www",
        __user: "0",
        __a: "1",
        __req: "3",
        __hs: "19624.HYP:instagram_web_pkg.2.1..0.0",
        dpr: "3",
        __ccg: "UNKNOWN",
        __rev: "1008824440",
        __s: "xf44ne:zhh75g:xr51e7",
        __hsi: "7282217488877343271",
        __dyn: "7xeUmwlEnwn8K2WnFw9-2i5U4e0yoW3q32360CEbo1nEhw2nVE4W0om78b87C0yE5ufz81s8hwGwQwoEcE7O2l0Fwqo31w9a9x-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7-0iK2S3qazo7u1xwIw8O321LwTwKG1pg661pwr86C1mwraCg",
        __csr: "gZ3yFmJkillQvV6ybimnG8AmhqujGbLADgjyEOWz49z9XDlAXBJpC7Wy-vQTSvUGWGh5u8KibG44dBiigrgjDxGjU0150Q0848azk48N09C02IR0go4SaR70r8owyg9pU0V23hwiA0LQczA48S0f-x-27o05NG0fkw",
        __comet_req: "7",
        lsd: "AVqbxe3J_YA",
        jazoest: "2957",
        __spin_r: "1008824440",
        __spin_b: "trunk",
        __spin_t: "1695523385",
        fb_api_caller_class: "RelayModern",
        fb_api_req_friendly_name: "PolarisPostActionLoadPostQueryQuery",
        variables: JSON.stringify({ shortcode }),
        server_timestamps: "true",
        doc_id: "10015901848480474",
    };
    const encoded = querystring.stringify(requestData);
    return encoded;
}
export async function getPostGraphqlData(postId) {
    const encodedData = encodeGraphqlRequestData(postId);
    const res = await fetch(`https://www.instagram.com${InstagramEndpoints.GetByGraphQL}`, {
        method: "POST",
        body: encodedData,
        headers: {
            Accept: "*/*",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
            "X-IG-App-ID": "1217981644879628",
            "X-FB-LSD": "AVqbxe3J_YA",
            "X-ASBD-ID": "129477",
            "User-Agent": "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
        },
    });
    // Instagram prefixes JSON responses with "for (;;);" to prevent JSON hijacking
    const responseText = await res.text();
    console.log('📥 Raw GraphQL response (first 100 chars):', responseText.substring(0, 100));
    // Remove the "for (;;);" prefix if it exists
    const cleanedResponse = responseText.replace(/^for\s*\(\s*;\s*;\s*\)\s*;\s*/, '');
    console.log('🧹 Cleaned response (first 100 chars):', cleanedResponse.substring(0, 100));
    try {
        return JSON.parse(cleanedResponse);
    }
    catch (error) {
        console.error('❌ Failed to parse GraphQL JSON response');
        console.error('Raw response length:', responseText.length);
        console.error('Cleaned response length:', cleanedResponse.length);
        console.error('First 200 chars of raw response:', responseText.substring(0, 200));
        throw new Error(`Failed to parse Instagram GraphQL response: ${error.message}`);
    }
}
function formatGraphqlJson(data) {
    var _a, _b, _c, _d;
    return {
        filename: `ig-downloader-${Date.now()}.mp4`,
        width: String((_b = (_a = data.dimensions) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : ""),
        height: String((_d = (_c = data.dimensions) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : ""),
        videoUrl: data.video_url,
    };
}
function formatPageJson(postHtml) {
    var _a, _b;
    const videoElement = postHtml("meta[property='og:video']");
    if (videoElement.length === 0)
        return null;
    const videoUrl = videoElement.attr("content");
    if (!videoUrl)
        return null;
    const width = (_a = postHtml("meta[property='og:video:width']").attr("content")) !== null && _a !== void 0 ? _a : "";
    const height = (_b = postHtml("meta[property='og:video:height']").attr("content")) !== null && _b !== void 0 ? _b : "";
    return { filename: `ig-downloader-${Date.now()}.mp4`, width, height, videoUrl };
}
export async function getPostIdFromUrl(postUrl) {
    const shareRegex = /^https:\/\/(?:www\.)?instagram\.com\/share\/([a-zA-Z0-9_-]+)\/?/;
    const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
    const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
    if (shareRegex.test(postUrl)) {
        const res = await fetch(postUrl, { method: "GET", redirect: "follow" });
        const match = res.url.match(/reel\/([a-zA-Z0-9_-]+)/);
        if (!(match === null || match === void 0 ? void 0 : match[1]))
            throw new Error("Reel ID not found in URL");
        return match[1];
    }
    const postMatch = postUrl.match(postRegex);
    if (postMatch === null || postMatch === void 0 ? void 0 : postMatch[1])
        return postMatch[1];
    const reelMatch = postUrl.match(reelRegex);
    if (reelMatch === null || reelMatch === void 0 ? void 0 : reelMatch[1])
        return reelMatch[1];
    throw new Error("Unable to extract ID");
}
export async function getVideoInfo(postId) {
    var _a;
    const html = await getPostPageHTML(postId);
    const doc = load(html);
    const pageJson = formatPageJson(doc);
    if (pageJson)
        return pageJson;
    const data = await getPostGraphqlData(postId);
    const mediaData = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.xdt_shortcode_media;
    if (!mediaData)
        throw new HTTPError("Video link for this post is not public.", 401);
    if (!mediaData.is_video)
        throw new HTTPError("This post is not a video", 400);
    return formatGraphqlJson(mediaData);
}
