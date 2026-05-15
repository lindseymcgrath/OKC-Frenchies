import crypto from 'crypto';

const PIXEL_ID = '949488324369648';
// Load from env, fallback to the one provided by user for immediate setup
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || 'EAAmh4JYNQJYBRWZAyHumDdXgF4FdF028NTQZAe9wri5rXZAVTAZCHVfqXDDJx5W2WAdkQ1M2x2swtpjHAObBrpO01qeuldSlKskh3WzPjdcHkehZAQXF1ytZCuvkV7ZAJmmL014kVISF8ISZBZCmWsbqpELDbXSogSly4xNdTnmKZAa0nrEDvvTM1ZC9nt9MEquT1lY2AZDZD';

const hashData = (data: string) => {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
};

export const sendCAPIEvent = async (
  eventName: string,
  userData: { email?: string; phone?: string; clientIp?: string; userAgent?: string; fbp?: string; fbc?: string; }
) => {
  if (!META_ACCESS_TOKEN) {
    console.warn('META_ACCESS_TOKEN not configured. Skipping CAPI.');
    return;
  }

  const payload = {
    data: [
      {
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          em: [hashData(userData.email || '')].filter(Boolean),
          ph: [hashData(userData.phone || '')].filter(Boolean),
          client_ip_address: userData.clientIp,
          client_user_agent: userData.userAgent,
          fbp: userData.fbp,
          fbc: userData.fbc
        }
      }
    ]
  };

  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log(`CAPI Event [${eventName}] response:`, result);
    return result;
  } catch (error) {
    console.error('CAPI Error:', error);
  }
};
