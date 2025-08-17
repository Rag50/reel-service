import React, { useState, useCallback, useMemo } from 'react';

// Types
interface VideoInfo {
  filename: string;
  width: string;
  height: string;
  videoUrl: string;
}

interface DownloadResult {
  success: boolean;
  error?: string;
  videoInfo?: VideoInfo;
}

interface InstagramDownloaderConfig {
  enableWebpage?: boolean;
  enableGraphQL?: boolean;
  customHeaders?: Record<string, string>;
  onDownloadStart?: (url: string) => void;
  onDownloadComplete?: (result: DownloadResult) => void;
  onDownloadError?: (error: string) => void;
}

interface InstagramDownloaderProps {
  config?: InstagramDownloaderConfig;
  placeholder?: string;
  buttonText?: string;
  className?: string;
  inputClassName?: string;
  buttonClassName?: string;
  loadingText?: string;
  showInstructions?: boolean;
  instructionsText?: string;
}

// Utility Functions
const generateFilename = (prefix: string = "instagram", extension: string = "mp4"): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `${prefix}-${timestamp}.${extension}`;
};

const validateInstagramURL = (postUrl: string): string => {
  if (!postUrl) {
    return "Instagram URL was not provided";
  }

  if (!postUrl.includes("instagram.com/")) {
    return "Invalid URL does not contain Instagram domain";
  }

  if (!postUrl.startsWith("https://")) {
    return 'Invalid URL it should start with "https://www.instagram.com..."';
  }

  const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;
  const shareRegex = /^https:\/\/(?:www\.)?instagram\.com\/share\/([a-zA-Z0-9_-]+)\/?/;

  if (!postRegex.test(postUrl) && !reelRegex.test(postUrl) && !shareRegex.test(postUrl)) {
    return "URL does not match Instagram post, reel, or share format";
  }

  return "";
};

const getPostIdFromUrl = async (postUrl: string): Promise<string> => {
  const shareRegex = /^https:\/\/(?:www\.)?instagram\.com\/share\/([a-zA-Z0-9_-]+)\/?/;
  const postRegex = /^https:\/\/(?:www\.)?instagram\.com\/p\/([a-zA-Z0-9_-]+)\/?/;
  const reelRegex = /^https:\/\/(?:www\.)?instagram\.com\/reels?\/([a-zA-Z0-9_-]+)\/?/;

  if (shareRegex.test(postUrl)) {
    try {
      const reelId = await fetchReelIdFromShareURL(postUrl);
      return reelId;
    } catch (error) {
      throw new Error('Error resolving share URL');
    }
  }

  const postMatch = postUrl.match(postRegex);
  if (postMatch?.[1]) {
    return postMatch[1];
  }

  const reelMatch = postUrl.match(reelRegex);
  if (reelMatch?.[1]) {
    return reelMatch[1];
  }

  throw new Error('Unable to extract post ID from URL');
};

const fetchReelIdFromShareURL = async (shareUrl: string): Promise<string> => {
  try {
    const response = await fetch(shareUrl, { method: 'GET', redirect: 'follow' });

    if (!response.ok) {
      throw new Error("Failed to fetch share URL");
    }

    const match = response.url.match(/reel\/([a-zA-Z0-9_-]+)/);
    if (!match || !match[1]) {
      throw new Error("Reel ID not found in URL");
    }

    return match[1];
  } catch (error) {
    throw new Error("Error fetching or parsing share URL");
  }
};

const downloadFile = async (videoUrl: string, filename: string): Promise<void> => {
  try {
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch the video for download.");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Cleanup blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw new Error("Error during file download");
  }
};

// Core downloader logic
class InstagramDownloaderCore {
  private config: Required<InstagramDownloaderConfig>;

  constructor(config: InstagramDownloaderConfig = {}) {
    this.config = {
      enableWebpage: true,
      enableGraphQL: true,
      customHeaders: {},
      onDownloadStart: () => {},
      onDownloadComplete: () => {},
      onDownloadError: () => {},
      ...config
    };
  }

  async getVideoInfo(postUrl: string): Promise<VideoInfo> {
    const validationError = validateInstagramURL(postUrl);
    if (validationError) {
      throw new Error(validationError);
    }

    const postId = await getPostIdFromUrl(postUrl);
    let videoInfo: VideoInfo | null = null;

    if (this.config.enableWebpage) {
      try {
        videoInfo = await this.getVideoFromHTML(postId);
        if (videoInfo) return videoInfo;
      } catch (error) {
        console.warn('HTML method failed:', error);
      }
    }

    if (this.config.enableGraphQL) {
      try {
        videoInfo = await this.getVideoFromGraphQL(postId);
        if (videoInfo) return videoInfo;
      } catch (error) {
        console.warn('GraphQL method failed:', error);
      }
    }

    throw new Error('Unable to fetch video information. The post may be private or not a video.');
  }

  private async getVideoFromHTML(postId: string): Promise<VideoInfo | null> {
    const url = `https://www.instagram.com/p/${postId}/`;
    
    const headers = {
      accept: "*/*",
      host: "www.instagram.com",
      referer: "https://www.instagram.com/",
      DNT: "1",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0",
      ...this.config.customHeaders,
    };

    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post HTML: ${response.status}`);
    }

    const htmlData = await response.text();
    
    // Simple regex to extract video URL from meta tags
    const videoMatch = htmlData.match(/<meta property="og:video" content="([^"]+)"/);
    const widthMatch = htmlData.match(/<meta property="og:video:width" content="([^"]+)"/);
    const heightMatch = htmlData.match(/<meta property="og:video:height" content="([^"]+)"/);

    if (!videoMatch) {
      return null;
    }

    return {
      filename: generateFilename("instagram-video"),
      width: widthMatch?.[1] || "",
      height: heightMatch?.[1] || "",
      videoUrl: videoMatch[1],
    };
  }

  private async getVideoFromGraphQL(postId: string): Promise<VideoInfo | null> {
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
      variables: JSON.stringify({
        shortcode: postId,
        fetch_comment_count: "null",
        fetch_related_profile_media_count: "null",
        parent_comment_count: "null",
        child_comment_count: "null",
        fetch_like_count: "null",
        fetch_tagged_user_count: "null",
        fetch_preview_comment_count: "null",
        has_threaded_comments: "false",
        hoisted_comment_id: "null",
        hoisted_reply_id: "null",
      }),
      server_timestamps: "true",
      doc_id: "10015901848480474",
    };

    const encodedData = new URLSearchParams(requestData).toString();
    const url = "https://www.instagram.com/api/graphql";

    const headers = {
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded",
      "X-FB-Friendly-Name": "PolarisPostActionLoadPostQueryQuery",
      "X-CSRFToken": "RVDUooU5MYsBbS1CNN3CzVAuEP8oHB52",
      "X-IG-App-ID": "1217981644879628",
      "X-FB-LSD": "AVqbxe3J_YA",
      "X-ASBD-ID": "129477",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G973U) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/14.2 Chrome/87.0.4280.141 Mobile Safari/537.36",
      ...this.config.customHeaders,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: encodedData,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch GraphQL data: ${response.status}`);
    }

    const data: any = await response.json();
    const mediaData = data.data?.xdt_shortcode_media;

    if (!mediaData) {
      return null;
    }

    if (!mediaData.is_video) {
      throw new Error("This post is not a video");
    }

    return {
      filename: generateFilename("instagram-video"),
      width: mediaData.dimensions.width.toString(),
      height: mediaData.dimensions.height.toString(),
      videoUrl: mediaData.video_url,
    };
  }

  async downloadVideo(postUrl: string): Promise<DownloadResult> {
    try {
      this.config.onDownloadStart(postUrl);

      const videoInfo = await this.getVideoInfo(postUrl);
      
      if (typeof window !== 'undefined') {
        await downloadFile(videoInfo.videoUrl, videoInfo.filename);
      }

      const result: DownloadResult = {
        success: true,
        videoInfo
      };

      this.config.onDownloadComplete(result);
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const result: DownloadResult = {
        success: false,
        error: errorMessage
      };

      this.config.onDownloadError(errorMessage);
      return result;
    }
  }
}

// Main React Component
const InstagramDownloader: React.FC<InstagramDownloaderProps> = ({
  config = {},
  placeholder = "Paste your Instagram link here...",
  buttonText = "Download",
  className = "",
  inputClassName = "",
  buttonClassName = "",
  loadingText = "Downloading...",
  showInstructions = true,
  instructionsText = "If the download opens a new page, right click the video and then click Save as video."
}) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<DownloadResult | null>(null);

  const downloader = useMemo(() => new InstagramDownloaderCore(config), [config]);

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return url.includes('instagram.com');
    } catch {
      return false;
    }
  };

  const handleDownload = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a valid Instagram URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid Instagram URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const downloadResult = await downloader.downloadVideo(url);
      setResult(downloadResult);
      
      if (!downloadResult.success) {
        setError(downloadResult.error || 'Download failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [url, downloader]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDownload();
  };

  const defaultStyles = {
    container: "max-w-2xl w-full mx-auto p-6 bg-white rounded-lg shadow-md border",
    form: "flex flex-col gap-4",
    inputContainer: "flex flex-col sm:flex-row gap-4",
    input: `flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isLoading ? 'opacity-50' : ''}`,
    button: `px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
    error: "text-red-500 text-sm mt-2",
    success: "text-green-500 text-sm mt-2",
    instructions: "text-gray-500 text-xs mt-4 text-center"
  };

  return (
    <div className={className || defaultStyles.container}>
      <form onSubmit={handleSubmit} className={defaultStyles.form}>
        {error && (
          <div className={defaultStyles.error}>
            {error}
          </div>
        )}
        
        <div className={defaultStyles.inputContainer}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className={inputClassName || defaultStyles.input}
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className={buttonClassName || defaultStyles.button}
          >
            {isLoading ? loadingText : buttonText}
          </button>
        </div>

        {result?.success && (
          <div className={defaultStyles.success}>
            ✅ Download started! Check your downloads folder.
          </div>
        )}

        {showInstructions && (
          <p className={defaultStyles.instructions}>
            {instructionsText}
          </p>
        )}
      </form>
    </div>
  );
};

export default InstagramDownloader; 