import glossaryData from '../data/glossary.json';
import blogData from '../data/blog.json';

export type ContentMode = 'puppies' | 'studs' | 'glossary' | 'standards' | 'didyouknow';
export type FramePreset = 'minimal' | 'arch' | 'editorial' | 'sage';
export type CanvasRatio = 'feed' | 'story' | 'square';
export type BgStyle =
  | 'photo'
  | 'cream-editorial'
  | 'forest-luxe'
  | 'blush-botanical'
  | 'warm-sand'
  | 'sage-mist';
export type PillStyle =
  | 'none-dark'
  | 'none-light'
  | 'cream'
  | 'sage'
  | 'gold'
  | 'terracotta'
  | 'blush'
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
  { label: string; bg1: string; bg2: string; accent: string; darkText: boolean }
> = {
  photo: { label: '📷 Photo Background', bg1: '#EFECE4', bg2: '#EFECE4', accent: '#2E5A44', darkText: true },
  'cream-editorial': {
    label: '🌿 Botanical Cream',
    bg1: '#FBF9F4',
    bg2: '#EFEAE0',
    accent: '#2E5A44',
    darkText: true
  },
  'forest-luxe': {
    label: '🌲 Deep Forest',
    bg1: '#244736',
    bg2: '#172E23',
    accent: '#F4D37E',
    darkText: false
  },
  'blush-botanical': {
    label: '🌸 Soft Rose Editorial',
    bg1: '#FDF3F2',
    bg2: '#F5DFDC',
    accent: '#8C2F2B',
    darkText: true
  },
  'warm-sand': {
    label: '☀️ Sunlit Champagne',
    bg1: '#FAF3E3',
    bg2: '#EFE2C6',
    accent: '#D46A4E',
    darkText: true
  },
  'sage-mist': {
    label: '🍃 Sage Mist',
    bg1: '#EAF2ED',
    bg2: '#D5E5DC',
    accent: '#2E5A44',
    darkText: true
  }
};

export const STAMP_BADGES: { id: string; text: string; pill: PillStyle }[] = [
  { id: 'stamp-new', text: '✨ NEW LITTER', pill: 'gold' },
  { id: 'stamp-avail', text: '🌿 AVAILABLE NOW', pill: 'sage' },
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
    badge: '🥩 NUTRITION PROTOCOL',
    title: 'Why We Love Raw & Whole Nutrition',
    body: 'Clean nutrition supports shinier coats, firmer stools, calmer skin, and stronger immune systems from weaning onward.',
    footer: 'Lifetime Breeder Support • OKCFrenchies.com',
    bgStyle: 'cream-editorial',
    shareUrl: 'https://okcfrenchies.com/buyer-education'
  },
  ...(blogData as any[]).map((b) => ({
    id: `blog-${b.id}`,
    badge: `📖 JOURNAL • ${String(b.category || 'BREEDER NOTES').toUpperCase()}`,
    title: b.title,
    body:
      (b.summary || '').length > 155 ? `${b.summary.slice(0, 152).trim()}...` : b.summary || '',
    footer: 'Read Full Guide at OKCFrenchies.com',
    bgStyle: b.image ? ('photo' as BgStyle) : ('forest-luxe' as BgStyle),
    image: b.image || '',
    shareUrl: `https://okcfrenchies.com/french-bulldog-breeding-blog?post=${encodeURIComponent(b.id)}`
  }))
];

export const DID_YOU_KNOW_ITEMS: TopicCardItem[] = [
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
  canvasH: number
): TextLayer[] => {
  const isDarkBg = !BG_STYLES[item.bgStyle].darkText;
  const centerY = Math.round(canvasH * 0.5);

  return [
    {
      id: 'badge',
      label: 'Top Badge',
      visible: true,
      text: item.badge,
      x: 540,
      y: centerY - 270,
      fontSize: 24,
      pillWidth: 520,
      padY: 14,
      pill: isDarkBg ? 'gold' : 'sage',
      font: 'sans'
    },
    {
      id: 'headline',
      label: 'Headline',
      visible: true,
      text: item.title,
      x: 540,
      y: centerY - 85,
      fontSize: 58,
      pillWidth: 880,
      padY: 14,
      pill: isDarkBg ? 'none-light' : 'none-dark',
      font: 'serif'
    },
    {
      id: 'body',
      label: 'Explanation Box',
      visible: true,
      text: item.body,
      x: 540,
      y: centerY + 135,
      fontSize: 31,
      pillWidth: 860,
      padY: 28,
      pill: isDarkBg ? 'frosted' : 'cream',
      font: 'sans'
    },
    {
      id: 'footer',
      label: 'Bottom Callout',
      visible: true,
      text: item.footer,
      x: 540,
      y: canvasH - 120,
      fontSize: 23,
      pillWidth: 680,
      padY: 14,
      pill: isDarkBg ? 'cream' : 'terracotta',
      font: 'sans'
    },
    {
      id: 'handle',
      label: '@okcfrenchies',
      visible: true,
      text: '@okcfrenchies',
      x: 540,
      y: 95,
      fontSize: 22,
      pillWidth: 250,
      padY: 10,
      pill: isDarkBg ? 'none-light' : 'none-dark',
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
