import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import puppiesData from '../data/puppies.json';
import studsData from '../data/studs.json';

type FramePreset = 'minimal' | 'arch' | 'editorial' | 'sage';
type CanvasRatio = 'feed' | 'story'; // 1080x1350 vs 1080x1920
type PillStyle = 'none-dark' | 'none-light' | 'cream' | 'sage' | 'gold' | 'terracotta' | 'frosted';
type FontKind = 'sans' | 'serif' | 'serif-italic';

interface TextLayer {
  id: string;
  label: string;
  visible: boolean;
  text: string;
  x: number; // center X in 1080 space
  y: number; // center Y in 1080xH space
  baseSize: number;
  scale: number;
  pill: PillStyle;
  font: FontKind;
}

interface DogRecord {
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

const DEFAULT_QUOTES: Record<string, string> = {
  shuffin: '"Fluffy, joyful, and always ready to steal your heart with one big smile."',
  alex: '"All ears, happy paws, and the sweetest little shadow you could ever ask for."',
  alice: '"Super tiny pocket princess with a gentle soul and endless cuddles to give."',
  arya: '"Compact, confident, and bursting with playful charm from nose to tail."',
  brew: '"Little merle sweetheart with soulful eyes and the coziest cuddle energy."',
  bean: '"Chunky, sweet-natured baby who loves warm laps and quiet afternoon naps."',
  biscotti: '"A tiny bundle of sweetness—soft, snuggly, and spoiled with love from day one."',
  brulee: '"Gentle, dreamy, and already stealing hearts with that rosy little nose."'
};

const PILL_PALETTE: Record<
  PillStyle,
  { label: string; bg: string; text: string; border: string; hasBg: boolean; shadow?: boolean }
> = {
  cream: { label: 'Cream Pill', bg: '#F6F4EE', text: '#1C2621', border: '#E2DCCD', hasBg: true, shadow: true },
  sage: { label: 'Forest Pill', bg: '#2E5A44', text: '#FFFFFF', border: '#2E5A44', hasBg: true, shadow: true },
  gold: { label: 'Gold Pill', bg: '#F4D37E', text: '#1C2621', border: '#E5C165', hasBg: true, shadow: true },
  terracotta: { label: 'Terracotta', bg: '#D46A4E', text: '#FFFFFF', border: '#D46A4E', hasBg: true, shadow: true },
  frosted: {
    label: 'Dark Glass',
    bg: 'rgba(28,38,33,0.82)',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.22)',
    hasBg: true,
    shadow: true
  },
  'none-dark': { label: 'Dark Text', bg: 'transparent', text: '#1C2621', border: 'transparent', hasBg: false },
  'none-light': { label: 'White Text', bg: 'transparent', text: '#FFFFFF', border: 'transparent', hasBg: false }
};

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
  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
  ctx.lineTo(x + bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
};

const wrapLines = (ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
};

const getFrameGeometry = (preset: FramePreset, canvasH: number, archH: number) => {
  if (preset === 'minimal') {
    return {
      outerBg: '#EFECE4',
      hasCard: false,
      cardX: 0,
      cardY: 0,
      cardW: 1080,
      cardH: canvasH,
      cardBg: 'transparent',
      cardTopR: 0,
      photoX: 0,
      photoY: 0,
      photoW: 1080,
      photoH: canvasH,
      photoTopR: 0,
      photoBottomR: 0
    };
  }
  const pad = preset === 'sage' ? 36 : 26;
  const cardW = 1080 - pad * 2;
  const cardH = canvasH - pad * 2;
  const photoX = pad + 26;
  const photoY = preset === 'sage' ? pad + 86 : pad + 24;
  const photoW = cardW - 52;
  return {
    outerBg: preset === 'sage' ? '#2E5A44' : '#F6F4EE',
    hasCard: true,
    cardX: pad,
    cardY: pad,
    cardW,
    cardH,
    cardBg: preset === 'sage' ? '#F6F4EE' : '#FFFFFF',
    cardTopR: preset === 'arch' ? 230 : 38,
    photoX,
    photoY,
    photoW,
    photoH: archH,
    photoTopR: preset === 'arch' ? 210 : 28,
    photoBottomR: 26
  };
};

const buildLayersForPreset = (
  dog: DogRecord,
  preset: FramePreset,
  canvasH: number,
  archH: number
): TextLayer[] => {
  const slug = dog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const age = extractAge(dog);
  const breed = dog.breed || (dog.category === 'Stud' ? 'French Bulldog Stud' : 'French Bulldog');
  const statusStr =
    dog.status === 'Pending'
      ? '✨ Pending • Deposit Placed'
      : dog.category === 'Stud'
        ? '✨ Stud Service Available'
        : '✨ Available Now';
  const breedAgeStr = [breed, age || dog.gender].filter(Boolean).join(' • ');
  const fullMetaStr = [breed, dog.gender, age].filter(Boolean).join(' • ').toUpperCase();
  const coatStr = dog.dna || dog.description || '';
  const dnaStr = (dog.dna_technical || '').trim();
  const quoteStr =
    DEFAULT_QUOTES[slug] || '"Raised in our OKC home with love, structure & health first."';

  if (preset === 'minimal') {
    return [
      {
        id: 'breedAge',
        label: 'Breed & Age Banner',
        visible: true,
        text: breedAgeStr,
        x: 540,
        y: canvasH - 185,
        baseSize: 36,
        scale: 1,
        pill: 'cream',
        font: 'sans'
      },
      {
        id: 'handle',
        label: '@okcfrenchies',
        visible: true,
        text: '@okcfrenchies',
        x: 540,
        y: canvasH - 95,
        baseSize: 22,
        scale: 1,
        pill: 'frosted',
        font: 'sans'
      },
      {
        id: 'status',
        label: 'Status Pill',
        visible: false,
        text: statusStr,
        x: 540,
        y: 95,
        baseSize: 24,
        scale: 1,
        pill: 'gold',
        font: 'sans'
      },
      {
        id: 'name',
        label: 'Meet Name',
        visible: false,
        text: `Meet ${dog.name}`,
        x: 540,
        y: canvasH - 275,
        baseSize: 64,
        scale: 1,
        pill: 'none-light',
        font: 'serif'
      },
      {
        id: 'coat',
        label: 'Coat Color',
        visible: false,
        text: coatStr,
        x: 540,
        y: canvasH - 345,
        baseSize: 28,
        scale: 1,
        pill: 'frosted',
        font: 'sans'
      },
      {
        id: 'dna',
        label: 'DNA String',
        visible: false,
        text: dnaStr ? `DNA: ${dnaStr}` : 'DNA: Health & Color Tested',
        x: 540,
        y: 170,
        baseSize: 22,
        scale: 1,
        pill: 'cream',
        font: 'sans'
      },
      {
        id: 'quote',
        label: 'Sweet Quote',
        visible: false,
        text: quoteStr,
        x: 540,
        y: 250,
        baseSize: 28,
        scale: 1,
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
        baseSize: 22,
        scale: 1,
        pill: 'sage',
        font: 'sans'
      }
    ];
  }

  const geom = getFrameGeometry(preset, canvasH, archH);
  const photoBottom = geom.photoY + geom.photoH;

  return [
    {
      id: 'status',
      label: 'Status Pill',
      visible: true,
      text: statusStr,
      x: preset === 'sage' ? geom.photoX + 165 : 540,
      y: preset === 'sage' ? geom.cardY + 46 : photoBottom,
      baseSize: 23,
      scale: 1,
      pill: 'gold',
      font: 'sans'
    },
    {
      id: 'handle',
      label: '@okcfrenchies',
      visible: preset === 'sage',
      text: '@okcfrenchies',
      x: preset === 'sage' ? geom.photoX + geom.photoW - 95 : 540,
      y: preset === 'sage' ? geom.cardY + 46 : 90,
      baseSize: 22,
      scale: 1,
      pill: 'none-dark',
      font: 'sans'
    },
    {
      id: 'name',
      label: 'Meet Name',
      visible: true,
      text: `Meet ${dog.name}`,
      x: 540,
      y: photoBottom + 78,
      baseSize: 64,
      scale: 1,
      pill: 'none-dark',
      font: 'serif'
    },
    {
      id: 'breedAge',
      label: 'Breed & Age',
      visible: true,
      text: fullMetaStr,
      x: 540,
      y: photoBottom + 138,
      baseSize: 23,
      scale: 1,
      pill: 'none-dark',
      font: 'sans'
    },
    {
      id: 'coat',
      label: 'Coat Color',
      visible: true,
      text: coatStr,
      x: 540,
      y: photoBottom + 182,
      baseSize: 26,
      scale: 1,
      pill: 'none-dark',
      font: 'sans'
    },
    {
      id: 'dna',
      label: 'DNA String',
      visible: Boolean(dnaStr),
      text: dnaStr ? `DNA: ${dnaStr}` : 'DNA: Tested',
      x: 540,
      y: photoBottom + 232,
      baseSize: 21,
      scale: 1,
      pill: 'cream',
      font: 'sans'
    },
    {
      id: 'quote',
      label: 'Sweet Quote',
      visible: true,
      text: quoteStr,
      x: 540,
      y: photoBottom + (dnaStr ? 292 : 244),
      baseSize: 26,
      scale: 1,
      pill: 'none-dark',
      font: 'serif-italic'
    },
    {
      id: 'contact',
      label: 'Contact Pill',
      visible: true,
      text: 'Text 405.300.8482 • info@okcfrenchies.com',
      x: 540,
      y: canvasH - geom.cardY - 52,
      baseSize: 22,
      scale: 1,
      pill: 'sage',
      font: 'sans'
    }
  ];
};

const SocialStudio: React.FC = () => {
  const allDogs: DogRecord[] = useMemo(() => {
    const p = (puppiesData as any[]).map((d) => ({ ...d, category: 'Puppy' as const }));
    const s = (studsData as any[]).map((d) => ({ ...d, category: 'Stud' as const }));
    return [...p, ...s];
  }, []);

  const [filterMode, setFilterMode] = useState<'available' | 'all'>('available');
  const filteredDogs = useMemo(() => {
    if (filterMode === 'all') return allDogs;
    return allDogs.filter((d) => d.status === 'Available' || d.status === 'Pending');
  }, [allDogs, filterMode]);

  const [selectedId, setSelectedId] = useState<string>('puppies-4');
  const selectedDog = useMemo(
    () => filteredDogs.find((d) => d.id === selectedId) || filteredDogs[0] || allDogs[0],
    [filteredDogs, selectedId, allDogs]
  );

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

  const [ratio, setRatio] = useState<CanvasRatio>('feed');
  const canvasH = ratio === 'feed' ? 1350 : 1920;

  const [preset, setPreset] = useState<FramePreset>('minimal');
  const [archHeight, setArchHeight] = useState<number>(800);
  const [photoSrc, setPhotoSrc] = useState<string>(selectedDog?.image || '');
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [imgNat, setImgNat] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const [layers, setLayers] = useState<TextLayer[]>(() =>
    selectedDog ? buildLayersForPreset(selectedDog, 'minimal', 1350, 800) : []
  );
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [snapCenterLine, setSnapCenterLine] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'fields' | 'puppy' | 'style' | 'caption'>('fields');
  const [copiedCaption, setCopiedCaption] = useState<boolean>(false);

  // Responsive preview width (fits iPhone screens without horizontal overflow)
  const [stageWidth, setStageWidth] = useState<number>(480);
  useEffect(() => {
    const updateWidth = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setStageWidth(Math.min(390, w - 28));
      } else {
        setStageWidth(ratio === 'story' ? 390 : 500);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [ratio]);

  const stageScale = stageWidth / 1080;
  const stageHeight = canvasH * stageScale;

  const imgRef = useRef<HTMLImageElement | null>(null);

  // Rebuild default layers when dog, preset, or ratio changes
  useEffect(() => {
    if (!selectedDog) return;
    const defaultArch = ratio === 'story' ? 1180 : preset === 'sage' ? 740 : 800;
    setArchHeight(defaultArch);
    setPhotoSrc(selectedDog.image || galleryPhotos[0] || '');
    setPanX(0);
    setPanY(0);
    setZoom(1);
    setLayers(buildLayersForPreset(selectedDog, preset, ratio === 'feed' ? 1350 : 1920, defaultArch));
    setSelectedLayerId(null);
    setEditingLayerId(null);
  }, [selectedDog?.id, preset, ratio]);

  const selectedLayer = useMemo(
    () => layers.find((l) => l.id === selectedLayerId) || null,
    [layers, selectedLayerId]
  );

  const updateLayer = (id: string, patch: Partial<TextLayer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  };

  const addCustomText = () => {
    const id = `custom-${Date.now()}`;
    const newLayer: TextLayer = {
      id,
      label: 'Custom Text',
      visible: true,
      text: 'Tap to edit text ✨',
      x: 540,
      y: Math.round(canvasH * 0.5),
      baseSize: 34,
      scale: 1,
      pill: 'cream',
      font: 'sans'
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(id);
    setEditingLayerId(id);
  };

  // Drag & Resize Refs
  const dragModeRef = useRef<{
    type: 'none' | 'photo' | 'layer' | 'resize';
    layerId?: string;
    sx: number;
    sy: number;
    bx: number;
    by: number;
    bScale: number;
  }>({ type: 'none', sx: 0, sy: 0, bx: 0, by: 0, bScale: 1 });

  // Pinch-to-Zoom Touch Ref (works on both selected text layer OR background photo!)
  const pinchRef = useRef<{
    active: boolean;
    startDist: number;
    baseZoom: number;
    baseLayerScale: number;
    targetLayerId: string | null;
  }>({ active: false, startDist: 0, baseZoom: 1, baseLayerScale: 1, targetLayerId: null });

  const handleTouchStartStage = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      pinchRef.current = {
        active: true,
        startDist: Math.max(10, dist),
        baseZoom: zoom,
        baseLayerScale: selectedLayer?.scale || 1,
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
        const nextScale = Math.max(0.4, Math.min(3.2, pinchRef.current.baseLayerScale * ratioDist));
        updateLayer(pinchRef.current.targetLayerId, { scale: nextScale });
      } else {
        const nextZoom = Math.max(0.6, Math.min(3.0, pinchRef.current.baseZoom * ratioDist));
        setZoom(nextZoom);
      }
    }
  };

  const handleTouchEndStage = () => {
    if (pinchRef.current.active) {
      pinchRef.current.active = false;
    }
  };

  // Auto-generated Instagram caption for quick copy-paste
  const generatedCaption = useMemo(() => {
    if (!selectedDog) return '';
    const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const age = extractAge(selectedDog);
    const quote = DEFAULT_QUOTES[slug]?.replace(/^"|"$/g, '') || '';
    const lines = [
      `🌿 Meet ${selectedDog.name} ✨`,
      quote ? `${quote}` : '',
      '',
      `🐾 Breed: ${selectedDog.breed || 'French Bulldog'} (${selectedDog.gender || ''})`,
      age ? `🎂 Age: ${age}` : '',
      selectedDog.dna ? `🎨 Coat: ${selectedDog.dna}` : '',
      selectedDog.dna_technical ? `🧬 DNA: ${selectedDog.dna_technical}` : '',
      '',
      `📲 Text Lindsey or Eric: 405.300.8482`,
      `📩 Email: info@okcfrenchies.com`,
      `🌐 OKCFrenchies.com`,
      '',
      `#okcfrenchies #frenchbulldog #minibulldog #oklahomacity #frenchiepuppy #rarefrenchies`
    ].filter((l, idx, arr) => l !== '' || arr[idx - 1] !== '');
    return lines.join('\n');
  }, [selectedDog]);

  // Render exact 1080 x canvasH PNG Blob
  const renderCanvasBlob = async (): Promise<Blob | null> => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = canvasH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const geom = getFrameGeometry(preset, canvasH, archHeight);
    ctx.fillStyle = geom.outerBg;
    ctx.fillRect(0, 0, 1080, canvasH);

    if (geom.hasCard) {
      ctx.save();
      ctx.shadowColor = 'rgba(28,38,33,0.08)';
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

      if (preset !== 'sage') {
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
        ctx.strokeStyle = '#EAE5D9';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    // Draw Photo inside frame
    ctx.save();
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
    ctx.clip();
    ctx.fillStyle = '#EFECE4';
    ctx.fillRect(geom.photoX, geom.photoY, geom.photoW, geom.photoH);

    const img = imgRef.current;
    if (img && img.naturalWidth > 0) {
      const coverScale = Math.max(geom.photoW / img.naturalWidth, geom.photoH / img.naturalHeight) * zoom;
      const drawW = img.naturalWidth * coverScale;
      const drawH = img.naturalHeight * coverScale;
      const drawX = geom.photoX + (geom.photoW - drawW) / 2 + panX;
      const drawY = geom.photoY + (geom.photoH - drawH) / 2 + panY;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
    ctx.restore();

    // Draw Visible Layers
    for (const layer of layers) {
      if (!layer.visible || !layer.text.trim()) continue;
      const fontSize = Math.round(layer.baseSize * layer.scale);
      const fontSpec =
        layer.font === 'serif'
          ? `700 ${fontSize}px 'Playfair Display', serif`
          : layer.font === 'serif-italic'
            ? `italic 600 ${fontSize}px 'Playfair Display', serif`
            : `800 ${fontSize}px 'DM Sans', sans-serif`;
      ctx.font = fontSpec;

      const pal = PILL_PALETTE[layer.pill];
      const maxTextW = 920;
      const textLines = wrapLines(ctx, layer.text, maxTextW);
      const lineH = fontSize * 1.22;
      const widest = Math.max(...textLines.map((t) => ctx.measureText(t).width), 40);

      if (pal.hasBg) {
        const padX = Math.round(fontSize * 0.95);
        const padY = Math.round(fontSize * 0.48);
        const boxW = widest + padX * 2;
        const boxH = textLines.length * lineH + padY * 2 - (lineH - fontSize);
        const bx = layer.x - boxW / 2;
        const by = layer.y - boxH / 2;
        const r = textLines.length > 1 ? 26 : 999;

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
      } else if (layer.pill === 'none-light') {
        ctx.shadowColor = 'rgba(0,0,0,0.45)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;
      }

      ctx.fillStyle = pal.text;
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

  const handleSaveOrShare = async (preferShare: boolean) => {
    const blob = await renderCanvasBlob();
    if (!blob) return;
    const safeName = (selectedDog?.name || 'puppy').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fileName = `okcfrenchies-${safeName}-${preset}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });

    if (preferShare && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `OKC Frenchies — ${selectedDog?.name || 'Puppy'}`
        });
        return;
      } catch {
        // User cancelled share sheet or share failed; fall through only if needed
        return;
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = fileName;
    a.href = url;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  };

  const geom = getFrameGeometry(preset, canvasH, archHeight);
  const previewScale =
    imgNat.w > 0 && imgNat.h > 0
      ? Math.max(geom.photoW / imgNat.w, geom.photoH / imgNat.h) * zoom
      : 1;
  const previewDrawW = imgNat.w > 0 ? imgNat.w * previewScale : geom.photoW;
  const previewDrawH = imgNat.h > 0 ? imgNat.h * previewScale : geom.photoH;
  const previewDrawX = (geom.photoW - previewDrawW) / 2 + panX;
  const previewDrawY = (geom.photoH - previewDrawH) / 2 + panY;

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1C2621] pb-16">
      <Helmet>
        <title>Instagram Card Studio | OKC Frenchies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Sticky Action Bar */}
      <div className="bg-white border-b border-[#EAE5D9] px-3 sm:px-6 py-2.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold text-[#2E5A44]">
              🌿 Card Studio
            </span>
            <div className="flex bg-[#F6F4EE] rounded-full p-0.5 border border-[#E2DCCD] text-xs font-bold">
              <button
                type="button"
                onClick={() => setRatio('feed')}
                className={`px-2.5 py-1 rounded-full transition ${
                  ratio === 'feed' ? 'bg-[#2E5A44] text-white' : 'text-[#5C6B63]'
                }`}
              >
                4:5 Post
              </button>
              <button
                type="button"
                onClick={() => setRatio('story')}
                className={`px-2.5 py-1 rounded-full transition ${
                  ratio === 'story' ? 'bg-[#2E5A44] text-white' : 'text-[#5C6B63]'
                }`}
              >
                9:16 Story
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSaveOrShare(true)}
              className="sm:hidden px-3.5 py-2 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold shadow-sm"
            >
              📲 Save / Share
            </button>
            <button
              type="button"
              onClick={() => handleSaveOrShare(false)}
              className="px-4 py-2 rounded-full bg-[#2E5A44] text-white text-xs sm:text-sm font-extrabold hover:bg-[#234735] transition shadow-sm"
            >
              ⬇ Export PNG
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 grid grid-cols-1 lg:grid-cols-[1fr_430px] gap-6 items-start">
        {/* CENTER / TOP: Interactive Canva Stage (First on iPhone so zero scrolling needed!) */}
        <main className="flex flex-col items-center gap-2.5 lg:sticky lg:top-20 order-1">
          {/* Floating Contextual Layer Toolbar when a text box is tapped */}
          {selectedLayer ? (
            <div className="w-full max-w-[520px] bg-white border border-[#DDD6C7] rounded-2xl px-3 py-2 shadow-md flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setEditingLayerId(selectedLayer.id)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F6F4EE] font-bold border border-[#DDD6C7]"
                >
                  ✏️ Edit
                </button>
                <select
                  value={selectedLayer.pill}
                  onChange={(e) => updateLayer(selectedLayer.id, { pill: e.target.value as PillStyle })}
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
                    updateLayer(selectedLayer.id, {
                      font:
                        selectedLayer.font === 'sans'
                          ? 'serif'
                          : selectedLayer.font === 'serif'
                            ? 'serif-italic'
                            : 'sans'
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#F6F4EE] font-bold border border-[#DDD6C7]"
                  title="Cycle Font"
                >
                  Aa
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateLayer(selectedLayer.id, {
                      scale: Math.max(0.4, +(selectedLayer.scale - 0.1).toFixed(2))
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#F6F4EE] font-extrabold border border-[#DDD6C7]"
                >
                  A-
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateLayer(selectedLayer.id, {
                      scale: Math.min(3.2, +(selectedLayer.scale + 0.1).toFixed(2))
                    })
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-[#F6F4EE] font-extrabold border border-[#DDD6C7]"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => updateLayer(selectedLayer.id, { x: 540 })}
                  className="px-2 py-1.5 rounded-lg bg-[#F6F4EE] font-bold border border-[#DDD6C7]"
                  title="Center Horizontally"
                >
                  ┼ Center
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  updateLayer(selectedLayer.id, { visible: false });
                  setSelectedLayerId(null);
                  setEditingLayerId(null);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-[#FEE2E2] text-[#991B1B] font-extrabold"
              >
                🗑️ Hide
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold text-[#5C6B63] bg-white px-3.5 py-1.5 rounded-full border border-[#EAE5D9] text-center">
              👆 Drag photo or any text • Pinch with 2 fingers or drag ↘ corner to resize • Tap text to style/hide
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
              onPointerDown={() => {
                setSelectedLayerId(null);
                setEditingLayerId(null);
              }}
              onPointerMove={(e) => {
                const dm = dragModeRef.current;
                if (dm.type === 'none') return;
                const dx = (e.clientX - dm.sx) / stageScale;
                const dy = (e.clientY - dm.sy) / stageScale;

                if (dm.type === 'photo') {
                  setPanX(dm.bx + dx);
                  setPanY(dm.by + dy);
                } else if (dm.type === 'layer' && dm.layerId) {
                  let nextX = dm.bx + dx;
                  const nextY = dm.by + dy;
                  if (Math.abs(nextX - 540) < 18) {
                    nextX = 540;
                    setSnapCenterLine(true);
                  } else {
                    setSnapCenterLine(false);
                  }
                  updateLayer(dm.layerId, { x: nextX, y: nextY });
                } else if (dm.type === 'resize' && dm.layerId) {
                  const nextScale = Math.max(0.4, Math.min(3.2, dm.bScale + (dx + dy) * 0.0035));
                  updateLayer(dm.layerId, { scale: nextScale });
                }
              }}
              onPointerUp={() => {
                dragModeRef.current.type = 'none';
                setSnapCenterLine(false);
              }}
              style={{
                width: 1080,
                height: canvasH,
                transform: `scale(${stageScale})`,
                transformOrigin: 'top left',
                background: geom.outerBg,
                position: 'relative'
              }}
            >
              {/* Card Frame if non-minimal */}
              {geom.hasCard && (
                <div
                  style={{
                    position: 'absolute',
                    left: geom.cardX,
                    top: geom.cardY,
                    width: geom.cardW,
                    height: geom.cardH,
                    background: geom.cardBg,
                    border: preset === 'sage' ? 'none' : '2px solid #EAE5D9',
                    borderRadius: `${geom.cardTopR}px ${geom.cardTopR}px 40px 40px`,
                    boxShadow: '0 24px 60px rgba(28,38,33,0.08)'
                  }}
                />
              )}

              {/* Photo Area */}
              <div
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setSelectedLayerId(null);
                  setEditingLayerId(null);
                  dragModeRef.current = {
                    type: 'photo',
                    sx: e.clientX,
                    sy: e.clientY,
                    bx: panX,
                    by: panY,
                    bScale: 1
                  };
                  (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                }}
                style={{
                  position: 'absolute',
                  left: geom.photoX,
                  top: geom.photoY,
                  width: geom.photoW,
                  height: geom.photoH,
                  borderRadius: `${geom.photoTopR}px ${geom.photoTopR}px ${geom.photoBottomR}px ${geom.photoBottomR}px`,
                  overflow: 'hidden',
                  background: '#EFECE4',
                  cursor: 'grab'
                }}
              >
                <img
                  ref={imgRef}
                  src={photoSrc}
                  alt={selectedDog?.name || 'Puppy'}
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
              </div>

              {/* Center Snap Guideline */}
              {snapCenterLine && (
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

              {/* Freeform Draggable & Resizable Layers */}
              {layers.map((layer) => {
                if (!layer.visible) return null;
                const isSel = selectedLayerId === layer.id;
                const isEditing = editingLayerId === layer.id;
                const pal = PILL_PALETTE[layer.pill];
                const fontSize = Math.round(layer.baseSize * layer.scale);

                return (
                  <div
                    key={layer.id}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (isEditing) return;
                      setSelectedLayerId(layer.id);
                      dragModeRef.current = {
                        type: 'layer',
                        layerId: layer.id,
                        sx: e.clientX,
                        sy: e.clientY,
                        bx: layer.x,
                        by: layer.y,
                        bScale: layer.scale
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
                      background: pal.bg,
                      color: pal.text,
                      border: pal.hasBg ? `2px solid ${pal.border}` : 'none',
                      padding: pal.hasBg
                        ? `${Math.round(fontSize * 0.42)}px ${Math.round(fontSize * 0.92)}px`
                        : '6px 10px',
                      borderRadius: 999,
                      boxShadow: pal.shadow ? '0 10px 26px rgba(0,0,0,0.18)' : 'none',
                      textShadow:
                        layer.pill === 'none-light' ? '0 4px 16px rgba(0,0,0,0.5)' : 'none',
                      fontFamily:
                        layer.font === 'sans'
                          ? "'DM Sans', sans-serif"
                          : "'Playfair Display', serif",
                      fontStyle: layer.font === 'serif-italic' ? 'italic' : 'normal',
                      fontWeight: layer.font === 'serif-italic' ? 600 : 800,
                      fontSize,
                      lineHeight: 1.2,
                      textAlign: 'center',
                      maxWidth: 940,
                      whiteSpace: 'pre-wrap',
                      cursor: isEditing ? 'text' : 'move',
                      outline: isSel ? '3px dashed #D46A4E' : 'none',
                      outlineOffset: 8,
                      zIndex: isSel ? 30 : 20
                    }}
                  >
                    {isEditing ? (
                      <input
                        autoFocus
                        value={layer.text}
                        onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                        onBlur={() => setEditingLayerId(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayerId(null)}
                        style={{
                          background: 'transparent',
                          color: 'inherit',
                          font: 'inherit',
                          textAlign: 'center',
                          outline: 'none',
                          minWidth: 260,
                          width: Math.min(880, Math.max(260, layer.text.length * fontSize * 0.6))
                        }}
                      />
                    ) : (
                      layer.text
                    )}

                    {/* Corner Drag-to-Resize Handle */}
                    {isSel && !isEditing && (
                      <div
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          dragModeRef.current = {
                            type: 'resize',
                            layerId: layer.id,
                            sx: e.clientX,
                            sy: e.clientY,
                            bx: layer.x,
                            by: layer.y,
                            bScale: layer.scale
                          };
                          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                        }}
                        title="Drag to resize"
                        style={{
                          position: 'absolute',
                          right: -18,
                          bottom: -18,
                          width: 38,
                          height: 38,
                          borderRadius: 999,
                          background: '#D46A4E',
                          color: '#FFFFFF',
                          border: '4px solid #FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 20,
                          fontWeight: 900,
                          cursor: 'nwse-resize',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                        }}
                      >
                        ↘
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </main>

        {/* RIGHT / BOTTOM: Compact Tabbed Control Panel (Independent Scroll on Desktop) */}
        <aside className="bg-white border border-[#EAE5D9] rounded-3xl p-4 sm:p-5 shadow-sm lg:h-[calc(100vh-105px)] lg:overflow-y-auto order-2 space-y-4">
          {/* Tab Switcher (Makes iPhone super compact with zero long page scrolling!) */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#F6F4EE] p-1 rounded-2xl border border-[#EAE5D9]">
            {(
              [
                ['fields', '✨ Fields'],
                ['puppy', '🐶 Puppy'],
                ['style', '🖼️ Frame'],
                ['caption', '📝 Caption']
              ] as const
            ).map(([tab, label]) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(tab)}
                className={`py-2 rounded-xl text-xs font-extrabold transition ${
                  mobileTab === tab
                    ? 'bg-[#2E5A44] text-white shadow-sm'
                    : 'text-[#3E4D45] hover:bg-[#EAE5D9]/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* TAB 1: ADD / REMOVE / EDIT FIELDS */}
          {mobileTab === 'fields' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    Tap to Add / Remove on Image
                  </span>
                  <button
                    type="button"
                    onClick={addCustomText}
                    className="text-xs font-extrabold text-[#D46A4E] bg-[#F6F4EE] px-2.5 py-1 rounded-full border border-[#E2DCCD]"
                  >
                    + Add Custom Text
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layers.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => {
                        const nextVis = !layer.visible;
                        updateLayer(layer.id, { visible: nextVis });
                        setSelectedLayerId(nextVis ? layer.id : null);
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
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

              {/* Quick Text Inputs for Active Fields */}
              <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                  Active Field Text
                </div>
                {layers
                  .filter((l) => l.visible)
                  .map((layer) => (
                    <div key={layer.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={layer.text}
                        onFocus={() => setSelectedLayerId(layer.id)}
                        onChange={(e) => updateLayer(layer.id, { text: e.target.value })}
                        className="flex-1 rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-sm font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => updateLayer(layer.id, { visible: false })}
                        className="px-2.5 py-2 rounded-xl bg-[#F6F4EE] text-xs font-bold text-[#5C6B63] hover:text-[#991B1B]"
                        title="Remove from image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 2: PUPPY & PHOTO GALLERY */}
          {mobileTab === 'puppy' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                  Select Dog
                </span>
                <button
                  type="button"
                  onClick={() => setFilterMode(filterMode === 'available' ? 'all' : 'available')}
                  className="text-xs font-bold text-[#D46A4E] underline"
                >
                  {filterMode === 'available' ? 'Show All Dogs & Studs' : 'Show Available Only'}
                </button>
              </div>

              <select
                value={selectedDog?.id || ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-sm font-bold"
              >
                {filteredDogs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.status || d.category})
                  </option>
                ))}
              </select>

              {galleryPhotos.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-[#3E4D45] mb-2">
                    Tap a Photo to Swap
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {galleryPhotos.map((url) => (
                      <img
                        key={url}
                        src={url}
                        alt={selectedDog?.name}
                        onClick={() => {
                          setPhotoSrc(url);
                          setPanX(0);
                          setPanY(0);
                        }}
                        className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${
                          photoSrc === url
                            ? 'border-[#2E5A44] ring-2 ring-[#CFE2D7]'
                            : 'border-[#DDD6C7]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <label className="w-full flex items-center justify-center gap-2 bg-[#F6F4EE] border-2 border-dashed border-[#BDB5A4] px-4 py-3 rounded-2xl text-sm font-bold cursor-pointer hover:bg-[#EFECE3]">
                📷 Choose Photo from Camera Roll / Files
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      if (typeof ev.target?.result === 'string') {
                        setPhotoSrc(ev.target.result);
                        setPanX(0);
                        setPanY(0);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="hidden"
                />
              </label>

              <label className="block text-xs font-bold text-[#3E4D45] pt-2">
                <div className="flex justify-between mb-1">
                  <span>Photo Zoom (or 2-finger pinch)</span>
                  <span className="text-[#D46A4E]">{zoom.toFixed(2)}×</span>
                </div>
                <input
                  type="range"
                  min={0.6}
                  max={3.0}
                  step={0.02}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-[#2E5A44]"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setPanX(0);
                  setPanY(0);
                  setZoom(1);
                }}
                className="w-full py-2 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-xs font-bold"
              >
                Reset Photo Position &amp; Zoom
              </button>
            </div>
          )}

          {/* TAB 3: TEMPLATE & FRAME */}
          {mobileTab === 'style' && (
            <div className="space-y-4">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44] mb-2">
                  Theme Template
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ['minimal', '✨ Minimal Full Photo'],
                      ['arch', '🌿 Botanical Arch'],
                      ['editorial', '🖼️ Editorial Card'],
                      ['sage', '🌲 Sage Mat Frame']
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPreset(key)}
                      className={`py-3 px-3 rounded-xl text-xs font-extrabold border text-left transition ${
                        preset === key
                          ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44]'
                          : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {preset !== 'minimal' && (
                <label className="block text-xs font-bold text-[#3E4D45] pt-2">
                  <div className="flex justify-between mb-1">
                    <span>Photo Window Height</span>
                    <span className="text-[#D46A4E]">{archHeight}px</span>
                  </div>
                  <input
                    type="range"
                    min={560}
                    max={ratio === 'story' ? 1480 : 1020}
                    value={archHeight}
                    onChange={(e) => setArchHeight(Number(e.target.value))}
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
              )}

              <button
                type="button"
                onClick={() => {
                  if (selectedDog) {
                    setLayers(buildLayersForPreset(selectedDog, preset, canvasH, archHeight));
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-xs font-bold"
              >
                Reset Default Text Layout for Template
              </button>
            </div>
          )}

          {/* TAB 4: ONE-TAP INSTAGRAM CAPTION */}
          {mobileTab === 'caption' && (
            <div className="space-y-3">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                Ready-to-Paste Instagram Caption
              </div>
              <p className="text-xs text-[#5C6B63]">
                Keep the photo clean for higher engagement, then paste all DNA &amp; contact details in the caption!
              </p>
              <textarea
                rows={10}
                readOnly
                value={generatedCaption}
                className="w-full rounded-2xl border border-[#DDD6C7] bg-[#FCFBF8] p-3 text-xs font-medium leading-relaxed"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generatedCaption);
                  setCopiedCaption(true);
                  setTimeout(() => setCopiedCaption(false), 2000);
                }}
                className="w-full py-3 rounded-full bg-[#2E5A44] text-white text-sm font-extrabold shadow-sm"
              >
                {copiedCaption ? '✓ Copied to Clipboard!' : '📋 Copy Instagram Caption'}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default SocialStudio;
