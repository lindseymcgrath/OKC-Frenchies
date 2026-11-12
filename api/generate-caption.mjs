import { GoogleGenAI } from '@google/genai';

const BASE_BRAND_RULES = [
  'You create warm, authoritative, high-engagement Instagram & Facebook content for OKC Frenchies & Mini Bulldogs in Oklahoma City (owners: Lindsey & Eric).',
  'Brand rules:',
  '- NEVER include puppy prices or dollar amounts unless the user explicitly asks for pricing.',
  '- Include an engaging opening hook or question that encourages comments, saves, or shares.',
  '- Always include contact details cleanly near the end of captions: Text Lindsey or Eric at 405.300.8482 (text only), email info@okcfrenchies.com, and OKCFrenchies.com.',
  '- Mention nationwide flight nanny delivery or FaceTime proof-of-life naturally when relevant.',
  '- End captions with 5-8 relevant hashtags (#okcfrenchies #frenchbulldog #minibulldog #oklahomacity #frenchiepuppy #rarefrenchies).'
].join('\n');

const parseJsonSafe = (raw) => {
  const cleaned = String(raw || '')
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();
  return JSON.parse(cleaned);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const apiKey =
      process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;
    const {
      mode = 'caption',
      contentMode = 'puppies',
      dog = {},
      topic = {},
      category = 'did-you-know',
      prompt = ''
    } = req.body || {};

    if (!apiKey) {
      res.status(503).json({
        error: 'Missing GEMINI_API_KEY in environment variables.'
      });
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    if (mode === 'card') {
      const cardInstruction = [
        BASE_BRAND_RULES,
        '',
        'Return ONLY valid JSON matching this exact shape:',
        '{',
        '  "badge": "Short uppercase pill tag with emoji, e.g. 💡 DID YOU KNOW? or 🧐 MYTH VS FACT",',
        '  "headline": "Scroll-stopping 4 to 9 word headline for the Instagram image card",',
        '  "body": "Clear, punchy 1 to 2 sentence explanation (max 155 characters) easy to read on mobile",',
        '  "footer": "Short interactive callout for bottom pill, e.g. Drop your guess below! 👇 • @okcfrenchies",',
        '  "caption": "Complete ready-to-post Instagram caption expanding on the card with a comment hook, contact info, and hashtags"',
        '}'
      ].join('\n');

      const userMsg = [
        `Post Category: ${category}`,
        `User Topic / Direction: ${prompt || 'Share a surprising, helpful, save-worthy French Bulldog or Mini Bulldog insight, care tip, or fun engagement question.'}`
      ].join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: cardInstruction,
          responseMimeType: 'application/json',
          temperature: 0.88
        }
      });

      const parsed = parseJsonSafe(response.text);
      res.status(200).json(parsed);
      return;
    }

    if (mode === 'carousel') {
      const carouselInstruction = [
        BASE_BRAND_RULES,
        '',
        'Return ONLY valid JSON matching this exact shape for a 3-slide swipeable Instagram carousel:',
        '{',
        '  "slides": [',
        '    { "badge": "Slide 1 pill tag", "headline": "Big curiosity hook (4-8 words)", "body": "Short teaser ending with Swipe 👉" },',
        '    { "badge": "Slide 2 pill tag", "headline": "Core insight / breakdown (4-8 words)", "body": "Clear 1-2 sentence explanation (max 155 chars)" },',
        '    { "badge": "Slide 3 pill tag", "headline": "Breeder takeaway / question", "body": "Helpful tip + Text 405.300.8482 • OKCFrenchies.com" }',
        '  ],',
        '  "caption": "Complete ready-to-post Instagram carousel caption encouraging swipes, saves, and comments, with contact info and hashtags"',
        '}'
      ].join('\n');

      const userMsg = [
        `Content Mode: ${contentMode}`,
        dog?.name ? `Dog: ${dog.name} (${dog.breed || 'French Bulldog'}, ${dog.gender || ''}, ${dog.dna || ''})` : '',
        topic?.title ? `Topic: ${topic.title} — ${topic.body || ''}` : '',
        `User Direction: ${prompt || 'Create a high-save 3-slide swipeable carousel!'}`
      ]
        .filter(Boolean)
        .join('\n');

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userMsg,
        config: {
          systemInstruction: carouselInstruction,
          responseMimeType: 'application/json',
          temperature: 0.85
        }
      });

      const parsed = parseJsonSafe(response.text);
      res.status(200).json(parsed);
      return;
    }

    // Default: mode === 'caption'
    const systemPrompt = [
      BASE_BRAND_RULES,
      '- Output ONLY the ready-to-post Instagram caption text, no markdown code fences or intro commentary.'
    ].join('\n');

    const contextLines = [];
    if (contentMode === 'puppies' || contentMode === 'studs') {
      contextLines.push(
        `${contentMode === 'studs' ? 'Stud' : 'Puppy'} Details:`,
        `- Name: ${dog.name || ''}`,
        `- Breed: ${dog.breed || 'French Bulldog'}`,
        `- Sex: ${dog.gender || ''}`,
        dog.age ? `- Age: ${dog.age}` : '',
        `- Status: ${dog.status || (contentMode === 'studs' ? 'Stud Service Available' : 'Available')}`,
        `- Coat / Genetics: ${dog.dna || dog.description || ''}`,
        dog.dna_technical ? `- Technical DNA: ${dog.dna_technical}` : ''
      );
    } else {
      contextLines.push(
        `Post Mode: ${contentMode}`,
        `- Card Headline: ${topic.title || ''}`,
        `- Card Summary / Details: ${topic.body || ''}`,
        topic.extra ? `- Extra Context: ${topic.extra}` : ''
      );
    }

    contextLines.push(
      '',
      `User Request / Vibe: ${prompt || 'Write a warm, engaging Instagram caption that encourages comments and saves!'}`
    );

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextLines.filter(Boolean).join('\n'),
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85
      }
    });

    const text = (response.text || '').trim();
    res.status(200).json({ caption: text });
  } catch (err) {
    console.error('generate-caption error:', err);
    res.status(500).json({ error: err?.message || 'Failed to generate content' });
  }
}
