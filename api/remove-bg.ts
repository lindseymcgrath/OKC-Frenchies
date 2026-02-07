export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  try {
    // Pipe the raw request stream directly to PhotoRoom
    // We assume the client sends the raw image blob
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        // Ensure PhotoRoom treats this as a binary stream upload if supported, 
        // or passes through the client's content-type
        'Content-Type': req.headers['content-type'] || 'application/octet-stream',
        'Accept': 'image/png, application/json'
      },
      body: req, 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("PhotoRoom API Error:", errorText);
      return res.status(response.status).json({ error: `PhotoRoom: ${errorText}` });
    }

    const imageBuffer = await response.arrayBuffer();

    // Return the processed image
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(imageBuffer));

  } catch (error: any) {
    console.error("API Handler Error:", error);
    return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
}