export const config = {
  api: {
    bodyParser: false, // Essential for streaming binary data
  },
};

export default async function handler(req, res) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  try {
    // 2. Pipe the raw request stream to PhotoRoom
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        // Force octet-stream so PhotoRoom knows this is raw image data
        'Content-Type': 'application/octet-stream',
        'Accept': 'image/png'
      },
      body: req,
      // @ts-ignore - Required for streaming bodies in Node.js 18+
      duplex: 'half' 
    });

    // 3. Handle PhotoRoom errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error("PhotoRoom API Error:", errorText);
      return res.status(response.status).json({ error: `PhotoRoom: ${errorText}` });
    }

    // 4. Return the image buffer back to the browser
    const imageBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(imageBuffer));

  } catch (error: any) {
    console.error("API Handler Error:", error);
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}
