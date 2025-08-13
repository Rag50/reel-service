# Instagram Reels Downloader

A modern web application for downloading Instagram reels and videos. Built with Next.js, TypeScript, and Tailwind CSS.

## ⚠️ Important Notice

**Instagram has implemented strict security measures that limit access to content without authentication. This application may not work for all Instagram posts due to these restrictions.**

### Current Limitations:

1. **Authentication Required**: Instagram now requires users to be logged in to access most content
2. **Private Accounts**: Content from private accounts cannot be accessed
3. **Rate Limiting**: Instagram may block requests if too many are made in a short time
4. **Content Restrictions**: Some content may be region-locked or have additional restrictions

### What Works:
- ✅ Public posts from public accounts (when accessible)
- ✅ Reels and videos that don't require authentication
- ✅ Content that hasn't been deleted or made private

### What May Not Work:
- ❌ Posts from private accounts
- ❌ Content requiring Instagram login
- ❌ Deleted or removed content
- ❌ Region-restricted content

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Instagram-reels-downloader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🛠️ Usage

### Web Interface

1. Open the application in your browser
2. Paste an Instagram post URL (reel, post, or story)
3. Click "Download" to get video information
4. Use the provided download links

### API Endpoint

You can also use the API directly:

```bash
curl "http://localhost:3000/api/video?postUrl=https://www.instagram.com/reel/EXAMPLE_ID/"
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "videoUrl": "https://...",
    "thumbnailUrl": "https://...",
    "caption": "Video caption...",
    "duration": 15.5,
    "width": 1080,
    "height": 1920
  }
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Rate Limiting (optional)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000

# Instagram API Configuration
ENABLE_WEBPAGE_SCRAPING=true
ENABLE_GRAPHQL_API=true
```

### Rate Limiting

The application includes built-in rate limiting to prevent abuse:

- **Default**: 100 requests per 15 minutes per IP
- **Configurable**: Modify `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS`

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── components/            # React components
├── features/              # Feature modules
│   └── instagram/         # Instagram integration
├── lib/                   # Utilities and helpers
├── services/              # External service integrations
└── types/                 # TypeScript type definitions
```

## 🛡️ Error Handling

The application provides detailed error messages for different scenarios:

- **401 Unauthorized**: Content requires Instagram authentication
- **403 Forbidden**: Content is private or not available
- **404 Not Found**: Content doesn't exist or has been deleted
- **429 Too Many Requests**: Rate limit exceeded

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

```bash
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

This tool is for educational purposes only. Please respect Instagram's Terms of Service and only download content you have permission to access. The developers are not responsible for any misuse of this application.

## 🔗 Related Links

- [Instagram Terms of Service](https://help.instagram.com/581066165581870)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 📞 Support

If you encounter issues:

1. Check the error messages for guidance
2. Verify the Instagram URL is accessible in a browser
3. Ensure the content is from a public account
4. Try again later if rate limited

For technical issues, please open an issue on GitHub with:
- The Instagram URL you're trying to access
- The error message you're receiving
- Your browser and operating system
