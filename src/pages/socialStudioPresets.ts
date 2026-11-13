import glossaryData from '../data/glossary.json';
import blogData from '../data/blog.json';

export type ContentMode = 'puppies' | 'studs' | 'glossary' | 'standards' | 'didyouknow';
export type FramePreset = 'minimal' | 'arch' | 'cameo' | 'editorial' | 'sage' | 'no-photo';
export type CanvasRatio = 'feed' | 'story' | 'square';
export type BgStyle =
  | 'pure-white'
  | 'cream-editorial'
  | 'oat-latte'
  | 'warm-sand'
  | 'gold-luxe'
  | 'sage-mist'
  | 'forest-luxe'
  | 'espresso-mocha'
  | 'charcoal-ink'
  | 'terracotta-clay'
  | 'blush-botanical'
  | 'berry-wine';
export type PillStyle =
  | 'none-dark'
  | 'none-light'
  | 'white'
  | 'cream'
  | 'oat'
  | 'champagne'
  | 'gold'
  | 'sage-mist'
  | 'sage'
  | 'mocha'
  | 'charcoal'
  | 'terracotta'
  | 'blush'
  | 'berry'
  | 'frosted';
export type FontKind = 'sans' | 'serif' | 'serif-italic';

export interface TextLayer {
  id: string;
  label: string;
  visible: boolean;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  pillWidth: number;
  padY: number;
  pill: PillStyle;
  textColor?: string;
  font: FontKind;
}

export interface DogRecord {
  id: string;
  name: string;
  status?: string;
  dna?: string;
  dna_technical?: string;
  description?: string;
  breed?: string;
  gender?: string;
  image?: string;
  media?: { type: string; url: string }[];
  category: 'Puppy' | 'Stud';
}

export interface SlideState {
  id: string;
  preset: FramePreset;
  bgStyle: BgStyle;
  windowStyle?: BgStyle;
  dogId?: string;
  customPhotoDogId?: string;
  slideMode?: ContentMode;
  topicId?: string;
  photoSrc: string;
  photoDim: number;
  panX: number;
  panY: number;
  zoom: number;
  archHeight: number;
  layers: TextLayer[];
}

export interface SavedLayoutPreset {
  id: string;
  name: string;
  preset: FramePreset;
  bgStyle: BgStyle;
  windowStyle?: BgStyle;
  photoDim: number;
  archHeight: number;
  layers: (Omit<TextLayer, 'text'> & { sampleText?: string })[];
}

export interface TopicCardItem {
  id: string;
  badge: string;
  title: string;
  body: string;
  footer: string;
  bgStyle: BgStyle;
  image?: string;
  shareUrl: string;
}

export const BG_STYLES: Record<
  BgStyle,
  {
    label: string;
    swatch: string;
    bg1: string;
    bg2: string;
    cardBg: string;
    matOuter: string;
    border: string;
    accent: string;
    darkText: boolean;
  }
> = {
  'pure-white': {
    label: '🤍 Crisp White',
    swatch: '#FFFFFF',
    bg1: '#FFFFFF',
    bg2: '#F6F4EE',
    cardBg: '#FFFFFF',
    matOuter: '#FFFFFF',
    border: '#EAE5D9',
    accent: '#2E5A44',
    darkText: true
  },
  'cream-editorial': {
    label: '🌿 Botanical Cream',
    swatch: '#F3EFE6',
    bg1: '#FBF9F4',
    bg2: '#EFEAE0',
    cardBg: '#FBF9F4',
    matOuter: '#EAE3D5',
    border: '#E2DCCD',
    accent: '#2E5A44',
    darkText: true
  },
  'oat-latte': {
    label: '🥛 Warm Oat Latte',
    swatch: '#E8DEC8',
    bg1: '#F5EFE2',
    bg2: '#E6DBC6',
    cardBg: '#FAF6EE',
    matOuter: '#E0D3BA',
    border: '#D5C7B0',
    accent: '#3B2B23',
    darkText: true
  },
  'espresso-mocha': {
    label: '☕ Espresso Mocha',
    swatch: '#3B2B23',
    bg1: '#433128',
    bg2: '#281C16',
    cardBg: '#36261F',
    matOuter: '#241914',
    border: 'rgba(244,211,126,0.34)',
    accent: '#F4D37E',
    darkText: false
  },
  'forest-luxe': {
    label: '🌲 Deep Forest',
    swatch: '#244736',
    bg1: '#244736',
    bg2: '#172E23',
    cardBg: '#1E3B2D',
    matOuter: '#14291E',
    border: 'rgba(244,211,126,0.34)',
    accent: '#F4D37E',
    darkText: false
  },
  'sage-mist': {
    label: '🍃 Sage Mist',
    swatch: '#CFE0D6',
    bg1: '#E2EFE8',
    bg2: '#CBE0D4',
    cardBg: '#ECF5F0',
    matOuter: '#CBE0D4',
    border: '#B8D2C3',
    accent: '#2E5A44',
    darkText: true
  },
  'blush-botanical': {
    label: '🌸 Soft Rose',
    swatch: '#F5DFDC',
    bg1: '#FDF3F2',
    bg2: '#F5DFDC',
    cardBg: '#FDF3F2',
    matOuter: '#EED0CC',
    border: '#EBC6C2',
    accent: '#8C2F2B',
    darkText: true
  },
  'warm-sand': {
    label: '☀️ Sunlit Champagne',
    swatch: '#EFE2C6',
    bg1: '#FAF3E3',
    bg2: '#EFE2C6',
    cardBg: '#FAF3E3',
    matOuter: '#E5D3AE',
    border: '#E2CFA8',
    accent: '#D46A4E',
    darkText: true
  },
  'terracotta-clay': {
    label: '🏺 Warm Terracotta',
    swatch: '#D46A4E',
    bg1: '#D46A4E',
    bg2: '#B8543A',
    cardBg: '#C85E43',
    matOuter: '#B8543A',
    border: 'rgba(255,255,255,0.28)',
    accent: '#F4D37E',
    darkText: false
  },
  'gold-luxe': {
    label: '✨ Warm Gold',
    swatch: '#F4D37E',
    bg1: '#F7DF97',
    bg2: '#EBCB6E',
    cardBg: '#F9E6AC',
    matOuter: '#E5C165',
    border: '#D9B451',
    accent: '#3B2B23',
    darkText: true
  },
  'charcoal-ink': {
    label: '🖤 Charcoal Ink',
    swatch: '#1C2621',
    bg1: '#232F29',
    bg2: '#141C18',
    cardBg: '#1C2621',
    matOuter: '#121815',
    border: 'rgba(244,211,126,0.3)',
    accent: '#F4D37E',
    darkText: false
  },
  'berry-wine': {
    label: '🍷 Deep Berry',
    swatch: '#8C2F2B',
    bg1: '#993530',
    bg2: '#6E221F',
    cardBg: '#8C2F2B',
    matOuter: '#631E1B',
    border: 'rgba(249,228,226,0.34)',
    accent: '#F9E4E2',
    darkText: false
  }
};

export const STAMP_BADGES: { id: string; text: string; pill: PillStyle }[] = [
  { id: 'stamp-new', text: '✨ NEW LITTER', pill: 'gold' },
  { id: 'stamp-avail', text: '🌿 AVAILABLE NOW', pill: 'sage' },
  { id: 'stamp-raw', text: '🥩 FED RAW + BOVINE PLASMA • RAWANDPAWCO.COM', pill: 'mocha' },
  { id: 'stamp-found', text: '🎉 FOUND MY FAMILY!', pill: 'terracotta' },
  { id: 'stamp-reserved', text: '⏳ RESERVED', pill: 'blush' },
  { id: 'stamp-nanny', text: '✈️ FLIGHT NANNY READY', pill: 'cream' },
  { id: 'stamp-facetime', text: '📱 FACETIME READY', pill: 'frosted' },
  { id: 'stamp-stud', text: '👑 STUD SERVICE OPEN', pill: 'gold' },
  { id: 'stamp-guess', text: '💬 GUESS MY COAT! 👇', pill: 'terracotta' },
  { id: 'stamp-caption', text: '😂 CAPTION THIS FACE!', pill: 'gold' },
  { id: 'stamp-swipe', text: 'Swipe 👉', pill: 'frosted' }
];

export const GLOSSARY_ITEMS: TopicCardItem[] = (glossaryData as any[]).map((g, idx) => ({
  id: g.id || `glossary-${idx}`,
  badge: `🧬 ${String(g.category || 'GENETICS').toUpperCase()} • ${g.locus || 'DNA'}`,
  title: `What is "${g.term}"?`,
  body: g.definition || '',
  footer: 'OKCFrenchies.com • Coat & DNA Guide',
  bgStyle: (['cream-editorial', 'forest-luxe', 'blush-botanical', 'sage-mist', 'warm-sand'] as BgStyle[])[
    idx % 5
  ],
  shareUrl: 'https://okcfrenchies.com/french-bulldog-coat-color-genetics'
}));

export const STANDARDS_AND_BLOG_ITEMS: TopicCardItem[] = [
  {
    id: 'std-inhome',
    badge: '🏡 THE OKC STANDARD',
    title: 'Raised Underfoot In Our Home',
    body: 'Never kennels. Every puppy grows up inside our Oklahoma City home with 24/7 neonatal care, household sounds & daily snuggles.',
    footer: 'Text Lindsey or Eric • 405.300.8482',
    bgStyle: 'cream-editorial',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'std-nanny',
    badge: '✈️ NATIONWIDE DELIVERY',
    title: 'Don’t Live in Oklahoma? No Problem!',
    body: 'Our trusted Flight Nanny hand-delivers your puppy in-cabin right to your local airport anywhere in the US.',
    footer: 'FaceTime Meet-and-Greets Available • @okcfrenchies',
    bgStyle: 'sage-mist',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'std-health',
    badge: '🩺 HEALTH IS WEALTH',
    title: '6-Panel Genetic Health Tested',
    body: 'Every parent is 6-panel DNA health cleared via Animal Genetics before ever entering our breeding program.',
    footer: 'OKCFrenchies.com • Health Protocol',
    bgStyle: 'forest-luxe',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-breeding-protocol'
  },
  {
    id: 'std-facetime',
    badge: '📱 SCAM-FREE PROMISE',
    title: 'Always Ask for Live FaceTime!',
    body: 'Before placing a deposit anywhere, ask to see the puppy live on video. We love showing off our babies on FaceTime!',
    footer: 'Text 405.300.8482 to Meet a Pup Live',
    bgStyle: 'warm-sand',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'std-heat',
    badge: '☀️ FRENCHIE CARE 101',
    title: 'Heat Rule: Strictly Indoor Royalty',
    body: 'Flat-faced breeds overheat fast! Keep summer walks short at dawn/dusk and keep that AC cranked.',
    footer: 'Save this tip for summer! 📌 • @okcfrenchies',
    bgStyle: 'blush-botanical',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'std-raw',
    badge: '🥩 RAW & PAW CO. PROTOCOL',
    title: 'Fed Raw Diet + Clinical Bovine Plasma',
    body: 'Every puppy is raised on a raw diet fortified with researched bovine plasma & all-natural supplements you won’t find in big-box stores for gut immunity, joints & coat shine.',
    footer: 'Shop Supplements & Raw Guides • RawAndPawCo.com',
    bgStyle: 'espresso-mocha',
    shareUrl: 'https://rawandpawco.com'
  },
  ...(blogData as any[]).map((b, idx) => ({
    id: `blog-${b.id}`,
    badge: `📖 JOURNAL • ${String(b.category || 'BREEDER NOTES').toUpperCase()}`,
    title: b.title,
    body:
      (b.summary || '').length > 155 ? `${b.summary.slice(0, 152).trim()}...` : b.summary || '',
    footer: 'Read Full Guide at OKCFrenchies.com',
    bgStyle: (['forest-luxe', 'cream-editorial', 'sage-mist'] as BgStyle[])[idx % 3],
    image: b.image || '',
    shareUrl: `https://okcfrenchies.com/french-bulldog-breeding-blog?post=${encodeURIComponent(b.id)}`
  }))
];

export const DID_YOU_KNOW_ITEMS: TopicCardItem[] = [
  {
    id: 'dyk-plasma',
    badge: '🥩 RAW & PAW CO. SCIENCE',
    title: 'Why We Add Bovine Plasma to Every Raw Bowl',
    body: 'Bovine plasma is a heavily researched bioactive protein packed with immunoglobulins that fortify puppy gut immunity, joint cartilage & plush coat shine!',
    footer: 'All-Natural Supplements • RawAndPawCo.com',
    bgStyle: 'espresso-mocha',
    shareUrl: 'https://rawandpawco.com'
  },
  {
    id: 'dyk-1',
    badge: '💡 DID YOU KNOW?',
    title: '“Floodle” Has ZERO Poodle Blood!',
    body: 'That teddy-bear coat is 100% purebred genetics—combining the Fluffy gene (FGF5) with Furnishings (RSPO2).',
    footer: 'Did that surprise you?! Tell us below 👇',
    bgStyle: 'forest-luxe',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-coat-color-genetics'
  },
  {
    id: 'dyk-2',
    badge: '🧐 MYTH VS. FACT',
    title: 'Cream Can Secretly Hide Rare DNA',
    body: 'The Cream gene (e/e) acts like an invisibility cloak—a Cream Frenchie can carry Fluffy, Cocoa, or Pink underneath!',
    footer: 'Save for coat genetics class 📌 • @okcfrenchies',
    bgStyle: 'cream-editorial',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-coat-color-genetics'
  },
  {
    id: 'dyk-3',
    badge: '🩺 SPINE CARE TIP',
    title: 'Couch Ramps Save Frenchie Backs!',
    body: 'Teaching puppies to use stairs or a ramp instead of launching off sofas protects their compact spine & joints for life.',
    footer: 'Does your pup use a ramp or fly?! 😂👇',
    bgStyle: 'sage-mist',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'dyk-4',
    badge: '💬 COMMENT GAME',
    title: 'Smooth Coat vs. Fluffy Coat?',
    body: 'If you had to pick just ONE cuddle buddy for movie night—classic sleek velvet or full fluffy teddy bear?',
    footer: 'Drop TEAM VELVET or TEAM FLUFFY 👇',
    bgStyle: 'warm-sand',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-puppies-for-sale'
  },
  {
    id: 'dyk-5',
    badge: '💡 DID YOU KNOW?',
    title: 'Why Frenchies “Talk” Back to You',
    body: 'Those dramatic yawns, gargles, and chirps were bred into companion bull-baiters over 150 years ago in England & France!',
    footer: 'How dramatic is your dog from 1–10? 😂👇',
    bgStyle: 'blush-botanical',
    shareUrl: 'https://okcfrenchies.com'
  },
  {
    id: 'dyk-6',
    badge: '🧼 WRINKLE CARE 101',
    title: 'Always Dry Between Nose Folds!',
    body: 'Trapped moisture—not dirt—is the #1 cause of tear stains & fold irritation. Wipe gently, then pat 100% dry!',
    footer: 'Save this quick care tip 📌 • @okcfrenchies',
    bgStyle: 'cream-editorial',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  {
    id: 'dyk-7',
    badge: '💬 QUICK POLL',
    title: 'French Bulldog vs. Mini Bulldog?',
    body: 'Bat-eared clown energy or chunky Mini English wrinkle puddle—which personality wins your heart?',
    footer: 'Vote in the comments! 👇 • OKCFrenchies.com',
    bgStyle: 'forest-luxe',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-puppies-for-sale'
  },
  {
    id: 'dyk-8',
    badge: '💡 BREEDER INSIGHT',
    title: 'First 3 Weeks = Sleepless Nights',
    body: 'Every OKC Frenchies litter gets round-the-clock incubator checks, weight tracking, and early scent socialization.',
    footer: 'Raised with heart in OKC 🤍 • 405.300.8482',
    bgStyle: 'sage-mist',
    shareUrl: 'https://okcfrenchies.com/french-bulldog-breeding-protocol'
  }
];

export const buildTopicLayers = (
  item: TopicCardItem,
  canvasH: number,
  windowStyle?: BgStyle,
  mode?: ContentMode
): TextLayer[] => {
  const surfaceStyle = windowStyle || item.bgStyle;
  const isDarkSurface = !(BG_STYLES[surfaceStyle] || BG_STYLES['cream-editorial']).darkText;
  const centerY = Math.round(canvasH * 0.5);

  const badgePill: PillStyle = isDarkSurface
    ? 'gold'
    : mode === 'didyouknow'
      ? 'mocha'
      : mode === 'standards'
        ? 'sage'
        : 'sage';

  const bodyPill: PillStyle = isDarkSurface
    ? 'frosted'
    : mode === 'didyouknow'
      ? 'white'
      : mode === 'glossary'
        ? 'oat'
        : 'cream';

  const footerPill: PillStyle = isDarkSurface
    ? 'cream'
    : mode === 'standards'
      ? 'mocha'
      : 'terracotta';

  return [
    {
      id: 'badge',
      label: 'Top Badge',
      visible: true,
      text: item.badge,
      x: 540,
      y: centerY - 255,
      fontSize: 24,
      pillWidth: 540,
      padY: 14,
      pill: badgePill,
      font: 'sans'
    },
    {
      id: 'headline',
      label: 'Headline',
      visible: true,
      text: item.title,
      x: 540,
      y: centerY - 80,
      fontSize: 56,
      pillWidth: 820,
      padY: 14,
      pill: isDarkSurface ? 'none-light' : 'none-dark',
      font: 'serif'
    },
    {
      id: 'body',
      label: 'Explanation Box',
      visible: true,
      text: item.body,
      x: 540,
      y: centerY + 135,
      fontSize: 30,
      pillWidth: 810,
      padY: 28,
      pill: bodyPill,
      font: 'sans'
    },
    {
      id: 'footer',
      label: 'Bottom Callout',
      visible: true,
      text: item.footer,
      x: 540,
      y: canvasH - 135,
      fontSize: 22,
      pillWidth: 680,
      padY: 14,
      pill: footerPill,
      font: 'sans'
    },
    {
      id: 'handle',
      label: '@okcfrenchies',
      visible: true,
      text: '@okcfrenchies',
      x: 540,
      y: 118,
      fontSize: 22,
      pillWidth: 250,
      padY: 10,
      pill: isDarkSurface ? 'none-light' : 'none-dark',
      font: 'sans'
    }
  ];
};

export const buildTopicCaption = (item: TopicCardItem): string =>
  [
    `${item.badge}`,
    `${item.title}`,
    '',
    item.body,
    '',
    `💬 What do you think—did you already know this, or do you have a Frenchie question you want us to cover next? Drop it below! 👇`,
    '',
    `📲 Text Lindsey or Eric: 405.300.8482`,
    `📩 Email: info@okcfrenchies.com`,
    `🌐 ${item.shareUrl.replace(/^https?:\/\//, '')}`,
    '',
    `#okcfrenchies #frenchbulldog #minibulldog #frenchiegenetics #frenchietips #oklahomacity #rarefrenchies`
  ].join('\n');
