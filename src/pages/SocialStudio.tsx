import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GoogleGenAI } from '@google/genai';
import puppiesData from '../data/puppies.json';
import studsData from '../data/studs.json';
import {
  BG_STYLES,
  BgStyle,
  CanvasRatio,
  ContentMode,
  DID_YOU_KNOW_ITEMS,
  DogRecord,
  FramePreset,
  GLOSSARY_ITEMS,
  PillStyle,
  STAMP_BADGES,
  STANDARDS_AND_BLOG_ITEMS,
  SavedLayoutPreset,
  SlideState,
  TextLayer,
  TopicCardItem,
  buildTopicCaption,
  buildTopicLayers
} from './socialStudioPresets';

const DEFAULT_QUOTES: Record<string, string> = {
  'phatty-patty': '"Our sweet Chocolate Tri Merle keeper—chunky, wrinkly, and staying right here at OKC Frenchies."',
  jellyroll: '"Chocolate Tri Merle showstopper—thick bone, dreamy eyes, and elite Mini English structure."',
  shuffin: '"Fluffy, joyful, and always ready to steal your heart with one big smile."',
  alex: '"All ears, happy paws, and the sweetest little shadow you could ever ask for."',
  alice: '"Super tiny pocket princess with a gentle soul and endless cuddles to give."',
  arya: '"Compact, confident, and bursting with playful charm from nose to tail."',
  brew: '"Little merle sweetheart with soulful eyes and the coziest cuddle energy."',
  bean: '"Chunky, sweet-natured baby who loves warm laps and quiet afternoon naps."',
  biscotti: '"A tiny bundle of sweetness—soft, snuggly, and spoiled with love from day one."',
  brulee: '"Gentle, dreamy, and already stealing hearts with that rosy little nose."',
  ghost: '"Full Pink powerhouse sire—proven structure, calm temperament & elite genetics."',
  everest: '"Compact frame, heavy bone, and world-class exotic DNA ready for your program."',
  shifu: '"Plush coat genetics, sweet disposition, and show-stopping presence."',
  denali: '"Exceptional structure, expressive headpiece, and proven rare coat producer."'
};

const PILL_PALETTE: Record<
  PillStyle,
  { label: string; bg: string; text: string; border: string; hasBg: boolean; shadow?: boolean }
> = {
  cream: { label: 'Cream Pill', bg: '#F6F4EE', text: '#1C2621', border: '#E2DCCD', hasBg: true, shadow: true },
  mocha: { label: 'Mocha Pill', bg: '#3B2B23', text: '#F4D37E', border: '#5A4337', hasBg: true, shadow: true },
  sage: { label: 'Forest Pill', bg: '#2E5A44', text: '#FFFFFF', border: '#2E5A44', hasBg: true, shadow: true },
  gold: { label: 'Gold Pill', bg: '#F4D37E', text: '#1C2621', border: '#E5C165', hasBg: true, shadow: true },
  terracotta: { label: 'Terracotta', bg: '#D46A4E', text: '#FFFFFF', border: '#D46A4E', hasBg: true, shadow: true },
  blush: { label: 'Soft Rose', bg: '#F9E4E2', text: '#8C2F2B', border: '#EBC6C2', hasBg: true, shadow: true },
  frosted: {
    label: 'Dark Glass',
    bg: 'rgba(28,38,33,0.84)',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.22)',
    hasBg: true,
    shadow: true
  },
  'none-dark': { label: 'No Pill (Dark Text)', bg: 'transparent', text: '#1C2621', border: 'transparent', hasBg: false },
  'none-light': { label: 'No Pill (Light Text)', bg: 'transparent', text: '#FFFFFF', border: 'transparent', hasBg: false }
};

const TEXT_COLOR_SWATCHES: { value: string; label: string; hex: string }[] = [
  { value: '', label: 'Auto', hex: 'linear-gradient(135deg,#1C2621 50%,#F4D37E 50%)' },
  { value: '#1C2621', label: 'Charcoal', hex: '#1C2621' },
  { value: '#FFFFFF', label: 'White', hex: '#FFFFFF' },
  { value: '#2E5A44', label: 'Forest', hex: '#2E5A44' },
  { value: '#3B2B23', label: 'Mocha', hex: '#3B2B23' },
  { value: '#F4D37E', label: 'Gold', hex: '#F4D37E' },
  { value: '#D46A4E', label: 'Terracotta', hex: '#D46A4E' },
  { value: '#8C2F2B', label: 'Berry', hex: '#8C2F2B' },
  { value: '#F6F4EE', label: 'Cream', hex: '#F6F4EE' },
  { value: '#F9E4E2', label: 'Blush', hex: '#F9E4E2' }
];

const SAVED_PRESETS_KEY = 'okcfrenchies_studio_saved_layouts_v1';
const DRAFT_STORAGE_KEY = 'okcfrenchies_studio_draft_v2';

const extractAge = (dog: DogRecord): string => {
  const m = (dog.description || '').match(/(\d+)-(month|week)-old/i);
  if (m) {
    const num = Number(m[1]);
    const unit = m[2].charAt(0).toUpperCase() + m[2].slice(1).toLowerCase() + (num === 1 ? '' : 's');
    return `${num} ${unit} Old`;
  }
  if (dog.name === 'Alex') return '4 Months Old';
  return '';
};

const getCanvasHeight = (r: CanvasRatio) => (r === 'story' ? 1920 : r === 'square' ? 1080 : 1350);

const roundRectPath = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  tl: number,
  tr: number,
  br: number,
  bl: number
) => {
  const maxR = Math.min(w / 2, h / 2);
  const rtl = Math.min(tl, maxR);
  const rtr = Math.min(tr, maxR);
  const rbr = Math.min(br, maxR);
  const rbl = Math.min(bl, maxR);
  ctx.beginPath();
  ctx.moveTo(x + rtl, y);
  ctx.lineTo(x + w - rtr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rtr);
  ctx.lineTo(x + w, y + h - rbr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rbr, y + h);
  ctx.lineTo(x + rbl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rbl);
  ctx.lineTo(x, y + rtl);
  ctx.quadraticCurveTo(x, y, x + rtl, y);
  ctx.closePath();
};

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
  const paragraphs = text.split('\n');
  const allLines: string[] = [];
  for (const para of paragraphs) {
    const words = para.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      allLines.push('');
      continue;
    }
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxW && line) {
        allLines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) allLines.push(line);
  }
  return allLines.length > 0 ? allLines : [''];
};

const loadImageElement = (src: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    if (/^https?:\/\//i.test(src)) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const getFrameGeometry = (
  preset: FramePreset,
  canvasH: number,
  archH: number,
  bgStyle: BgStyle = 'cream-editorial',
  windowStyle: BgStyle = 'pure-white'
) => {
  const outerTheme = BG_STYLES[bgStyle] || BG_STYLES['cream-editorial'];
  const winTheme = BG_STYLES[windowStyle] || BG_STYLES['pure-white'];

  if (preset === 'no-photo') {
    return {
      outerBg1: outerTheme.bg1,
      outerBg2: outerTheme.bg2,
      hasCard: false,
      hasPhoto: false,
      cardX: 0,
      cardY: 0,
      cardW: 1080,
      cardH: canvasH,
      cardBg: outerTheme.cardBg,
      cardBorder: outerTheme.border,
      cardTopR: 0,
      photoX: 0,
      photoY: 0,
      photoW: 0,
      photoH: 0,
      photoTopR: 0,
      photoBottomR: 0
    };
  }

  if (preset === 'minimal') {
    return {
      outerBg1: outerTheme.bg1,
      outerBg2: outerTheme.bg2,
      hasCard: false,
      hasPhoto: true,
      cardX: 0,
      cardY: 0,
      cardW: 1080,
      cardH: canvasH,
      cardBg: 'transparent',
      cardBorder: 'transparent',
      cardTopR: 0,
      photoX: 0,
      photoY: 0,
      photoW: 1080,
      photoH: canvasH,
      photoTopR: 0,
      photoBottomR: 0
    };
  }

  const pad = preset === 'sage' ? 38 : preset === 'cameo' ? 34 : 26;
  const cardW = 1080 - pad * 2;
  const cardH = canvasH - pad * 2;
  const photoW = preset === 'cameo' ? 760 : cardW - 52;
  const photoX = preset === 'cameo' ? Math.round((1080 - photoW) / 2) : pad + 26;
  const photoY = preset === 'sage' ? pad + 86 : preset === 'cameo' ? pad + 56 : pad + 24;
  const clampedArch = Math.min(archH, canvasH - 360);
  return {
    outerBg1: outerTheme.bg1,
    outerBg2: outerTheme.bg2,
    hasCard: true,
    hasPhoto: true,
    cardX: pad,
    cardY: pad,
    cardW,
    cardH,
    cardBg: winTheme.cardBg,
    cardBorder: winTheme.border,
    cardTopR: preset === 'arch' ? 230 : 42,
    photoX,
    photoY,
    photoW,
    photoH: clampedArch,
    photoTopR: preset === 'arch' ? 210 : preset === 'cameo' ? 999 : 28,
    photoBottomR: preset === 'cameo' ? 999 : 26
  };
};

const buildLayersForDog = (
  dog: DogRecord,
  preset: FramePreset,
  canvasH: number,
  archH: number,
  bgStyle: BgStyle = 'cream-editorial',
  windowStyle: BgStyle = 'pure-white'
): TextLayer[] => {
  const outerTheme = BG_STYLES[bgStyle] || BG_STYLES['cream-editorial'];
  const winTheme = BG_STYLES[windowStyle] || BG_STYLES['pure-white'];
  const surfaceTheme = preset === 'no-photo' ? outerTheme : winTheme;
  const baseTextPill: PillStyle = surfaceTheme.darkText ? 'none-dark' : 'none-light';
  const slug = dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const age = extractAge(dog);
  const isStud = dog.category === 'Stud';
  const breed = dog.breed || (isStud ? 'French Bulldog Sire' : 'French Bulldog');
  const isFemale = (dog.gender || '').toLowerCase() === 'female';
  const sexLabel = isStud
    ? '👑 Proven Sire'
    : dog.gender
      ? `${isFemale ? '♀' : '♂'} ${dog.gender}`
      : '♀ Female';
  const sexPillStyle: PillStyle = isStud ? 'gold' : isFemale ? 'blush' : 'sage';

  const statusLower = (dog.status || '').toLowerCase();
  const statusStr = statusLower.includes('keeper')
    ? '👑 Keeper • Staying at OKC Frenchies'
    : statusLower.includes('retained') || statusLower.includes('co-own')
      ? '🤝 Retained / Co-Own Opportunity'
      : dog.status === 'Pending'
        ? '✨ Pending • Deposit Placed'
        : dog.status === 'SOLD'
          ? '🏡 Placed in Forever Home'
          : isStud
            ? '👑 Stud Service • Shipped Nationwide'
            : '✨ Available Now';
  const breedAgeStr = isStud
    ? `${dog.name} • ${breed}`
    : [breed, age].filter(Boolean).join(' • ');
  const coatStr = dog.dna || dog.description || '';
  const dnaStr = (dog.dna_technical || '').trim();
  const quoteStr =
    DEFAULT_QUOTES[slug] || '"Raised in our OKC home with love, structure & health first."';

  if (preset === 'minimal' || preset === 'no-photo') {
    const topTextPill: PillStyle =
      preset === 'no-photo' ? baseTextPill : 'none-light';
    return [
      {
        id: 'breedAge',
        label: isStud ? 'Sire Banner' : 'Breed & Age Banner',
        visible: true,
        text: breedAgeStr,
        x: 540,
        y: canvasH - 190,
        fontSize: 34,
        pillWidth: 700,
        padY: 18,
        pill: 'cream',
        font: 'sans'
      },
      {
        id: 'sex',
        label: isStud ? 'Sire Badge' : 'Sex Pill',
        visible: true,
        text: sexLabel,
        x: 540,
        y: canvasH - 102,
        fontSize: 25,
        pillWidth: isStud ? 290 : 230,
        padY: 12,
        pill: sexPillStyle,
        font: 'sans'
      },
      {
        id: 'coat',
        label: 'Coat / DNA',
        visible: isStud || preset === 'no-photo',
        text: coatStr,
        x: 540,
        y: preset === 'no-photo' ? Math.round(canvasH * 0.48) : 95,
        fontSize: 26,
        pillWidth: 680,
        padY: 13,
        pill: 'frosted',
        font: 'sans'
      },
      {
        id: 'handle',
        label: '@okcfrenchies',
        visible: preset === 'no-photo',
        text: '@okcfrenchies',
        x: 540,
        y: 80,
        fontSize: 22,
        pillWidth: 260,
        padY: 10,
        pill: 'frosted',
        font: 'sans'
      },
      {
        id: 'status',
        label: 'Status Pill',
        visible: preset === 'no-photo',
        text: statusStr,
        x: 540,
        y: 165,
        fontSize: 24,
        pillWidth: 460,
        padY: 12,
        pill: 'gold',
        font: 'sans'
      },
      {
        id: 'name',
        label: 'Meet Name',
        visible: preset === 'no-photo',
        text: isStud ? `Sire: ${dog.name}` : `Meet ${dog.name}`,
        x: 540,
        y: preset === 'no-photo' ? Math.round(canvasH * 0.34) : canvasH - 285,
        fontSize: 64,
        pillWidth: 720,
        padY: 10,
        pill: topTextPill,
        font: 'serif'
      },
      {
        id: 'dna',
        label: 'DNA String',
        visible: false,
        text: dnaStr ? `DNA: ${dnaStr}` : `DNA: ${coatStr || '6-Panel Cleared'}`,
        x: 540,
        y: 235,
        fontSize: 22,
        pillWidth: 780,
        padY: 12,
        pill: 'cream',
        font: 'sans'
      },
      {
        id: 'quote',
        label: 'Sweet Quote',
        visible: preset === 'no-photo',
        text: quoteStr,
        x: 540,
        y: preset === 'no-photo' ? Math.round(canvasH * 0.62) : 325,
        fontSize: 27,
        pillWidth: 820,
        padY: 16,
        pill: 'cream',
        font: 'serif-italic'
      },
      {
        id: 'contact',
        label: 'Contact Info',
        visible: false,
        text: 'Text 405.300.8482 • info@okcfrenchies.com',
        x: 540,
        y: canvasH - 42,
        fontSize: 22,
        pillWidth: 660,
        padY: 12,
        pill: 'sage',
        font: 'sans'
      }
    ];
  }

  const geom = getFrameGeometry(preset, canvasH, archH, bgStyle, windowStyle);
  const photoBottom = geom.photoY + geom.photoH;

  return [
    {
      id: 'status',
      label: 'Status Pill',
      visible: true,
      text: statusStr,
      x: preset === 'sage' ? geom.photoX + 200 : 395,
      y: preset === 'sage' ? geom.cardY + 46 : photoBottom,
      fontSize: 21,
      pillWidth: 380,
      padY: 11,
      pill: 'gold',
      font: 'sans'
    },
    {
      id: 'sex',
      label: isStud ? 'Sire Badge' : 'Sex Pill',
      visible: true,
      text: sexLabel,
      x: preset === 'sage' ? geom.photoX + 510 : 715,
      y: preset === 'sage' ? geom.cardY + 46 : photoBottom,
      fontSize: 21,
      pillWidth: 235,
      padY: 11,
      pill: sexPillStyle,
      font: 'sans'
    },
    {
      id: 'handle',
      label: '@okcfrenchies',
      visible: preset === 'sage',
      text: '@okcfrenchies',
      x: preset === 'sage' ? geom.photoX + geom.photoW - 115 : 540,
      y: preset === 'sage' ? geom.cardY + 46 : 90,
      fontSize: 22,
      pillWidth: 230,
      padY: 8,
      pill: baseTextPill,
      font: 'sans'
    },
    {
      id: 'name',
      label: 'Meet Name',
      visible: true,
      text: isStud ? `Sire: ${dog.name}` : `Meet ${dog.name}`,
      x: 540,
      y: photoBottom + 70,
      fontSize: 58,
      pillWidth: 780,
      padY: 8,
      pill: baseTextPill,
      font: 'serif'
    },
    {
      id: 'breedAge',
      label: 'Breed & Age',
      visible: true,
      text: breedAgeStr.toUpperCase(),
      x: 540,
      y: photoBottom + 126,
      fontSize: 22,
      pillWidth: 800,
      padY: 6,
      pill: baseTextPill,
      font: 'sans'
    },
    {
      id: 'coat',
      label: 'Coat Color',
      visible: true,
      text: coatStr,
      x: 540,
      y: photoBottom + 168,
      fontSize: 25,
      pillWidth: 840,
      padY: 8,
      pill: baseTextPill,
      font: 'sans'
    },
    {
      id: 'dna',
      label: 'DNA String',
      visible: Boolean(dnaStr),
      text: dnaStr ? `DNA: ${dnaStr}` : `DNA: ${coatStr}`,
      x: 540,
      y: photoBottom + 218,
      fontSize: 20,
      pillWidth: 780,
      padY: 10,
      pill: 'cream',
      font: 'sans'
    },
    {
      id: 'quote',
      label: 'Sweet Quote',
      visible: true,
      text: quoteStr,
      x: 540,
      y: photoBottom + (dnaStr ? 276 : 230),
      fontSize: 25,
      pillWidth: 840,
      padY: 10,
      pill: baseTextPill,
      font: 'serif-italic'
    },
    {
      id: 'contact',
      label: 'Contact Pill',
      visible: true,
      text: 'Text 405.300.8482 • info@okcfrenchies.com',
      x: 540,
      y: canvasH - geom.cardY - 46,
      fontSize: 21,
      pillWidth: 650,
      padY: 12,
      pill: theme.darkText ? 'sage' : 'gold',
      font: 'sans'
    }
  ];
};

const buildDefaultDogCaption = (dog: DogRecord | undefined) => {
  if (!dog) return '';
  const slug = dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const age = extractAge(dog);
  const quote = DEFAULT_QUOTES[slug]?.replace(/^"|"$/g, '') || '';
  const isStud = dog.category === 'Stud';

  if (isStud) {
    return [
      `👑 Sire Spotlight: ${dog.name} ✨`,
      quote,
      '',
      `🐾 Breed: ${dog.breed || 'French Bulldog'} Proven Sire`,
      dog.dna ? `🧬 Genetics: ${dog.dna}` : '',
      `✈️ Same-day nationwide airport shipping & local OKC AI support available!`,
      '',
      `💬 Which trait are you looking to add to your next pairing? Drop a comment or text us! 👇`,
      '',
      `📲 Text Lindsey or Eric: 405.300.8482`,
      `📩 Email: info@okcfrenchies.com`,
      `🌐 OKCFrenchies.com`,
      '',
      `#okcfrenchies #frenchbulldogstud #frenchiegenetics #pinkfrenchie #fluffyfrenchie #oklahomacity`
    ]
      .filter((l, idx, arr) => l !== '' || arr[idx - 1] !== '')
      .join('\n');
  }

  return [
    `🌿 Meet ${dog.name} ✨`,
    quote,
    '',
    `🐾 Breed: ${dog.breed || 'French Bulldog'} (${dog.gender || ''})`,
    age ? `🎂 Age: ${age}` : '',
    dog.dna ? `🎨 Coat: ${dog.dna}` : '',
    dog.dna_technical ? `🧬 DNA: ${dog.dna_technical}` : '',
    `✈️ Raised underfoot in our OKC home • Live FaceTime & Flight Nanny available!`,
    '',
    `📲 Text Lindsey or Eric: 405.300.8482`,
    `📩 Email: info@okcfrenchies.com`,
    `🌐 OKCFrenchies.com`,
    '',
    `#okcfrenchies #frenchbulldog #minibulldog #oklahomacity #frenchiepuppy #rarefrenchies`
  ]
    .filter((l, idx, arr) => l !== '' || arr[idx - 1] !== '')
    .join('\n');
};

const makeInitialSlide = (dog: DogRecord, ratio: CanvasRatio): SlideState => {
  const ch = getCanvasHeight(ratio);
  const archH = ratio === 'story' ? 1180 : ratio === 'square' ? 600 : 800;
  return {
    id: 'slide-1',
    preset: 'arch',
    bgStyle: 'sage-mist',
    windowStyle: 'cream-editorial',
    dogId: dog.id,
    slideMode: dog.category === 'Stud' ? 'studs' : 'puppies',
    photoSrc: dog.image || '',
    photoDim: 0,
    panX: 0,
    panY: 0,
    zoom: 1,
    archHeight: archH,
    layers: buildLayersForDog(dog, 'arch', ch, archH, 'sage-mist', 'cream-editorial')
  };
};

const inferDogFromSlide = (slide: SlideState | undefined, allDogs: DogRecord[]): DogRecord | undefined => {
  if (!slide) return undefined;
  if (slide.dogId) {
    const byId = allDogs.find((d) => d.id === slide.dogId);
    if (byId) return byId;
  }
  const nameLayer = slide.layers.find((l) => l.id === 'name');
  if (nameLayer) {
    for (const d of allDogs) {
      const escaped = d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const nameRe = new RegExp(`\\b${escaped}\\b`, 'i');
      if (nameRe.test(nameLayer.text)) {
        return d;
      }
    }
  }
  if (slide.photoSrc) {
    const byPhoto = allDogs.find(
      (d) =>
        d.image === slide.photoSrc ||
        (d.media || []).some((m) => m.url === slide.photoSrc)
    );
    if (byPhoto) return byPhoto;
  }
  for (const d of allDogs) {
    const escaped = d.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRe = new RegExp(`\\b${escaped}\\b`, 'i');
    if (slide.layers.some((l) => nameRe.test(l.text))) {
      return d;
    }
  }
  return undefined;
};

const SocialStudio: React.FC = () => {
  const allPuppies: DogRecord[] = useMemo(
    () => (puppiesData as any[]).map((d) => ({ ...d, category: 'Puppy' as const })),
    []
  );
  const allStuds: DogRecord[] = useMemo(
    () => (studsData as any[]).map((d) => ({ ...d, category: 'Stud' as const })),
    []
  );

  const allDogs: DogRecord[] = useMemo(
    () => [...allPuppies, ...allStuds],
    [allPuppies, allStuds]
  );

  const defaultStudioDog: DogRecord = useMemo(
    () =>
      allPuppies.find((d) => d.name.toLowerCase() === 'phatty patty') ||
      allPuppies.find((d) => d.status === 'Available') ||
      allPuppies[0],
    [allPuppies]
  );

  // Content Mode
  const [contentMode, setContentMode] = useState<ContentMode>('puppies');
  const [filterMode, setFilterMode] = useState<'available' | 'all'>('available');
  const [selectedDogId, setSelectedDogId] = useState<string>(
    () => defaultStudioDog?.id || ''
  );
  const [selectedGlossaryId, setSelectedGlossaryId] = useState<string>(GLOSSARY_ITEMS[0]?.id || '');
  const [selectedStandardId, setSelectedStandardId] = useState<string>(
    STANDARDS_AND_BLOG_ITEMS[0]?.id || ''
  );
  const [selectedDykIndex, setSelectedDykIndex] = useState<number>(0);

  const visibleDogs = useMemo(() => {
    if (contentMode === 'studs') return allStuds;
    if (filterMode === 'all') return allPuppies;
    return allPuppies.filter((d) => {
      const s = (d.status || '').toLowerCase();
      return (
        s === 'available' ||
        s === 'pending' ||
        s.includes('keeper') ||
        s.includes('retained') ||
        s.includes('co-own')
      );
    });
  }, [contentMode, filterMode, allPuppies, allStuds]);

  const selectedDog = useMemo(
    () =>
      allDogs.find((d) => d.id === selectedDogId) ||
      defaultStudioDog ||
      visibleDogs[0] ||
      allPuppies[0],
    [allDogs, visibleDogs, selectedDogId, allPuppies, defaultStudioDog]
  );

  const activeTopicItem: TopicCardItem | null = useMemo(() => {
    if (contentMode === 'glossary') {
      return GLOSSARY_ITEMS.find((g) => g.id === selectedGlossaryId) || GLOSSARY_ITEMS[0];
    }
    if (contentMode === 'standards') {
      return (
        STANDARDS_AND_BLOG_ITEMS.find((s) => s.id === selectedStandardId) ||
        STANDARDS_AND_BLOG_ITEMS[0]
      );
    }
    if (contentMode === 'didyouknow') {
      return DID_YOU_KNOW_ITEMS[selectedDykIndex % DID_YOU_KNOW_ITEMS.length];
    }
    return null;
  }, [contentMode, selectedGlossaryId, selectedStandardId, selectedDykIndex]);

  const galleryPhotos = useMemo(() => {
    if (!selectedDog) return [];
    const urls = (selectedDog.media || [])
      .filter((m) => m.type === 'image' && m.url)
      .map((m) => m.url);
    if (selectedDog.image && !urls.includes(selectedDog.image)) {
      urls.unshift(selectedDog.image);
    }
    return urls;
  }, [selectedDog]);

  // Canvas Ratio & Multi-Slide Carousel State
  const [ratio, setRatio] = useState<CanvasRatio>('feed');
  const canvasH = getCanvasHeight(ratio);

  const [slides, setSlides] = useState<SlideState[]>(() => [
    makeInitialSlide(defaultStudioDog, 'feed')
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState<number>(0);
  const activeSlide = slides[activeSlideIdx] || slides[0];

  // Undo History Stack
  const [history, setHistory] = useState<SlideState[][]>([]);
  const pushHistory = (snapshot: SlideState[]) => {
    setHistory((prev) => [...prev.slice(-22), JSON.parse(JSON.stringify(snapshot))]);
  };
  const handleUndo = () => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setSlides(last);
      setActiveSlideIdx((idx) => Math.min(idx, last.length - 1));
      return prev.slice(0, -1);
    });
  };

  // Saved Custom Layout Presets
  const [savedLayouts, setSavedLayouts] = useState<SavedLayoutPreset[]>(() => {
    try {
      const raw = localStorage.getItem(SAVED_PRESETS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [newPresetName, setNewPresetName] = useState<string>('');

  // Selection, Snap Guides & UI Tabs
  const [photoLocked, setPhotoLocked] = useState<boolean>(false);
  const [imgNat, setImgNat] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [snapVertical, setSnapVertical] = useState<boolean>(false);
  const [snapHorizontal, setSnapHorizontal] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<
    'source' | 'fields' | 'stamps' | 'style' | 'layouts' | 'caption' | null
  >('source');
  const toggleAccordion = (
    sec: 'source' | 'fields' | 'stamps' | 'style' | 'layouts' | 'caption'
  ) => {
    setMobileTab((prev) => (prev === sec ? null : sec));
  };

  // Caption & Link State
  const [captionText, setCaptionText] = useState<string>(() =>
    buildDefaultDogCaption(defaultStudioDog)
  );
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiCategory, setAiCategory] = useState<string>('did-you-know');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string>('');

  // Direct Share URL (matches api/page.mjs Open Graph link preview routes!)
  const directShareUrl = useMemo(() => {
    if (contentMode === 'puppies' && selectedDog) {
      const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `https://okcfrenchies.com/puppies/${slug}`;
    }
    if (contentMode === 'studs' && selectedDog) {
      const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return `https://okcfrenchies.com/studs/${slug}`;
    }
    return activeTopicItem?.shareUrl || 'https://okcfrenchies.com';
  }, [contentMode, selectedDog, activeTopicItem]);

  // Responsive Stage Sizing
  const [stageWidth, setStageWidth] = useState<number>(480);
  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStageWidth(Math.min(395, w - 24));
      } else {
        setStageWidth(ratio === 'story' ? 380 : ratio === 'square' ? 480 : 490);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ratio]);

  const stageScale = stageWidth / 1080;
  const stageHeight = canvasH * stageScale;

  // Helpers to mutate active slide cleanly
  const updateActiveSlide = (patch: Partial<SlideState>, recordUndo = false) => {
    setSlides((prev) => {
      if (recordUndo) pushHistory(prev);
      return prev.map((s, idx) => (idx === activeSlideIdx ? { ...s, ...patch } : s));
    });
  };

  const updateLayer = (id: string, patch: Partial<TextLayer>, recordUndo = false) => {
    setSlides((prev) => {
      if (recordUndo) pushHistory(prev);
      return prev.map((s, idx) =>
        idx === activeSlideIdx
          ? { ...s, layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)) }
          : s
      );
    });
  };

  // Reset Studio back to the fresh default Phatty Patty Botanical Arch theme
  const handleResetStudioDefault = () => {
    const defaultDog = defaultStudioDog;
    if (!defaultDog) return;
    pushHistory(slides);
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setRatio('feed');
    setContentMode('puppies');
    setFilterMode('available');
    setSelectedDogId(defaultDog.id);
    setSlides([makeInitialSlide(defaultDog, 'feed')]);
    setActiveSlideIdx(0);
    setCaptionText(buildDefaultDogCaption(defaultDog));
    setSelectedLayerId(null);
    setEditingLayerId(null);
    setDraftSavedAt('Default Restored');
  };

  // Load draft once on mount if present
  const didMountRef = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          // Repair any slide where a saved layout updated text/dogId to one dog (e.g. Shuffin) but left another dog's catalog photo
          const repairedSlides: SlideState[] = parsed.slides.map((s: SlideState) => {
            const dog = inferDogFromSlide(s, allDogs);
            if (!dog) return s;
            const belongsToDog =
              s.photoSrc === dog.image ||
              (dog.media || []).some((m) => m.url === s.photoSrc);
            const belongsToOtherDog =
              !belongsToDog &&
              Boolean(s.photoSrc) &&
              allDogs.some(
                (other) =>
                  other.id !== dog.id &&
                  (other.image === s.photoSrc ||
                    (other.media || []).some((m) => m.url === s.photoSrc))
              );
            return {
              ...s,
              dogId: dog.id,
              photoSrc: belongsToOtherDog || !s.photoSrc ? dog.image || s.photoSrc : s.photoSrc
            };
          });
          setSlides(repairedSlides);
          if (parsed.ratio) setRatio(parsed.ratio);
          if (parsed.captionText) setCaptionText(parsed.captionText);
          const firstSlide: SlideState = repairedSlides[0];
          const inferredDog = inferDogFromSlide(firstSlide, allDogs);
          if (inferredDog) {
            setSelectedDogId(inferredDog.id);
            setContentMode(inferredDog.category === 'Stud' ? 'studs' : 'puppies');
            if (
              inferredDog.category !== 'Stud' &&
              inferredDog.status !== 'Available' &&
              inferredDog.status !== 'Pending'
            ) {
              setFilterMode('all');
            }
          } else if (firstSlide.slideMode) {
            setContentMode(firstSlide.slideMode);
          } else if (parsed.contentMode) {
            setContentMode(parsed.contentMode);
          }
        }
      }
    } catch {
      // ignore corrupt draft
    }
    setTimeout(() => {
      didMountRef.current = true;
    }, 100);
  }, [allDogs]);

  // Keep sidebar dog/mode synced with whichever slide the user selects!
  useEffect(() => {
    if (!activeSlide) return;
    if (activeSlide.slideMode && activeSlide.slideMode !== 'puppies' && activeSlide.slideMode !== 'studs') {
      setContentMode(activeSlide.slideMode);
      if (activeSlide.topicId) {
        if (activeSlide.slideMode === 'glossary') setSelectedGlossaryId(activeSlide.topicId);
        if (activeSlide.slideMode === 'standards') setSelectedStandardId(activeSlide.topicId);
        if (activeSlide.slideMode === 'didyouknow') {
          const idx = DID_YOU_KNOW_ITEMS.findIndex((i) => i.id === activeSlide.topicId);
          if (idx >= 0) setSelectedDykIndex(idx);
        }
      }
      return;
    }
    const inferred = inferDogFromSlide(activeSlide, allDogs);
    if (inferred) {
      setSelectedDogId(inferred.id);
      if (inferred.category === 'Stud') {
        setContentMode('studs');
      } else {
        setContentMode('puppies');
        if (inferred.status !== 'Available' && inferred.status !== 'Pending') {
          setFilterMode('all');
        }
      }
    }
  }, [activeSlideIdx, allDogs]);

  // Auto-save working draft
  useEffect(() => {
    if (!didMountRef.current) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_STORAGE_KEY,
          JSON.stringify({ slides, ratio, contentMode, captionText })
        );
        setDraftSavedAt('Saved');
      } catch {
        // storage quota full (e.g. huge custom dataURL)
      }
    }, 650);
    return () => clearTimeout(t);
  }, [slides, ratio, contentMode, captionText]);

  // Apply content selection to ONLY the active slide (preserving existing slide design/layout when switching dogs!)
  const loadDogIntoCard = (
    dog: DogRecord,
    targetPreset?: FramePreset,
    targetRatio?: CanvasRatio,
    resetLayout = false
  ) => {
    const r = targetRatio || ratio;
    const ch = getCanvasHeight(r);
    const pr =
      targetPreset ||
      (activeSlide.preset === 'no-photo' ? 'minimal' : activeSlide.preset) ||
      'minimal';
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'cream-editorial';
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    const currentArch =
      activeSlide.archHeight ||
      (r === 'story' ? 1180 : r === 'square' ? 580 : pr === 'sage' ? 740 : 800);

    const freshDogLayers = buildLayersForDog(dog, pr, ch, currentArch, currentBg, currentWin);
    const hasExistingDogLayers = activeSlide.layers.some(
      (l) => l.id === 'breedAge' || l.id === 'name' || l.id === 'sex'
    );

    // If active slide already has a puppy layout and resetLayout is false, preserve 100% of positions, sizes, colors & visibility!
    const nextLayers: TextLayer[] =
      hasExistingDogLayers && !resetLayout
        ? activeSlide.layers.map((existingLayer) => {
            const freshMatch = freshDogLayers.find((fl) => fl.id === existingLayer.id);
            if (!freshMatch) return existingLayer; // Keep custom stickers/pills untouched!
            return {
              ...existingLayer,
              text: freshMatch.text,
              pill: existingLayer.id === 'sex' ? freshMatch.pill : existingLayer.pill
            };
          })
        : freshDogLayers;

    updateActiveSlide(
      {
        preset: pr,
        bgStyle: currentBg,
        windowStyle: currentWin,
        dogId: dog.id,
        slideMode: dog.category === 'Stud' ? 'studs' : 'puppies',
        topicId: undefined,
        photoSrc: dog.image || '',
        panX: 0,
        panY: 0,
        archHeight: currentArch,
        layers: nextLayers
      },
      true
    );
    setCaptionText(buildDefaultDogCaption(dog));
    setSelectedLayerId(null);
    setEditingLayerId(null);
  };

  // Load a Topic (Coat & DNA, Standards/Blog, Did You Know) into ONLY the active slide without touching other slides!
  const loadTopicIntoCard = (item: TopicCardItem, targetRatio?: CanvasRatio) => {
    const r = targetRatio || ratio;
    const ch = getCanvasHeight(r);
    const hasImg = Boolean(item.image);
    updateActiveSlide(
      {
        preset: hasImg ? 'minimal' : 'no-photo',
        bgStyle: item.bgStyle,
        slideMode: contentMode,
        topicId: item.id,
        photoSrc: item.image || activeSlide.photoSrc || selectedDog?.image || '',
        photoDim: hasImg ? 0.5 : 0,
        panX: 0,
        panY: 0,
        zoom: 1,
        archHeight: 800,
        layers: buildTopicLayers(item, ch)
      },
      true
    );
    setCaptionText(buildTopicCaption(item));
    setSelectedLayerId(null);
    setEditingLayerId(null);
  };

  // Handle Ratio Switch (rescale Y positions proportionally across all slides!)
  const handleSwitchRatio = (nextRatio: CanvasRatio) => {
    if (nextRatio === ratio) return;
    const oldH = getCanvasHeight(ratio);
    const newH = getCanvasHeight(nextRatio);
    const scaleY = newH / oldH;
    pushHistory(slides);
    setRatio(nextRatio);
    setSlides((prev) =>
      prev.map((s) => ({
        ...s,
        archHeight:
          nextRatio === 'story' ? 1180 : nextRatio === 'square' ? 580 : s.preset === 'sage' ? 740 : 800,
        layers: s.layers.map((l) => ({
          ...l,
          y: Math.round(l.y * scaleY)
        }))
      }))
    );
  };

  // Handle Template Preset Switch on Active Slide (Preserves custom text, colors & visibility!)
  const handleSwitchPreset = (nextPreset: FramePreset) => {
    const defaultArch =
      ratio === 'story' ? 1180 : ratio === 'square' ? 580 : nextPreset === 'sage' ? 740 : 800;
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'cream-editorial';
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    const hasDogLayers = activeSlide.layers.some(
      (l) => l.id === 'breedAge' || l.id === 'name' || l.id === 'sex'
    );
    if ((contentMode === 'puppies' || contentMode === 'studs') && selectedDog && hasDogLayers) {
      const templateLayers = buildLayersForDog(
        selectedDog,
        nextPreset,
        canvasH,
        defaultArch,
        currentBg,
        currentWin
      );
      const customLayers = activeSlide.layers.filter(
        (el) => !templateLayers.some((tl) => tl.id === el.id)
      );
      const mergedLayers = [
        ...templateLayers.map((tl) => {
          const prev = activeSlide.layers.find((el) => el.id === tl.id);
          if (!prev) return tl;
          return {
            ...tl,
            text: prev.text,
            visible: prev.visible,
            font: prev.font,
            textColor: prev.textColor,
            pill: prev.pill === 'none-dark' || prev.pill === 'none-light' ? tl.pill : prev.pill
          };
        }),
        ...customLayers
      ];
      updateActiveSlide(
        {
          preset: nextPreset,
          bgStyle: currentBg,
          windowStyle: currentWin,
          photoSrc: activeSlide.photoSrc || selectedDog.image || '',
          archHeight: defaultArch,
          layers: mergedLayers
        },
        true
      );
    } else {
      updateActiveSlide(
        {
          preset: nextPreset,
          windowStyle: currentWin,
          photoSrc: activeSlide.photoSrc || selectedDog?.image || '',
          archHeight: defaultArch
        },
        true
      );
    }
  };

  // Change ONLY the Outer Background Color (keeps Inner Window / Card color untouched!)
  const handleSwitchBgTheme = (nextBg: BgStyle) => {
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    const nextPreset: FramePreset =
      activeSlide.preset === 'minimal' ? 'arch' : activeSlide.preset;
    const dark = BG_STYLES[nextBg].darkText;
    const updatedLayers = activeSlide.layers.map((l) => {
      if (nextPreset !== 'no-photo') return l;
      if (l.pill === 'none-dark' && !dark) return { ...l, pill: 'none-light' as PillStyle };
      if (l.pill === 'none-light' && dark) return { ...l, pill: 'none-dark' as PillStyle };
      return l;
    });
    if (
      activeSlide.preset === 'minimal' &&
      (contentMode === 'puppies' || contentMode === 'studs') &&
      selectedDog
    ) {
      const defaultArch = ratio === 'story' ? 1180 : ratio === 'square' ? 580 : 800;
      updateActiveSlide(
        {
          preset: 'arch',
          bgStyle: nextBg,
          windowStyle: currentWin,
          archHeight: defaultArch,
          layers: buildLayersForDog(selectedDog, 'arch', canvasH, defaultArch, nextBg, currentWin)
        },
        true
      );
      return;
    }
    updateActiveSlide(
      { preset: nextPreset, bgStyle: nextBg, windowStyle: currentWin, layers: updatedLayers },
      true
    );
  };

  // Change ONLY the Inner Window / Card Color (keeps Outer Background untouched!)
  const handleSwitchWindowTheme = (nextWin: BgStyle) => {
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'cream-editorial';
    const nextPreset: FramePreset =
      activeSlide.preset === 'minimal' || activeSlide.preset === 'no-photo'
        ? 'arch'
        : activeSlide.preset;
    const dark = BG_STYLES[nextWin].darkText;
    if (
      (activeSlide.preset === 'minimal' || activeSlide.preset === 'no-photo') &&
      (contentMode === 'puppies' || contentMode === 'studs') &&
      selectedDog
    ) {
      const defaultArch = ratio === 'story' ? 1180 : ratio === 'square' ? 580 : 800;
      updateActiveSlide(
        {
          preset: 'arch',
          bgStyle: currentBg,
          windowStyle: nextWin,
          archHeight: defaultArch,
          layers: buildLayersForDog(selectedDog, 'arch', canvasH, defaultArch, currentBg, nextWin)
        },
        true
      );
      return;
    }
    const updatedLayers = activeSlide.layers.map((l) => {
      if (l.pill === 'none-dark' && !dark) return { ...l, pill: 'none-light' as PillStyle };
      if (l.pill === 'none-light' && dark) return { ...l, pill: 'none-dark' as PillStyle };
      return l;
    });
    updateActiveSlide(
      { preset: nextPreset, windowStyle: nextWin, layers: updatedLayers },
      true
    );
  };

  // 1-Tap Swap Outer Background & Inner Window Colors
  const handleSwapBgAndWindow = () => {
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'cream-editorial';
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    const nextWin = currentBg;
    const nextBg = currentWin;
    const dark = BG_STYLES[nextWin].darkText;
    const updatedLayers = activeSlide.layers.map((l) => {
      if (l.pill === 'none-dark' && !dark) return { ...l, pill: 'none-light' as PillStyle };
      if (l.pill === 'none-light' && dark) return { ...l, pill: 'none-dark' as PillStyle };
      return l;
    });
    updateActiveSlide({ bgStyle: nextBg, windowStyle: nextWin, layers: updatedLayers }, true);
  };

  // Multi-Slide Carousel Builder
  const handleBuildAutoCarousel = () => {
    pushHistory(slides);
    if ((contentMode === 'puppies' || contentMode === 'studs') && selectedDog) {
      const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const quote =
        DEFAULT_QUOTES[slug] || '"Raised underfoot in our OKC home with 24/7 love & care."';
      const photo1 = galleryPhotos[0] || selectedDog.image || '';
      const photo2 = galleryPhotos[1] || photo1;
      const photo3 = galleryPhotos[2] || photo1;
      const slide1Layers = buildLayersForDog(selectedDog, 'minimal', canvasH, 800);
      slide1Layers.push({
        id: 'swipe-hint',
        label: 'Swipe Badge',
        visible: true,
        text: 'Swipe 👉',
        x: 910,
        y: 90,
        fontSize: 22,
        pillWidth: 210,
        padY: 10,
        pill: 'frosted',
        font: 'sans'
      });

      const slide2Layers: TextLayer[] = [
        {
          id: 's2-badge',
          label: 'Spotlight Tag',
          visible: true,
          text: `✨ ALL ABOUT ${selectedDog.name.toUpperCase()}`,
          x: 540,
          y: 120,
          fontSize: 23,
          pillWidth: 460,
          padY: 12,
          pill: 'gold',
          font: 'sans'
        },
        {
          id: 's2-coat',
          label: 'Coat & Genetics',
          visible: true,
          text: selectedDog.dna || selectedDog.breed || 'Rare Genetics',
          x: 540,
          y: canvasH - 275,
          fontSize: 32,
          pillWidth: 820,
          padY: 16,
          pill: 'cream',
          font: 'sans'
        },
        {
          id: 's2-quote',
          label: 'Personality Quote',
          visible: true,
          text: quote,
          x: 540,
          y: canvasH - 135,
          fontSize: 28,
          pillWidth: 860,
          padY: 18,
          pill: 'frosted',
          font: 'serif-italic'
        }
      ];

      const slide3Layers: TextLayer[] = [
        {
          id: 's3-badge',
          label: 'OKC Promise',
          visible: true,
          text: '🏡 THE OKC FRENCHIES PROMISE',
          x: 540,
          y: Math.round(canvasH * 0.24),
          fontSize: 23,
          pillWidth: 520,
          padY: 13,
          pill: 'gold',
          font: 'sans'
        },
        {
          id: 's3-title',
          label: 'CTA Headline',
          visible: true,
          text:
            selectedDog.category === 'Stud'
              ? `Book ${selectedDog.name} For Your Program`
              : `Bring ${selectedDog.name} Home`,
          x: 540,
          y: Math.round(canvasH * 0.4),
          fontSize: 58,
          pillWidth: 860,
          padY: 12,
          pill: 'none-light',
          font: 'serif'
        },
        {
          id: 's3-perks',
          label: 'Included Perks',
          visible: true,
          text:
            selectedDog.category === 'Stud'
              ? '✓ 6-Panel Health Cleared\n✓ Same-Day Airport Shipping\n✓ Breeder Support Included'
              : '✓ Live FaceTime Meet & Greet\n✓ 6-Panel Health Tested Parents\n✓ In-Cabin Flight Nanny Nationwide',
          x: 540,
          y: Math.round(canvasH * 0.6),
          fontSize: 29,
          pillWidth: 820,
          padY: 26,
          pill: 'frosted',
          font: 'sans'
        },
        {
          id: 's3-contact',
          label: 'Contact CTA',
          visible: true,
          text: 'Text Lindsey or Eric • 405.300.8482',
          x: 540,
          y: Math.round(canvasH * 0.8),
          fontSize: 26,
          pillWidth: 700,
          padY: 16,
          pill: 'cream',
          font: 'sans'
        }
      ];

      setSlides([
        {
          id: 'slide-1',
          preset: 'minimal',
          bgStyle: activeSlide.bgStyle || 'cream-editorial',
          photoSrc: photo1,
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: slide1Layers
        },
        {
          id: 'slide-2',
          preset: 'arch',
          bgStyle: activeSlide.bgStyle || 'cream-editorial',
          photoSrc: photo2,
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1.02,
          archHeight: 800,
          layers: slide2Layers
        },
        {
          id: 'slide-3',
          preset: photo3 ? 'minimal' : 'no-photo',
          bgStyle: 'forest-luxe',
          photoSrc: photo3,
          photoDim: 0.58,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: slide3Layers
        }
      ]);
      setActiveSlideIdx(0);
    } else if (activeTopicItem) {
      setSlides([
        {
          id: 'slide-1',
          preset: activeTopicItem.image ? 'minimal' : 'no-photo',
          bgStyle: activeTopicItem.bgStyle,
          photoSrc: activeTopicItem.image || selectedDog?.image || '',
          photoDim: activeTopicItem.image ? 0.5 : 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: [
            {
              id: 'c1-badge',
              label: 'Hook Tag',
              visible: true,
              text: activeTopicItem.badge,
              x: 540,
              y: Math.round(canvasH * 0.34),
              fontSize: 25,
              pillWidth: 540,
              padY: 14,
              pill: BG_STYLES[activeTopicItem.bgStyle].darkText ? 'sage' : 'gold',
              font: 'sans'
            },
            {
              id: 'c1-title',
              label: 'Big Hook',
              visible: true,
              text: activeTopicItem.title,
              x: 540,
              y: Math.round(canvasH * 0.52),
              fontSize: 66,
              pillWidth: 880,
              padY: 16,
              pill: BG_STYLES[activeTopicItem.bgStyle].darkText ? 'none-dark' : 'none-light',
              font: 'serif'
            },
            {
              id: 'c1-swipe',
              label: 'Swipe Prompt',
              visible: true,
              text: 'Swipe for the answer 👉',
              x: 540,
              y: Math.round(canvasH * 0.74),
              fontSize: 26,
              pillWidth: 460,
              padY: 14,
              pill: 'terracotta',
              font: 'sans'
            }
          ]
        },
        {
          id: 'slide-2',
          preset: 'no-photo',
          bgStyle: 'cream-editorial',
          photoSrc: '',
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: [
            {
              id: 'c2-badge',
              label: 'The Breakdown',
              visible: true,
              text: '🌿 HERE IS WHY IT MATTERS',
              x: 540,
              y: Math.round(canvasH * 0.28),
              fontSize: 24,
              pillWidth: 500,
              padY: 13,
              pill: 'sage',
              font: 'sans'
            },
            {
              id: 'c2-body',
              label: 'Explanation',
              visible: true,
              text: activeTopicItem.body,
              x: 540,
              y: Math.round(canvasH * 0.52),
              fontSize: 38,
              pillWidth: 860,
              padY: 36,
              pill: 'cream',
              font: 'serif'
            },
            {
              id: 'c2-swipe',
              label: 'Next Slide',
              visible: true,
              text: 'One more tip 👉',
              x: 540,
              y: Math.round(canvasH * 0.78),
              fontSize: 23,
              pillWidth: 340,
              padY: 12,
              pill: 'gold',
              font: 'sans'
            }
          ]
        },
        {
          id: 'slide-3',
          preset: 'no-photo',
          bgStyle: 'forest-luxe',
          photoSrc: '',
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: [
            {
              id: 'c3-badge',
              label: 'Save & Share',
              visible: true,
              text: '📌 SAVE & SHARE WITH A DOG LOVER',
              x: 540,
              y: Math.round(canvasH * 0.3),
              fontSize: 23,
              pillWidth: 580,
              padY: 13,
              pill: 'gold',
              font: 'sans'
            },
            {
              id: 'c3-q',
              label: 'Question',
              visible: true,
              text: 'Have a Frenchie question? Ask Lindsey & Eric below! 👇',
              x: 540,
              y: Math.round(canvasH * 0.52),
              fontSize: 48,
              pillWidth: 860,
              padY: 14,
              pill: 'none-light',
              font: 'serif'
            },
            {
              id: 'c3-cta',
              label: 'Contact',
              visible: true,
              text: 'Text 405.300.8482 • OKCFrenchies.com',
              x: 540,
              y: Math.round(canvasH * 0.75),
              fontSize: 26,
              pillWidth: 680,
              padY: 16,
              pill: 'cream',
              font: 'sans'
            }
          ]
        }
      ]);
      setActiveSlideIdx(0);
    }
  };

  const addBlankOrDuplicateSlide = () => {
    pushHistory(slides);
    const cloned: SlideState = JSON.parse(JSON.stringify(activeSlide));
    cloned.id = `slide-${Date.now()}`;
    setSlides((prev) => [...prev, cloned]);
    setActiveSlideIdx(slides.length);
  };

  const removeActiveSlide = () => {
    if (slides.length <= 1) return;
    pushHistory(slides);
    setSlides((prev) => prev.filter((_, i) => i !== activeSlideIdx));
    setActiveSlideIdx((idx) => Math.max(0, idx - 1));
  };

  // Add Custom Text or 1-Tap Status Stamp
  const addCustomText = () => {
    const id = `custom-${Date.now()}`;
    const newLayer: TextLayer = {
      id,
      label: 'Custom Pill',
      visible: true,
      text: 'Tap to edit ✨',
      x: 540,
      y: Math.round(canvasH * 0.45),
      fontSize: 34,
      pillWidth: 460,
      padY: 16,
      pill: 'cream',
      font: 'sans'
    };
    updateActiveSlide({ layers: [...activeSlide.layers, newLayer] }, true);
    setSelectedLayerId(id);
    setEditingLayerId(id);
  };

  const applyStampBadge = (stamp: { id: string; text: string; pill: PillStyle }) => {
    const existing = activeSlide.layers.find((l) => l.id === 'stamp-badge');
    if (existing) {
      updateLayer(
        'stamp-badge',
        { visible: true, text: stamp.text, pill: stamp.pill },
        true
      );
      setSelectedLayerId('stamp-badge');
      return;
    }
    const stampLayer: TextLayer = {
      id: 'stamp-badge',
      label: 'Sticker Stamp',
      visible: true,
      text: stamp.text,
      x: 540,
      y: 115,
      fontSize: 26,
      pillWidth: 440,
      padY: 14,
      pill: stamp.pill,
      font: 'sans'
    };
    updateActiveSlide({ layers: [...activeSlide.layers, stampLayer] }, true);
    setSelectedLayerId('stamp-badge');
  };

  // Save & Apply Custom User Layout Presets
  const handleSaveLayoutPreset = () => {
    const name = newPresetName.trim() || `My Layout ${savedLayouts.length + 1}`;
    const presetItem: SavedLayoutPreset = {
      id: `layout-${Date.now()}`,
      name,
      preset: activeSlide.preset,
      bgStyle: activeSlide.bgStyle,
      windowStyle: activeSlide.windowStyle || 'pure-white',
      photoDim: activeSlide.photoDim,
      archHeight: activeSlide.archHeight,
      layers: activeSlide.layers.map(({ text, ...rest }) => ({
        ...rest,
        sampleText: text
      }))
    };
    const next = [presetItem, ...savedLayouts];
    setSavedLayouts(next);
    localStorage.setItem(SAVED_PRESETS_KEY, JSON.stringify(next));
    setNewPresetName('');
  };

  const handleApplySavedLayout = (saved: SavedLayoutPreset) => {
    // Keep current dog's fresh text for matching standard layer IDs (breedAge, sex, name, coat, dna, quote, status)!
    const freshDogLayers =
      selectedDog && (contentMode === 'puppies' || contentMode === 'studs')
        ? buildLayersForDog(
            selectedDog,
            saved.preset,
            canvasH,
            saved.archHeight,
            saved.bgStyle,
            saved.windowStyle || 'pure-white'
          )
        : [];
    const freshTextMap = new Map(freshDogLayers.map((l) => [l.id, l.text]));

    const mergedLayers: TextLayer[] = saved.layers.map((sl) => ({
      id: sl.id,
      label: sl.label,
      visible: sl.visible,
      x: sl.x,
      y: sl.y,
      fontSize: sl.fontSize,
      pillWidth: sl.pillWidth,
      padY: sl.padY,
      pill:
        sl.id === 'sex' && selectedDog
          ? (selectedDog.gender || '').toLowerCase() === 'female'
            ? 'blush'
            : 'sage'
          : sl.pill,
      font: sl.font,
      textColor: sl.textColor,
      text: freshTextMap.get(sl.id) || sl.sampleText || sl.label
    }));

    const isDogMode = Boolean(selectedDog && (contentMode === 'puppies' || contentMode === 'studs'));
    const currentPhotoBelongsToSelectedDog =
      isDogMode &&
      selectedDog &&
      (activeSlide.photoSrc === selectedDog.image ||
        (selectedDog.media || []).some((m) => m.url === activeSlide.photoSrc));

    updateActiveSlide(
      {
        preset: saved.preset,
        bgStyle: saved.bgStyle,
        windowStyle: saved.windowStyle || 'pure-white',
        photoDim: saved.photoDim,
        archHeight: saved.archHeight,
        ...(isDogMode && selectedDog
          ? {
              dogId: selectedDog.id,
              photoSrc: currentPhotoBelongsToSelectedDog
                ? activeSlide.photoSrc
                : selectedDog.image || activeSlide.photoSrc
            }
          : {}),
        layers: mergedLayers
      },
      true
    );
  };

  const handleDeleteSavedLayout = (id: string) => {
    const next = savedLayouts.filter((s) => s.id !== id);
    setSavedLayouts(next);
    localStorage.setItem(SAVED_PRESETS_KEY, JSON.stringify(next));
  };

  const selectedLayer = useMemo(
    () => activeSlide.layers.find((l) => l.id === selectedLayerId) || null,
    [activeSlide.layers, selectedLayerId]
  );

  // Unified Drag & 4-Way Handle State
  const dragModeRef = useRef<{
    type:
      | 'none'
      | 'photo'
      | 'layer'
      | 'handle-left'
      | 'handle-right'
      | 'handle-top'
      | 'handle-bottom';
    layerId?: string;
    sx: number;
    sy: number;
    bx: number;
    by: number;
    bWidth: number;
    bPadY: number;
    moved: boolean;
    recordedUndo: boolean;
  }>({
    type: 'none',
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0,
    bWidth: 400,
    bPadY: 14,
    moved: false,
    recordedUndo: false
  });

  // Two-Finger Pinch State
  const pinchRef = useRef<{
    active: boolean;
    startDist: number;
    baseZoom: number;
    baseFontSize: number;
    targetLayerId: string | null;
  }>({
    active: false,
    startDist: 0,
    baseZoom: 1,
    baseFontSize: 30,
    targetLayerId: null
  });

  const handleTouchStartStage = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pushHistory(slides);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.max(12, Math.hypot(dx, dy));
      pinchRef.current = {
        active: true,
        startDist: dist,
        baseZoom: activeSlide.zoom,
        baseFontSize: selectedLayer?.fontSize || 30,
        targetLayerId: selectedLayerId
      };
      dragModeRef.current.type = 'none';
    }
  };

  const handleTouchMoveStage = (e: React.TouchEvent) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const ratioDist = Math.hypot(dx, dy) / pinchRef.current.startDist;
      if (pinchRef.current.targetLayerId) {
        const nextFont = Math.round(
          Math.max(15, Math.min(120, pinchRef.current.baseFontSize * ratioDist))
        );
        updateLayer(pinchRef.current.targetLayerId, { fontSize: nextFont });
      } else if (!photoLocked && activeSlide.preset !== 'no-photo') {
        const nextZoom = Math.max(0.6, Math.min(3.2, pinchRef.current.baseZoom * ratioDist));
        updateActiveSlide({ zoom: nextZoom });
      }
    }
  };

  const handleTouchEndStage = () => {
    if (pinchRef.current.active) {
      pinchRef.current.active = false;
    }
  };

  // AI Generation: Supports both Captions AND full AI "Did You Know / Comment Bait" Cards!
  const handleGenerateAiCaption = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt ?? aiPrompt;
    setAiLoading(true);
    setAiError('');

    const payloadDog = selectedDog
      ? {
          name: selectedDog.name,
          breed: selectedDog.breed,
          gender: selectedDog.gender,
          age: extractAge(selectedDog),
          status: selectedDog.status,
          dna: selectedDog.dna,
          dna_technical: selectedDog.dna_technical,
          description: selectedDog.description
        }
      : {};

    const payloadTopic = activeTopicItem
      ? {
          title: activeTopicItem.title,
          body: activeTopicItem.body
        }
      : {
          title: activeSlide.layers.find((l) => l.visible)?.text || ''
        };

    try {
      const resp = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'caption',
          contentMode,
          dog: payloadDog,
          topic: payloadTopic,
          prompt: promptToUse
        })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.caption) {
          setCaptionText(data.caption);
          setAiLoading(false);
          return;
        }
      }

      const clientKey =
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (process.env as any).GEMINI_API_KEY ||
        (process.env as any).API_KEY;
      if (clientKey) {
        const ai = new GoogleGenAI({ apiKey: clientKey });
        const result = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Write a warm, high-engagement Instagram caption for OKC Frenchies & Mini Bulldogs. Mode: ${contentMode}. ${
            contentMode === 'puppies' || contentMode === 'studs'
              ? `Dog: ${payloadDog.name}, ${payloadDog.gender || ''} ${payloadDog.breed || 'French Bulldog'}, coat: ${payloadDog.dna || ''}.`
              : `Topic: ${payloadTopic.title} — ${payloadTopic.body || ''}.`
          } Never include pricing. Include Text Lindsey or Eric at 405.300.8482, info@okcfrenchies.com, OKCFrenchies.com. Direction: ${promptToUse || 'Engaging question hook for comments.'}`
        });
        if (result.text) {
          setCaptionText(result.text.trim());
          setAiLoading(false);
          return;
        }
      }
      throw new Error('Add GEMINI_API_KEY in Vercel environment variables to enable live AI generation.');
    } catch (err: any) {
      setAiError(err?.message || 'Could not reach AI service.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateAiCardAndCaption = async (overrideCategory?: string, overridePrompt?: string) => {
    const cat = overrideCategory || aiCategory;
    const promptToUse = overridePrompt ?? aiPrompt;
    setAiLoading(true);
    setAiError('');

    try {
      let cardData: any = null;
      const resp = await fetch('/api/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'card', category: cat, prompt: promptToUse })
      });
      if (resp.ok) {
        cardData = await resp.json();
      } else {
        const clientKey =
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (process.env as any).GEMINI_API_KEY ||
        (process.env as any).API_KEY;
        if (clientKey) {
          const ai = new GoogleGenAI({ apiKey: clientKey });
          const res = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create an Instagram card for OKC Frenchies. Category: ${cat}. Topic: ${promptToUse || 'Surprising French Bulldog care tip, coat DNA fact, or comment game'}. Return JSON with keys: badge, headline, body (max 150 chars), footer, caption (no pricing, include 405.300.8482 and OKCFrenchies.com).`,
            config: { responseMimeType: 'application/json' }
          });
          cardData = JSON.parse((res.text || '{}').trim());
        }
      }

      if (!cardData?.headline) {
        throw new Error('Add GEMINI_API_KEY in Vercel environment variables (or tap Shuffle Built-In Ideas above!).');
      }

      const bgChoices: BgStyle[] = [
        'forest-luxe',
        'cream-editorial',
        'blush-botanical',
        'warm-sand',
        'sage-mist'
      ];
      const chosenBg =
        activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
          ? activeSlide.bgStyle
          : bgChoices[Math.floor(Math.random() * bgChoices.length)];

      const generatedItem: TopicCardItem = {
        id: `ai-${Date.now()}`,
        badge: cardData.badge || '💡 DID YOU KNOW?',
        title: cardData.headline,
        body: cardData.body || '',
        footer: cardData.footer || 'Drop your thoughts below! 👇 • @okcfrenchies',
        bgStyle: chosenBg,
        shareUrl: 'https://okcfrenchies.com'
      };

      updateActiveSlide(
        {
          preset: 'no-photo',
          bgStyle: chosenBg,
          slideMode: 'didyouknow',
          topicId: generatedItem.id,
          photoSrc: activeSlide.photoSrc,
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: buildTopicLayers(generatedItem, canvasH)
        },
        true
      );
      if (cardData.caption) setCaptionText(cardData.caption);
    } catch (err: any) {
      setAiError(err?.message || 'Could not generate AI card.');
    } finally {
      setAiLoading(false);
    }
  };

  // Exact 1:1 Canvas PNG Renderer for ANY Slide
  const renderSlideBlob = async (slide: SlideState): Promise<Blob | null> => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const geom = getFrameGeometry(
      slide.preset,
      canvasH,
      slide.archHeight,
      slide.bgStyle,
      slide.windowStyle || 'pure-white'
    );
    const outerGrad = ctx.createLinearGradient(0, 0, 1080, canvasH);
    outerGrad.addColorStop(0, geom.outerBg1);
    outerGrad.addColorStop(1, geom.outerBg2);
    ctx.fillStyle = outerGrad;
    ctx.fillRect(0, 0, 1080, canvasH);

    if (geom.hasCard) {
      ctx.save();
      ctx.shadowColor = 'rgba(28,38,33,0.12)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;
      roundRectPath(
        ctx,
        geom.cardX,
        geom.cardY,
        geom.cardW,
        geom.cardH,
        geom.cardTopR,
        geom.cardTopR,
        40,
        40
      );
      ctx.fillStyle = geom.cardBg;
      ctx.fill();
      ctx.restore();

      roundRectPath(
        ctx,
        geom.cardX,
        geom.cardY,
        geom.cardW,
        geom.cardH,
        geom.cardTopR,
        geom.cardTopR,
        40,
        40
      );
      ctx.strokeStyle = geom.cardBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (!geom.hasPhoto) {
      const bgTheme = BG_STYLES[slide.bgStyle] || BG_STYLES['cream-editorial'];
      ctx.save();
      roundRectPath(ctx, 42, 42, 1080 - 84, canvasH - 84, 220, 220, 36, 36);
      ctx.strokeStyle = bgTheme.darkText ? 'rgba(46,90,68,0.18)' : 'rgba(244,211,126,0.28)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      if (slide.preset === 'cameo') {
        ctx.beginPath();
        ctx.ellipse(
          geom.photoX + geom.photoW / 2,
          geom.photoY + geom.photoH / 2,
          geom.photoW / 2,
          geom.photoH / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.closePath();
      } else {
        roundRectPath(
          ctx,
          geom.photoX,
          geom.photoY,
          geom.photoW,
          geom.photoH,
          geom.photoTopR,
          geom.photoTopR,
          geom.photoBottomR,
          geom.photoBottomR
        );
      }
      ctx.clip();
      ctx.fillStyle = '#EFECE4';
      ctx.fillRect(geom.photoX, geom.photoY, geom.photoW, geom.photoH);
      const loadedImg = await loadImageElement(slide.photoSrc);
      if (loadedImg && loadedImg.naturalWidth > 0) {
        const coverScale =
          Math.max(geom.photoW / loadedImg.naturalWidth, geom.photoH / loadedImg.naturalHeight) *
          slide.zoom;
        const drawW = loadedImg.naturalWidth * coverScale;
        const drawH = loadedImg.naturalHeight * coverScale;
        const drawX = geom.photoX + (geom.photoW - drawW) / 2 + slide.panX;
        const drawY = geom.photoY + (geom.photoH - drawH) / 2 + slide.panY;
        ctx.drawImage(loadedImg, drawX, drawY, drawW, drawH);
      }
      if (slide.photoDim > 0) {
        ctx.fillStyle = `rgba(20, 28, 24, ${slide.photoDim})`;
        ctx.fillRect(geom.photoX, geom.photoY, geom.photoW, geom.photoH);
      }
      ctx.restore();

      if (slide.preset === 'cameo') {
        const winTheme = BG_STYLES[slide.windowStyle || 'pure-white'] || BG_STYLES['pure-white'];
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
          geom.photoX + geom.photoW / 2,
          geom.photoY + geom.photoH / 2,
          geom.photoW / 2 + 12,
          geom.photoH / 2 + 12,
          0,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = winTheme.accent;
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      }
    }

    for (const layer of slide.layers) {
      if (!layer.visible || !layer.text.trim()) continue;
      const fontSize = layer.fontSize;
      const fontSpec =
        layer.font === 'serif'
          ? `700 ${fontSize}px 'Playfair Display', serif`
          : layer.font === 'serif-italic'
            ? `italic 600 ${fontSize}px 'Playfair Display', serif`
            : `800 ${fontSize}px 'DM Sans', sans-serif`;
      ctx.font = fontSpec;

      const pal = PILL_PALETTE[layer.pill];
      const padX = pal.hasBg ? 26 : 8;
      const innerMaxW = Math.max(60, layer.pillWidth - padX * 2);
      const textLines = wrapLines(ctx, layer.text, innerMaxW);
      const lineH = fontSize * 1.24;
      const boxW = layer.pillWidth;
      const boxH = textLines.length * lineH + layer.padY * 2;
      const bx = layer.x - boxW / 2;
      const by = layer.y - boxH / 2;
      const r = textLines.length > 1 || layer.padY > 28 ? 32 : 999;

      if (pal.hasBg) {
        ctx.save();
        if (pal.shadow) {
          ctx.shadowColor = 'rgba(0,0,0,0.16)';
          ctx.shadowBlur = 22;
          ctx.shadowOffsetY = 8;
        }
        roundRectPath(ctx, bx, by, boxW, boxH, r, r, r, r);
        ctx.fillStyle = pal.bg;
        ctx.fill();
        ctx.restore();

        roundRectPath(ctx, bx, by, boxW, boxH, r, r, r, r);
        ctx.strokeStyle = pal.border;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (
        layer.pill === 'none-light' ||
        (!pal.hasBg && (layer.textColor === '#FFFFFF' || layer.textColor === '#F4D37E' || layer.textColor === '#F6F4EE'))
      ) {
        ctx.shadowColor = 'rgba(0,0,0,0.48)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;
      }

      ctx.fillStyle = layer.textColor || pal.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const totalH = (textLines.length - 1) * lineH;
      textLines.forEach((line, i) => {
        ctx.fillText(line, layer.x, layer.y - totalH / 2 + i * lineH + 2);
      });
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  };

  const handleExportSlides = async (exportAll: boolean, preferShare: boolean) => {
    const targetSlides = exportAll ? slides : [activeSlide];
    const baseSlug = (
      contentMode === 'puppies' || contentMode === 'studs'
        ? selectedDog?.name || 'card'
        : activeTopicItem?.id || 'okcfrenchies'
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const files: File[] = [];
    const blobs: { blob: Blob; name: string }[] = [];

    for (let i = 0; i < targetSlides.length; i++) {
      const b = await renderSlideBlob(targetSlides[i]);
      if (!b) continue;
      const suffix = targetSlides.length > 1 ? `-slide-${i + 1}` : '';
      const name = `okcfrenchies-${baseSlug}-${ratio}${suffix}.png`;
      blobs.push({ blob: b, name });
      files.push(new File([b], name, { type: 'image/png' }));
    }
    if (files.length === 0) return;

    if (preferShare && navigator.canShare && navigator.canShare({ files })) {
      try {
        await navigator.share({
          files,
          title: 'OKC Frenchies Social Post'
        });
        return;
      } catch {
        return;
      }
    }

    blobs.forEach(({ blob, name }, idx) => {
      setTimeout(() => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = name;
        a.href = url;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
      }, idx * 280);
    });
  };

  const geom = getFrameGeometry(
    activeSlide.preset,
    canvasH,
    activeSlide.archHeight,
    activeSlide.bgStyle,
    activeSlide.windowStyle || 'pure-white'
  );
  const previewScale =
    geom.hasPhoto && imgNat.w > 0 && imgNat.h > 0
      ? Math.max(geom.photoW / imgNat.w, geom.photoH / imgNat.h) * activeSlide.zoom
      : 1;
  const previewDrawW = imgNat.w > 0 ? imgNat.w * previewScale : geom.photoW;
  const previewDrawH = imgNat.h > 0 ? imgNat.h * previewScale : geom.photoH;
  const previewDrawX = (geom.photoW - previewDrawW) / 2 + activeSlide.panX;
  const previewDrawY = (geom.photoH - previewDrawH) / 2 + activeSlide.panY;

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1C2621] pb-16">
      <Helmet>
        <title>Instagram Card Studio | OKC Frenchies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Sticky Action Bar */}
      <div className="bg-white border-b border-[#EAE5D9] px-3 sm:px-6 py-2 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-base sm:text-xl font-bold text-[#2E5A44]">
              🌿 Card Studio
            </span>
            <div className="flex bg-[#F6F4EE] rounded-full p-0.5 border border-[#E2DCCD] text-[11px] sm:text-xs font-bold">
              {(
                [
                  ['feed', '4:5 Feed'],
                  ['story', '9:16 Story'],
                  ['square', '1:1']
                ] as const
              ).map(([rKey, rLabel]) => (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => handleSwitchRatio(rKey)}
                  className={`px-2.5 py-1 rounded-full transition ${
                    ratio === rKey ? 'bg-[#2E5A44] text-white' : 'text-[#5C6B63]'
                  }`}
                >
                  {rLabel}
                </button>
              ))}
            </div>
            {draftSavedAt && (
              <span className="hidden md:inline text-[11px] font-bold text-[#5C6B63]">
                ✓ Auto-saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleResetStudioDefault}
              className="px-2.5 py-1.5 rounded-full text-xs font-extrabold border bg-[#F6F4EE] border-[#D9D2C3] text-[#2E5A44] hover:bg-[#EAE5D9] transition"
              title="Reset Studio to default Phatty Patty Botanical Arch theme"
            >
              🔄 Default (Phatty Patty)
            </button>
            <button
              type="button"
              disabled={history.length === 0}
              onClick={handleUndo}
              className="px-2.5 py-1.5 rounded-full text-xs font-extrabold border bg-[#F6F4EE] border-[#D9D2C3] text-[#1C2621] disabled:opacity-40"
              title="Undo last change"
            >
              ↩ Undo
            </button>
            {geom.hasPhoto && (
              <button
                type="button"
                onClick={() => setPhotoLocked((v) => !v)}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold border transition ${
                  photoLocked
                    ? 'bg-[#F4D37E] border-[#D9B451] text-[#1C2621]'
                    : 'bg-[#F6F4EE] border-[#D9D2C3] text-[#5C6B63]'
                }`}
              >
                {photoLocked ? '🔒 Locked' : '🔓 Lock Photo'}
              </button>
            )}
            <button
              type="button"
              onClick={() => handleExportSlides(slides.length > 1, true)}
              className="sm:hidden px-3 py-1.5 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold shadow-sm"
            >
              📲 Share{slides.length > 1 ? ` (${slides.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => handleExportSlides(false, false)}
              className="px-3.5 py-1.5 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold hover:bg-[#234735] transition shadow-sm"
            >
              ⬇ PNG
            </button>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => handleExportSlides(true, false)}
                className="px-3.5 py-1.5 rounded-full bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm"
              >
                📚 All ({slides.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Mode Switcher Strip (What are we posting today?) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {(
            [
              ['puppies', '🐾 Puppies'],
              ['studs', '👑 Studs'],
              ['glossary', '🧬 Coat & DNA'],
              ['standards', '🏡 Standards & Blog'],
              ['didyouknow', '💡 Did You Know & AI']
            ] as const
          ).map(([modeKey, modeLabel]) => (
            <button
              key={modeKey}
              type="button"
              onClick={() => {
                setContentMode(modeKey);
                setMobileTab('source');
              }}
              className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-extrabold border transition shadow-2xs ${
                contentMode === modeKey
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-white text-[#3E4D45] border-[#DDD6C7] hover:bg-[#F6F4EE]'
              }`}
            >
              {modeLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-2.5 grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-5 items-start">
        {/* LEFT / TOP: Interactive Canva Stage */}
        <main className="flex flex-col items-center gap-2 lg:sticky lg:top-16 order-1">
          {/* Carousel Slide Strip */}
          <div className="w-full max-w-[520px] flex items-center justify-between gap-1.5 bg-white/80 border border-[#EAE5D9] rounded-2xl px-2.5 py-1.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    setActiveSlideIdx(idx);
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-extrabold transition ${
                    idx === activeSlideIdx
                      ? 'bg-[#2E5A44] text-white'
                      : 'bg-[#F6F4EE] text-[#5C6B63] border border-[#E2DCCD]'
                  }`}
                >
                  Slide {idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={addBlankOrDuplicateSlide}
                className="shrink-0 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-[#F6F4EE] text-[#2E5A44] border border-[#D4CEC0]"
                title="Duplicate current slide to add another carousel page"
              >
                + Slide
              </button>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={removeActiveSlide}
                  className="shrink-0 px-2 py-1 rounded-xl text-xs font-extrabold bg-[#FEE2E2] text-[#991B1B]"
                  title="Remove current slide"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleBuildAutoCarousel}
              className="shrink-0 px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-[#F4D37E] text-[#1C2621] border border-[#E2BE62]"
            >
              ✨ Auto 3-Slide
            </button>
          </div>

          {/* Quick Thumb Layer Picker Bar */}
          <div className="w-full max-w-[520px] flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedLayerId(null);
                setEditingLayerId(null);
              }}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-extrabold border transition ${
                !selectedLayerId
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-white text-[#5C6B63] border-[#DDD6C7]'
              }`}
            >
              {geom.hasPhoto ? '🖼️ Photo' : '🎨 Card Bg'}
            </button>
            {activeSlide.layers
              .filter((l) => l.visible)
              .map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setSelectedLayerId(l.id);
                    setEditingLayerId(null);
                  }}
                  className={`shrink-0 px-3 py-1 rounded-full text-xs font-extrabold border transition ${
                    selectedLayerId === l.id
                      ? 'bg-[#D46A4E] text-white border-[#D46A4E]'
                      : 'bg-white text-[#1C2621] border-[#DDD6C7]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
          </div>

          {/* Floating Contextual Layer Toolbar (Right above canvas — zero scrolling needed!) */}
          {selectedLayer ? (
            <div className="w-full max-w-[520px] bg-white border border-[#DDD6C7] rounded-2xl p-2.5 shadow-md space-y-2 text-xs">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={selectedLayer.text}
                  onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                  placeholder="Edit pill text..."
                  className="flex-1 rounded-lg border border-[#D46A4E] bg-[#FCFBF8] px-2.5 py-1.5 text-xs font-bold outline-none"
                />
                <select
                  value={selectedLayer.pill}
                  onChange={(e) =>
                    updateLayer(selectedLayer.id, { pill: e.target.value as PillStyle }, true)
                  }
                  className="rounded-lg border border-[#DDD6C7] bg-[#FCFBF8] px-2 py-1.5 font-bold"
                >
                  {Object.entries(PILL_PALETTE).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    updateLayer(
                      selectedLayer.id,
                      {
                        font:
                          selectedLayer.font === 'sans'
                            ? 'serif'
                            : selectedLayer.font === 'serif'
                              ? 'serif-italic'
                              : 'sans'
                      },
                      true
                    )
                  }
                  className="px-2 py-1.5 rounded-lg bg-[#F6F4EE] font-bold border border-[#DDD6C7]"
                >
                  Aa
                </button>
                <button
                  type="button"
                  onClick={() => updateLayer(selectedLayer.id, { x: 540 }, true)}
                  className="px-2 py-1.5 rounded-lg bg-[#F6F4EE] font-bold border border-[#DDD6C7]"
                  title="Center horizontally"
                >
                  ┼
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateLayer(selectedLayer.id, { visible: false }, true);
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-[#FEE2E2] text-[#991B1B] font-extrabold"
                  title="Hide pill"
                >
                  🗑️
                </button>
              </div>

              {/* Text Color Swatches (Works WITH or WITHOUT a Pill!) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-[#F0ECE1]">
                <span className="text-[11px] font-extrabold text-[#3E4D45] shrink-0">
                  Text Color:
                </span>
                {TEXT_COLOR_SWATCHES.map((sw) => {
                  const isActive = (selectedLayer.textColor || '') === sw.value;
                  return (
                    <button
                      key={sw.label}
                      type="button"
                      onClick={() =>
                        updateLayer(
                          selectedLayer.id,
                          { textColor: sw.value || undefined },
                          true
                        )
                      }
                      title={`Text Color: ${sw.label}`}
                      className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold transition ${
                        isActive
                          ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                          : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#3E4D45]'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                        style={{ background: sw.hex }}
                      />
                      <span>{sw.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[#F0ECE1]">
                <label className="block text-[11px] font-bold text-[#3E4D45]">
                  <div className="flex justify-between">
                    <span>Text Size</span>
                    <span className="text-[#D46A4E]">{selectedLayer.fontSize}</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={110}
                    value={selectedLayer.fontSize}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { fontSize: Number(e.target.value) })
                    }
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
                <label className="block text-[11px] font-bold text-[#3E4D45]">
                  <div className="flex justify-between">
                    <span>Pill Width</span>
                    <span className="text-[#D46A4E]">{Math.round(selectedLayer.pillWidth)}</span>
                  </div>
                  <input
                    type="range"
                    min={140}
                    max={1020}
                    value={selectedLayer.pillWidth}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { pillWidth: Number(e.target.value) })
                    }
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
                <label className="block text-[11px] font-bold text-[#3E4D45]">
                  <div className="flex justify-between">
                    <span>Pill Height</span>
                    <span className="text-[#D46A4E]">{Math.round(selectedLayer.padY)}</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={90}
                    value={selectedLayer.padY}
                    onChange={(e) =>
                      updateLayer(selectedLayer.id, { padY: Number(e.target.value) })
                    }
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
              </div>
            </div>
          ) : (
            <div className="text-[11px] sm:text-xs font-semibold text-[#5C6B63] bg-white px-3.5 py-1.5 rounded-full border border-[#EAE5D9] text-center">
              👆 Tap any pill to select • Pinch to scale text • Drag ◀ ▶ ▲ ▼ handles to size pill
            </div>
          )}

          {/* Interactive Stage */}
          <div
            onTouchStart={handleTouchStartStage}
            onTouchMove={handleTouchMoveStage}
            onTouchEnd={handleTouchEndStage}
            style={{
              width: stageWidth,
              height: stageHeight,
              touchAction: 'none'
            }}
            className="relative overflow-hidden rounded-2xl shadow-2xl select-none"
          >
            <div
              onPointerMove={(e) => {
                if (pinchRef.current.active) return;
                const dm = dragModeRef.current;
                if (dm.type === 'none') return;
                const dx = (e.clientX - dm.sx) / stageScale;
                const dy = (e.clientY - dm.sy) / stageScale;
                if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
                  if (!dm.recordedUndo) {
                    pushHistory(slides);
                    dm.recordedUndo = true;
                  }
                  dm.moved = true;
                }

                if (dm.type === 'photo') {
                  if (!photoLocked && geom.hasPhoto) {
                    updateActiveSlide({ panX: dm.bx + dx, panY: dm.by + dy });
                  }
                } else if (dm.type === 'layer' && dm.layerId) {
                  let nextX = dm.bx + dx;
                  let nextY = dm.by + dy;
                  if (Math.abs(nextX - 540) < 18) {
                    nextX = 540;
                    setSnapVertical(true);
                  } else {
                    setSnapVertical(false);
                  }
                  if (Math.abs(nextY - canvasH / 2) < 18) {
                    nextY = Math.round(canvasH / 2);
                    setSnapHorizontal(true);
                  } else {
                    setSnapHorizontal(false);
                  }
                  updateLayer(dm.layerId, { x: nextX, y: nextY });
                } else if (dm.type === 'handle-right' && dm.layerId) {
                  const nextW = Math.max(140, Math.min(1040, dm.bWidth + dx * 2));
                  updateLayer(dm.layerId, { pillWidth: nextW });
                } else if (dm.type === 'handle-left' && dm.layerId) {
                  const nextW = Math.max(140, Math.min(1040, dm.bWidth - dx * 2));
                  updateLayer(dm.layerId, { pillWidth: nextW });
                } else if (dm.type === 'handle-bottom' && dm.layerId) {
                  const nextPadY = Math.max(4, Math.min(110, dm.bPadY + dy));
                  updateLayer(dm.layerId, { padY: nextPadY });
                } else if (dm.type === 'handle-top' && dm.layerId) {
                  const nextPadY = Math.max(4, Math.min(110, dm.bPadY - dy));
                  updateLayer(dm.layerId, { padY: nextPadY });
                }
              }}
              onPointerUp={() => {
                if (
                  dragModeRef.current.type === 'photo' &&
                  !dragModeRef.current.moved &&
                  !pinchRef.current.active
                ) {
                  setSelectedLayerId(null);
                  setEditingLayerId(null);
                }
                dragModeRef.current.type = 'none';
                setSnapVertical(false);
                setSnapHorizontal(false);
              }}
              style={{
                width: 1080,
                height: canvasH,
                transform: `scale(${stageScale})`,
                transformOrigin: 'top left',
                background: `linear-gradient(155deg, ${geom.outerBg1}, ${geom.outerBg2})`,
                position: 'relative'
              }}
            >
              {geom.hasCard && (
                <div
                  style={{
                    position: 'absolute',
                    left: geom.cardX,
                    top: geom.cardY,
                    width: geom.cardW,
                    height: geom.cardH,
                    background: geom.cardBg,
                    border: `2px solid ${geom.cardBorder}`,
                    borderRadius: `${geom.cardTopR}px ${geom.cardTopR}px 40px 40px`,
                    boxShadow: '0 24px 60px rgba(28,38,33,0.12)'
                  }}
                />
              )}

              {/* Photo Window or No-Photo Decorative Arch Outline */}
              {!geom.hasPhoto ? (
                <div
                  onPointerDown={() => {
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  }}
                  style={{
                    position: 'absolute',
                    left: 42,
                    top: 42,
                    right: 42,
                    bottom: 42,
                    borderRadius: '220px 220px 36px 36px',
                    border: `3px solid ${
                      (BG_STYLES[activeSlide.bgStyle] || BG_STYLES['cream-editorial']).darkText
                        ? 'rgba(46,90,68,0.18)'
                        : 'rgba(244,211,126,0.28)'
                    }`
                  }}
                />
              ) : (
                <div
                  onPointerDown={(e) => {
                    if (!e.isPrimary || pinchRef.current.active) return;
                    dragModeRef.current = {
                      type: 'photo',
                      sx: e.clientX,
                      sy: e.clientY,
                      bx: activeSlide.panX,
                      by: activeSlide.panY,
                      bWidth: 0,
                      bPadY: 0,
                      moved: false,
                      recordedUndo: false
                    };
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  style={{
                    position: 'absolute',
                    left: geom.photoX,
                    top: geom.photoY,
                    width: geom.photoW,
                    height: geom.photoH,
                    borderRadius:
                      activeSlide.preset === 'cameo'
                        ? '50%'
                        : `${geom.photoTopR}px ${geom.photoTopR}px ${geom.photoBottomR}px ${geom.photoBottomR}px`,
                    boxShadow:
                      activeSlide.preset === 'cameo'
                        ? `0 0 0 10px ${geom.cardBg}, 0 0 0 14px ${(BG_STYLES[activeSlide.windowStyle || 'pure-white'] || BG_STYLES['pure-white']).accent}`
                        : undefined,
                    overflow: 'hidden',
                    background: '#EFECE4',
                    cursor: photoLocked ? 'default' : 'grab'
                  }}
                >
                  {activeSlide.photoSrc && (
                    <img
                      src={activeSlide.photoSrc}
                      alt={selectedDog?.name || 'Card'}
                      onLoad={(e) => {
                        const im = e.currentTarget;
                        setImgNat({ w: im.naturalWidth, h: im.naturalHeight });
                      }}
                      style={{
                        position: 'absolute',
                        left: previewDrawX,
                        top: previewDrawY,
                        width: previewDrawW,
                        height: previewDrawH,
                        maxWidth: 'none',
                        maxHeight: 'none',
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                  {activeSlide.photoDim > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: `rgba(20, 28, 24, ${activeSlide.photoDim})`,
                        pointerEvents: 'none'
                      }}
                    />
                  )}
                </div>
              )}

              {/* Center Snap Guides */}
              {snapVertical && (
                <div
                  style={{
                    position: 'absolute',
                    left: 539,
                    top: 0,
                    width: 2,
                    height: canvasH,
                    background: '#D46A4E',
                    zIndex: 40,
                    pointerEvents: 'none'
                  }}
                />
              )}
              {snapHorizontal && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: Math.round(canvasH / 2) - 1,
                    width: 1080,
                    height: 2,
                    background: '#D46A4E',
                    zIndex: 40,
                    pointerEvents: 'none'
                  }}
                />
              )}

              {/* Freeform Pills with Explicit Width/Padding & 4-Way Handles */}
              {activeSlide.layers.map((layer) => {
                if (!layer.visible) return null;
                const isSel = selectedLayerId === layer.id;
                const isEditing = editingLayerId === layer.id;
                const pal = PILL_PALETTE[layer.pill];
                const fontSize = layer.fontSize;
                const padX = pal.hasBg ? 26 : 8;

                const startHandle = (
                  handleType:
                    | 'handle-left'
                    | 'handle-right'
                    | 'handle-top'
                    | 'handle-bottom',
                  e: React.PointerEvent
                ) => {
                  e.stopPropagation();
                  dragModeRef.current = {
                    type: handleType,
                    layerId: layer.id,
                    sx: e.clientX,
                    sy: e.clientY,
                    bx: layer.x,
                    by: layer.y,
                    bWidth: layer.pillWidth,
                    bPadY: layer.padY,
                    moved: false,
                    recordedUndo: false
                  };
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                };

                return (
                  <div
                    key={layer.id}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (!e.isPrimary || pinchRef.current.active || isEditing) return;
                      setSelectedLayerId(layer.id);
                      dragModeRef.current = {
                        type: 'layer',
                        layerId: layer.id,
                        sx: e.clientX,
                        sy: e.clientY,
                        bx: layer.x,
                        by: layer.y,
                        bWidth: layer.pillWidth,
                        bPadY: layer.padY,
                        moved: false,
                        recordedUndo: false
                      };
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setSelectedLayerId(layer.id);
                      setEditingLayerId(layer.id);
                    }}
                    style={{
                      position: 'absolute',
                      left: layer.x,
                      top: layer.y,
                      transform: 'translate(-50%, -50%)',
                      padding: 22,
                      zIndex: isSel ? 30 : 20,
                      cursor: isEditing ? 'text' : 'move'
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: layer.pillWidth,
                        paddingTop: layer.padY,
                        paddingBottom: layer.padY,
                        paddingLeft: padX,
                        paddingRight: padX,
                        background: pal.bg,
                        color: layer.textColor || pal.text,
                        border: pal.hasBg ? `2px solid ${pal.border}` : 'none',
                        borderRadius:
                          layer.padY > 28 || layer.text.includes('\n') ? 32 : 999,
                        boxShadow: pal.shadow ? '0 10px 26px rgba(0,0,0,0.18)' : 'none',
                        textShadow:
                          layer.pill === 'none-light' ||
                          (!pal.hasBg &&
                            (layer.textColor === '#FFFFFF' ||
                              layer.textColor === '#F4D37E' ||
                              layer.textColor === '#F6F4EE'))
                            ? '0 4px 16px rgba(0,0,0,0.5)'
                            : 'none',
                        fontFamily:
                          layer.font === 'sans'
                            ? "'DM Sans', sans-serif"
                            : "'Playfair Display', serif",
                        fontStyle: layer.font === 'serif-italic' ? 'italic' : 'normal',
                        fontWeight: layer.font === 'serif-italic' ? 600 : 800,
                        fontSize,
                        lineHeight: 1.24,
                        textAlign: 'center',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        outline: isSel ? '3px dashed #D46A4E' : 'none',
                        outlineOffset: 6
                      }}
                    >
                      {isEditing ? (
                        <textarea
                          autoFocus
                          rows={3}
                          value={layer.text}
                          onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                          onBlur={() => setEditingLayerId(null)}
                          style={{
                            width: '100%',
                            background: 'transparent',
                            color: 'inherit',
                            font: 'inherit',
                            textAlign: 'center',
                            outline: 'none',
                            resize: 'none'
                          }}
                        />
                      ) : (
                        layer.text
                      )}

                      {isSel && !isEditing && (
                        <>
                          <div
                            onPointerDown={(e) => startHandle('handle-left', e)}
                            style={{
                              position: 'absolute',
                              left: -34,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 64,
                              height: 64,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'ew-resize'
                            }}
                          >
                            <span
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                background: '#D46A4E',
                                color: '#FFF',
                                border: '4px solid #FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 900,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
                              }}
                            >
                              ◀
                            </span>
                          </div>

                          <div
                            onPointerDown={(e) => startHandle('handle-right', e)}
                            style={{
                              position: 'absolute',
                              right: -34,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: 64,
                              height: 64,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'ew-resize'
                            }}
                          >
                            <span
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: 999,
                                background: '#D46A4E',
                                color: '#FFF',
                                border: '4px solid #FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 16,
                                fontWeight: 900,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
                              }}
                            >
                              ▶
                            </span>
                          </div>

                          <div
                            onPointerDown={(e) => startHandle('handle-top', e)}
                            style={{
                              position: 'absolute',
                              top: -34,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 64,
                              height: 64,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'ns-resize'
                            }}
                          >
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 999,
                                background: '#2E5A44',
                                color: '#FFF',
                                border: '4px solid #FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 15,
                                fontWeight: 900,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
                              }}
                            >
                              ▲
                            </span>
                          </div>

                          <div
                            onPointerDown={(e) => startHandle('handle-bottom', e)}
                            style={{
                              position: 'absolute',
                              bottom: -34,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 64,
                              height: 64,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'ns-resize'
                            }}
                          >
                            <span
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 999,
                                background: '#2E5A44',
                                color: '#FFF',
                                border: '4px solid #FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 15,
                                fontWeight: 900,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.25)'
                              }}
                            >
                              ▼
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT / BOTTOM: Compact Single-Open Accordion Panel (Zero Long Scrolling on Mobile!) */}
        <aside className="bg-white border border-[#EAE5D9] rounded-3xl p-3 sm:p-4 shadow-sm lg:h-[calc(100vh-118px)] lg:overflow-y-auto order-2 space-y-2">
          {/* ACCORDION 1: SOURCE CONTENT & PHOTO */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('source')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>
                {contentMode === 'puppies'
                  ? `🐶 Puppy & Photo (${selectedDog?.name || ''})`
                  : contentMode === 'studs'
                    ? `👑 Sire & Photo (${selectedDog?.name || ''})`
                    : `📚 Topic & Background Photo`}
              </span>
              <span className="text-[#2E5A44]">{mobileTab === 'source' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'source' && (
              <div className="p-3 space-y-3 bg-white">
              {(contentMode === 'puppies' || contentMode === 'studs') && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      {contentMode === 'studs' ? 'Select Sire / Stud' : 'Select Puppy'}
                    </span>
                    {contentMode === 'puppies' && (
                      <button
                        type="button"
                        onClick={() =>
                          setFilterMode(filterMode === 'available' ? 'all' : 'available')
                        }
                        className="text-xs font-bold text-[#D46A4E] underline"
                      >
                        {filterMode === 'available' ? 'Show Past Litters Too' : 'Available Only'}
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedDog?.id || ''}
                    onChange={(e) => {
                      const found = visibleDogs.find((d) => d.id === e.target.value);
                      setSelectedDogId(e.target.value);
                      if (found) loadDogIntoCard(found);
                    }}
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-sm font-bold"
                  >
                    {visibleDogs.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.status || d.category})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => selectedDog && loadDogIntoCard(selectedDog, undefined, undefined, false)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-[#E4EFE8] border border-[#2E5A44]/30 text-[#2E5A44] text-xs font-extrabold"
                    >
                      ✓ Apply {selectedDog?.name} to Slide {activeSlideIdx + 1} (Keep Layout)
                    </button>
                    <button
                      type="button"
                      onClick={() => selectedDog && loadDogIntoCard(selectedDog, undefined, undefined, true)}
                      className="py-1.5 px-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#5C6B63] text-xs font-bold"
                      title="Reset pill positions on this slide to default"
                    >
                      🔄 Reset
                    </button>
                  </div>

                  {galleryPhotos.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-[#3E4D45] mb-2">
                        Tap Photo to Swap Only Photo (Slide {activeSlideIdx + 1})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {galleryPhotos.map((url) => (
                          <img
                            key={url}
                            src={url}
                            alt={selectedDog?.name}
                            onClick={() =>
                              updateActiveSlide(
                                {
                                  preset: activeSlide.preset === 'no-photo' ? 'minimal' : activeSlide.preset,
                                  photoSrc: url,
                                  panX: 0,
                                  panY: 0
                                },
                                true
                              )
                            }
                            className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${
                              activeSlide.photoSrc === url && geom.hasPhoto
                                ? 'border-[#2E5A44] ring-2 ring-[#CFE2D7]'
                                : 'border-[#DDD6C7]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {contentMode === 'glossary' && (
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    🧬 17 Coat &amp; DNA Glossary Terms (Slide {activeSlideIdx + 1})
                  </div>
                  <select
                    value={selectedGlossaryId}
                    onChange={(e) => {
                      setSelectedGlossaryId(e.target.value);
                      const item = GLOSSARY_ITEMS.find((g) => g.id === e.target.value);
                      if (item) loadTopicIntoCard(item);
                    }}
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-sm font-bold"
                  >
                    {GLOSSARY_ITEMS.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title} ({g.badge.replace('🧬 ', '')})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const item = GLOSSARY_ITEMS.find((g) => g.id === selectedGlossaryId) || GLOSSARY_ITEMS[0];
                      if (item) loadTopicIntoCard(item);
                    }}
                    className="w-full py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold"
                  >
                    ✓ Load Term onto Slide {activeSlideIdx + 1}
                  </button>
                </div>
              )}

              {contentMode === 'standards' && (
                <div className="space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    🏡 OKC Standards, Care Rules &amp; Blog (Slide {activeSlideIdx + 1})
                  </div>
                  <select
                    value={selectedStandardId}
                    onChange={(e) => {
                      setSelectedStandardId(e.target.value);
                      const item = STANDARDS_AND_BLOG_ITEMS.find((s) => s.id === e.target.value);
                      if (item) loadTopicIntoCard(item);
                    }}
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-sm font-bold"
                  >
                    {STANDARDS_AND_BLOG_ITEMS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      const item =
                        STANDARDS_AND_BLOG_ITEMS.find((s) => s.id === selectedStandardId) ||
                        STANDARDS_AND_BLOG_ITEMS[0];
                      if (item) loadTopicIntoCard(item);
                    }}
                    className="w-full py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold"
                  >
                    ✓ Load Guide onto Slide {activeSlideIdx + 1}
                  </button>
                </div>
              )}

              {contentMode === 'didyouknow' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      💡 Facts &amp; Polls (Slide {activeSlideIdx + 1})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextIdx = (selectedDykIndex + 1) % DID_YOU_KNOW_ITEMS.length;
                        setSelectedDykIndex(nextIdx);
                        loadTopicIntoCard(DID_YOU_KNOW_ITEMS[nextIdx]);
                      }}
                      className="px-3 py-1 rounded-full bg-[#F4D37E] text-[#1C2621] text-xs font-extrabold"
                    >
                      🎲 Shuffle Idea
                    </button>
                  </div>

                  <select
                    value={selectedDykIndex}
                    onChange={(e) => {
                      const idx = Number(e.target.value);
                      setSelectedDykIndex(idx);
                      loadTopicIntoCard(DID_YOU_KNOW_ITEMS[idx]);
                    }}
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-xs font-bold"
                  >
                    {DID_YOU_KNOW_ITEMS.map((item, i) => (
                      <option key={item.id} value={i}>
                        {item.badge} — {item.title}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => loadTopicIntoCard(DID_YOU_KNOW_ITEMS[selectedDykIndex % DID_YOU_KNOW_ITEMS.length])}
                    className="w-full py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold"
                  >
                    ✓ Load Fact onto Slide {activeSlideIdx + 1}
                  </button>

                  <div className="border-t border-[#EAE5D9] pt-3 space-y-2">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-[#D46A4E]">
                      🤖 Generate Brand-New AI Card + Caption
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ['did-you-know', '💡 Did You Know'],
                        ['myth-vs-fact', '🧐 Myth vs Fact'],
                        ['care-tip', '🩺 Care Tip'],
                        ['comment-game', '💬 Comment Game'],
                        ['this-or-that', '⚖️ This or That']
                      ].map(([catKey, catLabel]) => (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => setAiCategory(catKey)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            aiCategory === catKey
                              ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                              : 'bg-[#F6F4EE] text-[#3E4D45] border-[#DDD6C7]'
                          }`}
                        >
                          {catLabel}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Optional topic (e.g. 'potty training stubborn Frenchies', 'why raw food shines coats')..."
                      className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-xs font-medium"
                    />
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={() => handleGenerateAiCardAndCaption()}
                      className="w-full py-2.5 rounded-xl bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm disabled:opacity-60"
                    >
                      {aiLoading ? '✨ Creating Card & Caption...' : '✨ Generate New Card + Caption with AI'}
                    </button>
                    {aiError && (
                      <div className="text-[11px] text-[#991B1B] bg-[#FEE2E2] px-3 py-2 rounded-xl font-medium">
                        {aiError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Camera Roll Upload & Photo Controls (Available in ALL modes!) */}
              <div className="border-t border-[#F0ECE1] pt-3 space-y-3">
                <label className="w-full flex items-center justify-center gap-2 bg-[#F6F4EE] border-2 border-dashed border-[#BDB5A4] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold cursor-pointer hover:bg-[#EFECE3]">
                  📷 Upload Custom Photo from Camera Roll
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (typeof ev.target?.result === 'string') {
                          updateActiveSlide(
                            {
                              preset: activeSlide.preset === 'no-photo' ? 'minimal' : activeSlide.preset,
                              photoSrc: ev.target.result,
                              panX: 0,
                              panY: 0
                            },
                            true
                          );
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                    className="hidden"
                  />
                </label>

                {geom.hasPhoto && (
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-bold text-[#3E4D45]">
                      <div className="flex justify-between mb-1">
                        <span>Photo Zoom</span>
                        <span className="text-[#D46A4E]">{activeSlide.zoom.toFixed(2)}×</span>
                      </div>
                      <input
                        type="range"
                        min={0.6}
                        max={3.0}
                        step={0.02}
                        value={activeSlide.zoom}
                        onChange={(e) => updateActiveSlide({ zoom: Number(e.target.value) })}
                        className="w-full accent-[#2E5A44]"
                      />
                    </label>
                    <label className="block text-xs font-bold text-[#3E4D45]">
                      <div className="flex justify-between mb-1">
                        <span>Photo Dim</span>
                        <span className="text-[#D46A4E]">{Math.round(activeSlide.photoDim * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={0.7}
                        step={0.02}
                        value={activeSlide.photoDim}
                        onChange={(e) => updateActiveSlide({ photoDim: Number(e.target.value) })}
                        className="w-full accent-[#2E5A44]"
                      />
                    </label>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(directShareUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#E4EFE8] border border-[#2E5A44]/30 text-[#2E5A44] text-xs font-extrabold"
                >
                  {copiedLink ? '✓ Direct Preview Link Copied!' : '🔗 Copy Direct Website Link (For DMs / Stories)'}
                </button>
              </div>
              </div>
            )}
          </div>

          {/* ACCORDION 2: ADD / REMOVE PILLS & EDIT TEXT */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('fields')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>✨ Show / Hide Pills &amp; Edit Text</span>
              <span className="text-[#2E5A44]">{mobileTab === 'fields' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'fields' && (
              <div className="p-3 space-y-3 bg-white">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      Tap to Toggle Pills
                    </span>
                    <button
                      type="button"
                      onClick={addCustomText}
                      className="text-xs font-extrabold text-[#D46A4E] bg-[#F6F4EE] px-2.5 py-1 rounded-full border border-[#E2DCCD]"
                    >
                      + Custom Pill
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSlide.layers.map((layer) => (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => {
                          const nextVis = !layer.visible;
                          updateLayer(layer.id, { visible: nextVis }, true);
                          setSelectedLayerId(nextVis ? layer.id : null);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border transition ${
                          layer.visible
                            ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44]'
                            : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#5C6B63] opacity-75'
                        }`}
                      >
                        {layer.visible ? '✓ ' : '+ '}
                        {layer.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#F0ECE1] pt-2.5 space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    Visible Text (Slide {activeSlideIdx + 1})
                  </div>
                  {activeSlide.layers
                    .filter((l) => l.visible)
                    .map((layer) => (
                      <div key={layer.id} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={layer.text}
                          onFocus={() => setSelectedLayerId(layer.id)}
                          onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                          className={`flex-1 rounded-xl border px-2.5 py-1.5 text-xs font-medium ${
                            selectedLayerId === layer.id
                              ? 'border-[#D46A4E] bg-white ring-2 ring-[#D46A4E]/20'
                              : 'border-[#DDD6C7] bg-[#FCFBF8]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => updateLayer(layer.id, { visible: false }, true)}
                          className="px-2 py-1.5 rounded-xl bg-[#F6F4EE] text-xs font-bold text-[#5C6B63] hover:text-[#991B1B]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 3: 1-TAP STATUS STAMPS & COMMENT STICKERS */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('stamps')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>🏷️ 1-Tap Status Stamps &amp; Stickers</span>
              <span className="text-[#2E5A44]">{mobileTab === 'stamps' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'stamps' && (
              <div className="p-3 bg-white">
                <div className="flex flex-wrap gap-1.5">
                  {STAMP_BADGES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => applyStampBadge(st)}
                      className="px-2.5 py-1.5 rounded-full text-xs font-extrabold bg-[#F6F4EE] border border-[#DDD6C7] hover:bg-[#E4EFE8] transition"
                    >
                      {st.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 4: MIX & MATCH THEME COLORS & FRAME TEMPLATE */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('style')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>🖼️ Mix &amp; Match Colors &amp; Frame</span>
              <span className="text-[#2E5A44]">{mobileTab === 'style' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'style' && (
              <div className="p-3 space-y-3 bg-white">
                {/* 1. Frame & Layout Template */}
                <div>
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44] mb-1.5">
                    1. Frame &amp; Layout Template
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(
                      [
                        ['minimal', '✨ Full Bleed Photo'],
                        ['arch', '🌿 Botanical Arch'],
                        ['cameo', '🪞 Oval Cameo'],
                        ['editorial', '🖼️ Editorial Card'],
                        ['sage', '🌲 Classic Mat Frame'],
                        ['no-photo', '📝 No-Photo Graphic Card']
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSwitchPreset(key)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border text-left transition ${
                          activeSlide.preset === key
                            ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44]'
                            : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>

                  {activeSlide.preset !== 'minimal' && activeSlide.preset !== 'no-photo' && (
                    <label className="block text-xs font-bold text-[#3E4D45] pt-2.5">
                      <div className="flex justify-between mb-1">
                        <span>Photo Window Height</span>
                        <span className="text-[#D46A4E]">{activeSlide.archHeight}px</span>
                      </div>
                      <input
                        type="range"
                        min={480}
                        max={ratio === 'story' ? 1480 : ratio === 'square' ? 720 : 1020}
                        value={activeSlide.archHeight}
                        onChange={(e) => updateActiveSlide({ archHeight: Number(e.target.value) })}
                        className="w-full accent-[#2E5A44]"
                      />
                    </label>
                  )}
                </div>

                {/* 2. Outer Background Color */}
                <div className="border-t border-[#F0ECE1] pt-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      2. Outer Background Color
                    </span>
                    <button
                      type="button"
                      onClick={handleSwapBgAndWindow}
                      className="text-[11px] font-extrabold text-[#D46A4E] bg-[#F6F4EE] px-2.5 py-0.5 rounded-full border border-[#E2DCCD]"
                      title="Swap Outer Background and Inner Window colors"
                    >
                      🔄 Swap Outer &amp; Window
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.entries(BG_STYLES) as [BgStyle, (typeof BG_STYLES)[BgStyle]][]).map(
                      ([bgKey, bgMeta]) => (
                        <button
                          key={bgKey}
                          type="button"
                          onClick={() => handleSwitchBgTheme(bgKey)}
                          className={`py-1.5 px-2.5 rounded-xl text-xs font-extrabold border text-left transition flex items-center gap-2 ${
                            activeSlide.bgStyle === bgKey
                              ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                              : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                            style={{ background: bgMeta.swatch }}
                          />
                          <span className="truncate">{bgMeta.label}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 3. Inner Window / Card Color */}
                <div className="border-t border-[#F0ECE1] pt-2.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44] mb-1.5">
                    3. Inner Window / Card Color
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(Object.entries(BG_STYLES) as [BgStyle, (typeof BG_STYLES)[BgStyle]][]).map(
                      ([winKey, winMeta]) => {
                        const activeWin = activeSlide.windowStyle || 'pure-white';
                        return (
                          <button
                            key={winKey}
                            type="button"
                            onClick={() => handleSwitchWindowTheme(winKey)}
                            className={`py-1.5 px-2.5 rounded-xl text-xs font-extrabold border text-left transition flex items-center gap-2 ${
                              activeWin === winKey
                                ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                                : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621]'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                              style={{ background: winMeta.swatch }}
                            />
                            <span className="truncate">{winMeta.label}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ACCORDION 5: SAVED GO-TO LAYOUTS */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('layouts')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>💾 Saved Go-To Layouts ({savedLayouts.length})</span>
              <span className="text-[#2E5A44]">{mobileTab === 'layouts' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'layouts' && (
              <div className="p-3 space-y-2.5 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="e.g. Lindsey's Go-To Minimal"
                    className="flex-1 rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleSaveLayoutPreset}
                    className="px-3.5 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold"
                  >
                    💾 Save
                  </button>
                </div>
                {savedLayouts.length > 0 && (
                  <div className="space-y-1.5">
                    {savedLayouts.map((sl) => (
                      <div
                        key={sl.id}
                        className="flex items-center justify-between bg-[#F6F4EE] border border-[#E2DCCD] rounded-xl px-3 py-2"
                      >
                        <button
                          type="button"
                          onClick={() => handleApplySavedLayout(sl)}
                          className="text-xs font-extrabold text-[#1C2621] text-left flex-1 hover:text-[#2E5A44]"
                        >
                          ✨ {sl.name}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSavedLayout(sl.id)}
                          className="text-xs font-bold text-[#991B1B] px-2"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACCORDION 6: AI CAPTION & DIRECT LINK */}
          <div className="border border-[#EAE5D9] rounded-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => toggleAccordion('caption')}
              className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F6F4EE] text-xs font-extrabold text-[#1C2621]"
            >
              <span>🤖 AI Caption &amp; Direct Link</span>
              <span className="text-[#2E5A44]">{mobileTab === 'caption' ? '▲' : '▼'}</span>
            </button>
            {mobileTab === 'caption' && (
              <div className="p-3 space-y-2.5 bg-white">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiCaption()}
                    placeholder="Tell AI what to say (e.g., 'ask followers to guess coat color')..."
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-xs font-medium"
                  />

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Ask a fun question for comments',
                      'Sweet & cuddly personality',
                      'Spotlight rare DNA & structure',
                      'Mention Flight Nanny & FaceTime',
                      'Short 2-line punchy hook'
                    ].map((presetIdea) => (
                      <button
                        key={presetIdea}
                        type="button"
                        onClick={() => {
                          setAiPrompt(presetIdea);
                          handleGenerateAiCaption(presetIdea);
                        }}
                        className="px-2.5 py-1 rounded-full bg-[#F6F4EE] border border-[#E2DCCD] text-[11px] font-bold text-[#3E4D45] hover:bg-[#E4EFE8]"
                      >
                        {presetIdea}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={() => handleGenerateAiCaption()}
                    className="w-full py-2 rounded-xl bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm disabled:opacity-60"
                  >
                    {aiLoading ? '✨ Writing Caption...' : '✨ Generate New Caption with AI'}
                  </button>

                  {aiError && (
                    <div className="text-[11px] text-[#991B1B] bg-[#FEE2E2] px-3 py-2 rounded-xl font-medium">
                      {aiError}
                    </div>
                  )}
                </div>

                <textarea
                  rows={6}
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  className="w-full rounded-2xl border border-[#DDD6C7] bg-[#FCFBF8] p-2.5 text-xs font-medium leading-relaxed"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(captionText);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold shadow-sm"
                  >
                    {copiedCaption ? '✓ Copied!' : '📋 Copy Caption'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(directShareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="py-2.5 rounded-full bg-[#F6F4EE] border border-[#2E5A44] text-[#2E5A44] text-xs font-extrabold"
                  >
                    {copiedLink ? '✓ Copied!' : '🔗 Copy Direct Link'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default SocialStudio;
