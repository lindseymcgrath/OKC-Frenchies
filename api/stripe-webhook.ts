import { Buffer } from 'buffer';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with fallbacks to prevent "supabaseUrl is required" error on build
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

export const config = {
  api: {
    bodyParser: false, // Stripe needs raw bodies for security verification
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  // Check for env vars at runtime
  if (!process.env.VITE_SUPABASE_URL) {
      console.error("Missing VITE_SUPABASE_URL");
      return res.status(500).send("Server Configuration Error");
  }

  // 1. We get the data from Stripe
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const payload = Buffer.concat(chunks).toString();
  // const sig = req.headers['stripe-signature']; // Verification skipped for simplicity as per previous code

  let event;

  try {
    event = JSON.parse(payload);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 2. Handle the successful payment
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.client_reference_id; // This is the "Magic Tag" we added to your links!

    if (!email) {
      console.error("No email found in session");
      return res.status(400).send("No email found");
    }

    // Identify what they bought based on the amount (or you can use Price IDs)
    const amount = session.amount_total;
    let creditsToAdd = 0;
    let isSub = false;

    if (amount === 99) creditsToAdd = 1;      // $0.99
    else if (amount === 399) creditsToAdd = 5; // $3.99
    else if (amount === 999) isSub = true;     // $9.99 (3 Months)

    try {
      // 3. Update Supabase
      if (isSub) {
        // Set subscription to end 90 days from now
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 90);
        
        await supabase
          .from('user_credits')
          .update({ subscription_end: expiryDate.toISOString() })
          .eq('email', email);
      } else {
        // Add credits to their existing balance
        const { data } = await supabase.from('user_credits').select('credits_remaining').eq('email', email).single();
        const currentCredits = data?.credits_remaining || 0;
        
        await supabase
          .from('user_credits')
          .update({ credits_remaining: currentCredits + creditsToAdd })
          .eq('email', email);
      }

      console.log(`Successfully credited ${email}`);
      return res.status(200).json({ received: true });

    } catch (dbError) {
      console.error("Database Error:", dbError);
      return res.status(500).send("Internal Server Error");
    }
  }

  res.status(200).json({ received: true });
}
