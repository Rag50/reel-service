# Instagram Reels Downloader Widget

A standalone React component and server-side API for downloading Instagram reels and videos. This package can be easily integrated into any React application.

## ⚠️ Important Notice

**Instagram has implemented strict security measures that limit access to content without authentication. This widget may not work for all Instagram posts due to these restrictions.**

### Current Limitations:

1. **Authentication Required**: Instagram now requires users to be logged in to access most content
2. **Private Accounts**: Content from private accounts cannot be accessed
3. **Rate Limiting**: Instagram may block requests if too many are made in a short time
4. **Content Restrictions**: Some content may be region-locked or have additional restrictions

## 🚀 Installation

```bash
npm install instagram-reels-downloader-widget
```

## 📦 Usage

### Client-Side Component

```tsx
import { InstagramReelDownloader } from 'instagram-reels-downloader-widget';

function App() {
  return (
    <div>
      <h1>Download Instagram Videos</h1>
      <InstagramReelDownloader 
        endpoint="/api/instagram-video"
        placeholder="Paste Instagram URL here..."
        buttonText="Download Video"
        className="my-custom-styles"
      />
    </div>
  );
}
```

### Server-Side API Handler

#### Next.js API Route

Create a file at `pages/api/instagram-video.ts` or `app/api/instagram-video/route.ts`:

```typescript
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

// For Pages Router
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const response = await instagramVideoGET(req);
  const data = await response.json();
  
  res.status(response.status).json(data);
}

// For App Router
export const GET = instagramVideoGET;
```

#### Express.js

```typescript
import express from 'express';
import { instagramVideoGET } from 'instagram-reels-downloader-widget';

const app = express();

app.get('/api/instagram-video', async (req, res) => {
  const request = new Request(`http://localhost${req.url}`);
  const response = await instagramVideoGET(request);
  const data = await response.json();
  
  res.status(response.status).json(data);
});
```

## 🔧 API Reference

### InstagramReelDownloader Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `endpoint` | `string` | `"/api/video"` | API endpoint for video processing |
| `className` | `string` | `undefined` | Custom CSS classes |
| `placeholder` | `string` | `"Paste your Instagram link here..."` | Input placeholder text |
| `buttonText` | `string` | `"Download"` | Button text |

### API Endpoint

#### Request

```
GET /api/instagram-video?postUrl=https://www.instagram.com/reel/EXAMPLE_ID/
```

#### Response

**Success (200):**
```json
{
  "status": "success",
  "data": {
    "filename": "ig-downloader-1234567890.mp4",
    "width": "1080",
    "height": "1920",
    "videoUrl": "https://..."
  }
}
```

**Error (400/401/500):**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🛠️ Customization

### Styling

The component uses minimal default styles. You can customize it by:

1. **Passing className prop:**
```tsx
<InstagramReelDownloader 
  className="my-custom-form-styles"
/>
```

2. **Using CSS modules or styled-components:**
```css
/* styles.module.css */
.customForm {
  @apply bg-white rounded-lg shadow-lg p-6;
}
```

### Custom Download Logic

You can use the `downloadFile` utility function directly:

```tsx
import { downloadFile } from 'instagram-reels-downloader-widget';

async function handleCustomDownload(videoUrl: string, filename: string) {
  try {
    await downloadFile(videoUrl, filename);
    console.log('Download completed!');
  } catch (error) {
    console.error('Download failed:', error);
  }
}
```

## 🔒 Error Handling

The component handles various error scenarios:

- **Invalid URLs**: Shows validation errors
- **Network Errors**: Displays user-friendly error messages
- **Instagram Restrictions**: Shows appropriate error messages for private content
- **Rate Limiting**: Handles too many requests gracefully

## 🌐 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 📝 License

MIT License - see LICENSE file for details.

## ⚖️ Legal Disclaimer

This tool is for educational purposes only. Please respect Instagram's Terms of Service and only download content you have permission to access. The developers are not responsible for any misuse of this application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the error messages for guidance
2. Verify the Instagram URL is accessible in a browser
3. Ensure the content is from a public account
4. Try again later if rate limited

## 🔗 Related Links

- [Instagram Terms of Service](https://help.instagram.com/581066165581870)
- [React Documentation](https://reactjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs) 