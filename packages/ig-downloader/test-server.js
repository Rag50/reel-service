import express from 'express';
import { instagramVideoGET } from './dist/server.js';

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
    console.log('🔍 Request received:', {
      method: req.method,
      url: req.url,
      query: req.query,
      headers: req.headers
    });

    const url = new URL(req.url, `http://${req.headers.host}`);
    console.log('🔗 Constructed URL:', url.toString());
    
    const request = new Request(url.toString(), {
      method: req.method,
      headers: req.headers,
    });
    
    console.log('📡 Calling instagramVideoGET...');
    const response = await instagramVideoGET(request);
    console.log('📥 Response received:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    const data = await response.json();
    console.log('📄 Response data:', data);
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('❌ API Error Details:');
    console.error('  Error name:', error.name);
    console.error('  Error message:', error.message);
    console.error('  Error stack:', error.stack);
    console.error('  Full error object:', error);
    
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Serve a simple HTML page for testing
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Instagram Video Downloader - Test</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                border-radius: 12px;
                padding: 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                color: #333;
                margin-bottom: 30px;
            }
            .form-group {
                margin-bottom: 20px;
            }
            label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
                color: #555;
            }
            input[type="url"] {
                width: 100%;
                padding: 12px;
                border: 2px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
            }
            input[type="url"]:focus {
                outline: none;
                border-color: #667eea;
            }
            button {
                background: #667eea;
                color: white;
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            }
            button:hover {
                background: #5a6fd8;
            }
            button:disabled {
                background: #ccc;
                cursor: not-allowed;
            }
            .result {
                margin-top: 20px;
                padding: 15px;
                border-radius: 6px;
                display: none;
            }
            .success {
                background: #d4edda;
                border: 1px solid #c3e6cb;
                color: #155724;
            }
            .error {
                background: #f8d7da;
                border: 1px solid #f5c6cb;
                color: #721c24;
            }
            .loading {
                text-align: center;
                color: #666;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Instagram Video Downloader</h1>
            <p style="text-align: center; color: #666; margin-bottom: 30px;">
                Test the standalone Instagram downloader package
            </p>
            
            <div class="form-group">
                <label for="urlInput">Instagram URL:</label>
                <input 
                    type="url" 
                    id="urlInput" 
                    placeholder="https://www.instagram.com/reel/EXAMPLE_ID/"
                >
            </div>
            
            <div class="form-group">
                <button id="downloadBtn">Download Video</button>
            </div>
            
            <div id="result" class="result"></div>
        </div>

        <script>
            const urlInput = document.getElementById('urlInput');
            const downloadBtn = document.getElementById('downloadBtn');
            const resultDiv = document.getElementById('result');

            function showResult(message, isError = false) {
                resultDiv.textContent = message;
                resultDiv.className = 'result ' + (isError ? 'error' : 'success');
                resultDiv.style.display = 'block';
            }

            function showLoading() {
                resultDiv.innerHTML = '<div class="loading">Processing...</div>';
                resultDiv.className = 'result';
                resultDiv.style.display = 'block';
            }

            downloadBtn.addEventListener('click', async () => {
                const url = urlInput.value.trim();
                
                if (!url) {
                    showResult('Please enter a valid Instagram URL', true);
                    return;
                }

                downloadBtn.disabled = true;
                downloadBtn.textContent = 'Processing...';
                showLoading();

                try {
                    const response = await fetch('/api/instagram-video?postUrl=' + encodeURIComponent(url));
                    const data = await response.json();

                    if (data.status === 'error') {
                        throw new Error(data.message);
                    }

                    showResult('Success! Video URL: ' + data.data.videoUrl);
                    
                    // Optionally trigger download
                    const downloadLink = document.createElement('a');
                    downloadLink.href = data.data.videoUrl;
                    downloadLink.download = data.data.filename;
                    downloadLink.textContent = 'Click here to download';
                    downloadLink.style.display = 'block';
                    downloadLink.style.marginTop = '10px';
                    downloadLink.style.color = '#667eea';
                    downloadLink.style.textDecoration = 'none';
                    
                    resultDiv.appendChild(downloadLink);
                    
                } catch (error) {
                    showResult('Error: ' + error.message, true);
                } finally {
                    downloadBtn.disabled = false;
                    downloadBtn.textContent = 'Download Video';
                }
            });

            // Allow Enter key to submit
            urlInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    downloadBtn.click();
                }
            });
        </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log('🚀 Instagram Downloader Test Server Running!');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/instagram-video`);
  console.log('\n📝 Test Instructions:');
  console.log('1. Open http://localhost:3001 in your browser');
  console.log('2. Paste an Instagram reel or post URL');
  console.log('3. Click "Download Video" to test the API');
  console.log('4. Check the console for detailed logs');
  console.log('\n⚠️  Note: Due to Instagram restrictions, some content may not be accessible');
}); 