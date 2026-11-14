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

const formatProductContext = (prod, heading = 'Primary Featured Product') => {
  if (!prod || !prod.id) return '';
  const brandLabel =
    prod.brandTheme === 'k9ss' || prod.category === 'k9ss'
      ? 'K9 Super Supplements'
      : 'Raw & Paw Naturals / Raw & Paw Co.';
  const statsText = Array.isArray(prod.stats)
    ? prod.stats
        .filter((s) => s && (s.val || s.label))
        .map((s) => `${s.val || ''} ${s.label || ''}`.trim())
        .join(', ')
    : '';
  const highlights = [prod.hotspot1, prod.hotspot2].filter(Boolean).join(' | ');
  const directUrl = prod.shopifyHandle
    ? `RawAndPawCo.com/products/${prod.shopifyHandle}`
    : 'RawAndPawCo.com';

  return [
    `${heading}:`,
    `- Brand: ${brandLabel}`,
    prod.divisionLabel ? `- Division: ${prod.divisionLabel}` : '',
    prod.name ? `- Product Name: ${prod.name}` : '',
    prod.category ? `- Category: ${prod.category}` : '',
    prod.price ? `- Price: ${prod.price}` : '',
    prod.servings ? `- Servings / Pack Size: ${prod.servings}` : '',
    prod.tagline ? `- Tagline: ${prod.tagline}` : '',
    highlights ? `- Highlights: ${highlights}` : '',
    prod.clinicalSpec ? `- Clinical / Ingredient Spec: ${prod.clinicalSpec}` : '',
    prod.benefits ? `- Benefits: ${prod.benefits}` : '',
    prod.feedingNote ? `- Feeding / Dosing: ${prod.feedingNote}` : '',
    statsText ? `- Stats: ${statsText}` : '',
    `- Direct URL: ${directUrl}`
  ]
    .filter(Boolean)
    .join('\n');
};

const buildProductSystemRules = (primaryProd, extraProds = [], fallbackBrandTheme = 'raw-and-paw') => {
  const allProds = [primaryProd, ...(Array.isArray(extraProds) ? extraProds : [])].filter(
    (p) => p && p.id
  );
  const isK9 = primaryProd?.id
    ? primaryProd.brandTheme === 'k9ss' || primaryProd.category === 'k9ss'
    : fallbackBrandTheme === 'k9ss';

  const brandIdentity = isK9
    ? 'K9 Super Supplements (@k9supersupplements / @rawandpawco on RawAndPawCo.com) — clinical & performance canine nutrition.'
    : 'Raw & Paw Co. / Raw & Paw Naturals (@rawandpawco on RawAndPawCo.com) — holistic canine nutrition, raw diets, stacks & functional toppers.';

  const hasRaw = allProds.some((p) => p.category === 'raw');
  const hasStack = allProds.some((p) => p.category === 'stacks');
  const hasPouchOrBottle = allProds.some(
    (p) => p.category === 'naturals' || p.category === 'k9ss'
  );

  const promoRules = [];
  if (allProds.length > 0) {
    if (hasRaw) {
      promoRules.push(
        '- Shipping & purity: Highlight that Order by Sunday night -> Ships Frozen Tuesday on dry ice with FREE shipping, and highlight USDA Non-HPP purity.'
      );
    } else {
      promoRules.push(
        '- Shipping rule: NEVER mention frozen Tuesday dry-ice shipping or frozen raw chub cases for this product.'
      );
    }

    if (hasStack) {
      promoRules.push(
        '- Stack promo: Highlight that this complete synergistic protocol stack already includes 20% bundle savings built in on RawAndPawCo.com.'
      );
    }

    if (hasPouchOrBottle) {
      promoRules.push(
        '- Pouch/bottle promo: Mention naturally that shoppers can mix & match any 2+ pouches/bottles to save 20% automatically on RawAndPawCo.com.'
      );
    } else {
      promoRules.push(
        '- Pouch promo rule: Do NOT mention "2+ pouches for 20% off" because no individual pouch/bottle is featured.'
      );
    }
  } else {
    promoRules.push(
      '- When mentioning promos: Mix & match any 2+ pouches/bottles saves 20% on RawAndPawCo.com; frozen raw cases ship every Tuesday when ordered by Sunday night.'
    );
  }

  const shopUrl = primaryProd?.shopifyHandle
    ? `RawAndPawCo.com/products/${primaryProd.shopifyHandle}`
    : 'RawAndPawCo.com';

  const hashtagRule = isK9
    ? '- End captions with 5-8 relevant hashtags tailored to THIS specific product and K9SS brand (include #k9supersupplements #rawandpaw and tags specific to the product).'
    : '- End captions with 5-8 relevant hashtags tailored to THIS specific product and Raw & Paw brand (include #rawandpaw #rawandpawnaturals and tags specific to the product).';

  return [
    `You create bold, authoritative, high-engagement Instagram & Facebook content for ${brandIdentity}`,
    'Strict brand & accuracy rules:',
    '- Write strictly about the exact featured product(s) and/or topic provided. NEVER mention OKC Frenchies, puppy sales, stud services, 405.300.8482, info@okcfrenchies.com, OKCFrenchies.com, or flight nannies.',
    '- NEVER invent or mix in unrelated catalog ingredients (do NOT mention 80/10/10 raw meat ratios, bovine plasma, goat milk, or mushrooms unless explicitly present in the provided product facts or slide copy).',
    ...promoRules,
    `- Include an engaging opening hook or question that drives comments, saves, or shares, weave in the exact product name${primaryProd?.price ? ` (${primaryProd.price}${primaryProd.servings ? `, ${primaryProd.servings}` : ''})` : ''}, real clinical/nutritional specs, and the exact shop link: ${shopUrl}.`,
    hashtagRule
  ].join('\n');
};

export async function generateCaptionPayload(body = {}, env = process.env) {
  const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || env.API_KEY;
  const {
    mode = 'caption',
    brandTheme = 'sunlit-garden',
    brandName = '',
    contentMode = 'puppies',
    dog = {},
    product = null,
    additionalProducts = [],
    topic = null,
    slideCopy = [],
    category = 'did-you-know',
    prompt = ''
  } = body || {};

  if (!apiKey) {
    const err = new Error('Missing GEMINI_API_KEY in environment variables.');
    err.statusCode = 503;
    throw err;
  }

  const extraProds = Array.isArray(additionalProducts) ? additionalProducts : [];
  const isProductBrand =
    brandTheme === 'raw-and-paw' ||
    brandTheme === 'k9ss' ||
    Boolean(product && product.id);
  const brandRules = isProductBrand
    ? buildProductSystemRules(product, extraProds, brandTheme)
    : BASE_BRAND_RULES;

  const ai = new GoogleGenAI({ apiKey });

  if (mode === 'card') {
    const footerHandle = isProductBrand
      ? product?.brandTheme === 'k9ss' || brandTheme === 'k9ss'
        ? '@k9supersupplements'
        : '@rawandpawco'
      : '@okcfrenchies';
    const cardInstruction = [
      brandRules,
      '',
      'Return ONLY valid JSON matching this exact shape:',
      '{',
      '  "badge": "Short uppercase pill tag with emoji, e.g. 💡 DID YOU KNOW? or 🧐 MYTH VS FACT",',
      '  "headline": "Scroll-stopping 4 to 9 word headline for the Instagram image card",',
      '  "body": "Clear, punchy 1 to 2 sentence explanation (max 155 characters) easy to read on mobile",',
      `  "footer": "Short interactive callout for bottom pill, e.g. Drop your guess below! 👇 • ${footerHandle}",`,
      '  "caption": "Complete ready-to-post Instagram caption expanding on the card with a comment hook, shop/contact CTA matching brand rules, and hashtags"',
      '}'
    ].join('\n');

    const defaultCardDirection = isProductBrand
      ? brandTheme === 'k9ss' || product?.brandTheme === 'k9ss'
        ? 'Share a science-backed K9 Super Supplements canine performance, joint, recovery, or clinical dosing insight.'
        : 'Share a helpful, save-worthy canine raw nutrition, digestive enzyme, immune, or skin/coat feeding insight for Raw & Paw Co.'
      : 'Share a surprising, helpful, save-worthy French Bulldog or Mini Bulldog insight, care tip, or fun engagement question.';

    const userMsg = [
      brandName ? `Brand Theme: ${brandName}` : '',
      `Post Category: ${category}`,
      product?.id ? formatProductContext(product) : '',
      `User Topic / Direction: ${prompt || defaultCardDirection}`
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMsg,
      config: {
        systemInstruction: cardInstruction,
        responseMimeType: 'application/json',
        temperature: 0.88
      }
    });

    return parseJsonSafe(response.text);
  }

  if (mode === 'carousel') {
    const slide3End = isProductBrand ? 'Shop RawAndPawCo.com' : 'Text 405.300.8482 • OKCFrenchies.com';
    const slide3Title = isProductBrand
      ? 'Product / Nutrition Takeaway + Question'
      : 'Breeder takeaway / question';
    const carouselInstruction = [
      brandRules,
      '',
      'Return ONLY valid JSON matching this exact shape for a 3-slide swipeable Instagram carousel:',
      '{',
      '  "slides": [',
      '    { "badge": "Slide 1 pill tag", "headline": "Big curiosity hook (4-8 words)", "body": "Short teaser ending with Swipe 👉" },',
      '    { "badge": "Slide 2 pill tag", "headline": "Core insight / breakdown (4-8 words)", "body": "Clear 1-2 sentence explanation (max 155 chars)" },',
      `    { "badge": "Slide 3 pill tag", "headline": "${slide3Title}", "body": "Helpful tip + ${slide3End}" }`,
      '  ],',
      '  "caption": "Complete ready-to-post Instagram carousel caption encouraging swipes, saves, and comments, matching the exact brand rules and hashtags"',
      '}'
    ].join('\n');

    const userMsg = [
      brandName ? `Brand Theme: ${brandName}` : '',
      `Content Mode: ${contentMode}`,
      !isProductBrand && dog?.name
        ? `Dog: ${dog.name} (${dog.breed || 'French Bulldog'}, ${dog.gender || ''}, ${dog.dna || ''})`
        : '',
      product?.id ? formatProductContext(product) : '',
      ...extraProds.map((p, idx) => formatProductContext(p, `Companion Product ${idx + 1} on Slide`)),
      topic?.title ? `Topic: ${topic.title} — ${topic.body || ''}` : '',
      `User Direction: ${prompt || 'Create a high-save 3-slide swipeable carousel!'}`
    ]
      .filter(Boolean)
      .join('\n\n');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMsg,
      config: {
        systemInstruction: carouselInstruction,
        responseMimeType: 'application/json',
        temperature: 0.85
      }
    });

    return parseJsonSafe(response.text);
  }

  // Default: mode === 'caption'
  const systemPrompt = [
    brandRules,
    '- Output ONLY the ready-to-post Instagram caption text, no markdown code fences or intro commentary.'
  ].join('\n');

  const contextLines = [];
  if (isProductBrand) {
    contextLines.push(
      `Content Mode: ${contentMode}`,
      brandName ? `Studio Theme Palette: ${brandName}` : ''
    );
    if (product?.id) {
      contextLines.push(formatProductContext(product, 'Primary Featured Product'));
    }
    extraProds.forEach((p, idx) => {
      const formatted = formatProductContext(p, `Companion Product ${idx + 1} on Slide`);
      if (formatted) contextLines.push(formatted);
    });
    if (topic?.title) {
      contextLines.push(
        [
          'Topic Card Context:',
          `- Card Headline: ${topic.title}`,
          topic.body ? `- Card Summary / Details: ${topic.body}` : '',
          topic.extra ? `- Extra Context: ${topic.extra}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      );
    }
    if (Array.isArray(slideCopy) && slideCopy.length > 0) {
      contextLines.push(
        `Visible Slide Text Layers:\n${slideCopy.map((line) => `- ${line}`).join('\n')}`
      );
    }
  } else if (contentMode === 'puppies' || contentMode === 'studs') {
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
      `- Card Headline: ${topic?.title || ''}`,
      `- Card Summary / Details: ${topic?.body || ''}`,
      topic?.extra ? `- Extra Context: ${topic.extra}` : ''
    );
  }

  contextLines.push(
    '',
    `User Request / Vibe: ${
      prompt ||
      (isProductBrand
        ? 'Write a bold, high-converting caption focused squarely on the featured product specs, benefits, and CTA above!'
        : 'Write a warm, engaging Instagram caption that encourages comments and saves!')
    }`
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
  return { caption: text };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    let body = req.body || {};
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body || '{}');
      } catch {
        body = {};
      }
    }
    const payload = await generateCaptionPayload(body, process.env);
    res.status(200).json(payload);
  } catch (err) {
    console.error('generate-caption error:', err);
    res.status(err?.statusCode || 500).json({ error: err?.message || 'Failed to generate content' });
  }
}
