# Framework Integration Examples

Here's how to use the `InstagramDownloader.tsx` component in different React frameworks:

## Next.js

### App Router (Next.js 13+)
```jsx
// app/downloader/page.tsx
'use client';

import InstagramDownloader from '@/components/InstagramDownloader';

export default function DownloaderPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Instagram Video Downloader
      </h1>
      <InstagramDownloader 
        className="max-w-2xl mx-auto"
      />
    </div>
  );
}
```

### Pages Router (Next.js 12 and earlier)
```jsx
// pages/downloader.tsx
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR issues
const InstagramDownloader = dynamic(
  () => import('../components/InstagramDownloader'),
  { ssr: false }
);

export default function DownloaderPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Instagram Video Downloader
      </h1>
      <InstagramDownloader />
    </div>
  );
}
```

## Create React App

```jsx
// src/App.js
import React from 'react';
import InstagramDownloader from './components/InstagramDownloader';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Instagram Downloader</h1>
        <p>Download your favorite Instagram reels and posts</p>
      </header>
      
      <main className="main-content">
        <InstagramDownloader 
          config={{
            onDownloadComplete: (result) => {
              if (result.success) {
                console.log('✅ Downloaded:', result.videoInfo?.filename);
              }
            }
          }}
        />
      </main>
    </div>
  );
}

export default App;
```

## Vite + React

```jsx
// src/App.tsx
import { useState } from 'react';
import InstagramDownloader from './components/InstagramDownloader';

function App() {
  const [downloads, setDownloads] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Instagram Downloader
          </h1>
          <p className="text-gray-600">
            Downloads completed: {downloads}
          </p>
        </div>
        
        <InstagramDownloader 
          config={{
            onDownloadComplete: (result) => {
              if (result.success) {
                setDownloads(prev => prev + 1);
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default App;
```

## Gatsby

```jsx
// src/pages/downloader.js
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout';

const DownloaderPage = () => {
  const [InstagramDownloader, setInstagramDownloader] = useState(null);

  useEffect(() => {
    // Dynamically import to avoid SSR issues
    import('../components/InstagramDownloader').then((module) => {
      setInstagramDownloader(() => module.default);
    });
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Instagram Downloader</h1>
        {InstagramDownloader ? (
          <InstagramDownloader />
        ) : (
          <div>Loading downloader...</div>
        )}
      </div>
    </Layout>
  );
};

export default DownloaderPage;
```

## React Router (SPA)

```jsx
// src/pages/DownloaderPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import InstagramDownloader from '../components/InstagramDownloader';

function DownloaderPage() {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <button 
        onClick={() => navigate('/')}
        className="back-button"
      >
        ← Back to Home
      </button>
      
      <div className="content">
        <h1>Instagram Video Downloader</h1>
        <InstagramDownloader 
          config={{
            onDownloadStart: (url) => {
              console.log('Downloading from:', url);
            }
          }}
        />
      </div>
    </div>
  );
}

export default DownloaderPage;
```

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DownloaderPage from './pages/DownloaderPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/downloader" element={<DownloaderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Custom Styling Examples

### With Tailwind CSS
```jsx
<InstagramDownloader
  className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-xl shadow-2xl"
  inputClassName="w-full px-4 py-3 rounded-lg border-2 border-white bg-white/90 focus:bg-white focus:outline-none focus:ring-4 focus:ring-white/50"
  buttonClassName="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
  placeholder="✨ Paste Instagram URL here..."
  buttonText="🚀 Download"
/>
```

### With CSS Modules
```jsx
// styles.module.css
.container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  font-size: 1.1rem;
}

.button {
  background: linear-gradient(45deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
}
```

```jsx
// Component usage
import styles from './styles.module.css';

<InstagramDownloader
  className={styles.container}
  inputClassName={styles.input}
  buttonClassName={styles.button}
/>
```

## Integration Tips

1. **SSR Compatibility**: Use dynamic imports or client-side rendering for SSR frameworks
2. **Error Boundaries**: Wrap the component in error boundaries for production
3. **Loading States**: The component handles its own loading, but you can add page-level loading
4. **Styling**: Component includes default Tailwind-like classes, but they're just strings - style however you want
5. **CORS Issues**: For production, consider implementing a proxy server

## File Structure

```
your-project/
├── components/
│   └── InstagramDownloader.tsx  (copy this file)
├── pages/
│   └── downloader.tsx           (your page using the component)
└── ...
```

That's it! Just copy the `InstagramDownloader.tsx` file and start using it in any of these frameworks! 🎉 