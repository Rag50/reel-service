import React from 'react';
import { InstagramReelDownloader } from '../src/client';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instagram Video Downloader
          </h1>
          <p className="text-lg text-gray-600">
            Download Instagram reels and videos easily
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <InstagramReelDownloader 
            endpoint="/api/instagram-video"
            placeholder="Paste your Instagram reel or post URL here..."
            buttonText="Download Video"
            className="max-w-2xl mx-auto"
          />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            ⚠️ This tool respects Instagram's terms of service. 
            Only download content you have permission to access.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App; 