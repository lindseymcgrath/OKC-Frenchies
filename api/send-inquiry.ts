import { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests from your Supabase Webhook
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { record } = req.body; // Supabase sends the new row data here

  try {
    const data = await resend.emails.send({
      from: 'OKC Frenchies <info@okcfrenchies.com>',
      to: ['info@okcfrenchies.com'], // 🔥 YOUR ACTUAL EMAIL HERE
      subject: `New Inquiry: ${record.full_name}`,
      html: `
        <h1>New Lead Received</h1>
        <p><strong>Name:</strong> ${record.full_name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Phone:</strong> ${record.phone}</p>
        <p><strong>Interest:</strong> ${record.interest}</p>
        <p><strong>Dog:</strong> ${record.selected_dog}</p>
        <p><strong>Message:</strong> ${record.message}</p>
      `
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error });
  }
}