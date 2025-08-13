# Usage Guide

This guide shows how to integrate the Instagram Reels Downloader Widget into different frameworks and applications.

## 📋 Table of Contents

1. [React Application](#react-application)
2. [Next.js Application](#nextjs-application)
3. [Express.js Server](#expressjs-server)
4. [Vanilla JavaScript](#vanilla-javascript)
5. [Custom Styling](#custom-styling)
6. [Error Handling](#error-handling)

## ⚛️ React Application

### Basic Setup

```tsx
import React from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  return (
    <div className="container">
      <h1>Instagram Video Downloader</h1>
      <InstagramReelDownloader 
        endpoint="/api/instagram-video"
      />
    </div>
  );
}
```

### With Custom Styling

```tsx
import React from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';
import './styles.css';

function App() {
  return (
    <div className="app">
      <div className="header">
        <h1>Download Instagram Videos</h1>
        <p>Paste any Instagram reel or post URL to download</p>
      </div>
      
      <div className="download-section">
        <InstagramReelDownloader 
          endpoint="/api/instagram-video"
          placeholder="Enter Instagram URL here..."
          buttonText="Download Now"
          className="custom-downloader"
        />
      </div>
    </div>
  );
}
```

## 🚀 Next.js Application

### App Router (Next.js 13+)

#### 1. Create API Route

Create `app/api/instagram-video/route.ts`:

```typescript
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

export const GET = instagramVideoGET;
```

#### 2. Create Page Component

Create `app/page.tsx`:

```tsx
'use client';

import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instagram Video Downloader
          </h1>
          <p className="text-lg text-gray-600">
            Download Instagram reels and videos with ease
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <InstagramReelDownloader 
            endpoint="/api/instagram-video"
            placeholder="Paste Instagram URL here..."
            buttonText="Download Video"
            className="bg-white rounded-lg shadow-lg p-6"
          />
        </div>
      </div>
    </main>
  );
}
```

### Pages Router (Next.js 12 and below)

#### 1. Create API Route

Create `pages/api/instagram-video.ts`:

```typescript
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
    });
    
    const response = await instagramVideoGET(request);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
}
```

#### 2. Create Page Component

Create `pages/index.tsx`:

```tsx
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Instagram Video Downloader
      </h1>
      
      <InstagramReelDownloader 
        endpoint="/api/instagram-video"
        className="max-w-md mx-auto"
      />
    </div>
  );
}
```

## 🖥️ Express.js Server

### Basic Express Server

```typescript
import express from 'express';
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Instagram video download API endpoint
app.get('/api/instagram-video', async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as any,
    });
    
    const response = await instagramVideoGET(request);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### With Frontend Integration

```typescript
import express from 'express';
import { instagramVideoGET } from 'instagram-reels-downloader-widget';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static('public'));

// API endpoint
app.get('/api/instagram-video', async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as any,
    });
    
    const response = await instagramVideoGET(request);
    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' 
    });
  }
});

// Serve HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## 🌐 Vanilla JavaScript

### HTML Page

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Video Downloader</title>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        .error {
            color: red;
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Instagram Video Downloader</h1>
        
        <div class="form-group">
            <input 
                type="url" 
                id="urlInput" 
                class="input" 
                placeholder="Paste Instagram URL here..."
            >
        </div>
        
        <div class="form-group">
            <button id="downloadBtn" class="button">Download Video</button>
        </div>
        
        <div id="error" class="error"></div>
    </div>

    <script>
        const urlInput = document.getElementById('urlInput');
        const downloadBtn = document.getElementById('downloadBtn');
        const errorDiv = document.getElementById('error');

        downloadBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            
            if (!url) {
                errorDiv.textContent = 'Please enter a URL';
                return;
            }

            downloadBtn.disabled = true;
            downloadBtn.textContent = 'Processing...';
            errorDiv.textContent = '';

            try {
                const response = await fetch(`/api/instagram-video?postUrl=${encodeURIComponent(url)}`);
                const data = await response.json();

                if (data.status === 'error') {
                    throw new Error(data.message);
                }

                // Download the video
                const videoResponse = await fetch(data.data.videoUrl);
                const blob = await videoResponse.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = data.data.filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);

                errorDiv.textContent = 'Download completed!';
                errorDiv.style.color = 'green';
            } catch (error) {
                errorDiv.textContent = error.message || 'Download failed';
            } finally {
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Download Video';
            }
        });
    </script>
</body>
</html>
```

## 🎨 Custom Styling

### CSS Modules

```css
/* Downloader.module.css */
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  max-width: 500px;
  width: 100%;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-size: 1.1rem;
}
```

```tsx
import React from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';
import styles from './Downloader.module.css';

function App() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Instagram Video Downloader</h1>
        <p className={styles.subtitle}>
          Download your favorite Instagram videos and reels
        </p>
        
        <InstagramReelDownloader 
          endpoint="/api/instagram-video"
          className="custom-downloader"
        />
      </div>
    </div>
  );
}
```

### Tailwind CSS

```tsx
import React from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Video Downloader
          </h1>
          <p className="text-gray-600">
            Download Instagram videos instantly
          </p>
        </div>
        
        <InstagramReelDownloader 
          endpoint="/api/instagram-video"
          placeholder="Paste Instagram URL..."
          buttonText="Download Now"
          className="space-y-4"
        />
      </div>
    </div>
  );
}
```

## ⚠️ Error Handling

### Custom Error Handling

```tsx
import React, { useState } from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    
    // Auto-clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="container">
      <h1>Instagram Video Downloader</h1>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <InstagramReelDownloader 
        endpoint="/api/instagram-video"
        onError={handleError}
      />
    </div>
  );
}
```

### Error Types

The widget handles various error scenarios:

1. **Invalid URL**: Shows validation error
2. **Network Error**: Displays connection error
3. **Instagram Restrictions**: Shows appropriate message for private content
4. **Rate Limiting**: Handles too many requests
5. **Server Error**: Shows generic error message

## 🔧 Advanced Usage

### Custom Download Logic

```tsx
import React from 'react';
import { InstagramReelDownloader, downloadFile } from 'instagram-reels-downloader-widget';

function App() {
  const handleCustomDownload = async (videoUrl: string, filename: string) => {
    try {
      // Custom download logic
      console.log('Starting download...');
      
      await downloadFile(videoUrl, filename);
      
      console.log('Download completed!');
      
      // Show success notification
      alert('Video downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <div>
      <InstagramReelDownloader 
        endpoint="/api/instagram-video"
        onDownload={handleCustomDownload}
      />
    </div>
  );
}
```

### Multiple Instances

```tsx
import React from 'react';
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2>Download Reels</h2>
        <InstagramReelDownloader 
          endpoint="/api/instagram-video"
          placeholder="Paste reel URL..."
          buttonText="Download Reel"
        />
      </div>
      
      <div>
        <h2>Download Posts</h2>
        <InstagramReelDownloader 
          endpoint="/api/instagram-video"
          placeholder="Paste post URL..."
          buttonText="Download Post"
        />
      </div>
    </div>
  );
}
```

This comprehensive usage guide covers all the major integration scenarios and provides practical examples for different frameworks and use cases. 