import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import puppiesData from '../data/puppies.json';
import studsData from '../data/studs.json';

type TemplateType = 'arch' | 'editorial' | 'sage' | 'minimal';
type LayerKey = 'pill' | 'brand' | 'headline' | 'meta' | 'coat' | 'dna' | 'quote' | 'minimalBanner';

interface Offset {
  x: number;
  y: number;
}

const ZERO_OFFSETS: Record<LayerKey, Offset> = {
  pill: { x: 0, y: 0 },
  brand: { x: 0, y: 0 },
  headline: { x: 0, y: 0 },
  meta: { x: 0, y: 0 },
  coat: { x: 0, y: 0 },
  dna: { x: 0, y: 0 },
  quote: { x: 0, y: 0 },
  minimalBanner: { x: 0, y: 0 }
};

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

  const [template, setTemplate] = useState<TemplateType>('minimal');
  const [photoSrc, setPhotoSrc] = useState<string>(selectedDog?.image || '');
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [archHeight, setArchHeight] = useState<number>(815);

  const [pillText, setPillText] = useState<string>('✨ Available Now');
  const [brandText, setBrandText] = useState<string>('🌿 OKC Frenchies & Mini Bulldogs');
  const [headline, setHeadline] = useState<string>('Meet Alice');
  const [metaRow, setMetaRow] = useState<string>('FRENCH BULLDOG • FEMALE • 5 MONTHS OLD');
  const [coatText, setCoatText] = useState<string>('');
  const [dnaText, setDnaText] = useState<string>('');
  const [quoteText, setQuoteText] = useState<string>('');
  const [minimalBannerText, setMinimalBannerText] = useState<string>('French Bulldog • 5 Months Old');
  const [bannerBg, setBannerBg] = useState<'cream' | 'sage' | 'gold' | 'dark'>('cream');
  const [emailText, setEmailText] = useState<string>('info@okcfrenchies.com');
  const [siteText, setSiteText] = useState<string>('OKCFrenchies.com');
  const [ctaText, setCtaText] = useState<string>('Text 405.300.8482');

  const [h1Size, setH1Size] = useState<number>(62);
  const [bodySize, setBodySize] = useState<number>(27);
  const [quoteSize, setQuoteSize] = useState<number>(28);
  const [bannerSize, setBannerSize] = useState<number>(34);
  const [textGap, setTextGap] = useState<number>(0.85);

  const [offsets, setOffsets] = useState<Record<LayerKey, Offset>>(ZERO_OFFSETS);
  const [activeLayer, setActiveLayer] = useState<LayerKey | null>(null);
  const [editingLayer, setEditingLayer] = useState<LayerKey | null>(null);
  const [imgNat, setImgNat] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const photoDragRef = useRef<{ active: boolean; sx: number; sy: number; bx: number; by: number }>({
    active: false,
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0
  });
  const layerDragRef = useRef<{
    key: LayerKey | null;
    sx: number;
    sy: number;
    bx: number;
    by: number;
    moved: boolean;
  }>({
    key: null,
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0,
    moved: false
  });

  useEffect(() => {
    if (!selectedDog) return;
    const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const age = extractAge(selectedDog);
    const breed =
      selectedDog.breed || (selectedDog.category === 'Stud' ? 'French Bulldog Stud' : 'French Bulldog');
    const parts = [breed, selectedDog.gender, age].filter(Boolean).map((s) => String(s).toUpperCase());

    setPhotoSrc(selectedDog.image || galleryPhotos[0] || '');
    setPanX(0);
    setPanY(0);
    setZoom(1);
    setPillText(
      selectedDog.status === 'Pending'
        ? '✨ Pending • Deposit Placed'
        : selectedDog.category === 'Stud'
          ? '✨ Stud Service Available'
          : '✨ Available Now'
    );
    setHeadline(`Meet ${selectedDog.name}`);
    setMetaRow(parts.join(' • '));
    setMinimalBannerText([breed, age].filter(Boolean).join(' • '));
    setCoatText(selectedDog.dna || selectedDog.description || '');
    setDnaText((selectedDog.dna_technical || '').trim());
    setQuoteText(
      DEFAULT_QUOTES[slug] ||
        '"Raised in our Oklahoma City home with love, structure, and health first."'
    );
  }, [selectedDog?.id]);

  const startLayerDrag = (key: LayerKey, e: React.PointerEvent) => {
    if (editingLayer === key) return;
    e.stopPropagation();
    setActiveLayer(key);
    layerDragRef.current = {
      key,
      sx: e.clientX,
      sy: e.clientY,
      bx: offsets[key].x,
      by: offsets[key].y,
      moved: false
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const moveLayerDrag = (e: React.PointerEvent) => {
    const st = layerDragRef.current;
    if (!st.key) return;
    const dx = (e.clientX - st.sx) * 2;
    const dy = (e.clientY - st.sy) * 2;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) st.moved = true;
    const key = st.key;
    setOffsets((prev) => ({
      ...prev,
      [key]: { x: st.bx + dx, y: st.by + dy }
    }));
  };

  const endLayerDrag = (key: LayerKey) => {
    if (layerDragRef.current.key === key) {
      layerDragRef.current.key = null;
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const BANNER_STYLES = {
    cream: { bg: '#F6F4EE', text: '#1C2621', border: '#EAE5D9' },
    sage: { bg: '#2E5A44', text: '#FFFFFF', border: '#2E5A44' },
    gold: { bg: '#F4D37E', text: '#1C2621', border: '#E5C165' },
    dark: { bg: 'rgba(28, 38, 33, 0.88)', text: '#FFFFFF', border: 'rgba(255,255,255,0.2)' }
  };

  const handleDownload = async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;

    if (template === 'minimal') {
      ctx.fillStyle = '#EFECE4';
      ctx.fillRect(0, 0, 1080, 1350);

      if (img && img.naturalWidth > 0) {
        const coverScale = Math.max(1080 / img.naturalWidth, 1350 / img.naturalHeight) * zoom;
        const drawW = img.naturalWidth * coverScale;
        const drawH = img.naturalHeight * coverScale;
        const drawX = (1080 - drawW) / 2 + panX;
        const drawY = (1350 - drawH) / 2 + panY;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }

      // Minimal floating banner pill
      const bStyle = BANNER_STYLES[bannerBg];
      ctx.font = `800 ${bannerSize}px 'DM Sans', sans-serif`;
      const bannerW = Math.min(980, ctx.measureText(minimalBannerText).width + 76);
      const bannerH = bannerSize + 40;
      const bx = 540 - bannerW / 2 + offsets.minimalBanner.x;
      const by = 1140 + offsets.minimalBanner.y;

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 10;
      roundRectPath(ctx, bx, by, bannerW, bannerH, 999, 999, 999, 999);
      ctx.fillStyle = bStyle.bg;
      ctx.fill();
      ctx.restore();

      roundRectPath(ctx, bx, by, bannerW, bannerH, 999, 999, 999, 999);
      ctx.strokeStyle = bStyle.border;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = bStyle.text;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(minimalBannerText, bx + bannerW / 2, by + bannerH / 2 + 2);

      // Subtle @okcfrenchies handle pill
      ctx.font = "700 20px 'DM Sans', sans-serif";
      const hW = ctx.measureText('@okcfrenchies').width + 36;
      const hx = 540 - hW / 2 + offsets.brand.x;
      const hy = 1245 + offsets.brand.y;
      roundRectPath(ctx, hx, hy, hW, 38, 19, 19, 19, 19);
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.fill();
      ctx.fillStyle = '#2E5A44';
      ctx.fillText('@okcfrenchies', hx + hW / 2, hy + 20);
    } else {
      const isSage = template === 'sage';
      const isEditorial = template === 'editorial';

      ctx.fillStyle = isSage ? '#2E5A44' : '#F6F4EE';
      ctx.fillRect(0, 0, 1080, 1350);

      const pad = isSage ? 36 : 26;
      const cardW = 1080 - pad * 2;
      const cardH = 1350 - pad * 2;
      const topR = isEditorial || isSage ? 38 : 230;
      const archX = pad + 26;
      const archW = cardW - 52;
      const archH = archHeight;

      ctx.save();
      ctx.shadowColor = 'rgba(28,38,33,0.08)';
      ctx.shadowBlur = 50;
      ctx.shadowOffsetY = 20;
      roundRectPath(ctx, pad, pad, cardW, cardH, topR, topR, 40, 40);
      ctx.fillStyle = isSage ? '#F6F4EE' : '#FFFFFF';
      ctx.fill();
      ctx.restore();

      if (!isSage) {
        roundRectPath(ctx, pad, pad, cardW, cardH, topR, topR, 40, 40);
        ctx.strokeStyle = '#EAE5D9';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      let archY = pad + 20;

      if (isSage) {
        ctx.font = "800 21px 'DM Sans', sans-serif";
        const pW = ctx.measureText(pillText).width + 48;
        const px = archX + offsets.pill.x;
        const py = pad + 24 + offsets.pill.y;
        roundRectPath(ctx, px, py, pW, 44, 22, 22, 22, 22);
        ctx.fillStyle = '#F4D37E';
        ctx.fill();
        ctx.fillStyle = '#1C2621';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pillText, px + pW / 2, py + 23);

        ctx.textAlign = 'right';
        ctx.font = "800 22px 'DM Sans', sans-serif";
        ctx.fillStyle = '#2E5A44';
        ctx.fillText('@okcfrenchies', archX + archW, pad + 47);
        archY = pad + 84;
      }

      ctx.save();
      const photoTopR = isEditorial || isSage ? 28 : 210;
      roundRectPath(ctx, archX, archY, archW, archH, photoTopR, photoTopR, 26, 26);
      ctx.clip();
      ctx.fillStyle = '#EFECE4';
      ctx.fillRect(archX, archY, archW, archH);

      if (img && img.naturalWidth > 0) {
        const coverScale = Math.max(archW / img.naturalWidth, archH / img.naturalHeight) * zoom;
        const drawW = img.naturalWidth * coverScale;
        const drawH = img.naturalHeight * coverScale;
        const drawX = archX + (archW - drawW) / 2 + panX;
        const drawY = archY + (archH - drawH) / 2 + panY;
        ctx.drawImage(img, drawX, drawY, drawW, drawH);
      }
      ctx.restore();

      let curY = archY + archH;
      if (!isSage) {
        ctx.font = "800 23px 'DM Sans', sans-serif";
        const pillW = ctx.measureText(pillText).width + 64;
        const pillX = (isEditorial ? archX + 24 : 540 - pillW / 2) + offsets.pill.x;
        const pillY = archY + archH - 25 + offsets.pill.y;
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.08)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 6;
        roundRectPath(ctx, pillX, pillY, pillW, 48, 24, 24, 24, 24);
        ctx.fillStyle = '#F4D37E';
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = '#1C2621';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pillText, pillX + pillW / 2, pillY + 25);
        curY = archY + archH + 41;
      } else {
        curY += 28;
      }

      const textX = isEditorial ? archX : 540;
      ctx.textAlign = isEditorial ? 'left' : 'center';

      ctx.font = "800 19px 'DM Sans', sans-serif";
      ctx.fillStyle = '#2E5A44';
      ctx.fillText(brandText, textX + offsets.brand.x, curY + offsets.brand.y);

      curY += h1Size * (0.85 * textGap + 0.15);
      ctx.font = `700 ${h1Size}px 'Playfair Display', serif`;
      ctx.fillStyle = '#1C2621';
      ctx.fillText(headline, textX + offsets.headline.x, curY + offsets.headline.y);

      curY += bodySize * (1.35 * textGap + 0.25);
      ctx.font = `800 ${Math.max(16, bodySize - 3)}px 'DM Sans', sans-serif`;
      ctx.fillStyle = '#D46A4E';
      ctx.fillText(metaRow, textX + offsets.meta.x, curY + offsets.meta.y);

      curY += bodySize * (1.2 * textGap + 0.2);
      ctx.font = `700 ${bodySize}px 'DM Sans', sans-serif`;
      ctx.fillStyle = '#2F3E37';
      wrapLines(ctx, coatText, 900).forEach((line) => {
        ctx.fillText(line, textX + offsets.coat.x, curY + offsets.coat.y);
        curY += bodySize * (1.15 * textGap + 0.15);
      });

      if (dnaText.trim()) {
        const dnaFont = Math.max(15, bodySize - 5);
        ctx.font = `700 ${dnaFont}px 'DM Sans', sans-serif`;
        const fullDna = `DNA: ${dnaText.trim()}`;
        const boxW = Math.min(940, ctx.measureText(fullDna).width + 44);
        const boxX = (isEditorial ? archX : 540 - boxW / 2) + offsets.dna.x;
        const boxY = curY - 12 + offsets.dna.y;
        roundRectPath(ctx, boxX, boxY, boxW, dnaFont + 20, 14, 14, 14, 14);
        ctx.fillStyle = isSage ? '#FFFFFF' : '#F6F4EE';
        ctx.fill();
        ctx.strokeStyle = '#E2DCCD';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = '#2E5A44';
        ctx.textAlign = 'center';
        ctx.fillText(fullDna, boxX + boxW / 2, boxY + (dnaFont + 20) / 2);
        ctx.textAlign = isEditorial ? 'left' : 'center';
        curY += dnaFont + 24 * textGap + 6;
      }

      ctx.font = `italic 600 ${quoteSize}px 'Playfair Display', serif`;
      ctx.fillStyle = '#2E5A44';
      curY += 6 * textGap;
      wrapLines(ctx, quoteText, 880).forEach((line) => {
        ctx.fillText(line, textX + offsets.quote.x, curY + offsets.quote.y);
        curY += quoteSize * (1.15 * textGap + 0.15);
      });

      const footerY = 1350 - pad - 96;
      ctx.strokeStyle = isSage ? '#DFD8C8' : '#F0ECE1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(archX, footerY);
      ctx.lineTo(archX + archW, footerY);
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = "800 25px 'DM Sans', sans-serif";
      ctx.fillStyle = '#1C2621';
      ctx.fillText(emailText, archX + 6, footerY + 36);

      ctx.font = "700 22px 'DM Sans', sans-serif";
      ctx.fillStyle = '#5C6B63';
      ctx.fillText(siteText, archX + 6, footerY + 68);

      ctx.font = "800 24px 'DM Sans', sans-serif";
      const ctaW = ctx.measureText(ctaText).width + 64;
      roundRectPath(ctx, archX + archW - ctaW - 6, footerY + 22, ctaW, 56, 28, 28, 28, 28);
      ctx.fillStyle = '#2E5A44';
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, archX + archW - ctaW / 2 - 6, footerY + 51);
    }

    const a = document.createElement('a');
    const safeName = (selectedDog?.name || 'puppy').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `okcfrenchies-${safeName}-${template}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const isMinimal = template === 'minimal';
  const previewPad = template === 'sage' ? 36 : 26;
  const previewArchW = isMinimal ? 1080 : 1080 - previewPad * 2 - 52;
  const previewArchH = isMinimal ? 1350 : archHeight;
  const previewScale =
    imgNat.w > 0 && imgNat.h > 0
      ? Math.max(previewArchW / imgNat.w, previewArchH / imgNat.h) * zoom
      : 1;
  const previewDrawW = imgNat.w > 0 ? imgNat.w * previewScale : previewArchW;
  const previewDrawH = imgNat.h > 0 ? imgNat.h * previewScale : previewArchH;
  const previewDrawX = (previewArchW - previewDrawW) / 2 + panX;
  const previewDrawY = (previewArchH - previewDrawH) / 2 + panY;

  const layerClass = (key: LayerKey) =>
    `cursor-move transition-shadow ${
      activeLayer === key ? 'outline outline-2 outline-dashed outline-[#D46A4E] outline-offset-4 rounded-lg' : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#2E5A44]/50 hover:outline-offset-4 hover:rounded-lg'
    }`;

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1C2621] pb-10">
      <Helmet>
        <title>Instagram Card Studio | OKC Frenchies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Admin Toolbar */}
      <div className="bg-white border-b border-[#EAE5D9] px-4 sm:px-8 py-3 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#2E5A44]">
              🌿 Instagram Card Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#5C6B63]">
              Drag photos &amp; text boxes directly on the card, double-click any text to edit inline, and export 1080×1350 PNGs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPanX(0);
                setPanY(0);
                setZoom(1);
              }}
              className="px-3.5 py-2 rounded-full bg-[#F6F4EE] border border-[#D9D2C3] text-xs font-bold text-[#1C2621] hover:bg-[#EAE5D9] transition"
            >
              Reset Photo
            </button>
            <button
              type="button"
              onClick={() => setOffsets(ZERO_OFFSETS)}
              className="px-3.5 py-2 rounded-full bg-[#F6F4EE] border border-[#D9D2C3] text-xs font-bold text-[#1C2621] hover:bg-[#EAE5D9] transition"
            >
              Reset Text Positions
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2 rounded-full bg-[#2E5A44] text-white text-xs sm:text-sm font-bold hover:bg-[#234735] transition shadow-sm"
            >
              ⬇ Download 1080×1350 PNG
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Independent Scroll Sidebar + Sticky Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-5 grid grid-cols-1 lg:grid-cols-[410px_1fr] gap-8 items-start">
        {/* Left Scrollable Controls */}
        <aside className="bg-white border border-[#EAE5D9] rounded-3xl p-5 space-y-4 shadow-sm lg:h-[calc(100vh-116px)] lg:overflow-y-auto">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44] mb-2">
              1. Layout Template
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['minimal', '✨ Minimal Photo'],
                  ['arch', 'Botanical Arch'],
                  ['editorial', 'Editorial Card'],
                  ['sage', 'Sage Mat Frame']
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setTemplate(key);
                    setOffsets(ZERO_OFFSETS);
                  }}
                  className={`py-2.5 px-2 rounded-xl text-xs font-extrabold border transition ${
                    template === key
                      ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44]'
                      : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[#F0ECE1] pt-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44]">
                2. Puppy &amp; Gallery
              </div>
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
              className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-sm font-semibold"
            >
              {filteredDogs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.status || d.category})
                </option>
              ))}
            </select>

            {galleryPhotos.length > 0 && (
              <div>
                <div className="text-xs font-bold text-[#3E4D45] mb-1.5">
                  Gallery Photos (Click to Swap)
                </div>
                <div className="flex flex-wrap gap-2">
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
                      className={`w-14 h-14 rounded-xl object-cover cursor-pointer border-2 transition ${
                        photoSrc === url
                          ? 'border-[#2E5A44] ring-2 ring-[#CFE2D7]'
                          : 'border-[#DDD6C7]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <label className="inline-flex items-center gap-2 bg-[#F6F4EE] border border-dashed border-[#BDB5A4] px-3 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-[#EFECE3]">
              📷 Upload Custom Photo
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            </label>
          </div>

          <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44]">
              3. Photo Framing
            </div>
            {!isMinimal && (
              <label className="block text-xs font-bold text-[#3E4D45]">
                <div className="flex justify-between mb-1">
                  <span>Photo Window Height</span>
                  <span className="text-[#D46A4E]">{archHeight}px</span>
                </div>
                <input
                  type="range"
                  min={600}
                  max={920}
                  value={archHeight}
                  onChange={(e) => setArchHeight(Number(e.target.value))}
                  className="w-full accent-[#2E5A44]"
                />
              </label>
            )}
            <label className="block text-xs font-bold text-[#3E4D45]">
              <div className="flex justify-between mb-1">
                <span>Photo Zoom</span>
                <span className="text-[#D46A4E]">{zoom.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={2.4}
                step={0.02}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#2E5A44]"
              />
            </label>
          </div>

          {isMinimal ? (
            <div className="border-t border-[#F0ECE1] pt-3 space-y-3">
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44]">
                4. Minimal Banner &amp; Style
              </div>
              <label className="block text-xs font-bold text-[#3E4D45]">
                Banner Text (Breed &amp; Age)
                <input
                  type="text"
                  value={minimalBannerText}
                  onChange={(e) => setMinimalBannerText(e.target.value)}
                  placeholder="French Bulldog • 5 Months Old"
                  className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                />
              </label>
              <div>
                <div className="text-xs font-bold text-[#3E4D45] mb-1.5">Banner Background</div>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      ['cream', 'Cream'],
                      ['sage', 'Forest'],
                      ['gold', 'Gold'],
                      ['dark', 'Charcoal']
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setBannerBg(key)}
                      className={`py-1.5 rounded-lg text-xs font-bold border ${
                        bannerBg === key
                          ? 'border-[#2E5A44] ring-2 ring-[#CFE2D7]'
                          : 'border-[#DDD6C7]'
                      }`}
                      style={{
                        background: BANNER_STYLES[key].bg,
                        color: BANNER_STYLES[key].text
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block text-xs font-bold text-[#3E4D45]">
                <div className="flex justify-between mb-1">
                  <span>Banner Size</span>
                  <span className="text-[#D46A4E]">{bannerSize}px</span>
                </div>
                <input
                  type="range"
                  min={22}
                  max={50}
                  value={bannerSize}
                  onChange={(e) => setBannerSize(Number(e.target.value))}
                  className="w-full accent-[#2E5A44]"
                />
              </label>
            </div>
          ) : (
            <>
              <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44]">
                  4. Text &amp; Details
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-bold text-[#3E4D45]">
                    Status Pill
                    <input
                      type="text"
                      value={pillText}
                      onChange={(e) => setPillText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                    />
                  </label>
                  <label className="text-xs font-bold text-[#3E4D45]">
                    Headline
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                    />
                  </label>
                </div>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  Breed • Gender • Age • DOB
                  <input
                    type="text"
                    value={metaRow}
                    onChange={(e) => setMetaRow(e.target.value)}
                    placeholder="FRENCH BULLDOG • FEMALE • 5 MONTHS • DOB 06/10/2026"
                    className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  Coat Description
                  <input
                    type="text"
                    value={coatText}
                    onChange={(e) => setCoatText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  DNA String (optional)
                  <input
                    type="text"
                    value={dnaText}
                    onChange={(e) => setDnaText(e.target.value)}
                    placeholder="Leave blank to hide DNA pill"
                    className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  Sweet Quote
                  <textarea
                    rows={2}
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-bold text-[#3E4D45]">
                    Email
                    <input
                      type="text"
                      value={emailText}
                      onChange={(e) => setEmailText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                    />
                  </label>
                  <label className="text-xs font-bold text-[#3E4D45]">
                    Website
                    <input
                      type="text"
                      value={siteText}
                      onChange={(e) => setSiteText(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                    />
                  </label>
                </div>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  CTA Button
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-2.5 py-1.5 text-sm"
                  />
                </label>
              </div>

              <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
                <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44]">
                  5. Font Sizes &amp; Spacing
                </div>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  <div className="flex justify-between mb-1">
                    <span>Headline Size</span>
                    <span className="text-[#D46A4E]">{h1Size}px</span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={90}
                    value={h1Size}
                    onChange={(e) => setH1Size(Number(e.target.value))}
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  <div className="flex justify-between mb-1">
                    <span>Details &amp; Coat Size</span>
                    <span className="text-[#D46A4E]">{bodySize}px</span>
                  </div>
                  <input
                    type="range"
                    min={18}
                    max={40}
                    value={bodySize}
                    onChange={(e) => setBodySize(Number(e.target.value))}
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  <div className="flex justify-between mb-1">
                    <span>Quote Size</span>
                    <span className="text-[#D46A4E]">{quoteSize}px</span>
                  </div>
                  <input
                    type="range"
                    min={20}
                    max={44}
                    value={quoteSize}
                    onChange={(e) => setQuoteSize(Number(e.target.value))}
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
                <label className="block text-xs font-bold text-[#3E4D45]">
                  <div className="flex justify-between mb-1">
                    <span>Text Spacing (Tight / Loose)</span>
                    <span className="text-[#D46A4E]">{textGap.toFixed(2)}×</span>
                  </div>
                  <input
                    type="range"
                    min={0.35}
                    max={1.4}
                    step={0.05}
                    value={textGap}
                    onChange={(e) => setTextGap(Number(e.target.value))}
                    className="w-full accent-[#2E5A44]"
                  />
                </label>
              </div>
            </>
          )}
        </aside>

        {/* Right Sticky Preview Pane */}
        <main className="flex flex-col items-center gap-3 lg:sticky lg:top-24">
          <div className="text-xs sm:text-sm font-semibold text-[#5C6B63] bg-white px-4 py-1.5 rounded-full border border-[#EAE5D9] text-center">
            💡 <strong>Canva Mode:</strong> Drag the photo OR drag any text box/banner directly! Double-click text to type right on the card.
          </div>

          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 540, height: 675 }}
          >
            <div
              onClick={() => {
                setActiveLayer(null);
                setEditingLayer(null);
              }}
              style={{
                width: 1080,
                height: 1350,
                transform: 'scale(0.5)',
                transformOrigin: 'top left',
                background:
                  template === 'sage'
                    ? '#2E5A44'
                    : template === 'minimal'
                      ? '#EFECE4'
                      : '#F6F4EE',
                padding: template === 'minimal' ? 0 : template === 'sage' ? 36 : 26,
                display: 'flex',
                flexDirection: 'column',
                userSelect: editingLayer ? 'text' : 'none',
                position: 'relative'
              }}
            >
              {isMinimal ? (
                <div
                  onPointerDown={(e) => {
                    photoDragRef.current = {
                      active: true,
                      sx: e.clientX,
                      sy: e.clientY,
                      bx: panX,
                      by: panY
                    };
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!photoDragRef.current.active) return;
                    setPanX(photoDragRef.current.bx + (e.clientX - photoDragRef.current.sx) * 2);
                    setPanY(photoDragRef.current.by + (e.clientY - photoDragRef.current.sy) * 2);
                  }}
                  onPointerUp={() => {
                    photoDragRef.current.active = false;
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    cursor: 'grab'
                  }}
                >
                  <img
                    ref={imgRef}
                    src={photoSrc}
                    alt={headline}
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

                  {/* Draggable & Editable Minimal Banner */}
                  <div
                    onPointerDown={(e) => startLayerDrag('minimalBanner', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('minimalBanner')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('minimalBanner');
                    }}
                    className={layerClass('minimalBanner')}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 1140,
                      transform: `translate(calc(-50% + ${offsets.minimalBanner.x}px), ${offsets.minimalBanner.y}px)`,
                      background: BANNER_STYLES[bannerBg].bg,
                      color: BANNER_STYLES[bannerBg].text,
                      border: `2px solid ${BANNER_STYLES[bannerBg].border}`,
                      fontSize: bannerSize,
                      fontWeight: 800,
                      padding: '18px 38px',
                      borderRadius: 999,
                      boxShadow: '0 10px 28px rgba(0,0,0,0.22)',
                      whiteSpace: 'nowrap',
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'minimalBanner' ? (
                      <input
                        autoFocus
                        value={minimalBannerText}
                        onChange={(e) => setMinimalBannerText(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{
                          background: 'transparent',
                          color: 'inherit',
                          font: 'inherit',
                          textAlign: 'center',
                          outline: 'none',
                          width: Math.max(300, minimalBannerText.length * (bannerSize * 0.58))
                        }}
                      />
                    ) : (
                      minimalBannerText
                    )}
                  </div>

                  {/* Draggable Handle Pill */}
                  <div
                    onPointerDown={(e) => startLayerDrag('brand', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('brand')}
                    className={layerClass('brand')}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 1245,
                      transform: `translate(calc(-50% + ${offsets.brand.x}px), ${offsets.brand.y}px)`,
                      background: 'rgba(255,255,255,0.84)',
                      color: '#2E5A44',
                      fontSize: 20,
                      fontWeight: 700,
                      padding: '7px 20px',
                      borderRadius: 999,
                      zIndex: 10
                    }}
                  >
                    @okcfrenchies
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    overflow: 'hidden',
                    background: template === 'sage' ? '#F6F4EE' : '#FFFFFF',
                    border: template === 'sage' ? 'none' : '2px solid #EAE5D9',
                    borderRadius:
                      template === 'arch' ? '230px 230px 40px 40px' : '38px',
                    padding:
                      template === 'editorial'
                        ? '24px 28px 22px'
                        : template === 'sage'
                          ? '26px 30px 22px'
                          : '20px 26px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: template === 'editorial' ? 'flex-start' : 'center',
                    textAlign: template === 'editorial' ? 'left' : 'center',
                    boxShadow: '0 24px 60px rgba(28,38,33,0.08)'
                  }}
                >
                  {template === 'sage' && (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16
                      }}
                    >
                      <div
                        onPointerDown={(e) => startLayerDrag('pill', e)}
                        onPointerMove={moveLayerDrag}
                        onPointerUp={() => endLayerDrag('pill')}
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditingLayer('pill');
                        }}
                        className={layerClass('pill')}
                        style={{
                          transform: `translate(${offsets.pill.x}px, ${offsets.pill.y}px)`,
                          background: '#F4D37E',
                          color: '#1C2621',
                          fontSize: 21,
                          fontWeight: 800,
                          padding: '9px 24px',
                          borderRadius: 999,
                          zIndex: 10
                        }}
                      >
                        {editingLayer === 'pill' ? (
                          <input
                            autoFocus
                            value={pillText}
                            onChange={(e) => setPillText(e.target.value)}
                            onBlur={() => setEditingLayer(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                            style={{ background: 'transparent', font: 'inherit', outline: 'none' }}
                          />
                        ) : (
                          pillText
                        )}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#2E5A44' }}>
                        @okcfrenchies
                      </div>
                    </div>
                  )}

                  <div
                    onPointerDown={(e) => {
                      photoDragRef.current = {
                        active: true,
                        sx: e.clientX,
                        sy: e.clientY,
                        bx: panX,
                        by: panY
                      };
                      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                    }}
                    onPointerMove={(e) => {
                      if (!photoDragRef.current.active) return;
                      setPanX(photoDragRef.current.bx + (e.clientX - photoDragRef.current.sx) * 2);
                      setPanY(photoDragRef.current.by + (e.clientY - photoDragRef.current.sy) * 2);
                    }}
                    onPointerUp={() => {
                      photoDragRef.current.active = false;
                    }}
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: archHeight,
                      flexShrink: 0,
                      borderRadius:
                        template === 'arch' ? '210px 210px 26px 26px' : '28px',
                      overflow: 'hidden',
                      background: '#EFECE4',
                      cursor: 'grab'
                    }}
                  >
                    <img
                      ref={imgRef}
                      src={photoSrc}
                      alt={headline}
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

                  {template !== 'sage' && (
                    <div
                      onPointerDown={(e) => startLayerDrag('pill', e)}
                      onPointerMove={moveLayerDrag}
                      onPointerUp={() => endLayerDrag('pill')}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingLayer('pill');
                      }}
                      className={layerClass('pill')}
                      style={{
                        marginTop: -25,
                        marginLeft: template === 'editorial' ? 24 : 0,
                        transform: `translate(${offsets.pill.x}px, ${offsets.pill.y}px)`,
                        position: 'relative',
                        zIndex: 10,
                        background: '#F4D37E',
                        color: '#1C2621',
                        fontSize: 23,
                        fontWeight: 800,
                        padding: '9px 30px',
                        borderRadius: 999,
                        boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                      }}
                    >
                      {editingLayer === 'pill' ? (
                        <input
                          autoFocus
                          value={pillText}
                          onChange={(e) => setPillText(e.target.value)}
                          onBlur={() => setEditingLayer(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                          style={{ background: 'transparent', font: 'inherit', outline: 'none' }}
                        />
                      ) : (
                        pillText
                      )}
                    </div>
                  )}

                  {/* Layered & Individually Draggable Text Elements */}
                  <div
                    onPointerDown={(e) => startLayerDrag('brand', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('brand')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('brand');
                    }}
                    className={layerClass('brand')}
                    style={{
                      transform: `translate(${offsets.brand.x}px, ${offsets.brand.y}px)`,
                      marginTop: template === 'sage' ? 16 * textGap : 10 * textGap,
                      fontSize: 19,
                      fontWeight: 800,
                      color: '#2E5A44',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'brand' ? (
                      <input
                        autoFocus
                        value={brandText}
                        onChange={(e) => setBrandText(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{ background: 'transparent', font: 'inherit', textAlign: 'center', outline: 'none', width: 520 }}
                      />
                    ) : (
                      brandText
                    )}
                  </div>

                  <div
                    onPointerDown={(e) => startLayerDrag('headline', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('headline')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('headline');
                    }}
                    className={layerClass('headline')}
                    style={{
                      transform: `translate(${offsets.headline.x}px, ${offsets.headline.y}px)`,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: h1Size,
                      fontWeight: 700,
                      lineHeight: 1.03,
                      marginTop: 4 * textGap,
                      color: '#1C2621',
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'headline' ? (
                      <input
                        autoFocus
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{ background: 'transparent', font: 'inherit', textAlign: 'center', outline: 'none', width: 600 }}
                      />
                    ) : (
                      headline
                    )}
                  </div>

                  <div
                    onPointerDown={(e) => startLayerDrag('meta', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('meta')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('meta');
                    }}
                    className={layerClass('meta')}
                    style={{
                      transform: `translate(${offsets.meta.x}px, ${offsets.meta.y}px)`,
                      marginTop: 8 * textGap,
                      fontSize: Math.max(16, bodySize - 3),
                      fontWeight: 800,
                      color: '#D46A4E',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'meta' ? (
                      <input
                        autoFocus
                        value={metaRow}
                        onChange={(e) => setMetaRow(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{ background: 'transparent', font: 'inherit', textAlign: 'center', outline: 'none', width: 820 }}
                      />
                    ) : (
                      metaRow
                    )}
                  </div>

                  <div
                    onPointerDown={(e) => startLayerDrag('coat', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('coat')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('coat');
                    }}
                    className={layerClass('coat')}
                    style={{
                      transform: `translate(${offsets.coat.x}px, ${offsets.coat.y}px)`,
                      fontSize: bodySize,
                      color: '#2F3E37',
                      fontWeight: 700,
                      marginTop: 6 * textGap,
                      maxWidth: 920,
                      lineHeight: 1.24,
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'coat' ? (
                      <input
                        autoFocus
                        value={coatText}
                        onChange={(e) => setCoatText(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{ background: 'transparent', font: 'inherit', textAlign: 'center', outline: 'none', width: 860 }}
                      />
                    ) : (
                      coatText
                    )}
                  </div>

                  {dnaText.trim() && (
                    <div
                      onPointerDown={(e) => startLayerDrag('dna', e)}
                      onPointerMove={moveLayerDrag}
                      onPointerUp={() => endLayerDrag('dna')}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingLayer('dna');
                      }}
                      className={layerClass('dna')}
                      style={{
                        transform: `translate(${offsets.dna.x}px, ${offsets.dna.y}px)`,
                        marginTop: 10 * textGap,
                        background: template === 'sage' ? '#FFFFFF' : '#F6F4EE',
                        border: '1.5px solid #E2DCCD',
                        borderRadius: 14,
                        padding: '6px 20px',
                        fontSize: Math.max(15, bodySize - 5),
                        fontWeight: 700,
                        color: '#2E5A44',
                        maxWidth: 940,
                        lineHeight: 1.3,
                        zIndex: 10
                      }}
                    >
                      <strong style={{ color: '#1C2621', marginRight: 6 }}>DNA:</strong>
                      {editingLayer === 'dna' ? (
                        <input
                          autoFocus
                          value={dnaText}
                          onChange={(e) => setDnaText(e.target.value)}
                          onBlur={() => setEditingLayer(null)}
                          onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                          style={{ background: 'transparent', font: 'inherit', outline: 'none', width: 680 }}
                        />
                      ) : (
                        dnaText
                      )}
                    </div>
                  )}

                  <div
                    onPointerDown={(e) => startLayerDrag('quote', e)}
                    onPointerMove={moveLayerDrag}
                    onPointerUp={() => endLayerDrag('quote')}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      setEditingLayer('quote');
                    }}
                    className={layerClass('quote')}
                    style={{
                      transform: `translate(${offsets.quote.x}px, ${offsets.quote.y}px)`,
                      marginTop: 12 * textGap,
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: 'italic',
                      fontWeight: 600,
                      fontSize: quoteSize,
                      color: '#2E5A44',
                      maxWidth: 900,
                      lineHeight: 1.22,
                      zIndex: 10
                    }}
                  >
                    {editingLayer === 'quote' ? (
                      <input
                        autoFocus
                        value={quoteText}
                        onChange={(e) => setQuoteText(e.target.value)}
                        onBlur={() => setEditingLayer(null)}
                        onKeyDown={(e) => e.key === 'Enter' && setEditingLayer(null)}
                        style={{ background: 'transparent', font: 'inherit', textAlign: 'center', outline: 'none', width: 860 }}
                      />
                    ) : (
                      quoteText
                    )}
                  </div>

                  <div
                    style={{
                      marginTop: 'auto',
                      width: '100%',
                      paddingTop: 14,
                      borderTop: `2px solid ${template === 'sage' ? '#DFD8C8' : '#F0ECE1'}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingInline: 8,
                      gap: 16
                    }}
                  >
                    <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ fontSize: 25, fontWeight: 800, color: '#1C2621' }}>
                        {emailText}
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 700, color: '#5C6B63' }}>
                        {siteText}
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#2E5A44',
                        color: '#FFFFFF',
                        fontSize: 24,
                        fontWeight: 800,
                        padding: '14px 32px',
                        borderRadius: 999,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {ctaText}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SocialStudio;
