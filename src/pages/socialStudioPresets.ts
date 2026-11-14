import glossaryData from '../data/glossary.json';
import blogData from '../data/blog.json';

export type ContentMode =
  | 'puppies'
  | 'studs'
  | 'glossary'
  | 'standards'
  | 'didyouknow'
  | 'products'
  | 'info'
  | 'customers';
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
  | 'k9ss-poster-cover'
  | 'k9ss-collage-locker'
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
  | 'rp-orange-bold'
  | 'rp-amber-pedestal'
  | 'rp-plasma-pink'
  | 'rp-enzyme-emerald'
  | 'rp-littered-plum'
  | 'k9ss-steel'
  | 'k9ss-crimson'
  | 'k9ss-gold-arena'
  | 'k9ss-royal-cyan'
  | 'k9ss-electric-cyan'
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
  | 'rp-plasma'
  | 'rp-emerald'
  | 'rp-orchid'
  | 'k9ss-crimson'
  | 'k9ss-hotspot'
  | 'k9ss-gold'
  | 'k9ss-royal'
  | 'k9ss-cyan';
export type FontKind = 'sans' | 'serif' | 'serif-italic' | 'condensed' | 'k9ss';
export type OverlayShape = 'circle' | 'rounded' | 'arch' | 'polaroid' | 'square' | 'cutout';
export type TextBoxStyle =
  | 'pill'
  | 'tag'
  | 'outline'
  | 'underline'
  | 'left-bar'
  | 'brutalist'
  | 'glass'
  | 'plain';

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
  boxStyle?: TextBoxStyle;
  pillOpacity?: number;
  textOpacity?: number;
  customPillColor?: string;
  textColor?: string;
  font: FontKind;
  zIndex?: number;
  textAlign?: 'left' | 'center' | 'right';
  pillRadius?: number;
  rotation?: number;
  sublineColor?: string;
  autoText?: string;
}

export type ShapeBlockKind = 'rect' | 'circle' | 'line' | 'grid';

export interface ShapeBlockLayer {
  id: string;
  label: string;
  visible: boolean;
  kind: ShapeBlockKind;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
  topRadius?: number;
  bottomRadius?: number;
  chamfer?: number;
  gridSpacing?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  zIndex?: number;
  shadowColor?: string;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  leftAccentColor?: string;
  leftAccentWidth?: number;
  isHollow?: boolean;
  templateOwned?: boolean;
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
  photoRotation?: number;
  archHeight: number;
  layers: TextLayer[];
  photoOverlays?: PhotoOverlayLayer[];
  blocks?: ShapeBlockLayer[];
  layoutVersion?: number;
}

export interface ProductShowcaseItem {
  id: string;
  brandTheme: 'raw-and-paw' | 'k9ss';
  category?: 'naturals' | 'k9ss' | 'stacks' | 'raw';
  shopifyHandle?: string;
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
  accentColor: string;
  callout?: string;
  benefits?: string;
  feedingNote?: string;
  stats: { val: string; label: string }[];
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
  photoFit?: 'cover' | 'contain';
  zoom?: number;
  panX?: number;
  panY?: number;
  photoRotation?: number;
  archHeight: number;
  layers: (Omit<TextLayer, 'text'> & { sampleText?: string })[];
  photoOverlays?: PhotoOverlayLayer[];
  blocks?: ShapeBlockLayer[];
  isFavorite?: boolean;
  thumbnailUrl?: string;
  ratio?: CanvasRatio;
  cloudId?: string;
  updatedAt?: string;
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
  headingFont?: string;
  bodyFont?: string;
  displayFont?: string;
  swatchColors?: string[];
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
  baseBrandId?: 'sunlit-garden' | 'raw-and-paw' | 'k9ss';
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
    label: '🪨 Championship Stone',
    swatch: '#ECEAE4',
    bg1: '#F2EFE9',
    bg2: '#ECEAE4',
    cardBg: '#FFFFFF',
    matOuter: '#DED9CE',
    border: '#DED9CE',
    accent: '#FF8A00',
    darkText: true
  },
  'rp-charcoal-stage': {
    label: '🏁 Perk Showroom Dark',
    swatch: '#14161B',
    bg1: '#1C2029',
    bg2: '#14161B',
    cardBg: '#14161B',
    matOuter: '#0E1014',
    border: 'rgba(255,138,0,0.42)',
    accent: '#FF8A00',
    darkText: false
  },
  'rp-clinical-ice': {
    label: '🧪 Bold Clinical Teal',
    swatch: '#00ADC7',
    bg1: '#00ADC7',
    bg2: '#007C91',
    cardBg: '#0096AE',
    matOuter: '#005F70',
    border: '#00E5FF',
    accent: '#FFFFFF',
    darkText: false
  },
  'rp-naturals-linen': {
    label: '🌾 Naturals Cream & Orange',
    swatch: '#F5EFE6',
    bg1: '#F5EFE6',
    bg2: '#EDE1CE',
    cardBg: '#FFFFFF',
    matOuter: '#DEC9A8',
    border: '#FF8A00',
    accent: '#FF8A00',
    darkText: true
  },
  'rp-orange-bold': {
    label: '🧡 Naturals Bold Orange',
    swatch: '#FF8A00',
    bg1: '#FF8A00',
    bg2: '#D96200',
    cardBg: '#EA6A00',
    matOuter: '#9A3F00',
    border: '#FFD199',
    accent: '#FFFFFF',
    darkText: false
  },
  'rp-amber-pedestal': {
    label: '🔥 Amber Ochre Gold',
    swatch: '#D97706',
    bg1: '#F59E0B',
    bg2: '#B45309',
    cardBg: '#D97706',
    matOuter: '#92400E',
    border: '#FDE68A',
    accent: '#FFFFFF',
    darkText: false
  },
  'rp-plasma-pink': {
    label: '🌸 Bold Hot Pink',
    swatch: '#EC4899',
    bg1: '#EC4899',
    bg2: '#BE185D',
    cardBg: '#DB2777',
    matOuter: '#9D174D',
    border: '#FBCFE8',
    accent: '#FFFFFF',
    darkText: false
  },
  'rp-enzyme-emerald': {
    label: '🌿 Bold Emerald Green',
    swatch: '#059669',
    bg1: '#10B981',
    bg2: '#047857',
    cardBg: '#059669',
    matOuter: '#065F46',
    border: '#A7F3D0',
    accent: '#FFFFFF',
    darkText: false
  },
  'rp-littered-plum': {
    label: '🪻 Bold Royal Orchid',
    swatch: '#9333EA',
    bg1: '#9333EA',
    bg2: '#6B21A8',
    cardBg: '#7E22CE',
    matOuter: '#581C87',
    border: '#E9D5FF',
    accent: '#FFFFFF',
    darkText: false
  },
  'k9ss-steel': {
    label: '⚙️ K9SS Obsidian & Red',
    swatch: '#0E1014',
    bg1: '#161920',
    bg2: '#0E1014',
    cardBg: '#161920',
    matOuter: '#0B0D11',
    border: '#D32F2F',
    accent: '#D32F2F',
    darkText: false
  },
  'k9ss-crimson': {
    label: '🚨 K9SS Blood Red',
    swatch: '#D32F2F',
    bg1: '#D32F2F',
    bg2: '#8F1616',
    cardBg: '#B91C1C',
    matOuter: '#6E0E0E',
    border: '#FCA5A5',
    accent: '#FFFFFF',
    darkText: false
  },
  'k9ss-gold-arena': {
    label: '🏆 K9SS Trophy Gold',
    swatch: '#D4AF37',
    bg1: '#D4AF37',
    bg2: '#A17C12',
    cardBg: '#C49A22',
    matOuter: '#735A0D',
    border: '#FEF08A',
    accent: '#111317',
    darkText: true
  },
  'k9ss-royal-cyan': {
    label: '💙 K9SS Royal Blue',
    swatch: '#1D4ED8',
    bg1: '#1E3A8A',
    bg2: '#172554',
    cardBg: '#1D4ED8',
    matOuter: '#0F172A',
    border: '#00E5FF',
    accent: '#00E5FF',
    darkText: false
  },
  'k9ss-electric-cyan': {
    label: '⚡ K9SS Electric Cyan',
    swatch: '#00B4D8',
    bg1: '#00B4D8',
    bg2: '#0369A1',
    cardBg: '#0284C7',
    matOuter: '#0C4A6E',
    border: '#BAE6FD',
    accent: '#FFFFFF',
    darkText: false
  },
  'k9ss-titanium': {
    label: '🛡️ K9SS Cool-Steel',
    swatch: '#CBD5E1',
    bg1: '#E2E8F0',
    bg2: '#CBD5E1',
    cardBg: '#F1F5F9',
    matOuter: '#94A3B8',
    border: '#334155',
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
    name: 'Raw & Paw Naturals',
    shortName: 'Raw & Paw',
    icon: '🌿',
    tagline: 'Warm cream linen #F5EFE6, holistic orange #FF8A00 & clinical teal #00ADC7',
    handle: '@rawandpawco',
    contactText: 'SHOP NATURALS • RAWANDPAWCO.COM',
    nutritionText: 'HEAVY HITTER™ • GOAT BREW • PLASMA™ • OMEGA MANIA',
    lookbookLabel: 'RAW & PAW NATURALS // HOLISTIC FORMULAS',
    magazineMasthead: 'RAW & PAW',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    displayFont: 'Barlow Condensed',
    swatchColors: [
      '#F5EFE6',
      '#F6ECDD',
      '#FFFFFF',
      '#FF8A00',
      '#C96400',
      '#00ADC7',
      '#00E5FF',
      '#FF69B4',
      '#10B981',
      '#A855F7',
      '#14161B'
    ],
    defaultPuppyPreset: 'rp-showroom',
    defaultPuppyBg: 'rp-warm-stone',
    defaultPuppyWindow: 'rp-charcoal-stage',
    defaultStudPreset: 'rp-showroom',
    defaultStudBg: 'rp-warm-stone',
    defaultStudWindow: 'rp-charcoal-stage',
    defaultTopicBg: 'rp-orange-bold',
    defaultTopicWindow: 'rp-naturals-linen',
    defaultTopicTheme: 'ribbon-banner',
    defaultBgSwatches: [
      'rp-orange-bold',
      'rp-naturals-linen',
      'rp-clinical-ice',
      'rp-amber-pedestal',
      'rp-charcoal-stage',
      'rp-plasma-pink',
      'rp-enzyme-emerald',
      'rp-littered-plum',
      'rp-warm-stone',
      'pure-white'
    ],
    defaultPillPalette: [
      'rp-orange',
      'rp-hotspot',
      'rp-clinical',
      'rp-plasma',
      'rp-emerald',
      'rp-orchid',
      'amber',
      'obsidian',
      'cyber-teal',
      'white',
      'charcoal',
      'frosted',
      'none-dark',
      'none-light'
    ],
    featuredTemplates: [
      'rp-showroom',
      'rp-bento-grid',
      'rp-protocol-stack',
      'rp-naturals-pedestal',
      'rp-clinical-dossier',
      'rp-product-spotlight',
      'minimal',
      'no-photo'
    ]
  },
  {
    id: 'k9ss',
    name: 'K9 Super Supplements',
    shortName: 'K9SS',
    icon: '⚡',
    tagline: 'Obsidian #0E1014, cool-steel pedestals, blood red #D32F2F, gold #D4AF37 & Plane Crash display type',
    handle: '@k9supersupplements',
    contactText: 'SHOP K9SS PRO • RAWANDPAWCO.COM',
    nutritionText: 'WEIGHT GAINER • JOINT SUPPORT • MULTI-VITAMIN • PUPPY FORMULA',
    lookbookLabel: 'K9 SUPER SUPPLEMENTS',
    magazineMasthead: 'K9SS PRO',
    headingFont: 'Plane Crash',
    bodyFont: 'Plus Jakarta Sans',
    displayFont: 'Plane Crash',
    swatchColors: [
      '#0E1014',
      '#161920',
      '#D32F2F',
      '#EF4444',
      '#D4AF37',
      '#1E3A8A',
      '#00E5FF',
      '#EEF1F5',
      '#FFFFFF'
    ],
    defaultPuppyPreset: 'k9ss-athlete-stage',
    defaultPuppyBg: 'k9ss-steel',
    defaultPuppyWindow: 'k9ss-steel',
    defaultStudPreset: 'k9ss-red-brutalist',
    defaultStudBg: 'k9ss-crimson',
    defaultStudWindow: 'k9ss-steel',
    defaultTopicBg: 'k9ss-crimson',
    defaultTopicWindow: 'k9ss-steel',
    defaultTopicTheme: 'split-quote',
    defaultBgSwatches: [
      'k9ss-steel',
      'k9ss-crimson',
      'k9ss-royal-cyan',
      'k9ss-electric-cyan',
      'k9ss-gold-arena',
      'k9ss-titanium',
      'rp-orange-bold',
      'obsidian-carbon',
      'igniter-red',
      'trophy-gold'
    ],
    defaultPillPalette: [
      'k9ss-crimson',
      'k9ss-hotspot',
      'k9ss-gold',
      'k9ss-royal',
      'k9ss-cyan',
      'rp-orange',
      'obsidian',
      'titanium',
      'igniter-red',
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
      'k9ss-poster-cover',
      'k9ss-collage-locker',
      'minimal',
      'no-photo'
    ]
  }
];

export const BRAND_PRODUCT_CATALOG: ProductShowcaseItem[] = [
  // =========================================================
  // 9 EXACT RAW & PAW NATURALS FORMULAS (NO STACKS)
  // =========================================================
  {
    id: 'rp-heavy-hitter',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'heavy-hitter-beef-weight-gainer',
    divisionLabel: 'MUSCLE & RECOVERY',
    name: 'Heavy Hitter™',
    shortName: 'Heavy Hitter™',
    tagline: '8,500mg whey concentrate, bovine plasma, colostrum, creatine & BCAAs in one scoop.',
    price: '$49.99',
    servings: '60CT POUCH · 5LB BULK $89.99',
    imageSrc: '/images/products/rp-heavy-hitter.png',
    hotspot1: '+ 8,500mg Cold-Processed Whey Conc.',
    hotspot2: '+ Bovine Plasma IgG + Creatine + BCAAs',
    clinicalSpec: '12g Scoop · Zero Soy, Corn, Wheat or Artificial Fillers',
    ctaText: 'SHOP HEAVY HITTER™ • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-showroom',
    accentColor: '#FF8A00',
    callout: "★ PERK'S #1",
    stats: [
      { val: '8,500mg', label: 'Whey Conc.' },
      { val: 'Plasma+Cr', label: '500mg Each' },
      { val: '12g Scoop', label: 'Serving' }
    ]
  },
  {
    id: 'rp-goat-brew',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'goat-brew-goat-milk-dog-supplement',
    divisionLabel: 'GUT & COLOSTRUM',
    name: 'Goat Brew',
    shortName: 'Goat Brew',
    tagline: 'Raw goat milk powder, 1,000mg bovine colostrum, full vitamin panel & 500M CFU probiotics.',
    price: '$49.99',
    servings: '60CT POUCH · 5LB BULK $89.99',
    imageSrc: '/images/products/rp-goat-brew.png',
    hotspot1: '+ 13.12g Raw Whole Goat Milk Powder',
    hotspot2: '+ 1,000mg Bovine Colostrum + 500M CFU',
    clinicalSpec: '2+ Bags = 20% Off • Soothing Hydration & Immune Support',
    ctaText: 'SHOP GOAT BREW • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#00ADC7',
    callout: '2+ = 20% OFF',
    stats: [
      { val: '13.12g', label: 'Goat Milk' },
      { val: '1,000mg', label: 'Colostrum' },
      { val: '500M CFU', label: 'Probiotics' }
    ]
  },
  {
    id: 'rp-bovine-plasma',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'raw-and-paw-naturals-bovine-plasma-dog-supplement',
    divisionLabel: 'GUT & IMMUNITY',
    name: 'Plasma™ (Bovine Plasma)',
    shortName: 'Plasma™',
    tagline: '100% pure spray-dried bovine plasma delivering IgG, albumin & growth factors for structural gut repair.',
    price: '$49.99',
    servings: '150G PURE IGG TUB',
    imageSrc: '/images/products/rp-bovine-plasma.png',
    hotspot1: '+ 100% Pure Spray-Dried Bovine IgG',
    hotspot2: '+ Bioactive Albumin & Growth Factors',
    clinicalSpec: 'Structural Gut Barrier Defense • Pure Single-Ingredient Tub',
    ctaText: 'SHOP PLASMA™ • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-clinical-dossier',
    accentColor: '#FF69B4',
    callout: 'PURE IgG',
    stats: [
      { val: '100% Pure', label: 'Bovine IgG' },
      { val: 'Albumin', label: '+ Growth Fx' },
      { val: 'Gut Barrier', label: 'Structural' }
    ]
  },
  {
    id: 'rp-omega-mania',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'raw-and-paw-naturals-omega-mania-dog-oil-blend',
    divisionLabel: 'SKIN, COAT & JOINT',
    name: 'Omega Mania',
    shortName: 'Omega Mania',
    tagline: '4-oil blend of wild salmon, flaxseed, wheatgerm & fast-fuel MCT oil with mess-free pump.',
    price: '$29.99',
    servings: '12 OZ PUMP BOTTLE',
    imageSrc: '/images/products/rp-omega-mania.png',
    hotspot1: '+ Wild Salmon + Flax + Wheatgerm + MCT',
    hotspot2: '+ High EPA & DHA for Skin & Coat Shine',
    clinicalSpec: 'Cold-Pressed 4-Oil Elixir • Precision Pump Top',
    ctaText: 'SHOP OMEGA MANIA • $29.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-product-spotlight',
    accentColor: '#FF8A00',
    callout: '4-OIL PUMP',
    stats: [
      { val: '4-Oil Blend', label: 'Salmon+MCT' },
      { val: 'EPA & DHA', label: 'Skin & Joint' },
      { val: 'Pump Top', label: 'Easy Dose' }
    ]
  },
  {
    id: 'rp-enzyme-envy',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'raw-and-paw-naturals-enzyme-envy-digestive-enzymes-for-dogs',
    divisionLabel: 'YEAST & DIGESTION',
    name: 'Enzyme Envy',
    shortName: 'Enzyme Envy',
    tagline: '8 digestive enzymes + ginger, fennel & 2B CFU probiotics to stop paw licking, yeast & bloating.',
    price: '$29.99',
    servings: '4 OZ TUB · 2G SCOOP',
    imageSrc: '/images/products/rp-enzyme-envy.png',
    hotspot1: '+ 8 Active Digestive Enzymes + Botanicals',
    hotspot2: '+ 2B CFU Probiotics for Yeast & Gas',
    clinicalSpec: 'Stops Paw Licking & Yeast Cycles • Gentle Botanical Support',
    ctaText: 'SHOP ENZYME ENVY • $29.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#10B981',
    callout: 'YEAST RELIEF',
    stats: [
      { val: '8 Enzymes', label: '+ Botanicals' },
      { val: '2B CFU', label: 'Probiotics' },
      { val: '2g Scoop', label: 'Yeast Care' }
    ]
  },
  {
    id: 'rp-probiotic-pawty',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'probiotic-pawty-dog-probiotic-supplement',
    divisionLabel: 'DAILY MICROBIOME',
    name: 'Probiotic Pawty™',
    shortName: 'Probiotic Pawty™',
    tagline: '6 Billion CFU across 9 clinically studied probiotic strains for firm stools and immune balance.',
    price: '$29.99',
    servings: '4 OZ TUB · 1G SCOOP',
    imageSrc: '/images/products/rp-probiotic-pawty.png',
    hotspot1: '+ 6 Billion CFU Live Active Cultures',
    hotspot2: '+ 9 Clinically Studied Microbiome Strains',
    clinicalSpec: 'Daily Microbiome Balance • Firm Stools & Nutrient Uptake',
    ctaText: 'SHOP PROBIOTIC PAWTY™ • $29.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-bento-grid',
    accentColor: '#00ADC7',
    callout: '6B CFU · 9 STRAINS',
    stats: [
      { val: '6B CFU', label: 'Clinical' },
      { val: '9 Strains', label: 'Gut Flora' },
      { val: '1g Scoop', label: 'Daily Dose' }
    ]
  },
  {
    id: 'rp-gentlemans-litter',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'the-gentlemans-litter-stud-dog-fertility-supplement',
    divisionLabel: 'STUD FERTILITY',
    name: "The Gentlemen's Litter",
    shortName: "Gentlemen's Litter",
    tagline: 'Bovine plasma, CoQ10, L-carnitine, chelated zinc & tribulus for sperm motility, count, and vigor.',
    price: '$39.99',
    servings: '4 OZ / 60CT · STUD CARE',
    imageSrc: '/images/products/rp-gentlemans-litter.png',
    hotspot1: '+ Bovine Plasma + CoQ10 + L-Carnitine',
    hotspot2: '+ Chelated Zinc & Tribulus Male Vigor',
    clinicalSpec: '5g Daily Stud Scoop • Motility, Count & Reproductive Peak',
    ctaText: "SHOP GENTLEMEN'S LITTER • $39.99 • RAWANDPAWCO.COM",
    defaultPreset: 'rp-protocol-stack',
    accentColor: '#00ADC7',
    callout: 'STUD FORMULA',
    stats: [
      { val: 'Plasma+CoQ', label: 'Motility' },
      { val: 'Carnitine', label: '+ Chelated Zn' },
      { val: '5g Scoop', label: 'Stud Care' }
    ]
  },
  {
    id: 'rp-lets-get-littered',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'lets-get-littered-female-dog-fertility-supplement',
    divisionLabel: 'DAM OVULATION',
    name: "Let's Get Littered",
    shortName: "Let's Get Littered",
    tagline: '40:1 Myo/D-Chiro Inositol, Vitex chaste berry, methylated folate & plasma for reliable heat cycles.',
    price: '$39.99',
    servings: '4 OZ / 60CT · DAM CARE',
    imageSrc: '/images/products/rp-lets-get-littered.png',
    hotspot1: '+ 40:1 Myo / D-Chiro Inositol Matrix',
    hotspot2: '+ Vitex Chaste Berry + Methylated Folate',
    clinicalSpec: '5g Dam Care Scoop • Ovulation Sync, Fertility & Cycle Health',
    ctaText: "SHOP LET'S GET LITTERED • $39.99 • RAWANDPAWCO.COM",
    defaultPreset: 'rp-protocol-stack',
    accentColor: '#A855F7',
    callout: 'DAM OVULATION',
    stats: [
      { val: '40:1 Inos.', label: 'Ovulation' },
      { val: 'Vitex+B9', label: 'Cycle Sync' },
      { val: '5g Scoop', label: 'Dam Care' }
    ]
  },
  {
    id: 'rp-fade-fighter',
    brandTheme: 'raw-and-paw',
    category: 'naturals',
    shopifyHandle: 'plasma-bovine-plasma-for-dog-gut-immune-support',
    divisionLabel: 'NEWBORN & WHELP',
    name: 'Fade Fighter™ Plasma',
    shortName: 'Fade Fighter™',
    tagline: 'Concentrated spray-dried bovine plasma IgG antibodies for fading puppies and newborn gut defense.',
    price: '$24.99',
    servings: 'WHELPING BOX ESSENTIAL',
    imageSrc: '/images/products/rp-fade-fighter.png',
    hotspot1: '+ Concentrated Bovine Plasma IgG Defense',
    hotspot2: '+ Rapid-Mix Whelping Box Emergency Aid',
    clinicalSpec: 'Keep On Hand Every Litter • Passive Immunity & Hydration',
    ctaText: 'SHOP FADE FIGHTER™ • $24.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#FF69B4',
    callout: 'WHELPING AID',
    stats: [
      { val: 'Pure IgG', label: 'Passive Imm.' },
      { val: 'Rapid Mix', label: 'Whelp Box' },
      { val: 'Litter Aid', label: 'Newborns' }
    ]
  },

  // =========================================================
  // 4 EXACT K9 SUPER SUPPLEMENTS (K9SS) FORMULAS (NO STACKS)
  // =========================================================
  {
    id: 'k9ss-weight-gainer',
    brandTheme: 'k9ss',
    category: 'k9ss',
    shopifyHandle: 'k9-super-supplements-weight-gainer',
    divisionLabel: 'MASS & MUSCLE',
    name: 'Weight Gainer',
    shortName: 'weight gainer',
    tagline: 'Caloric density, whey + egg protein, and 18 aminos to fill out hard keepers and heavy frames.',
    price: '$49.99',
    servings: '60CT POUCH · $89.99 5LB',
    imageSrc: '/images/products/k9ss-weight-gainer.png',
    hotspot1: '+ Whey + Egg Protein Caloric Mass Matrix',
    hotspot2: '+ 18 Essential Amino Acids + BCAAs',
    clinicalSpec: '12g Scoop · Built for Hard Keepers & Heavy Frames',
    ctaText: 'SHOP WEIGHT GAINER • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-athlete-stage',
    accentColor: '#D32F2F',
    callout: '2+ = 20% OFF',
    stats: [
      { val: 'Whey + Egg', label: 'Protein' },
      { val: '18 Aminos', label: 'BCAA Matrix' },
      { val: '12g Scoop', label: 'Serving' }
    ]
  },
  {
    id: 'k9ss-joint-support',
    brandTheme: 'k9ss',
    category: 'k9ss',
    shopifyHandle: 'k9-super-supplements-joint-support',
    divisionLabel: 'HIP & JOINT',
    name: 'Joint Support',
    shortName: 'joint support',
    tagline: 'Maximum-strength glucosamine, chondroitin, MSM, organic turmeric & bone broth collagen.',
    price: '$49.99',
    servings: '60CT POUCH · $89.99 5LB',
    imageSrc: '/images/products/k9ss-joint-support.png',
    hotspot1: '+ 300mg Glucosamine HCl + Chondroitin',
    hotspot2: '+ MSM + Curcumin + Bone Broth Collagen',
    clinicalSpec: '58% Crude Protein Base · Heavy-Load Joint & Tendon Care',
    ctaText: 'SHOP JOINT SUPPORT • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-red-brutalist',
    accentColor: '#D4AF37',
    callout: '2+ = 20% OFF',
    stats: [
      { val: '300mg', label: 'Glucosamine' },
      { val: 'MSM + Curc.', label: 'Anti-Inflam' },
      { val: '58% Prot.', label: 'Bone Broth' }
    ]
  },
  {
    id: 'k9ss-multivitamin',
    brandTheme: 'k9ss',
    category: 'k9ss',
    shopifyHandle: 'k9-super-supplements-multivitamin',
    divisionLabel: 'DAILY FOUNDATION',
    name: 'Multi-Vitamin',
    shortName: 'multi-vitamin',
    tagline: 'Whole-food beef liver, spirulina, beet root & BCAAs for muscle, coat, gut, and immunity.',
    price: '$49.99',
    servings: '60CT POUCH · $89.99 5LB',
    imageSrc: '/images/products/k9ss-multivitamin.png',
    hotspot1: '+ 14 Whole Superfoods + Beef Liver',
    hotspot2: '+ Spirulina, Beet Root & 58% Protein',
    clinicalSpec: '20g Daily Base · Complete All-In-One Kennel Nutrition',
    ctaText: 'SHOP MULTI-VITAMIN • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-titanium-pedestal',
    accentColor: '#EF4444',
    callout: '2+ = 20% OFF',
    stats: [
      { val: '14 Whole', label: 'Superfoods' },
      { val: '58% Prot.', label: 'Liver + Whey' },
      { val: '20g Scoop', label: 'Daily Base' }
    ]
  },
  {
    id: 'k9ss-puppy-formula',
    brandTheme: 'k9ss',
    category: 'k9ss',
    shopifyHandle: 'k9-super-supplements-puppy-formula',
    divisionLabel: 'PUPPY & DAM',
    name: 'Puppy Formula',
    shortName: 'puppy formula',
    tagline: 'Goat milk, smoked beef liver, whey & balanced Ca:P ratio from whelping box to adulthood.',
    price: '$49.99',
    servings: '60CT POUCH · $89.99 5LB',
    imageSrc: '/images/products/k9ss-puppy-formula.png',
    hotspot1: '+ Whole Goat Milk + Smoked Beef Liver',
    hotspot2: '+ Precision 166:216mg Calcium:Phosphorus',
    clinicalSpec: 'Safe 4+ Weeks to Adult · Nursing Dams & Growing Litters',
    ctaText: 'SHOP PUPPY FORMULA • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-lineup-bento',
    accentColor: '#00E5FF',
    callout: '2+ = 20% OFF',
    stats: [
      { val: 'Goat Milk', label: '+ Beef Liver' },
      { val: '166:216mg', label: 'Ca:P Ratio' },
      { val: '4+ Weeks', label: 'Wean & Dam' }
    ]
  },

  // =========================================================
  // 12 WEBSITE STACKS & BUNDLES (RAWANDPAWCO.COM)
  // =========================================================
  {
    id: 'stack-working-dog',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'working-dog-stack-heavy-hitter-omega-mania-and-joint-support',
    divisionLabel: 'ATHLETE BUNDLE',
    name: 'Working Dog Stack',
    shortName: 'Working Dog Stack',
    tagline: 'Heavy Hitter™, Omega Mania & K9SS Joint Support paired for endurance, recovery & joint longevity.',
    price: '$116.97',
    servings: '3-STEP PERFORMANCE PROTOCOL',
    imageSrc: '/images/products/stack-working-dog.png',
    hotspot1: '+ Heavy Hitter™ Muscle & Plasma Base',
    hotspot2: '+ Omega Mania Coat + Joint Support',
    clinicalSpec: 'High-Drive Working, Hunting & Sport Dogs · Save on Stack',
    ctaText: 'SHOP WORKING DOG STACK • $116.97 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-protocol-stack',
    accentColor: '#FF8A00',
    callout: 'WORKHORSE STACK',
    stats: [
      { val: '3-Part', label: 'Protocol' },
      { val: 'Muscle+Jnt', label: 'Endurance' },
      { val: '$116.97', label: 'Bundle' }
    ]
  },
  {
    id: 'stack-protein-protocol',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'protein-protocol-protein-shake-for-your-dog',
    divisionLabel: 'MUSCLE + GUT SHAKE',
    name: 'Protein Protocol',
    shortName: 'Protein Protocol',
    tagline: 'Heavy Hitter™ whey & creatine paired with pure Bovine Plasma™ for lean mass and gut recovery.',
    price: '$74.99',
    servings: 'HEAVY HITTER + PLASMA™',
    imageSrc: '/images/products/stack-protein-protocol.png',
    hotspot1: '+ 8,500mg Whey + Creatine + BCAAs',
    hotspot2: '+ Pure Spray-Dried Bovine Plasma IgG',
    clinicalSpec: 'Clean Post-Work Protein Shake · Zero Soy or Fillers',
    ctaText: 'SHOP PROTEIN PROTOCOL • $74.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-showroom',
    accentColor: '#FF8A00',
    callout: 'PROTEIN SHAKE',
    stats: [
      { val: 'Whey+IgG', label: '2-Piece Stack' },
      { val: 'Creatine', label: '+ BCAAs' },
      { val: '$74.99', label: 'Bundle' }
    ]
  },
  {
    id: 'stack-kibble-gut',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'ee-om-pl-stack',
    divisionLabel: 'KIBBLE RESCUE BUNDLE',
    name: 'Kibble Fed Gut Health Bundle',
    shortName: 'Kibble Gut Bundle',
    tagline: 'Enzyme Envy, Omega Mania & Plasma™ working together to calm yeast paws, itching & kibble gut stress.',
    price: '$79.99',
    servings: 'ENZYMES + OMEGA + PLASMA™',
    imageSrc: '/images/products/stack-kibble-gut.png',
    hotspot1: '+ 8 Digestive Enzymes + 2B CFU Yeast Shield',
    hotspot2: '+ Bovine Plasma IgG + 4-Oil Omega Pump',
    clinicalSpec: 'Built for Kibble-Fed Dogs · Skin, Coat & Stool Turnaround',
    ctaText: 'SHOP KIBBLE GUT BUNDLE • $79.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-clinical-dossier',
    accentColor: '#10B981',
    callout: 'YEAST & ITCH FIX',
    stats: [
      { val: '3-Step', label: 'Kibble Upgrade' },
      { val: 'Enzymes', label: '+ IgG + Oils' },
      { val: '$79.99', label: 'Bundle' }
    ]
  },
  {
    id: 'stack-k9ss-super',
    brandTheme: 'k9ss',
    category: 'stacks',
    shopifyHandle: 'k9-super-supplements-super-stack',
    divisionLabel: 'ALL 4 K9SS FORMULAS',
    name: 'K9SS Super Stack',
    shortName: 'k9ss super stack',
    tagline: 'Complete 4-bag championship arsenal: Weight Gainer, Joint Support, Multi-Vitamin & Puppy Formula.',
    price: '$179.96',
    servings: 'FULL 4-PRODUCT K9SS SYSTEM',
    imageSrc: '/images/products/stack-k9ss-super.png',
    hotspot1: '+ All 4 K9SS Formulas in One Kennel Kit',
    hotspot2: '+ Mix & Match Stack Discount Built In',
    clinicalSpec: 'Complete Kennel & Athlete Coverage · Zero Synthetic Junk',
    ctaText: 'SHOP K9SS SUPER STACK • $179.96 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-lineup-bento',
    accentColor: '#D32F2F',
    callout: 'FULL LINEUP',
    stats: [
      { val: '4 Full Bags', label: 'K9SS Lineup' },
      { val: 'Save 10%+', label: 'Bundle Price' },
      { val: '$179.96', label: 'Complete Kit' }
    ]
  },
  {
    id: 'stack-joint-plasma',
    brandTheme: 'k9ss',
    category: 'stacks',
    shopifyHandle: 'joint-supp-stack-joint-and-plasma',
    divisionLabel: 'MOBILITY & RECOVERY',
    name: 'Joint Support Stack',
    shortName: 'joint support stack',
    tagline: 'K9SS Joint Support glucosamine + MSM paired with Bovine Plasma™ for structural tissue repair.',
    price: '$89.98',
    servings: 'JOINT SUPPORT + PLASMA™',
    imageSrc: '/images/products/stack-joint-plasma.png',
    hotspot1: '+ Glucosamine HCl + Chondroitin + MSM',
    hotspot2: '+ Pure Bovine Plasma IgG Inflammation Guard',
    clinicalSpec: 'Heavy-Frame, Senior & High-Impact Sporting Dogs',
    ctaText: 'SHOP JOINT STACK • $89.98 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-red-brutalist',
    accentColor: '#D4AF37',
    callout: 'MOBILITY DUO',
    stats: [
      { val: '300mg', label: 'Glucosamine' },
      { val: 'Pure IgG', label: '+ Turmeric' },
      { val: '$89.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-breeder',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'breeder-stacks-plasma-his-hers-littered-supp',
    divisionLabel: 'KENNEL FERTILITY DUO',
    name: 'Breeder Stack (His/Hers + Plasma)',
    shortName: 'Breeder Stack',
    tagline: "Your choice of Gentlemen's Litter or Let's Get Littered paired with Bovine Plasma™ for peak conception.",
    price: '$80.98',
    servings: 'STUD OR DAM + PLASMA™',
    imageSrc: '/images/products/stack-breeder.png',
    hotspot1: '+ Stud Motility or 40:1 Inositol Ovulation',
    hotspot2: '+ Paired With Bovine Plasma™ IgG Shield',
    clinicalSpec: 'Pro-Breeder Pre-Breeding & Whelping Prep · Save $9+',
    ctaText: 'SHOP BREEDER STACK • $80.98 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-protocol-stack',
    accentColor: '#9333EA',
    callout: 'BREEDER PICK',
    stats: [
      { val: 'His / Hers', label: 'Fertility' },
      { val: '+ Plasma', label: 'IgG Defense' },
      { val: '$80.98', label: 'Bundle' }
    ]
  },
  {
    id: 'stack-mama-puppy',
    brandTheme: 'k9ss',
    category: 'stacks',
    shopifyHandle: 'puppy-mama-stack-puppy-formula-and-plasma',
    divisionLabel: 'WHELPING & LACTATION',
    name: 'Mama & Puppy Stack',
    shortName: 'mama & puppy stack',
    tagline: 'K9SS Puppy Formula (goat milk + beef liver + Ca:P) stacked with Bovine Plasma™ for dam & litter.',
    price: '$89.98',
    servings: 'PUPPY FORMULA + PLASMA™',
    imageSrc: '/images/products/stack-mama-puppy.png',
    hotspot1: '+ Goat Milk + Smoked Liver + 166:216mg Ca:P',
    hotspot2: '+ Pure Bovine Plasma™ Passive Immunity',
    clinicalSpec: 'Safe 4+ Weeks & Nursing Dams · Litter Thriving Kit',
    ctaText: 'SHOP MAMA & PUPPY • $89.98 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-titanium-pedestal',
    accentColor: '#00E5FF',
    callout: 'LITTER CARE',
    stats: [
      { val: 'Dam + Pup', label: '4+ Weeks' },
      { val: 'Goat+IgG', label: 'Clean Milk' },
      { val: '$89.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-mass',
    brandTheme: 'k9ss',
    category: 'stacks',
    shopifyHandle: 'mass-stack-weight-gainer-and-omega-mania',
    divisionLabel: 'WEIGHT & COAT GAIN',
    name: 'Mass Stack',
    shortName: 'mass stack',
    tagline: 'K9SS Weight Gainer whey + egg protein stacked with Omega Mania 4-oil blend for dense clean weight.',
    price: '$71.98',
    servings: 'WEIGHT GAINER + OMEGA MANIA',
    imageSrc: '/images/products/stack-mass.png',
    hotspot1: '+ Whey + Egg + 18 Aminos Muscle Builder',
    hotspot2: '+ Salmon + Flax + MCT Healthy Caloric Oils',
    clinicalSpec: 'Fill Out Hard Keepers & Build Show Coat Gloss',
    ctaText: 'SHOP MASS STACK • $71.98 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-poster-cover',
    accentColor: '#D32F2F',
    callout: 'CLEAN MASS',
    stats: [
      { val: 'Whey+Egg', label: '+ 4-Oil Fat' },
      { val: '18 Aminos', label: 'Hard Keeper' },
      { val: '$71.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-immunity',
    brandTheme: 'k9ss',
    category: 'stacks',
    shopifyHandle: 'immunity-stack-multivitamin-and-plasma',
    divisionLabel: 'DEFENSE & VITALITY',
    name: 'Immunity Stack',
    shortName: 'immunity stack',
    tagline: 'K9SS Multi-Vitamin 14-superfood base paired with pure Bovine Plasma™ IgG for daily resilience.',
    price: '$89.98',
    servings: 'MULTI-VITAMIN + PLASMA™',
    imageSrc: '/images/products/stack-immunity.png',
    hotspot1: '+ 14 Whole Superfoods + 58% Protein',
    hotspot2: '+ Concentrated Spray-Dried Bovine IgG',
    clinicalSpec: 'Year-Round Travel, Show & Kennel Stress Shield',
    ctaText: 'SHOP IMMUNITY STACK • $89.98 • RAWANDPAWCO.COM',
    defaultPreset: 'k9ss-collage-locker',
    accentColor: '#1E3A8A',
    callout: 'DAILY SHIELD',
    stats: [
      { val: '14 Foods', label: 'Multi Base' },
      { val: 'Pure IgG', label: 'Gut Shield' },
      { val: '$89.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-gut-health',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'gut-health-stack',
    divisionLabel: 'SOOTHE & DIGEST',
    name: 'Gut Health Stack',
    shortName: 'Gut Health Stack',
    tagline: 'Goat Brew colostrum milk + Enzyme Envy 8-enzyme blend to rebuild sensitive stools and calm itch.',
    price: '$71.98',
    servings: 'GOAT BREW + ENZYME ENVY',
    imageSrc: '/images/products/stack-gut-health.png',
    hotspot1: '+ Raw Goat Milk + 1,000mg Colostrum',
    hotspot2: '+ 8 Active Digestive Enzymes + 2.5B CFU',
    clinicalSpec: 'Ideal for Sensitive Stomachs, Puppy Transitions & Yeast',
    ctaText: 'SHOP GUT HEALTH STACK • $71.98 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#00ADC7',
    callout: 'GUT RESET',
    stats: [
      { val: '1,000mg', label: 'Colostrum' },
      { val: '8 Enzymes', label: '+ 2.5B CFU' },
      { val: '$71.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-summer-heat',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'summer-heat-stack-multivitamin-omega-mania-bundle',
    divisionLabel: 'HEAT & HYDRATION',
    name: 'Summer Heat Stack',
    shortName: 'Summer Heat Stack',
    tagline: 'K9SS Multi-Vitamin + Omega Mania to guard paw pads, skin barrier & electrolytes in summer heat.',
    price: '$71.98',
    servings: 'MULTI-VITAMIN + OMEGA MANIA',
    imageSrc: '/images/products/stack-summer-heat.png',
    hotspot1: '+ Beet Root + Spirulina Heat Stress Defense',
    hotspot2: '+ 4-Oil Omega Barrier for Dry Skin & Paws',
    clinicalSpec: 'Outdoor, Field & Working Dogs in High Heat Seasons',
    ctaText: 'SHOP SUMMER HEAT • $71.98 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-product-spotlight',
    accentColor: '#FF8A00',
    callout: 'SEASONAL PRO',
    stats: [
      { val: 'Beet+Spir', label: 'Recovery' },
      { val: '4-Oil EPA', label: 'Coat Barrier' },
      { val: '$71.98', label: 'Stack' }
    ]
  },
  {
    id: 'stack-pack-drop',
    brandTheme: 'raw-and-paw',
    category: 'stacks',
    shopifyHandle: 'the-pack-drop-monthly-mystery-supplement-box-supplement-subscription',
    divisionLabel: 'MONTHLY MYSTERY BOX',
    name: 'The Pack Drop',
    shortName: 'The Pack Drop',
    tagline: 'Curated monthly Raw & Paw surprise box packed with full-size formulas, treats & breeder favorites.',
    price: '$49.99',
    servings: 'MONTHLY MYSTERY SUBSCRIPTION',
    imageSrc: '/images/products/stack-pack-drop.png',
    hotspot1: '+ Up to $80+ Retail Value Every Box',
    hotspot2: '+ Curated Seasonal Supplements & Treats',
    clinicalSpec: 'Cancel or Skip Anytime • Free App Loyalty Rewards',
    ctaText: 'JOIN THE PACK DROP • $49.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-bento-grid',
    accentColor: '#FF8A00',
    callout: 'MYSTERY BOX',
    stats: [
      { val: 'Up to $80', label: 'Box Value' },
      { val: 'Full Size', label: 'Formulas' },
      { val: '$49.99', label: 'Monthly' }
    ]
  },

  // =========================================================
  // 10 SHOPIFY RAW CASES, FREEZE-DRIED & CHUB TUB
  // =========================================================
  {
    id: 'raw-beef-tripe-24lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'raw-and-paw-beef-organ-tripe-plus-bone-case',
    divisionLabel: 'FROZEN RAW • 24 LB CASE',
    name: 'Beef, Organ & Tripe + Bone (24 lb)',
    shortName: 'Beef & Tripe 24 lb',
    tagline: '12 x 2lb chubs of 85/15 pasture-raised beef, tripe, heart, liver & bone. Shipped frozen free.',
    price: '$132.00',
    servings: '12 x 2LB CHUBS · FREE SHIPPING',
    imageSrc: '/images/products/raw-beef-tripe-24lb.png',
    hotspot1: '+ 16.5% Min Protein · 13% Min Fat',
    hotspot2: '+ USDA Non-HPP Citric Acid Kill-Step',
    clinicalSpec: 'Order by Sunday Night -> Ships Tuesday on Dry Ice',
    ctaText: 'SHOP 24LB BEEF & TRIPE • $132 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-clinical-dossier',
    accentColor: '#FF8A00',
    callout: 'FREE SHIPPING',
    stats: [
      { val: '16.5%', label: 'Min Protein' },
      { val: '13.0%', label: 'Min Fat' },
      { val: '12x 2lb', label: 'Free Ship' }
    ]
  },
  {
    id: 'raw-beef-tripe-30lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'beef-organ-tripe-raw-dog-food-case-30lb',
    divisionLabel: 'BULK RAW • 30 LB CASE',
    name: 'Beef, Organ & Tripe + Bone (30 lb)',
    shortName: 'Beef & Tripe 30 lb',
    tagline: '6 x 5lb chubs built for multi-dog kennels & large breeds. Nutrient-dense green tripe + organ.',
    price: '$144.00',
    servings: '6 x 5LB CHUBS · FREE SHIPPING',
    imageSrc: '/images/products/raw-beef-tripe-30lb.png',
    hotspot1: '+ $4.80/lb Delivered Frozen to Your Door',
    hotspot2: '+ Green Tripe + Heart + Liver + Ground Bone',
    clinicalSpec: 'Order by Sunday -> Ships Tuesday · Insulated Dry Ice Box',
    ctaText: 'SHOP 30LB BEEF & TRIPE • $144 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#FF8A00',
    callout: 'KENNEL VALUE',
    stats: [
      { val: '30 lb Case', label: '6 x 5lb Chub' },
      { val: '$4.80/lb', label: 'Shipped Free' },
      { val: 'No HPP', label: 'Citric Safe' }
    ]
  },
  {
    id: 'raw-beef-801010-24lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'beef-organ-bone-80-10-10-raw-dog-food-case-12-x-2lb-chubs',
    divisionLabel: '80/10/10 BARF • 24 LB',
    name: 'Beef 80/10/10 Raw Case (24 lb)',
    shortName: 'Beef 80/10/10 24 lb',
    tagline: 'Classic 80% muscle meat, 10% secreting organ & 10% finely ground edible bone in 2lb chubs.',
    price: '$132.00',
    servings: '12 x 2LB CHUBS · 80/10/10',
    imageSrc: '/images/products/raw-beef-801010-24lb.png',
    hotspot1: '+ 80% Beef Muscle · 10% Organ · 10% Bone',
    hotspot2: '+ Single-Protein Clean Ancestral BARF Ratio',
    clinicalSpec: 'Non-HPP Human-Grade USDA Beef · Order Sunday -> Ships Tuesday',
    ctaText: 'SHOP 80/10/10 24LB • $132 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-clinical-dossier',
    accentColor: '#00ADC7',
    callout: 'CLASSIC 80/10/10',
    stats: [
      { val: '80 / 10 / 10', label: 'BARF Ratio' },
      { val: '12x 2lb', label: '24 lb Case' },
      { val: 'Free Ship', label: 'Tues Dispatch' }
    ]
  },
  {
    id: 'raw-beef-801010-30lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'beef-organ-80-10-10-raw-dog-food-case',
    divisionLabel: '80/10/10 BULK • 30 LB',
    name: 'Beef 80/10/10 Raw Case (30 lb)',
    shortName: 'Beef 80/10/10 30 lb',
    tagline: '6 x 5lb chubs of pure single-protein Beef 80/10/10 without synthetic preservatives or HPP.',
    price: '$144.00',
    servings: '6 x 5LB CHUBS · FREE SHIPPING',
    imageSrc: '/images/products/raw-beef-801010-30lb.png',
    hotspot1: '+ Pure Beef 80/10/10 Bulk Kennel Case',
    hotspot2: '+ 100% Zero Fillers, Grains, or Peas',
    clinicalSpec: 'Order by Sunday Night -> Ships Tuesday Frozen Nationwide',
    ctaText: 'SHOP 80/10/10 30LB • $144 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-showroom',
    accentColor: '#FF8A00',
    callout: '30LB BULK',
    stats: [
      { val: '6 x 5lb', label: '30 lb Case' },
      { val: '80/10/10', label: 'Single Beef' },
      { val: 'Free Ship', label: 'Tues Dispatch' }
    ]
  },
  {
    id: 'raw-beef-herring-24lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'raw-and-paw-beef-herring-blend',
    divisionLabel: 'BEEF + WILD HERRING • 24 LB',
    name: 'Beef with Herring Raw Case (24 lb)',
    shortName: 'Beef + Herring 24 lb',
    tagline: 'Wild whole herring fused with pasture-raised beef, tripe, organs & bone for natural EPA/DHA.',
    price: '$132.00',
    servings: '12 x 2LB CHUBS · OMEGA RICH',
    imageSrc: '/images/products/raw-beef-herring-24lb.png',
    hotspot1: '+ Whole Herring Natural Omega-3 & Vit D',
    hotspot2: '+ Beef + Tripe + Organs + Finely Ground Bone',
    clinicalSpec: 'Shiny Coat & Joint Recovery Built Into Every Bowl',
    ctaText: 'SHOP BEEF + HERRING • $132 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#00ADC7',
    callout: 'OMEGA-RICH RAW',
    stats: [
      { val: 'Wild Fish', label: 'Whole Herring' },
      { val: '12x 2lb', label: '24 lb Case' },
      { val: 'Free Ship', label: 'Tues Dispatch' }
    ]
  },
  {
    id: 'raw-beef-boneless-30lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'beef-organ-boneless-raw-dog-food-case',
    divisionLabel: 'BONELESS BASE • 30 LB',
    name: 'Beef & Organ Boneless Case (30 lb)',
    shortName: 'Boneless Beef 30 lb',
    tagline: '6 x 5lb chubs of pure muscle meat and secreting organs with ZERO bone for custom diets & toppers.',
    price: '$144.00',
    servings: '6 x 5LB CHUBS · BONELESS',
    imageSrc: '/images/products/raw-beef-boneless-30lb.png',
    hotspot1: '+ Zero Ground Bone — Ideal Custom Raw Base',
    hotspot2: '+ Pair With Whole Meaties or Calcium Mix',
    clinicalSpec: 'Built for DIY Raw Feeders & Whole-Bone Additions',
    ctaText: 'SHOP BONELESS 30LB • $144 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-product-spotlight',
    accentColor: '#10B981',
    callout: 'ZERO BONE',
    stats: [
      { val: 'Boneless', label: 'Meat + Organ' },
      { val: '6 x 5lb', label: '30 lb Case' },
      { val: 'Custom DIY', label: 'Raw Base' }
    ]
  },
  {
    id: 'raw-chicken-25lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'whole-carcass-chicken-raw-dog-food-case-5-x-5lb-chubs',
    divisionLabel: 'WHOLE PREY POULTRY • 25 LB',
    name: 'Whole Carcass Chicken Case (25 lb)',
    shortName: 'Whole Chicken 25 lb',
    tagline: '5 x 5lb chubs of finely ground whole chicken carcass with natural cartilage, organs & bone.',
    price: '$120.00',
    servings: '5 x 5LB CHUBS · FREE SHIPPING',
    imageSrc: '/images/products/raw-chicken-25lb.png',
    hotspot1: '+ Whole Carcass Grind w/ Organs & Bone',
    hotspot2: '+ Rich Natural Chondroitin & Calcium',
    clinicalSpec: 'Budget-Friendly Protein Rotation · Order Sunday -> Ships Tuesday',
    ctaText: 'SHOP CHICKEN 25LB • $120 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-naturals-pedestal',
    accentColor: '#FF8A00',
    callout: '$4.80/LB SHIPPED',
    stats: [
      { val: '5 x 5lb', label: '25 lb Case' },
      { val: 'Whole Prey', label: 'Natural Ca' },
      { val: 'Free Ship', label: 'Tues Dispatch' }
    ]
  },
  {
    id: 'raw-turkey-25lb',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'whole-carcass-turkey-raw-dog-food-case-5-x-5lb-chubs',
    divisionLabel: 'LEAN WHOLE PREY • 25 LB',
    name: 'Whole Carcass Turkey Case (25 lb)',
    shortName: 'Whole Turkey 25 lb',
    tagline: '5 x 5lb chubs of lean whole turkey carcass for rotational cooling protein & easy digestion.',
    price: '$120.00',
    servings: '5 x 5LB CHUBS · FREE SHIPPING',
    imageSrc: '/images/products/raw-turkey-25lb.png',
    hotspot1: '+ Novel / Lean Cooling Poultry Rotation',
    hotspot2: '+ Whole-Bird Grind With Organs & Bone',
    clinicalSpec: 'Non-HPP Cold Grind · Order Sunday -> Ships Tuesday',
    ctaText: 'SHOP TURKEY 25LB • $120 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-showroom',
    accentColor: '#00ADC7',
    callout: 'COOLING PROTEIN',
    stats: [
      { val: '5 x 5lb', label: '25 lb Case' },
      { val: 'Lean Bird', label: 'Sensitive Gut' },
      { val: 'Free Ship', label: 'Tues Dispatch' }
    ]
  },
  {
    id: 'raw-freeze-dried',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'freeze-dried-raw',
    divisionLabel: 'TRAVEL & TOPPER RAW',
    name: 'Freeze-Dried Beef, Tripe & Organ',
    shortName: 'Freeze-Dried Raw',
    tagline: 'Raw beef, green tripe, organ & bone gently freeze-dried to preserve enzymes with zero freezer needed.',
    price: '$19.99',
    servings: 'SHELF-STABLE RAW · REHYDRATES IN SEC',
    imageSrc: '/images/products/raw-freeze-dried.png',
    hotspot1: '+ Same Beef, Tripe, Organ & Bone Formula',
    hotspot2: '+ Zero Freezer Needed · Travel & Show Ready',
    clinicalSpec: 'Pour Warm Water or GOAT BREW to Rehydrate Anytime',
    ctaText: 'SHOP FREEZE-DRIED • $19.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-bento-grid',
    accentColor: '#FF8A00',
    callout: 'TRAVEL RAW',
    stats: [
      { val: 'No Freezer', label: 'Shelf Stable' },
      { val: 'Beef+Tripe', label: '90%+ Meat' },
      { val: '$19.99', label: 'Trial/Travel' }
    ]
  },
  {
    id: 'raw-chub-tub',
    brandTheme: 'raw-and-paw',
    category: 'raw',
    shopifyHandle: 'chubtub',
    divisionLabel: 'FRIDGE STORAGE GEAR',
    name: 'The Chub Tub™',
    shortName: 'Chub Tub™',
    tagline: 'Leak-proof fridge container sized specifically to thaw 2lb and 5lb raw chubs without countertop drips.',
    price: '$24.99',
    servings: 'FITS 2LB & 5LB RAW CHUBS',
    imageSrc: '/images/products/raw-chub-tub.png',
    hotspot1: '+ Leak-Proof Raw Thawing & Fridge Hygiene',
    hotspot2: '+ Dishwasher-Safe Food-Grade Seal',
    clinicalSpec: 'Keep Every Thawing Chub Tidy Between Feedings',
    ctaText: 'SHOP CHUB TUB™ • $24.99 • RAWANDPAWCO.COM',
    defaultPreset: 'rp-product-spotlight',
    accentColor: '#FF8A00',
    callout: 'FRIDGE ESSENTIAL',
    stats: [
      { val: '2lb & 5lb', label: 'Chub Fit' },
      { val: 'Leak-Proof', label: 'Thaw Clean' },
      { val: '$24.99', label: 'Gear' }
    ]
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

export const RAW_PAW_STAMP_BADGES: { id: string; text: string; pill: PillStyle }[] = [
  { id: 'rp-stamp-save20', text: '🔥 BUY 2+ = 20% OFF STACKS', pill: 'rp-orange' },
  { id: 'rp-stamp-freeship', text: '❄️ FREE SHIPPING ON FROZEN CASES', pill: 'rp-clinical' },
  { id: 'rp-stamp-nonhpp', text: '🥩 USDA NON-HPP • CITRIC ACID SAFE', pill: 'obsidian' },
  { id: 'rp-stamp-tuesday', text: '📦 ORDER SUN -> SHIPS TUESDAY', pill: 'amber' },
  { id: 'rp-stamp-plasma', text: '🧬 POWERED BY BOVINE PLASMA IgG', pill: 'rp-plasma' },
  { id: 'rp-stamp-nofillers', text: '✅ ZERO SOY, CORN OR FILLERS', pill: 'rp-emerald' },
  { id: 'rp-stamp-breeder', text: '🏆 BREEDER & VET RECOMMENDED', pill: 'rp-orchid' },
  { id: 'rp-stamp-app', text: '📱 EARN REWARDS IN OUR APP', pill: 'rp-hotspot' },
  { id: 'rp-stamp-swipe', text: 'Swipe 👉 RawAndPawCo.com', pill: 'frosted' }
];

export const K9SS_STAMP_BADGES: { id: string; text: string; pill: PillStyle }[] = [
  { id: 'k9-stamp-2plus', text: '🔥 2+ BAGS = 20% OFF', pill: 'k9ss-crimson' },
  { id: 'k9-stamp-perk', text: "★ PERK'S KENNEL PICK", pill: 'k9ss-gold' },
  { id: 'k9-stamp-protein', text: '💪 58% CRUDE PROTEIN BASE', pill: 'k9ss-royal' },
  { id: 'k9-stamp-veteran', text: '🇺🇸 WOMAN & VETERAN OWNED', pill: 'obsidian' },
  { id: 'k9-stamp-clean', text: '⚡ ZERO SYNTHETIC FILLERS', pill: 'k9ss-cyan' },
  { id: 'k9-stamp-stack', text: '🏆 BUILT FOR WORKING DOGS', pill: 'k9ss-hotspot' },
  { id: 'k9-stamp-4wks', text: '🐾 SAFE 4+ WEEKS TO SENIOR', pill: 'trophy-gold' },
  { id: 'k9-stamp-swipe', text: 'SWIPE 👉 RAWANDPAWCO.COM', pill: 'frosted' }
];

export const RAW_PAW_BLOG_ITEMS: TopicCardItem[] = [
  {
    id: 'rp-blog-plasma-gut',
    badge: '📖 JOURNAL • GUT & IMMUNITY',
    title: 'How Bovine Plasma Seals Leaky Gut & Ignites Immunity',
    body: 'Spray-dried bovine plasma delivers intact IgG immunoglobulins and growth factors that bind pathogens directly in the GI tract without stressing organs.',
    footer: 'RawAndPawCo.com/blog • Immunity Science',
    bgStyle: 'rp-plasma-pink',
    image: '/images/raw-paw-blog/plasma-powered-immunity-gut-health.jpg',
    shareUrl: 'https://rawandpawco.com/blog/plasma-powered-immunity-gut-health'
  },
  {
    id: 'rp-blog-fading-puppy',
    badge: '📖 JOURNAL • WHELPING PROTOCOL',
    title: 'Fading Puppy Survival Protocol: Early Gut & Hydration Support',
    body: 'In the first 72 hours, passive IgG transfer and gentle goat-milk hydration are critical. Keep Fade Fighter™ & Goat Brew stocked before welping day.',
    footer: 'RawAndPawCo.com/blog • Breeder Survival Guide',
    bgStyle: 'rp-orange-bold',
    image: '/images/raw-paw-blog/fading-puppy-survival-protocol.jpg',
    shareUrl: 'https://rawandpawco.com/blog/fading-puppy-survival-protocol'
  },
  {
    id: 'rp-blog-non-hpp-kill-step',
    badge: '📖 JOURNAL • RAW FOOD SAFETY',
    title: 'Why We Never Use HPP: Our USDA Citric Acid Kill-Step',
    body: 'High-pressure processing cooks enzymes and flattens texture. We use a gentle USDA-validated organic citric acid kill-step to stay raw, safe, and alive.',
    footer: 'RawAndPawCo.com/blog • Clean Raw Standards',
    bgStyle: 'rp-clinical-ice',
    image: '/images/raw-paw-blog/human-grade-kill-step-non-hpp-safety.jpg',
    shareUrl: 'https://rawandpawco.com/blog/human-grade-kill-step-non-hpp-safety'
  },
  {
    id: 'rp-blog-ancestral-barf',
    badge: '📖 JOURNAL • RAW BLENDS',
    title: 'HPP-Free Raw Meat Blends & The Ancestral BARF Ratio',
    body: 'Dogs thrive on 80% muscle meat, 10% secreting organs, and 10% finely ground bone—never starchy extruded kibble fillers.',
    footer: 'RawAndPawCo.com/blog • 80/10/10 Blueprint',
    bgStyle: 'rp-charcoal-stage',
    image: '/images/raw-paw-blog/hpp-free-raw-meat-blends-ancestral-barf-diet.jpg',
    shareUrl: 'https://rawandpawco.com/blog/hpp-free-raw-meat-blends-ancestral-barf-diet'
  },
  {
    id: 'rp-blog-yeast-paws',
    badge: '📖 JOURNAL • YEAST & ITCH',
    title: 'Stop Chronic Paw Licking: Healing the Kibble Yeast Cycle',
    body: 'High-glycemic kibble feeds systemic yeast and gut dysbiosis. Switching to raw protein + Enzyme Envy™ breaks down starch buildup fast.',
    footer: 'RawAndPawCo.com/blog • Yeast Relief Guide',
    bgStyle: 'rp-enzyme-emerald',
    image: '/images/raw-paw-blog/healing-dog-gut-yeast-paws-kibble-fix.jpg',
    shareUrl: 'https://rawandpawco.com/blog/healing-dog-gut-yeast-paws-kibble-fix'
  },
  {
    id: 'rp-blog-kibble-trap',
    badge: '📖 JOURNAL • DIGESTIVE HEALTH',
    title: 'The Kibble Trap: Why Paws Turn Red & Ears Stay Inflamed',
    body: 'Most itchy paw cases start in an overworked gut lacking live enzymes. Add 8 active digestive enzymes + 2B CFU probiotics at every meal.',
    footer: 'RawAndPawCo.com/blog • Kibble Gut Fix',
    bgStyle: 'rp-naturals-linen',
    image: '/images/raw-paw-blog/kibble-trap-yeast-paws-fix.jpg',
    shareUrl: 'https://rawandpawco.com/blog/kibble-trap-yeast-paws-fix'
  },
  {
    id: 'rp-blog-hunting-dog',
    badge: '📖 JOURNAL • K9SS PERFORMANCE',
    title: 'Fueling Hunting & Sporting Dogs Without Mid-Field Crash',
    body: 'Working dogs burn glycogen rapidly under load. Stacking Heavy Hitter™ whey + creatine with Omega Mania MCTs sustains recovery across multi-day hunts.',
    footer: 'RawAndPawCo.com/blog • Working Dog Nutrition',
    bgStyle: 'k9ss-crimson',
    image: '/images/raw-paw-blog/hunting-dog-performance-nutrition.jpg',
    shareUrl: 'https://rawandpawco.com/blog/hunting-dog-performance-nutrition'
  },
  {
    id: 'rp-blog-stud-motility',
    badge: '📖 JOURNAL • STUD FERTILITY',
    title: 'Supporting Sperm Motility, Count & Vigor Naturally',
    body: "Chelated zinc, L-carnitine, CoQ10, and bovine plasma in The Gentlemen's Litter protect reproductive cells from oxidative heat and travel stress.",
    footer: 'RawAndPawCo.com/blog • Stud Protocol',
    bgStyle: 'k9ss-royal-cyan',
    image: '/images/raw-paw-blog/stud-semen-motility-support.jpg',
    shareUrl: 'https://rawandpawco.com/blog/stud-semen-motility-support'
  },
  {
    id: 'rp-blog-pregnant-gestation',
    badge: '📖 JOURNAL • DAM NUTRITION',
    title: 'Gestation Science: Feeding Pregnant & Lactating Dams Raw',
    body: 'Growing fetuses and milk demand clean bioavailable amino acids, calcium, and folate—never inflammatory corn or soy.',
    footer: 'RawAndPawCo.com/blog • Gestation Guide',
    bgStyle: 'rp-littered-plum',
    image: '/images/raw-paw-blog/raw-nutrition-for-pregnant-dogs-gestation-science.jpg',
    shareUrl: 'https://rawandpawco.com/blog/raw-nutrition-for-pregnant-dogs-gestation-science'
  },
  {
    id: 'rp-blog-summer-heat',
    badge: '📖 JOURNAL • SEASONAL CARE',
    title: 'Protecting Working & Bull Breeds in High Summer Heat',
    body: 'Electrolytes, nitric-oxide beet root, spirulina, and barrier omegas shield paw pads, cooling efficiency, and cellular recovery in triple-digit weather.',
    footer: 'RawAndPawCo.com/blog • Summer Heat Stack',
    bgStyle: 'rp-amber-pedestal',
    image: '/images/raw-paw-blog/support-your-dog-in-the-heat-nutrition-skin-health.jpg',
    shareUrl: 'https://rawandpawco.com/blog/support-your-dog-in-the-heat-nutrition-skin-health'
  },
  {
    id: 'rp-blog-omega-mania',
    badge: '📖 JOURNAL • SKIN & COAT',
    title: 'Why Single Fish Oil Falls Short: The 4-Oil Omega Advantage',
    body: 'Omega Mania combines wild salmon, cold-pressed flax, wheatgerm vitamin E, and clean MCT energy for coat gloss, flexible joints, and calm skin.',
    footer: 'RawAndPawCo.com/blog • Omega Mania Benefits',
    bgStyle: 'rp-orange-bold',
    image: '/images/raw-paw-blog/omega-mania-benefits.jpg',
    shareUrl: 'https://rawandpawco.com/blog/omega-mania-benefits'
  },
  {
    id: 'rp-blog-raw-beginners',
    badge: '📖 JOURNAL • START RAW',
    title: "Raw Feeding For Beginners: How to Portion, Thaw & Transition",
    body: 'Feed 2–3% of adult ideal weight daily. Use a leak-proof Chub Tub™ in the fridge, transition over 7–10 days, and add Probiotic Pawty™ for smooth stools.',
    footer: 'RawAndPawCo.com/blog • Beginner Guide',
    bgStyle: 'rp-clinical-ice',
    image: '/images/raw-paw-blog/raw-feeding-beginners.jpg',
    shareUrl: 'https://rawandpawco.com/blog/raw-feeding-beginners'
  },
  {
    id: 'rp-blog-ancestral-truth',
    badge: '📖 JOURNAL • CANINE BIOLOGY',
    title: 'The Biological Truth: Why Canine Guts Were Designed For Raw',
    body: 'With a highly acidic pH stomach, hinged jaws, and short digestive tract, dogs absorb real moisture-rich meat far cleaner than extruded kibble pellets.',
    footer: 'RawAndPawCo.com/blog • Ancestral Truth',
    bgStyle: 'k9ss-steel',
    image: '/images/raw-paw-blog/the-biological-truth-ancestral-dog-nutrition.jpg',
    shareUrl: 'https://rawandpawco.com/blog/the-biological-truth-ancestral-dog-nutrition'
  },
  {
    id: 'rp-blog-ozone-skincare',
    badge: '📖 JOURNAL • DERM & SKIN',
    title: 'Calm Problem Skin Inside & Out: Enzymes + Topical Care',
    body: 'Pairing internal gut barrier support (Plasma + Enzyme Envy) with soothing ozone & sulfur skincare restores damaged skin coats rapidly.',
    footer: 'RawAndPawCo.com/blog • Skin Restoration',
    bgStyle: 'rp-enzyme-emerald',
    image: '/images/raw-paw-blog/ozone-lime-sulfur-dog-skincare.jpg',
    shareUrl: 'https://rawandpawco.com/blog/ozone-lime-sulfur-dog-skincare'
  },
  {
    id: 'rp-blog-yeast-deep-dive',
    badge: '📖 JOURNAL • PAW HEALTH',
    title: 'Smelly Frito Paws? Here Is What Is Actually Happening',
    body: 'Malassezia yeast overgrows when dietary carbohydrates Spike skin sugars. Cut fillers, add digestive enzymes, and starve the flare from within.',
    footer: 'RawAndPawCo.com/blog • Clean Bowl Reset',
    bgStyle: 'rp-warm-stone',
    image: '/images/raw-paw-blog/yeast-paws.jpg',
    shareUrl: 'https://rawandpawco.com/blog/healing-dog-gut-yeast-paws-kibble-fix'
  },
  {
    id: 'rp-blog-perk-stack',
    badge: '📖 JOURNAL • TEAM K9SS',
    title: "Inside Kendrick 'Perk' Perkins' Champion Heavy Hitter™ Stack",
    body: 'Why NBA champion Kendrick Perkins trusts Heavy Hitter™ & K9 Super Supplements for coat density, lean muscle, and kennel recovery.',
    footer: 'RawAndPawCo.com • Team K9SS',
    bgStyle: 'k9ss-crimson',
    image: '/images/raw-paw-blog/perk-hh.jpg',
    shareUrl: 'https://rawandpawco.com/collections/k9-super-supplements'
  }
];

export const RAW_PAW_DYK_ITEMS: TopicCardItem[] = [
  {
    id: 'rp-dyk-1',
    badge: '🤔 DID YOU KNOW? • RAW SCIENCE',
    title: 'High-Pressure Processing (HPP) Can Flatten Live Raw Nutrients',
    body: 'Instead of crushing meat at 87,000 PSI, Raw & Paw uses a gentle USDA citric-acid kill-step so natural texture, taste & enzymes stay alive.',
    footer: 'True Non-HPP Raw • RawAndPawCo.com',
    bgStyle: 'rp-orange-bold',
    image: '/images/raw-paw-blog/human-grade-kill-step-non-hpp-safety.jpg',
    shareUrl: 'https://rawandpawco.com/pages/raw-blends'
  },
  {
    id: 'rp-dyk-2',
    badge: '🧬 DID YOU KNOW? • PLASMA IgG',
    title: 'Bovine Plasma Works Directly Inside The Gut Lumen!',
    body: 'Unlike generic vitamins, intact spray-dried IgG antibodies bind pathogens before they cross the intestinal wall—calming loose stools & allergies.',
    footer: 'Shop Plasma™ & Heavy Hitter™ • RawAndPawCo.com',
    bgStyle: 'rp-plasma-pink',
    image: '/images/raw-paw-blog/plasma-studies-hero.jpg',
    shareUrl: 'https://rawandpawco.com/products/raw-and-paw-naturals-bovine-plasma-dog-supplement'
  },
  {
    id: 'rp-dyk-3',
    badge: '💬 PACK POLL • BOWL CHECK',
    title: "What's In Your Dog's Bowl Tonight? 👇",
    body: 'Team Full Raw 80/10/10, Half & Half, or Kibble + Toppers? Drop your feeding setup below—every bowl deserves live enzymes & omegas!',
    footer: 'Comment Below! • @rawandpawco',
    bgStyle: 'rp-charcoal-stage',
    image: '/images/raw-paw-blog/sprinkle-plasma-on-bowl.jpg',
    shareUrl: 'https://rawandpawco.com'
  },
  {
    id: 'rp-dyk-4',
    badge: '⚡ K9SS FACT • 58% PROTEIN',
    title: 'K9SS Bases Use Real Smoked Beef Liver—Not Corn Starch!',
    body: 'While most chews or powders are 60%+ tapioca, oat flour, or sugar, K9SS delivers whole-food beef liver, whey, and colostrum in every scoop.',
    footer: 'Shop K9SS • Buy 2+ Save 20%!',
    bgStyle: 'k9ss-crimson',
    image: '/images/raw-paw-blog/working-dog-stack-heavy-hitter-omega-mania.jpg',
    shareUrl: 'https://rawandpawco.com/collections/k9-super-supplements'
  },
  {
    id: 'rp-dyk-5',
    badge: '🐾 DID YOU KNOW? • YEAST PAWS',
    title: 'Frito-Smelling Paws Are Almost Always A Gut Signal',
    body: 'Starchy fillers spike yeast on skin & ears. Adding 8 digestive enzymes + 2B CFU probiotics helps break down carbs before yeast feeds on them.',
    footer: 'Enzyme Envy • $29.99 • RawAndPawCo.com',
    bgStyle: 'rp-enzyme-emerald',
    image: '/images/raw-paw-blog/healing-dog-gut-yeast-paws-kibble-fix.jpg',
    shareUrl: 'https://rawandpawco.com/products/raw-and-paw-naturals-enzyme-envy-digestive-enzymes-for-dogs'
  },
  {
    id: 'rp-dyk-6',
    badge: '📦 SHIPPING TIP • FROZEN RAW',
    title: 'Order Frozen Cases By Sunday Night -> Ships Tuesday!',
    body: 'We ship raw chub cases every Tuesday in heavy insulated liners with dry ice & FREE shipping so boxes arrive rock-solid without weekend delays.',
    footer: '24 lb $132 · 30 lb $144 • Free Shipping',
    bgStyle: 'rp-clinical-ice',
    image: '/images/raw-paw-blog/raw-dog-food-case-free-shipping.jpg',
    shareUrl: 'https://rawandpawco.com/collections/raw-dog-food'
  },
  {
    id: 'rp-dyk-7',
    badge: '🤰 BREEDER SECRET • 40:1 INOSITOL',
    title: 'Why 40:1 Myo/D-Chiro Inositol Supports Regular Dam Cycles',
    body: 'Paired with Vitex chaste berry and methylated folate in Let’s Get Littered, it supports follicular quality and steady ovulation timing.',
    footer: "Let's Get Littered • RawAndPawCo.com",
    bgStyle: 'rp-littered-plum',
    image: '/images/raw-paw-blog/raw-nutrition-for-pregnant-dogs-gestation-science.jpg',
    shareUrl: 'https://rawandpawco.com/products/lets-get-littered-female-dog-fertility-supplement'
  },
  {
    id: 'rp-dyk-8',
    badge: '🐐 DID YOU KNOW? • GOAT BREW',
    title: 'Whole Goat Milk Has Smaller Fat Globules Than Cow Milk',
    body: 'Easier on tiny puppy stomachs and nursing moms! Plus every scoop of Goat Brew packs 1,000mg bovine colostrum & 500M CFU probiotics.',
    footer: '60 Servings $49.99 • RawAndPawCo.com',
    bgStyle: 'rp-naturals-linen',
    image: '/images/raw-paw-blog/fading-puppy-survival-protocol.jpg',
    shareUrl: 'https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement'
  },
  {
    id: 'rp-dyk-9',
    badge: '🔥 TRUE OR FALSE? • RAW MYTH',
    title: 'MYTH: Kibble Dogs & Raw Dogs Need The Same Digestive Time',
    body: 'FALSE! Raw moisture + natural enzymes move cleanly in ~4–6 hours; cooked starch can take 10–14 hours. Never free-feed kibble on top of raw!',
    footer: 'Ancestral Nutrition • RawAndPawCo.com',
    bgStyle: 'rp-amber-pedestal',
    image: '/images/raw-paw-blog/yellow-lab-raw-beef.jpg',
    shareUrl: 'https://rawandpawco.com/blog/raw-feeding-beginners'
  },
  {
    id: 'rp-dyk-10',
    badge: '🥛 DID YOU KNOW? • COLOSTRUM',
    title: 'Heavy Hitter™ Stacks Whey + Plasma + Colostrum + Creatine',
    body: 'You don’t need 4 separate tubs—Heavy Hitter puts 8,500mg cold-processed whey, bovine plasma, colostrum & creatine in one 12g scoop.',
    footer: "Perk's #1 Pick • $49.99",
    bgStyle: 'k9ss-royal-cyan',
    image: '/images/raw-paw-blog/perk-hh.jpg',
    shareUrl: 'https://rawandpawco.com/products/heavy-hitter-beef-weight-gainer'
  }
];

export const RAW_PAW_INFO_ITEMS: TopicCardItem[] = [
  {
    id: 'rp-info-killstep',
    badge: '🛡️ RAW INFO • NON-HPP SAFETY',
    title: 'USDA Organic Citric Acid Kill-Step (Zero HPP)',
    body: 'Our beef, tripe, chicken & turkey blends are cold-ground and treated with a USDA-validated organic citric acid wash—keeping live nutrients intact while neutralizing pathogens.',
    footer: 'RawAndPawCo.com • Clean Frozen Raw',
    bgStyle: 'rp-clinical-ice',
    image: '/images/raw-paw-blog/human-grade-kill-step-non-hpp-safety.jpg',
    shareUrl: 'https://rawandpawco.com/blog/human-grade-kill-step-non-hpp-safety'
  },
  {
    id: 'rp-info-shipping',
    badge: '❄️ FROZEN SHIPPING • FREE USA',
    title: 'Order By Sunday Night -> Ships Tuesday On Dry Ice',
    body: 'Every 24lb ($132), 25lb ($120) & 30lb ($144) raw case ships FREE every Tuesday in thick insulated thermal boxes with dry ice so it stays rock frozen.',
    footer: 'Tuesday Frozen Dispatch • RawAndPawCo.com',
    bgStyle: 'rp-orange-bold',
    image: '/images/raw-paw-blog/raw-dog-food-case-free-shipping.jpg',
    shareUrl: 'https://rawandpawco.com/collections/raw-dog-food'
  },
  {
    id: 'rp-info-801010',
    badge: '🥩 BARF BLUEPRINT • 80/10/10',
    title: '80% Muscle Meat · 10% Organs · 10% Edible Bone',
    body: 'True ancestral balance without synthetic premixes or carbohydrate fillers. Available in 12x2lb chubs (24lb) or 6x5lb kennel chubs (30lb).',
    footer: 'Beef 80/10/10 • $132–$144 Free Ship',
    bgStyle: 'rp-charcoal-stage',
    image: '/images/raw-paw-blog/yellow-lab-raw-beef.jpg',
    shareUrl: 'https://rawandpawco.com/products/beef-organ-bone-80-10-10-raw-dog-food-case-12-x-2lb-chubs'
  },
  {
    id: 'rp-info-macros',
    badge: '📊 GUARANTEED ANALYSIS • BEEF + TRIPE',
    title: '16.5% Min Protein · 13% Min Fat · Only 68% Moisture',
    body: 'Rich in unbleached green tripe probiotics, heart, liver & bone. ~194 kcal/100g gives hard keepers and nursing dams effortless bioavailable fuel.',
    footer: 'Beef, Organ & Tripe • RawAndPawCo.com',
    bgStyle: 'rp-naturals-linen',
    image: '/images/raw-paw-blog/sprinkle-plasma-on-bowl.jpg',
    shareUrl: 'https://rawandpawco.com/products/raw-and-paw-beef-organ-tripe-plus-bone-case'
  },
  {
    id: 'rp-info-portioning',
    badge: '⚖️ FEEDING GUIDE • DAILY PORTION',
    title: 'Feed 2–3% Of Ideal Adult Bodyweight Per Day',
    body: '• 25 lb Dog: ~0.5 lb/day\n• 50 lb Dog: ~1.0–1.5 lb/day\n• 80 lb Working Dog: ~2.0–2.4 lb/day\nStore thawing chubs leak-free inside The Chub Tub™.',
    footer: 'Shop Cases + Chub Tub™ • RawAndPawCo.com',
    bgStyle: 'rp-amber-pedestal',
    image: '/images/raw-paw-blog/raw-feeding-beginners.jpg',
    shareUrl: 'https://rawandpawco.com/blog/raw-feeding-beginners'
  },
  {
    id: 'rp-info-stack-deal',
    badge: '🔥 BUNDLE DEAL • 2+ SAVE 20%',
    title: 'Stack Any 2+ Pouches & Save 20% Automatically',
    body: 'Mix & match Heavy Hitter™, Goat Brew, or all 4 K9SS formulas (Weight Gainer, Joint Support, Multi-Vitamin, Puppy Formula) in 60ct pouches or 5lb bags!',
    footer: 'Build Your Stack • RawAndPawCo.com',
    bgStyle: 'k9ss-crimson',
    image: '/images/raw-paw-blog/working-dog-stack-heavy-hitter-omega-mania.jpg',
    shareUrl: 'https://rawandpawco.com/collections/k9-super-supplements'
  },
  {
    id: 'rp-info-plasma',
    badge: '🧬 SCIENCE BRIEF • IMMUNE BARRIER',
    title: 'Why Spray-Dried Bovine Plasma Outperforms Single Colostrum',
    body: 'Bovine plasma supplies active IgG, albumin, transferrin & growth factors proven to reduce gut permeability and accelerate litter & working dog recovery.',
    footer: 'Plasma™ & Fade Fighter™ • RawAndPawCo.com',
    bgStyle: 'rp-plasma-pink',
    image: '/images/raw-paw-blog/plasma-studies-hero.jpg',
    shareUrl: 'https://rawandpawco.com/blog/plasma-powered-immunity-gut-health'
  },
  {
    id: 'rp-info-veteran',
    badge: '🇺🇸 ABOUT US • OKLAHOMA MADE',
    title: 'Woman & Veteran Owned • Zero Soy, Corn, Wheat or Fillers',
    body: 'Formulated by breeders & nutrition specialists in Oklahoma City for every kennel—from toy breeds and Frenchies to high-drive Malinois and hunting pointers.',
    footer: 'RawAndPawCo.com • Join The Pack',
    bgStyle: 'k9ss-royal-cyan',
    image: '/images/raw-paw-blog/the-biological-truth-ancestral-dog-nutrition.jpg',
    shareUrl: 'https://rawandpawco.com'
  }
];

export const RAW_PAW_CUSTOMER_ITEMS: TopicCardItem[] = [
  {
    id: 'rp-google-jalayne',
    badge: '★★★★★ GOOGLE REVIEW • JALAYNE J.',
    title: '"Worth Every Dime"',
    body: '"Love the food, love the free shipping, & love the price. Worth every dime."',
    footer: 'Jalayne J. • 5.0 ★ Google Review • RawAndPawCo.com',
    bgStyle: 'rp-orange-bold',
    image: '/images/raw-paw-customers/pearl.jpg',
    shareUrl: 'https://rawandpawco.com/products/raw-and-paw-beef-organ-tripe-plus-bone-case'
  },
  {
    id: 'rp-google-tiquan',
    badge: '★★★★★ GOOGLE REVIEW • TIQUAN P.',
    title: '"The Wellness Bundle Is The Way To Go"',
    body: '"The wellness bundle is the way to go. Everything works hand and hand with each other. Plus you get a discount. Can\'t beat it. I highly recommend."',
    footer: 'Tiquan P. • 5.0 ★ Verified Review • RawAndPawCo.com',
    bgStyle: 'k9ss-royal-cyan',
    image: '/images/raw-paw-customers/gsp-pointers.jpg',
    shareUrl: 'https://rawandpawco.com/collections/stacks'
  },
  {
    id: 'rp-google-mila',
    badge: '★★★★★ GOOGLE REVIEW • MILA Z.',
    title: '"The Only Thing I Will Ever Give Him"',
    body: '"Raw and Paw was recommended to me by the breeder I got my bully from... putting my baby on goat brew and their whole naturals line it\'s the only thing I will ever give him."',
    footer: 'Mila Z. • 5.0 ★ Verified Review • RawAndPawCo.com',
    bgStyle: 'rp-amber-pedestal',
    image: '/images/raw-paw-customers/american-bully-puppy.jpg',
    shareUrl: 'https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement'
  },
  {
    id: 'rp-google-courageous',
    badge: '★★★★★ GOOGLE REVIEW • COURAGEOUS G.',
    title: '"Rate Your Products A 10 — Simply The Best"',
    body: '"I would have to rate your products a 10 unbelievably my dogs love and enjoy the products. They won\'t even eat their food without their protein and probiotics. Simply the best."',
    footer: 'Courageous G. • 5.0 ★ Google Review • RawAndPawCo.com',
    bgStyle: 'rp-enzyme-emerald',
    image: '/images/raw-paw-customers/english-bulldog.jpg',
    shareUrl: 'https://rawandpawco.com/products/probiotic-pawty-dog-probiotic-supplement'
  },
  {
    id: 'rp-google-brayden',
    badge: '★★★★★ GOOGLE REVIEW • BRAYDEN',
    title: '"Completely Changed My Dogs\' Lives"',
    body: '"Switching my dogs to an all raw diet with Raw and Paw Co. completely changed my German Shepherd and my fluffy Frenchie\'s lives. They love it, they\'re so healthy, and they get SO excited for dinner time now!"',
    footer: 'Brayden • 5.0 ★ Verified Review • RawAndPawCo.com',
    bgStyle: 'rp-naturals-linen',
    image: '/images/raw-paw-customers/chubby.jpg',
    shareUrl: 'https://rawandpawco.com'
  },
  {
    id: 'rp-cust-perk',
    badge: '🏆 AMBASSADOR SPOTLIGHT • KENDRICK PERKINS',
    title: 'Kendrick Perkins Fuels His Kennel With Raw & Paw Co.',
    body: 'NBA Champion Kendrick Perkins fueling his kennel with Raw & Paw Co. Heavy Hitter™ & K9 Super Supplements.',
    footer: 'Raw & Paw Ambassador • Heavy Hitter™ + K9SS',
    bgStyle: 'k9ss-crimson',
    image: '/images/raw-paw-customers/perk-k9ss.jpg',
    shareUrl: 'https://rawandpawco.com/products/heavy-hitter-beef-weight-gainer'
  }
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
  const isRP = themeKit?.id === 'raw-and-paw';
  const isK9 = themeKit?.id === 'k9ss';
  const handleText = themeKit?.handle || '@okcfrenchies';
  const surfaceStyle = windowStyle || item.bgStyle;
  const isDarkSurface = !(BG_STYLES[surfaceStyle] || BG_STYLES['cream-editorial']).darkText;
  const centerY = Math.round(canvasH * 0.5);
  const baseNone: PillStyle = isDarkSurface ? 'none-light' : 'none-dark';
  const headlineFont: FontKind = isK9 ? 'k9ss' : isRP ? 'sans' : 'serif';

  const badgePill: PillStyle = isK9
    ? surfaceStyle === 'k9ss-crimson'
      ? 'k9ss-gold'
      : 'k9ss-crimson'
    : isRP
      ? 'rp-orange'
      : isDarkSurface
        ? 'gold'
        : mode === 'didyouknow'
          ? 'mocha'
          : 'sage';

  const bodyPill: PillStyle = isK9
    ? isDarkSurface
      ? 'obsidian'
      : 'white'
    : isRP
      ? isDarkSurface
        ? 'frosted'
        : 'white'
      : isDarkSurface
        ? 'frosted'
        : mode === 'didyouknow' || mode === 'glossary'
          ? 'white'
          : 'cream';

  const footerPill: PillStyle = isK9
    ? 'k9ss-gold'
    : isRP
      ? isDarkSurface
        ? 'rp-clinical'
        : 'obsidian'
      : isDarkSurface
        ? 'cream'
        : mode === 'standards'
          ? 'mocha'
          : 'terracotta';

  // Pure Editorial / Un-Pilled Typography Styles for Magazine, Minimal Luxe & Split Quote
  if (textTheme === 'magazine-border' || textTheme === 'minimal-luxe') {
    const accentColor = isK9
      ? '#D4AF37'
      : isRP
        ? isDarkSurface
          ? '#FF8A00'
          : '#D96200'
        : isDarkSurface
          ? '#F4D37E'
          : '#2E5A44';
    const subColor = isDarkSurface ? '#FAF7F0' : '#14161B';
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
        pillWidth: 280,
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
        textColor: isMinimal ? (isK9 ? '#EF4444' : isRP ? '#FF8A00' : '#D46A4E') : undefined,
        font: 'sans'
      },
      {
        id: 'headline',
        label: 'Headline',
        visible: true,
        text: item.title,
        x: 540,
        y: centerY - 95,
        fontSize: isK9 ? 54 : 60,
        pillWidth: 820,
        padY: 12,
        pill: baseNone,
        font: headlineFont
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
        font: isMinimal && !isK9 && !isRP ? 'serif-italic' : 'sans'
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
    const splitAccent = isK9 ? '#D4AF37' : isRP ? '#FF8A00' : '#F4D37E';
    return [
      {
        id: 'handle',
        label: handleText,
        visible: true,
        text: handleText,
        x: 540,
        y: 112,
        fontSize: 21,
        pillWidth: 280,
        padY: 8,
        pill: 'none-light',
        textColor: splitAccent,
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
        pillWidth: 580,
        padY: 12,
        pill: badgePill,
        font: 'sans'
      },
      {
        id: 'headline',
        label: 'Headline',
        visible: true,
        text: item.title,
        x: 540,
        y: Math.round(canvasH * 0.31),
        fontSize: isK9 ? 50 : 54,
        pillWidth: 840,
        padY: 12,
        pill: 'none-light',
        textColor: '#FFFFFF',
        font: headlineFont
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
        pill: badgePill,
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
        pillWidth: 280,
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
        fontSize: isK9 ? 50 : 56,
        pillWidth: 820,
        padY: 14,
        pill: baseNone,
        font: headlineFont
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
      pillWidth: isCameo ? 480 : 560,
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
      fontSize: isK9 ? (isCameo ? 46 : 50) : isCameo ? 52 : 56,
      pillWidth: isCameo ? 740 : 820,
      padY: 14,
      pill: baseNone,
      font: headlineFont
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
      pillWidth: 280,
      padY: 8,
      pill: baseNone,
      font: 'sans'
    }
  ];
};

export const buildProductCaption = (
  product: ProductShowcaseItem,
  _themeKit?: BrandThemeKit
): string => {
  const isK9 = product.brandTheme === 'k9ss' || product.category === 'k9ss';
  const shopUrl = product.shopifyHandle
    ? `https://rawandpawco.com/products/${product.shopifyHandle}`
    : 'https://rawandpawco.com';
  const brandLine = isK9
    ? `⚡ K9 Super Supplements (${product.divisionLabel})`
    : `🌿 Raw & Paw Naturals (${product.divisionLabel})`;
  const promoLine =
    product.category === 'raw'
      ? `❄️ Order by Sunday Night -> Ships Tuesday on dry ice with FREE shipping!`
      : product.category === 'stacks'
        ? `🔥 Complete Protocol Stack — 20% bundle savings already built in on RawAndPawCo.com!`
        : `🔥 Mix & match any 2+ pouches/bottles and save 20% automatically on RawAndPawCo.com!`;
  const prodSlug = product.shortName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const baseTags = isK9
    ? `#k9supersupplements #rawandpaw #workingdogs #dogsupplements #k9athlete #caninenutrition`
    : product.category === 'raw'
      ? `#rawandpaw #rawdogfood #801010raw #rawfeddogs #speciesappropriatediet #caninenutrition`
      : product.category === 'stacks'
        ? `#rawandpaw #dogsupplementstack #caninenutrition #rawfeddogs #doghealth #holisticdog`
        : `#rawandpaw #rawandpawnaturals #dogsupplements #bowltopper #caninenutrition #holisticdog`;
  const tags = prodSlug ? `#${prodSlug} ${baseTags}` : baseTags;
  return [
    `${brandLine} • ${product.name} (${product.price})`,
    '',
    product.tagline,
    '',
    `✓ ${product.hotspot1.replace(/^\+\s*/, '')}`,
    `✓ ${product.hotspot2.replace(/^\+\s*/, '')}`,
    `📋 ${product.clinicalSpec}`,
    '',
    promoLine,
    `🛒 Shop now: ${shopUrl.replace(/^https?:\/\//, '')}`,
    `📱 Earn Pack Rewards points every order in our iOS/Android app!`,
    '',
    tags
  ].join('\n');
};

export const buildSlideProductsCaption = (
  products: ProductShowcaseItem[],
  themeKit?: BrandThemeKit
): string => {
  if (!products || products.length === 0) {
    const isK9 = themeKit?.id === 'k9ss';
    return isK9
      ? [
          `⚡ K9 Super Supplements • Clinical Performance Canine Nutrition`,
          '',
          `Targeted conditioning, joint mobility, and daily recovery formulas built for active and working dogs.`,
          '',
          `🔥 Mix & match any 2+ pouches/bottles and save 20% automatically on RawAndPawCo.com!`,
          `🛒 Shop the full lineup: rawandpawco.com`,
          '',
          `#k9supersupplements #rawandpaw #workingdogs #dogsupplements #k9athlete #caninenutrition`
        ].join('\n')
      : [
          `🌿 Raw & Paw Co. • Complete Raw Diets, Stacks & Functional Toppers`,
          '',
          `Real nutrition powered by pure 80/10/10 frozen raw meals, clinical-dose toppers, and synergistic wellness stacks.`,
          '',
          `🛒 Shop Raw & Paw: rawandpawco.com`,
          `❄️ Frozen raw cases ship every Tuesday (order by Sunday night!) • FREE shipping`,
          '',
          `#rawandpaw #rawandpawnaturals #rawfeddogs #caninenutrition #holisticdog`
        ].join('\n');
  }

  if (products.length === 1) {
    return buildProductCaption(products[0], themeKit);
  }

  const lead = products[0];
  const companions = products.slice(1);
  const hasK9 = products.some((p) => p.brandTheme === 'k9ss' || p.category === 'k9ss');
  const isLeadK9 = lead.brandTheme === 'k9ss' || lead.category === 'k9ss';
  const brandLine = isLeadK9
    ? `⚡ K9 Super Supplements • Featured Lineup`
    : `🌿 Raw & Paw Co. • Featured Stack & Lineup`;
  const shopUrl = lead.shopifyHandle
    ? `rawandpawco.com/products/${lead.shopifyHandle}`
    : 'rawandpawco.com';

  const hasRaw = products.some((p) => p.category === 'raw');
  const hasStack = products.some((p) => p.category === 'stacks');
  const hasPouch = products.some((p) => p.category === 'naturals' || p.category === 'k9ss');
  const promoLines: string[] = [];
  if (hasPouch) {
    promoLines.push(
      `🔥 Mix & match any 2+ pouches/bottles and save 20% automatically on RawAndPawCo.com!`
    );
  } else if (hasStack) {
    promoLines.push(
      `🔥 Complete Protocol Stack — 20% bundle savings already built in on RawAndPawCo.com!`
    );
  }
  if (hasRaw) {
    promoLines.push(`❄️ Frozen raw cases: Order by Sunday Night -> Ships Tuesday on dry ice with FREE shipping!`);
  }

  const companionLines = companions.map(
    (p) => `• ${p.name} (${p.price}) — ${p.hotspot1.replace(/^\+\s*/, '')}`
  );

  const productTags = products
    .slice(0, 3)
    .map((p) => p.shortName.toLowerCase().replace(/[^a-z0-9]/g, ''))
    .filter(Boolean)
    .map((s) => `#${s}`);
  const brandTags = hasK9
    ? ['#k9supersupplements', '#rawandpaw', '#dogsupplements', '#caninenutrition', '#workingdogs']
    : ['#rawandpaw', '#rawandpawnaturals', '#dogsupplements', '#caninenutrition', '#holisticdog'];
  const tags = Array.from(new Set([...productTags, ...brandTags])).slice(0, 8).join(' ');

  return [
    `${brandLine}: ${lead.name} (${lead.price}) + ${companions.length} Companion${companions.length > 1 ? 's' : ''}`,
    '',
    lead.tagline,
    `✓ ${lead.hotspot1.replace(/^\+\s*/, '')}`,
    `📋 ${lead.clinicalSpec}`,
    '',
    `Paired on this slide:`,
    ...companionLines,
    '',
    ...promoLines,
    `🛒 Shop now: ${shopUrl}`,
    `📱 Earn Pack Rewards points every order in our iOS/Android app!`,
    '',
    tags
  ].join('\n');
};

export const buildTopicCaption = (
  item: TopicCardItem,
  themeKit?: BrandThemeKit
): string => {
  const isK9 = themeKit?.id === 'k9ss';
  const isRP = themeKit?.id === 'raw-and-paw';
  if (isK9 || isRP) {
    const cleanUrl = (item.shareUrl || 'https://rawandpawco.com').replace(/^https?:\/\//, '');
    const tags = isK9
      ? `#k9supersupplements #rawandpaw #workingdogs #doghealth #dogsupplements #rawfeddogs`
      : `#rawandpaw #rawandpawnaturals #rawdogfood #doghealth #caninenutrition #bovineplasma`;
    return [
      `${item.badge}`,
      `${item.title}`,
      '',
      item.body,
      '',
      `💬 Drop your questions below or tag a fellow dog owner who needs to see this! 👇`,
      '',
      `🛒 Shop Raw Food, Stacks & Supplements: ${cleanUrl}`,
      `❄️ Frozen raw cases ship every Tuesday (order by Sunday night!) • FREE shipping`,
      `🔥 Save 20% when you bundle 2+ supplements on RawAndPawCo.com`,
      '',
      tags
    ].join('\n');
  }

  return [
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
};
