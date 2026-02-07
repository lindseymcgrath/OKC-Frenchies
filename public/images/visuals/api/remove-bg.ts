export const config = {
  api: {
    bodyParser: false, // Essential for the Direct Pipe stream
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  try {
    // This takes the RAW data coming from useStudioLogic 
    // and sends it straight to PhotoRoom.
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 
        'x-api-key': API_KEY,
        'Content-Type': 'application/octet-stream' 
      },
      body: req, // THE DIRECT PIPE
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("PhotoRoom API Error:", errorText);
        return res.status(response.status).json({ error: `PhotoRoom: ${errorText}` });
    }

    const buffer = await response.arrayBuffer();
    
    // Return the clean image back to the browser
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(buffer));

  } catch (error: any) {
    console.error("Vercel API Handler Error:", error);
    return res.status(500).json({ error: `Server Error: ${error.message}` });
  }
}