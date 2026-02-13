import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { q } = req.query;
    
    // This grabs the key securely from the server environment
    const API_KEY = process.env.GIPHY_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        // We call Giphy from the server, so the user never sees the key
        const giphyRes = await fetch(`https://api.giphy.com/v1/stickers/search?api_key=${API_KEY}&q=${q}&limit=12&rating=g&lang=en`);
        const data = await giphyRes.json();
        
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch stickers' });
    }
}