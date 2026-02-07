export const config = {
  api: {
    bodyParser: false, 
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const API_KEY = "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  try {
    // 1. Convert the incoming stream into a Buffer (image data)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    // 2. Create a FormData "package" that PhotoRoom expects
    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image_file', blob, 'image.png');

    // 3. Send the package to PhotoRoom
    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 
        'x-api-key': API_KEY,
        // Don't set Content-Type manually here; fetch will set the multipart boundary for us
      },
      body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: `PhotoRoom: ${errorText}` });
    }

    const resultBuffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).send(Buffer.from(resultBuffer));

  } catch (error: any) {
    console.error("API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
