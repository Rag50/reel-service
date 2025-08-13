import { instagramVideoGET } from '../../src/server';

// Example Next.js API route
export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Convert Express request to Fetch API Request
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

// For Next.js App Router
export const GET = async (request: Request) => {
  return instagramVideoGET(request);
}; 