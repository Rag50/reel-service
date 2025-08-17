# Copy-Paste Instagram Downloader Component

This is a single, self-contained React component that you can copy and paste into any React project. **No external dependencies required** except React!

## 📋 How to Use

### 1. Copy the Component
Simply copy the entire `InstagramDownloader.tsx` file into your project.

### 2. Import and Use
```jsx
// In your React component or page
import InstagramDownloader from './InstagramDownloader';

function App() {
  return (
    <div className="App">
      <h1>My Instagram Downloader</h1>
      <InstagramDownloader />
    </div>
  );
}

export default App;
```

### 3. That's it! 
No additional dependencies to install, no package management needed.

## 🎨 Customization Examples

### Basic Usage
```jsx
<InstagramDownloader />
```

### Custom Styling
```jsx
<InstagramDownloader
  placeholder="Enter Instagram URL here..."
  buttonText="Download Video"
  loadingText="Processing..."
  className="my-custom-container"
  inputClassName="my-input-style"
  buttonClassName="my-button-style"
/>
```

### With Callbacks
```jsx
<InstagramDownloader
  config={{
    onDownloadStart: (url) => {
      console.log('Starting download:', url);
      // Show loading toast
    },
    onDownloadComplete: (result) => {
      if (result.success) {
        alert('Download completed!');
      }
    },
    onDownloadError: (error) => {
      console.error('Download failed:', error);
      // Show error message
    }
  }}
/>
```

### Hide Instructions
```jsx
<InstagramDownloader
  showInstructions={false}
/>
```

## 🚀 Features

- ✅ **Zero Dependencies**: Only requires React
- ✅ **Complete Functionality**: Downloads Instagram reels and posts
- ✅ **Multiple URL Formats**: Supports posts, reels, and share links
- ✅ **Error Handling**: Built-in validation and error messages
- ✅ **Loading States**: Shows loading indicators during download
- ✅ **Customizable**: Style it however you want
- ✅ **TypeScript**: Full type safety included
- ✅ **Self-Contained**: Everything in one file

## 📱 Supported URLs

- `https://www.instagram.com/p/ABC123/`
- `https://www.instagram.com/reel/ABC123/`
- `https://www.instagram.com/reels/ABC123/`
- `https://www.instagram.com/share/ABC123/`

## ⚠️ Important Notes

1. **CORS Limitations**: This works in the browser but may encounter CORS issues with some Instagram URLs. For production, consider using a proxy server.

2. **Browser Only**: This component uses browser APIs (`fetch`, `Blob`, etc.) and won't work in server-side rendering without modifications.

3. **Instagram Changes**: If Instagram changes their page structure or API, the component might need updates.

## 🎯 Perfect For

- Quick prototypes
- Personal projects
- Adding download functionality to existing apps
- When you don't want to manage external dependencies
- Learning how Instagram downloaders work

Just copy, paste, and you're ready to download Instagram content! 🎉 