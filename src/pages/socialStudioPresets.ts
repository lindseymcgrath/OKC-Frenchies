import glossaryData from '../data/glossary.json';
import blogData from '../data/blog.json';

export type ContentMode = 'puppies' | 'studs' | 'glossary' | 'standards' | 'didyouknow';
export type BuiltInBrandThemeId = 'sunlit-garden' | 'raw-and-paw' | 'k9ss';
export type BrandThemeId = string;
export type FramePreset =
  | 'minimal'
  | 'arch'
  | 'cameo'
  | 'editorial'
  | 'sage'
  | 'keyhole'
  | 'filmstrip'
  | 'apothecary'
  | 'split-header'
  | 'stud-crest'
  | 'magazine'
  | 'lookbook'
  | 'coastal'
  | 'rp-showroom'
  | 'rp-product-spotlight'
  | 'rp-protocol-stack'
  | 'rp-naturals-pedestal'
  | 'rp-clinical-dossier'
  | 'rp-bento-grid'
  | 'k9ss-athlete-stage'
  | 'k9ss-red-brutalist'
  | 'k9ss-titanium-pedestal'
  | 'k9ss-lineup-bento'
  | 'no-photo';
export type TextCardTheme =
  | 'arch-crest'
  | 'magazine-border'
  | 'cameo-medallion'
  | 'ribbon-banner'
  | 'split-quote'
  | 'minimal-luxe';
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
  | 'berry-wine'
  | 'coastal-sky'
  | 'butcher-crimson'
  | 'kraft-parchment'
  | 'marrow-amber'
  | 'pasture-green'
  | 'obsidian-carbon'
  | 'cyber-teal'
  | 'titanium-ice'
  | 'igniter-red'
  | 'trophy-gold'
  | 'rp-warm-stone'
  | 'rp-charcoal-stage'
  | 'rp-clinical-ice'
  | 'rp-naturals-linen'
  | 'rp-amber-pedestal'
  | 'k9ss-steel'
  | 'k9ss-crimson'
  | 'k9ss-titanium';
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
  | 'coastal'
  | 'frosted'
  | 'kraft'
  | 'crimson'
  | 'amber'
  | 'pasture'
  | 'obsidian'
  | 'cyber-teal'
  | 'titanium'
  | 'igniter-red'
  | 'trophy-gold'
  | 'rp-hotspot'
  | 'rp-clinical'
  | 'rp-orange'
  | 'k9ss-crimson'
  | 'k9ss-hotspot';
export type FontKind = 'sans' | 'serif' | 'serif-italic';
export type OverlayShape = 'circle' | 'rounded' | 'arch' | 'polaroid' | 'square' | 'cutout';

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
  pillOpacity?: number;
  customPillColor?: string;
  textColor?: string;
  font: FontKind;
  zIndex?: number;
}

export interface PhotoOverlayLayer {
  id: string;
  label: string;
  visible: boolean;
  mediaType?: 'image' | 'video';
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: OverlayShape;
  borderColor: string;
  borderWidth: number;
  opacity: number;
  rotation: number;
  zoom: number;
  panX: number;
  panY: number;
  shadow: boolean;
  zIndex: number;
}

export interface DogRecord {
  id: string;
  name: string;
  status?: string;
  dna?: string;
  dna_technical?: string;
  description?: string;
  customQuote?: string;
  isCustom?: boolean;
  breed?: string;
  gender?: string;
  image?: string;
  media?: { type: string; url: string }[];
  category: 'Puppy' | 'Stud';
}

export interface SlideState {
  id: string;
  brandTheme?: BrandThemeId;
  preset: FramePreset;
  textCardTheme?: TextCardTheme;
  bgStyle: BgStyle;
  windowStyle?: BgStyle;
  customBgColor?: string;
  customWindowColor?: string;
  dogId?: string;
  customPhotoDogId?: string;
  slideMode?: ContentMode;
  topicId?: string;
  photoSrc: string;
  videoSrc?: string;
  videoMuted?: boolean;
  photoFit?: 'cover' | 'contain';
  productId?: string;
  photoDim: number;
  panX: number;
  panY: number;
  zoom: number;
  archHeight: number;
  layers: TextLayer[];
  photoOverlays?: PhotoOverlayLayer[];
}

export interface ProductShowcaseItem {
  id: string;
  brandTheme: 'raw-and-paw' | 'k9ss';
  divisionLabel: string;
  name: string;
  shortName: string;
  tagline: string;
  price: string;
  servings: string;
  imageSrc: string;
  hotspot1: string;
  hotspot2: string;
  clinicalSpec: string;
  ctaText: string;
  defaultPreset: FramePreset;
}

export interface SavedLayoutPreset {
  id: string;
  name: string;
  brandTheme?: BrandThemeId;
  preset: FramePreset;
  textCardTheme?: TextCardTheme;
  bgStyle: BgStyle;
  windowStyle?: BgStyle;
  customBgColor?: string;
  customWindowColor?: string;
  photoDim: number;
  archHeight: number;
  layers: (Omit<TextLayer, 'text'> & { sampleText?: string })[];
  photoOverlays?: PhotoOverlayLayer[];
}

export interface BrandThemeKit {
  id: BrandThemeId;
  name: string;
  shortName: string;
  icon: string;
  tagline: string;
  handle: string;
  contactText: string;
  nutritionText: string;
  lookbookLabel: string;
  magazineMasthead: string;
  defaultPuppyPreset: FramePreset;
  defaultPuppyBg: BgStyle;
  defaultPuppyWindow: BgStyle;
  defaultStudPreset: FramePreset;
  defaultStudBg: BgStyle;
  defaultStudWindow: BgStyle;
  defaultTopicBg: BgStyle;
  defaultTopicWindow: BgStyle;
  defaultTopicTheme: TextCardTheme;
  defaultBgSwatches: BgStyle[];
  defaultPillPalette: PillStyle[];
  featuredTemplates: FramePreset[];
  customBgHex?: string;
  customWindowHex?: string;
  isCustom?: boolean;
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
    swatch: '#E8DFCE',
    bg1: '#EDE4D3',
    bg2: '#DFD3BE',
    cardBg: '#EAE0CE',
    matOuter: '#D8C9B0',
    border: '#CBBBA0',
    accent: '#2E5A44',
    darkText: true
  },
  'oat-latte': {
    label: '🧸 Lilac Taupe',
    swatch: '#B59E99',
    bg1: '#C7B4AF',
    bg2: '#A8918C',
    cardBg: '#CEBDB8',
    matOuter: '#9E8782',
    border: '#967F7A',
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
    label: '🌿 Olive Sage',
    swatch: '#8B9D83',
    bg1: '#9EAD97',
    bg2: '#7F9177',
    cardBg: '#ACBA9F',
    matOuter: '#788A70',
    border: '#6E8067',
    accent: '#1C2621',
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
    label: '🌊 French Slate',
    swatch: '#5A7385',
    bg1: '#688295',
    bg2: '#4B6273',
    cardBg: '#5A7385',
    matOuter: '#435868',
    border: 'rgba(246,244,238,0.34)',
    accent: '#F4D37E',
    darkText: false
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
  },
  'coastal-sky': {
    label: '🌊 Coastal Sky',
    swatch: '#DCE8F0',
    bg1: '#E3EEF5',
    bg2: '#C7DAE6',
    cardBg: '#FAF8F3',
    matOuter: '#B3C9D8',
    border: '#BDD0DC',
    accent: '#234152',
    darkText: true
  },
  // --- RAW & PAW CO. SIGNATURE PALETTE ---
  'butcher-crimson': {
    label: '🥩 Butcher Crimson',
    swatch: '#7A231D',
    bg1: '#852821',
    bg2: '#4E1410',
    cardBg: '#7A231D',
    matOuter: '#4E1410',
    border: 'rgba(239,227,206,0.36)',
    accent: '#D8973C',
    darkText: false
  },
  'kraft-parchment': {
    label: '📜 Raw Parchment',
    swatch: '#EFE3CE',
    bg1: '#F3E9D7',
    bg2: '#E2D1B5',
    cardBg: '#EFE3CE',
    matOuter: '#D6C2A3',
    border: '#CBB594',
    accent: '#7A231D',
    darkText: true
  },
  'marrow-amber': {
    label: '🍯 Colostrum Amber',
    swatch: '#D8973C',
    bg1: '#E3A74E',
    bg2: '#B97A24',
    cardBg: '#DF9F44',
    matOuter: '#A66C1C',
    border: '#9A6216',
    accent: '#2B1B12',
    darkText: true
  },
  'pasture-green': {
    label: '🌱 Pasture Herb',
    swatch: '#2D4C39',
    bg1: '#355A44',
    bg2: '#1D3326',
    cardBg: '#2D4C39',
    matOuter: '#1A2D21',
    border: 'rgba(239,227,206,0.34)',
    accent: '#D8973C',
    darkText: false
  },
  // --- K9SS (K9 SUPER SUPPLEMENTS) SIGNATURE PALETTE ---
  'obsidian-carbon': {
    label: '⚡ Obsidian Carbon',
    swatch: '#11161B',
    bg1: '#171E26',
    bg2: '#090C10',
    cardBg: '#11161B',
    matOuter: '#070A0D',
    border: 'rgba(14,165,233,0.35)',
    accent: '#F5B841',
    darkText: false
  },
  'cyber-teal': {
    label: '🧪 Bio-Teal',
    swatch: '#0F766E',
    bg1: '#14887F',
    bg2: '#0B554F',
    cardBg: '#0F766E',
    matOuter: '#09433E',
    border: 'rgba(245,184,65,0.4)',
    accent: '#F5B841',
    darkText: false
  },
  'titanium-ice': {
    label: '🔬 Lab Titanium',
    swatch: '#EDF2F7',
    bg1: '#F4F7FB',
    bg2: '#DCE5EF',
    cardBg: '#EDF2F7',
    matOuter: '#CBD5E1',
    border: '#B8C6D6',
    accent: '#0F766E',
    darkText: true
  },
  'igniter-red': {
    label: '🔥 Igniter Red',
    swatch: '#B91C1C',
    bg1: '#C82222',
    bg2: '#7F1D1D',
    cardBg: '#B91C1C',
    matOuter: '#6D1717',
    border: 'rgba(245,184,65,0.4)',
    accent: '#F5B841',
    darkText: false
  },
  'trophy-gold': {
    label: '🏆 Trophy Gold',
    swatch: '#F5B841',
    bg1: '#F7C45D',
    bg2: '#D99B26',
    cardBg: '#F5B841',
    matOuter: '#C48A1E',
    border: '#B07914',
    accent: '#11161B',
    darkText: true
  },
  'rp-warm-stone': {
    label: '🪨 Warm Stone',
    swatch: '#ECEAE4',
    bg1: '#EFECE6',
    bg2: '#E2DFD7',
    cardBg: '#ECEAE4',
    matOuter: '#DDD9D0',
    border: '#CFCBC1',
    accent: '#00ADC7',
    darkText: true
  },
  'rp-charcoal-stage': {
    label: '🏁 Charcoal Stage',
    swatch: '#14161B',
    bg1: '#181B22',
    bg2: '#0E1014',
    cardBg: '#14161B',
    matOuter: '#0B0D11',
    border: 'rgba(255,138,0,0.38)',
    accent: '#FF8A00',
    darkText: false
  },
  'rp-clinical-ice': {
    label: '🧪 Clinical Pedestal',
    swatch: '#E6F4F7',
    bg1: '#F3FAFB',
    bg2: '#E2F2F5',
    cardBg: '#F3FAFB',
    matOuter: '#CBEBF0',
    border: '#B5E2EA',
    accent: '#00ADC7',
    darkText: true
  },
  'rp-naturals-linen': {
    label: '🧡 Naturals Linen',
    swatch: '#F5EFE6',
    bg1: '#F8F3EC',
    bg2: '#EBE2D5',
    cardBg: '#F5EFE6',
    matOuter: '#E4D8C7',
    border: '#DFCEB7',
    accent: '#FF8A00',
    darkText: true
  },
  'rp-amber-pedestal': {
    label: '🍊 Amber Pedestal',
    swatch: '#F9EFE0',
    bg1: '#FFF9F0',
    bg2: '#F6E8D3',
    cardBg: '#FFF9F0',
    matOuter: '#F2DEC0',
    border: '#E9CEAA',
    accent: '#C96400',
    darkText: true
  },
  'k9ss-steel': {
    label: '⚙️ K9SS Steel',
    swatch: '#14171E',
    bg1: '#181C24',
    bg2: '#0F1117',
    cardBg: '#14171E',
    matOuter: '#0B0D11',
    border: '#2C313E',
    accent: '#D32F2F',
    darkText: false
  },
  'k9ss-crimson': {
    label: '🚨 K9SS Crimson',
    swatch: '#D32F2F',
    bg1: '#D32F2F',
    bg2: '#9A1B1B',
    cardBg: '#D32F2F',
    matOuter: '#7F1515',
    border: 'rgba(255,255,255,0.28)',
    accent: '#FFFFFF',
    darkText: false
  },
  'k9ss-titanium': {
    label: '🛡️ K9SS Titanium',
    swatch: '#E2E7EE',
    bg1: '#EEF1F5',
    bg2: '#D6DCE6',
    cardBg: '#EEF1F5',
    matOuter: '#C4CCD9',
    border: '#B5BFCE',
    accent: '#D32F2F',
    darkText: true
  }
};

export const BUILT_IN_BRAND_THEMES: BrandThemeKit[] = [
  {
    id: 'sunlit-garden',
    name: 'Sunlit Garden (OKC)',
    shortName: 'Sunlit Garden',
    icon: '🌿',
    tagline: 'Cream, olive sage, emerald & warm gold boutique aesthetics',
    handle: '@okcfrenchies',
    contactText: 'Text 405.300.8482 • OKCFrenchies.com',
    nutritionText: '🥩 Fed Raw Diet + Bovine Plasma • RawAndPawCo.com',
    lookbookLabel: 'OKC FRENCHIES • LOOKBOOK',
    magazineMasthead: 'THE FRENCHIE',
    defaultPuppyPreset: 'arch',
    defaultPuppyBg: 'sage-mist',
    defaultPuppyWindow: 'cream-editorial',
    defaultStudPreset: 'cameo',
    defaultStudBg: 'forest-luxe',
    defaultStudWindow: 'cream-editorial',
    defaultTopicBg: 'forest-luxe',
    defaultTopicWindow: 'cream-editorial',
    defaultTopicTheme: 'arch-crest',
    defaultBgSwatches: [
      'cream-editorial',
      'sage-mist',
      'forest-luxe',
      'pure-white',
      'oat-latte',
      'espresso-mocha',
      'gold-luxe',
      'terracotta-clay',
      'blush-botanical',
      'warm-sand',
      'berry-wine',
      'coastal-sky',
      'charcoal-ink'
    ],
    defaultPillPalette: [
      'white',
      'cream',
      'gold',
      'sage',
      'sage-mist',
      'oat',
      'champagne',
      'mocha',
      'terracotta',
      'blush',
      'berry',
      'coastal',
      'charcoal',
      'frosted',
      'none-dark',
      'none-light'
    ],
    featuredTemplates: [
      'arch',
      'cameo',
      'editorial',
      'sage',
      'stud-crest',
      'filmstrip',
      'lookbook',
      'apothecary',
      'split-header',
      'magazine',
      'coastal',
      'minimal',
      'no-photo'
    ]
  },
  {
    id: 'raw-and-paw',
    name: 'Raw & Paw Co.',
    shortName: 'Raw & Paw',
    icon: '🥩',
    tagline: 'Warm stone, championship charcoal, clinical teal & naturals amber',
    handle: '@rawandpawco',
    contactText: 'SHOP PROTOCOL • RAWANDPAW.COM',
    nutritionText: 'HEAVY HITTER® • GOAT BREW™ • OMEGA MANIA™',
    lookbookLabel: 'RAW & PAW // CHAMPION NUTRITION',
    magazineMasthead: 'RAW & PAW',
    defaultPuppyPreset: 'rp-showroom',
    defaultPuppyBg: 'rp-warm-stone',
    defaultPuppyWindow: 'rp-charcoal-stage',
    defaultStudPreset: 'rp-protocol-stack',
    defaultStudBg: 'rp-warm-stone',
    defaultStudWindow: 'pure-white',
    defaultTopicBg: 'rp-charcoal-stage',
    defaultTopicWindow: 'rp-clinical-ice',
    defaultTopicTheme: 'ribbon-banner',
    defaultBgSwatches: [
      'rp-warm-stone',
      'rp-charcoal-stage',
      'rp-clinical-ice',
      'rp-naturals-linen',
      'rp-amber-pedestal',
      'pure-white',
      'butcher-crimson',
      'kraft-parchment',
      'pasture-green',
      'marrow-amber'
    ],
    defaultPillPalette: [
      'rp-hotspot',
      'rp-clinical',
      'rp-orange',
      'obsidian',
      'cyber-teal',
      'amber',
      'crimson',
      'kraft',
      'pasture',
      'white',
      'charcoal',
      'frosted',
      'none-dark',
      'none-light'
    ],
    featuredTemplates: [
      'rp-showroom',
      'rp-product-spotlight',
      'rp-protocol-stack',
      'rp-naturals-pedestal',
      'rp-clinical-dossier',
      'rp-bento-grid',
      'minimal',
      'no-photo'
    ]
  },
  {
    id: 'k9ss',
    name: 'K9SS Performance',
    shortName: 'K9SS',
    icon: '⚡',
    tagline: 'Obsidian carbon, K9SS crimson, steel panel & titanium pedestal',
    handle: '@k9supersupplements',
    contactText: 'SHOP K9SS PRO • RAWANDPAW.COM',
    nutritionText: 'WEIGHT GAINER • JOINT SUPPORT • SUPER MULTI • PUPPY FORMULA',
    lookbookLabel: 'K9 SUPER SUPPLEMENTS',
    magazineMasthead: 'K9SS PRO',
    defaultPuppyPreset: 'k9ss-athlete-stage',
    defaultPuppyBg: 'obsidian-carbon',
    defaultPuppyWindow: 'k9ss-steel',
    defaultStudPreset: 'k9ss-red-brutalist',
    defaultStudBg: 'k9ss-steel',
    defaultStudWindow: 'obsidian-carbon',
    defaultTopicBg: 'obsidian-carbon',
    defaultTopicWindow: 'k9ss-titanium',
    defaultTopicTheme: 'split-quote',
    defaultBgSwatches: [
      'obsidian-carbon',
      'k9ss-steel',
      'k9ss-crimson',
      'k9ss-titanium',
      'cyber-teal',
      'igniter-red',
      'trophy-gold',
      'pure-white'
    ],
    defaultPillPalette: [
      'k9ss-crimson',
      'k9ss-hotspot',
      'obsidian',
      'titanium',
      'igniter-red',
      'cyber-teal',
      'trophy-gold',
      'white',
      'charcoal',
      'frosted',
      'none-dark',
      'none-light'
    ],
    featuredTemplates: [
      'k9ss-athlete-stage',
      'k9ss-red-brutalist',
      'k9ss-titanium-pedestal',
      'k9ss-lineup-bento',
      'minimal',
      'no-photo'
    ]
  }
];

export const BRAND_PRODUCT_CATALOG: ProductShowcaseItem[] = [
  {
    id: 'rp-heavy-hitter',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // PERFORMANCE',
    name: 'Heavy Hitter® Muscle & Mass',
    shortName: 'Heavy Hitter',
    tagline: '60 Servings • Championship K9 Mass & Frame Builder',
    price: '$44.99',
    servings: '60 Servings',
    imageSrc: '/images/products/rp-heavy-hitter.png',
    hotspot1: '+ Dense Muscle & Chest Width',
    hotspot2: '+ 73% Protein Amino Matrix',
    clinicalSpec: '100% Human-Grade • Zero Soy, Wheat or Fillers',
    ctaText: 'SHOP HEAVY HITTER → RAWANDPAW.COM',
    defaultPreset: 'rp-showroom'
  },
  {
    id: 'rp-goat-brew',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // NATURALS',
    name: 'Goat Brew™ Probiotic Goat Milk',
    shortName: 'Goat Brew',
    tagline: '60 Servings • Creamy Probiotic Hydration Topper',
    price: '$29.99',
    servings: '60 Servings',
    imageSrc: '/images/products/rp-goat-brew.png',
    hotspot1: '+ 5 Billion CFU Live Probiotics',
    hotspot2: '+ Whole Cream Goat Milk Hydration',
    clinicalSpec: 'Gut Flora • Gentle Digestion • Picky Eater Magic',
    ctaText: 'SHOP GOAT BREW → RAWANDPAW.COM',
    defaultPreset: 'rp-naturals-pedestal'
  },
  {
    id: 'rp-omega-mania',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // NATURALS',
    name: 'Omega Mania™ 4-Oil Skin & Coat',
    shortName: 'Omega Mania',
    tagline: '16 fl oz • Cold-Pressed Four-Oil Show Coat Elixir',
    price: '$29.99',
    servings: '16 fl oz Cold-Pressed',
    imageSrc: '/images/products/rp-omega-mania.png',
    hotspot1: '+ Mirror-Gloss Show Coat Shine',
    hotspot2: '+ Wild Salmon + Krill + Hemp + MCT',
    clinicalSpec: 'EPA / DHA / GLA Cold-Pressed Barrier Formula',
    ctaText: 'SHOP OMEGA MANIA → RAWANDPAW.COM',
    defaultPreset: 'rp-naturals-pedestal'
  },
  {
    id: 'rp-bovine-plasma',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // CLINICAL 80/10/10',
    name: 'Pure Bovine Plasma IgG Powder',
    shortName: 'Bovine Plasma',
    tagline: '60 Servings • Concentrated Immunoglobulins & Gut Repair',
    price: '$39.99',
    servings: '60 Servings',
    imageSrc: '/images/products/rp-bovine-plasma.webp',
    hotspot1: '+ Active IgG Immunoglobulins',
    hotspot2: '+ Gut Barrier & Post-Litter Recovery',
    clinicalSpec: '80%+ Bioactive Serum Protein • Vet-Trusted Recovery',
    ctaText: 'SHOP BOVINE PLASMA → RAWANDPAW.COM',
    defaultPreset: 'rp-clinical-dossier'
  },
  {
    id: 'rp-gentlemans-litter',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // BREEDER RESERVE',
    name: "Gentleman's Litter™ Stud & Whelp",
    shortName: "Gentleman's Litter",
    tagline: 'Breeder Reserve • Peak Stud Motility & Litter Vitality',
    price: '$49.99',
    servings: 'Breeder Reserve',
    imageSrc: '/images/products/rp-gentlemans-litter.png',
    hotspot1: '+ Peak Stud Motility & Stamina',
    hotspot2: '+ Heavy Bone & Litter Vitality',
    clinicalSpec: 'Clinical Breeder Formula • Formulated in USA',
    ctaText: 'SHOP BREEDER RESERVE → RAWANDPAW.COM',
    defaultPreset: 'rp-protocol-stack'
  },
  {
    id: 'rp-working-dog-stack',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // PACK DROP™ BUNDLE',
    name: 'Championship Working Dog Stack',
    shortName: 'Working Dog Stack',
    tagline: 'Heavy Hitter® + Omega Mania™ • Mass & Show Coat Duo',
    price: '$67.99',
    servings: '2-Part Stack • Save 15%',
    imageSrc: '/images/products/rp-working-dog-stack.webp',
    hotspot1: '+ Lean Muscle + Mirror Coat Gloss',
    hotspot2: '+ Save 15% Bundle Protocol',
    clinicalSpec: '2-Part Daily Championship Stack • Earn 100 Pts',
    ctaText: 'BUILD YOUR STACK → RAWANDPAW.COM',
    defaultPreset: 'rp-bento-grid'
  },
  {
    id: 'rp-gut-health-stack',
    brandTheme: 'raw-and-paw',
    divisionLabel: 'RAW & PAW // PACK DROP™ BUNDLE',
    name: 'Total Gut & Immunity Stack',
    shortName: 'Gut Health Stack',
    tagline: 'Goat Brew™ + Pure Bovine Plasma • Complete Microbiome Reset',
    price: '$64.99',
    servings: '2-Part Stack • Save 15%',
    imageSrc: '/images/products/rp-gut-health-stack.webp',
    hotspot1: '+ 5B Probiotics + IgG Plasma',
    hotspot2: '+ Firm Stool & Nutrient Absorption',
    clinicalSpec: 'Complete Microbiome & Immune Barrier Protocol',
    ctaText: 'SHOP GUT STACK → RAWANDPAW.COM',
    defaultPreset: 'rp-product-spotlight'
  },
  {
    id: 'k9ss-weight-gainer',
    brandTheme: 'k9ss',
    divisionLabel: 'K9 SUPER SUPPLEMENTS // ATHLETE',
    name: 'K9SS Weight Gainer',
    shortName: 'K9SS Weight Gainer',
    tagline: '60 Servings • High-Calorie Tri-Protein Mass Matrix',
    price: '$39.99',
    servings: '60 Servings',
    imageSrc: '/images/products/k9ss-weight-gainer.png',
    hotspot1: '+ 75% Protein + 20% Fat Mass Matrix',
    hotspot2: '+ Egg + Beef + Whey Tri-Protein',
    clinicalSpec: 'Rapid Conditioning & Thick Chest Width • Zero Soy',
    ctaText: 'SHOP K9SS GAINER → RAWANDPAW.COM',
    defaultPreset: 'k9ss-athlete-stage'
  },
  {
    id: 'k9ss-joint-support',
    brandTheme: 'k9ss',
    divisionLabel: 'K9 SUPER SUPPLEMENTS // MOBILITY',
    name: 'K9SS Joint Support',
    shortName: 'K9SS Joint Support',
    tagline: '60 Servings • Heavy-Load Hip, Cartilage & Tendon Defense',
    price: '$39.99',
    servings: '60 Servings',
    imageSrc: '/images/products/k9ss-joint-support.png',
    hotspot1: '+ Glucosamine + MSM + Chondroitin',
    hotspot2: '+ Hyaluronic Acid + Green-Lipped Mussel',
    clinicalSpec: 'Heavy-Load Cartilage & Joint Shock Protection',
    ctaText: 'SHOP K9SS JOINTS → RAWANDPAW.COM',
    defaultPreset: 'k9ss-red-brutalist'
  },
  {
    id: 'k9ss-multivitamin',
    brandTheme: 'k9ss',
    divisionLabel: 'K9 SUPER SUPPLEMENTS // VITALS',
    name: 'K9SS Super MultiVitamin',
    shortName: 'K9SS MultiVitamin',
    tagline: '60 Servings • 13 Whole Superfoods & Smoked Pork Liver',
    price: '$39.99',
    servings: '60 Servings',
    imageSrc: '/images/products/k9ss-multivitamin.png',
    hotspot1: '+ 13 Whole Superfoods + Smoked Liver',
    hotspot2: '+ Spirulina + Kelp + Colostrum + CoQ10',
    clinicalSpec: 'Daily Cellular Immunity, Coat & Organ Support',
    ctaText: 'SHOP K9SS MULTI → RAWANDPAW.COM',
    defaultPreset: 'k9ss-titanium-pedestal'
  },
  {
    id: 'k9ss-puppy-formula',
    brandTheme: 'k9ss',
    divisionLabel: 'K9 SUPER SUPPLEMENTS // PUPPY PRO',
    name: 'K9SS Puppy Formula',
    shortName: 'K9SS Puppy Formula',
    tagline: '60 Servings • 8 Weeks to 12 Months Growth & Immune Matrix',
    price: '$39.99',
    servings: '60 Servings',
    imageSrc: '/images/products/k9ss-puppy-formula.png',
    hotspot1: '+ Goat Milk + Colostrum + Egg Yolk',
    hotspot2: '+ Bone Density & Immune Foundation',
    clinicalSpec: 'Precision Skeletal Development & Gut Protection',
    ctaText: 'SHOP K9SS PUPPY → RAWANDPAW.COM',
    defaultPreset: 'k9ss-titanium-pedestal'
  },
  {
    id: 'k9ss-full-lineup',
    brandTheme: 'k9ss',
    divisionLabel: 'K9 SUPER SUPPLEMENTS // PRO ARSENAL',
    name: 'K9SS Full Athlete 4-Bag Lineup',
    shortName: 'K9SS 4-Bag Lineup',
    tagline: 'Complete System • Gainer + Joint + Multi + Puppy Formula',
    price: '$129.99',
    servings: 'Full 4-Bag System',
    imageSrc: '/images/products/k9ss-full-lineup.webp',
    hotspot1: '+ Weight Gainer + Joint + Multi + Puppy',
    hotspot2: '+ Complete Kennel Performance System',
    clinicalSpec: 'Engineered for Working Dogs, Show Bullies & Kennels',
    ctaText: 'SHOP FULL LINEUP → RAWANDPAW.COM',
    defaultPreset: 'k9ss-lineup-bento'
  }
];

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
  mode?: ContentMode,
  textTheme: TextCardTheme = 'arch-crest',
  themeKit?: BrandThemeKit
): TextLayer[] => {
  const handleText = themeKit?.handle || '@okcfrenchies';
  const surfaceStyle = windowStyle || item.bgStyle;
  const isDarkSurface = !(BG_STYLES[surfaceStyle] || BG_STYLES['cream-editorial']).darkText;
  const centerY = Math.round(canvasH * 0.5);
  const baseNone: PillStyle = isDarkSurface ? 'none-light' : 'none-dark';

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
        ? 'white'
        : 'cream';

  const footerPill: PillStyle = isDarkSurface
    ? 'cream'
    : mode === 'standards'
      ? 'mocha'
      : 'terracotta';

  // Pure Editorial / Un-Pilled Typography Styles for Magazine, Minimal Luxe & Split Quote
  if (textTheme === 'magazine-border' || textTheme === 'minimal-luxe') {
    const accentColor = isDarkSurface ? '#F4D37E' : '#2E5A44';
    const subColor = isDarkSurface ? '#FAF7F0' : '#3B2B23';
    const isMinimal = textTheme === 'minimal-luxe';
    return [
      {
        id: 'handle',
        label: handleText,
        visible: true,
        text: handleText,
        x: 540,
        y: isMinimal ? 110 : 146,
        fontSize: 21,
        pillWidth: 260,
        padY: 8,
        pill: baseNone,
        textColor: accentColor,
        font: 'sans'
      },
      {
        id: 'badge',
        label: 'Top Badge',
        visible: true,
        text: item.badge,
        x: 540,
        y: centerY - 265,
        fontSize: 23,
        pillWidth: 640,
        padY: 10,
        pill: isMinimal ? baseNone : badgePill,
        textColor: isMinimal ? '#D46A4E' : undefined,
        font: 'sans'
      },
      {
        id: 'headline',
        label: 'Headline',
        visible: true,
        text: item.title,
        x: 540,
        y: centerY - 95,
        fontSize: 60,
        pillWidth: 820,
        padY: 12,
        pill: baseNone,
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
        pillWidth: 790,
        padY: 18,
        pill: baseNone,
        textColor: subColor,
        font: isMinimal ? 'serif-italic' : 'sans'
      },
      {
        id: 'footer',
        label: 'Bottom Callout',
        visible: true,
        text: item.footer,
        x: 540,
        y: canvasH - (isMinimal ? 115 : 155),
        fontSize: 21,
        pillWidth: 720,
        padY: 10,
        pill: baseNone,
        textColor: accentColor,
        font: 'sans'
      }
    ];
  }

  if (textTheme === 'split-quote') {
    return [
      {
        id: 'handle',
        label: handleText,
        visible: true,
        text: handleText,
        x: 540,
        y: 112,
        fontSize: 21,
        pillWidth: 260,
        padY: 8,
        pill: 'none-light',
        textColor: '#F4D37E',
        font: 'sans'
      },
      {
        id: 'badge',
        label: 'Top Badge',
        visible: true,
        text: item.badge,
        x: 540,
        y: 205,
        fontSize: 23,
        pillWidth: 560,
        padY: 12,
        pill: 'gold',
        font: 'sans'
      },
      {
        id: 'headline',
        label: 'Headline',
        visible: true,
        text: item.title,
        x: 540,
        y: Math.round(canvasH * 0.31),
        fontSize: 54,
        pillWidth: 840,
        padY: 12,
        pill: 'none-light',
        textColor: '#FFFFFF',
        font: 'serif'
      },
      {
        id: 'body',
        label: 'Explanation Box',
        visible: true,
        text: item.body,
        x: 540,
        y: Math.round(canvasH * 0.64),
        fontSize: 30,
        pillWidth: 800,
        padY: 22,
        pill: baseNone,
        font: 'sans'
      },
      {
        id: 'footer',
        label: 'Bottom Callout',
        visible: true,
        text: item.footer,
        x: 540,
        y: canvasH - 135,
        fontSize: 21,
        pillWidth: 680,
        padY: 12,
        pill: footerPill,
        font: 'sans'
      }
    ];
  }

  if (textTheme === 'ribbon-banner') {
    return [
      {
        id: 'badge',
        label: 'Top Badge',
        visible: true,
        text: item.badge,
        x: 540,
        y: 132,
        fontSize: 24,
        pillWidth: 620,
        padY: 13,
        pill: 'gold',
        font: 'sans'
      },
      {
        id: 'handle',
        label: handleText,
        visible: true,
        text: handleText,
        x: 540,
        y: 235,
        fontSize: 21,
        pillWidth: 260,
        padY: 8,
        pill: baseNone,
        font: 'sans'
      },
      {
        id: 'headline',
        label: 'Headline',
        visible: true,
        text: item.title,
        x: 540,
        y: centerY - 95,
        fontSize: 56,
        pillWidth: 820,
        padY: 14,
        pill: baseNone,
        font: 'serif'
      },
      {
        id: 'body',
        label: 'Explanation Box',
        visible: true,
        text: item.body,
        x: 540,
        y: centerY + 135,
        fontSize: 29,
        pillWidth: 800,
        padY: 26,
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
        padY: 13,
        pill: footerPill,
        font: 'sans'
      }
    ];
  }

  // 'arch-crest' & 'cameo-medallion'
  const isCameo = textTheme === 'cameo-medallion';
  return [
    {
      id: 'badge',
      label: 'Top Badge',
      visible: true,
      text: item.badge,
      x: 540,
      y: centerY - (isCameo ? 235 : 255),
      fontSize: 23,
      pillWidth: isCameo ? 480 : 540,
      padY: 13,
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
      fontSize: isCameo ? 52 : 56,
      pillWidth: isCameo ? 740 : 820,
      padY: 14,
      pill: baseNone,
      font: 'serif'
    },
    {
      id: 'body',
      label: 'Explanation Box',
      visible: true,
      text: item.body,
      x: 540,
      y: centerY + 130,
      fontSize: isCameo ? 28 : 30,
      pillWidth: isCameo ? 730 : 810,
      padY: isCameo ? 22 : 28,
      pill: isCameo ? baseNone : bodyPill,
      font: 'sans'
    },
    {
      id: 'footer',
      label: 'Bottom Callout',
      visible: true,
      text: item.footer,
      x: 540,
      y: canvasH - (isCameo ? 185 : 135),
      fontSize: 21,
      pillWidth: isCameo ? 580 : 680,
      padY: 13,
      pill: footerPill,
      font: 'sans'
    },
    {
      id: 'handle',
      label: handleText,
      visible: true,
      text: handleText,
      x: 540,
      y: isCameo ? 185 : 118,
      fontSize: 21,
      pillWidth: 250,
      padY: 8,
      pill: baseNone,
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
