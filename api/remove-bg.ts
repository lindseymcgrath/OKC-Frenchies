
export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Use Environment Variable, fallback to the provided key for preview/testing if env is missing
  const API_KEY = process.env.PHOTOROOM_API_KEY || "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Server Configuration Error: Missing API Key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await req.formData();
    const image = formData.get('image_file');

    if (!image) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Construct request to PhotoRoom
    const photoroomData = new FormData();
    photoroomData.append('image_file', image);
    photoroomData.append('format', 'png');

    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
      },
      body: photoroomData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `PhotoRoom API Error: ${errorText}` }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return the binary image directly
    return new Response(response.body, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: `Internal Server Error: ${error.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
