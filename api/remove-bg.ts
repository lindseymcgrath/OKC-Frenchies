import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase inside the API
// Use placeholders to prevent "supabaseUrl is required" error if env vars are missing during build
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // 2. Identify the User (passed from your frontend header)
  const userEmail = req.headers['x-user-email'];
  const API_KEY = "sk_pr_default_26c40acfb6c6c60c9c7dea41f57253103e7dc3eb";

  if (!userEmail) {
    return res.status(401).json({ error: 'User email is required to verify credits.' });
  }

  // Double check that we have a valid Supabase connection before proceeding
  // Only if NOT guest
  if (userEmail !== 'guest' && !process.env.VITE_SUPABASE_URL) {
     console.error("Missing VITE_SUPABASE_URL environment variable");
     return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 3. CREDIT CHECK: Ask Supabase if this user has credits
    // SKIP IF GUEST
    if (userEmail !== 'guest') {
        const { data: profile, error: fetchError } = await supabase
          .from('user_credits')
          .select('credits_remaining, subscription_end')
          .eq('email', userEmail)
          .single();

        if (fetchError || !profile) {
          // Handle case where user might not exist yet - optional: auto-create? 
          // For now, return error
          return res.status(404).json({ error: 'User profile not found.' });
        }

        const isSubscribed = profile.subscription_end && new Date(profile.subscription_end) > new Date();
        
        // If no credits and not subscribed, block the request
        if (profile.credits_remaining <= 0 && !isSubscribed) {
          return res.status(402).json({ error: 'Insufficient credits. Please refill.' });
        }

        // 4. DEDUCT CREDIT: If not a subscriber, take 1 credit away now
        if (!isSubscribed) {
          await supabase
            .from('user_credits')
            .update({ credits_remaining: profile.credits_remaining - 1 })
            .eq('email', userEmail);
        }
    }

    // 5. PROCEED TO PHOTOROOM (Your existing logic)
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const imageBuffer = Buffer.concat(chunks);

    const formData = new FormData();
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    formData.append('image_file', blob, 'image.png');

    const response = await fetch('https://sdk.photoroom.com/v1/segment', {
      method: 'POST',
      headers: { 
        'x-api-key': API_KEY,
      },
      body: formData,
      // @ts-ignore
      duplex: 'half'
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
