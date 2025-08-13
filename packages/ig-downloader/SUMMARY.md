# Instagram Reels Downloader Widget - Package Summary

## 📦 Package Overview

This is a standalone, reusable package that provides Instagram video downloading functionality. It can be easily integrated into any React application or used with any JavaScript framework.

## 🏗️ Architecture

### Core Components

1. **Client-Side React Component** (`src/client.tsx`)
   - `InstagramReelDownloader`: Main React component
   - `downloadFile`: Utility function for downloading files

2. **Server-Side API Handler** (`src/server.ts`)
   - `instagramVideoGET`: API endpoint handler

3. **Instagram API Client** (`src/instagram.ts`)
   - `getVideoInfo`: Main function to fetch video data
   - `getPostIdFromUrl`: Extract post ID from Instagram URLs
   - `getPostPageHTML`: Fetch Instagram page HTML
   - `getPostGraphqlData`: Fetch data via GraphQL API

4. **Utilities** (`src/http.ts`, `src/errors.ts`, `src/types.ts`)
   - Error handling and HTTP utilities
   - TypeScript type definitions

## 🔄 How It Works

### 1. URL Processing
```typescript
// User provides Instagram URL
const url = "https://www.instagram.com/reel/ABC123/";

// Extract post ID
const postId = await getPostIdFromUrl(url); // Returns "ABC123"
```

### 2. Data Fetching
```typescript
// Try to get video data from page HTML first
const html = await getPostPageHTML(postId);
const pageData = formatPageJson(html);

// If HTML method fails, use GraphQL API
if (!pageData) {
  const graphqlData = await getPostGraphqlData(postId);
  const videoData = formatGraphqlJson(graphqlData);
}
```

### 3. Response Format
```typescript
// Success response
{
  status: "success",
  data: {
    filename: "ig-downloader-1234567890.mp4",
    width: "1080",
    height: "1920", 
    videoUrl: "https://..."
  }
}
```

## 📁 File Structure

```
packages/ig-downloader/
├── src/
│   ├── client.tsx          # React component
│   ├── server.ts           # API handler
│   ├── instagram.ts        # Instagram API client
│   ├── http.ts            # HTTP utilities
│   ├── errors.ts          # Error classes
│   ├── types.ts           # TypeScript types
│   └── index.ts           # Main exports
├── dist/                  # Built files
├── example/               # Usage examples
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript config
├── README.md              # Package documentation
├── USAGE.md              # Detailed usage guide
└── SUMMARY.md            # This file
```

## 🚀 Integration Methods

### 1. React Application
```tsx
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  return (
    <InstagramReelDownloader 
      endpoint="/api/instagram-video"
    />
  );
}
```

### 2. Next.js API Route
```typescript
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

export const GET = instagramVideoGET;
```

### 3. Express.js Server
```typescript
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

app.get('/api/instagram-video', async (req, res) => {
  const request = new Request(req.url);
  const response = await instagramVideoGET(request);
  const data = await response.json();
  res.status(response.status).json(data);
});
```

## 🔧 Key Features

### ✅ What Works
- Public Instagram posts and reels
- URL validation and error handling
- Multiple URL formats support
- Responsive React component
- TypeScript support
- Customizable styling
- Cross-browser compatibility

### ⚠️ Limitations
- Instagram authentication requirements
- Private account restrictions
- Rate limiting
- Content region restrictions

## 🛡️ Error Handling

The package handles various error scenarios:

1. **Invalid URLs**: Validation errors
2. **Network Issues**: Connection errors
3. **Instagram Restrictions**: Private content errors
4. **Rate Limiting**: Too many requests
5. **Server Errors**: Generic error messages

## 🎨 Customization

### Styling
- CSS classes can be passed via `className` prop
- Default styles are minimal and clean
- Compatible with CSS frameworks (Tailwind, Bootstrap, etc.)

### Configuration
- Custom API endpoints
- Custom placeholder text
- Custom button text
- Custom error handling

## 📦 Build Process

```bash
# Install dependencies
npm install

# Build the package
npm run build

# The built files are in dist/
```

## 🔍 Testing

The package includes example implementations:
- React component example
- Next.js API route example
- Express.js server example
- Vanilla JavaScript example

## 📄 License

MIT License - Free to use in commercial and non-commercial projects.

## ⚖️ Legal Notice

This package is for educational purposes. Users must respect Instagram's Terms of Service and only download content they have permission to access.

## 🔗 Dependencies

### Peer Dependencies
- React >= 18
- React DOM >= 18

### Runtime Dependencies
- @hookform/resolvers
- @tanstack/react-query
- cheerio
- react-hook-form
- zod

### Development Dependencies
- TypeScript
- @types/react
- @types/react-dom

## 🚀 Getting Started

1. **Install the package:**
   ```bash
   npm install instagram-reels-downloader-widget
   ```

2. **Set up the API endpoint** (Next.js example):
   ```typescript
   // app/api/instagram-video/route.ts
   import { instagramVideoGET } from 'instagram-reels-downloader-widget';
   export const GET = instagramVideoGET;
   ```

3. **Use the component:**
   ```tsx
   import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';
   
   function App() {
     return (
       <InstagramReelDownloader 
         endpoint="/api/instagram-video"
       />
     );
   }
   ```

## 📞 Support

For issues and questions:
1. Check the error messages
2. Verify Instagram URL accessibility
3. Ensure content is from public accounts
4. Check rate limiting

The package is designed to be self-contained and easy to integrate into any React application or JavaScript project. 