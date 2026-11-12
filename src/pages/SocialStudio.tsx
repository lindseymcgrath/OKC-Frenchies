import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import puppiesData from '../data/puppies.json';
import studsData from '../data/studs.json';

type TemplateType = 'arch' | 'editorial' | 'sage';

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

  const [selectedId, setSelectedId] = useState<string>('puppies-4'); // Default to Alice
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

  const [template, setTemplate] = useState<TemplateType>('arch');
  const [photoSrc, setPhotoSrc] = useState<string>(selectedDog?.image || '');
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [archHeight, setArchHeight] = useState<number>(815);

  const [pillText, setPillText] = useState<string>('✨ Available Now');
  const [headline, setHeadline] = useState<string>('Meet Alice');
  const [metaRow, setMetaRow] = useState<string>('FRENCH BULLDOG • FEMALE • 5 MONTHS OLD');
  const [coatText, setCoatText] = useState<string>('');
  const [dnaText, setDnaText] = useState<string>('');
  const [quoteText, setQuoteText] = useState<string>('');
  const [emailText, setEmailText] = useState<string>('info@okcfrenchies.com');
  const [siteText, setSiteText] = useState<string>('OKCFrenchies.com');
  const [ctaText, setCtaText] = useState<string>('Text 405.300.8482');

  const [h1Size, setH1Size] = useState<number>(62);
  const [bodySize, setBodySize] = useState<number>(27);
  const [quoteSize, setQuoteSize] = useState<number>(28);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragRef = useRef<{ active: boolean; sx: number; sy: number; bx: number; by: number }>({
    active: false,
    sx: 0,
    sy: 0,
    bx: 0,
    by: 0
  });

  // Sync editor fields when selecting a different dog
  useEffect(() => {
    if (!selectedDog) return;
    const slug = selectedDog.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const age = extractAge(selectedDog);
    const parts = [
      selectedDog.breed || (selectedDog.category === 'Stud' ? 'French Bulldog Stud' : 'French Bulldog'),
      selectedDog.gender,
      age
    ]
      .filter(Boolean)
      .map((s) => String(s).toUpperCase());

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
    setCoatText(selectedDog.dna || selectedDog.description || '');
    setDnaText((selectedDog.dna_technical || '').trim());
    setQuoteText(
      DEFAULT_QUOTES[slug] ||
        '"Raised in our Oklahoma City home with love, structure, and health first."'
    );
  }, [selectedDog?.id]);

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

  const handleDownload = async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isSage = template === 'sage';
    const isEditorial = template === 'editorial';

    ctx.fillStyle = isSage ? '#2E5A44' : '#F6F4EE';
    ctx.fillRect(0, 0, 1080, 1350);

    const pad = isSage ? 36 : 26;
    const cardW = 1080 - pad * 2;
    const cardH = 1350 - pad * 2;
    const topR = isEditorial || isSage ? 38 : 230;

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
    const archX = pad + 26;
    const archW = cardW - 52;
    const archH = archHeight;

    if (isSage) {
      ctx.font = "800 21px 'DM Sans', sans-serif";
      const pW = ctx.measureText(pillText).width + 48;
      roundRectPath(ctx, archX, pad + 24, pW, 44, 22, 22, 22, 22);
      ctx.fillStyle = '#F4D37E';
      ctx.fill();
      ctx.fillStyle = '#1C2621';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(pillText, archX + pW / 2, pad + 47);

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

    const img = imgRef.current;
    if (img && img.naturalWidth > 0) {
      const coverScale = Math.max(archW / img.naturalWidth, archH / img.naturalHeight) * zoom;
      const drawW = img.naturalWidth * coverScale;
      const drawH = img.naturalHeight * coverScale;
      const drawX = archX + archW / 2 - drawW / 2 + panX;
      const drawY = archY + archH / 2 - drawH / 2 + panY;
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }
    ctx.restore();

    let curY = archY + archH;
    if (!isSage) {
      ctx.font = "800 23px 'DM Sans', sans-serif";
      const pillW = ctx.measureText(pillText).width + 64;
      const pillX = isEditorial ? archX + 24 : 540 - pillW / 2;
      const pillY = archY + archH - 25;
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
      curY = pillY + 66;
    } else {
      curY += 28;
    }

    const textX = isEditorial ? archX : 540;
    ctx.textAlign = isEditorial ? 'left' : 'center';

    ctx.font = "800 19px 'DM Sans', sans-serif";
    ctx.fillStyle = '#2E5A44';
    ctx.fillText('🌿 OKC FRENCHIES & MINI BULLDOGS', textX, curY);

    curY += h1Size * 0.85;
    ctx.font = `700 ${h1Size}px 'Playfair Display', serif`;
    ctx.fillStyle = '#1C2621';
    ctx.fillText(headline, textX, curY);

    curY += bodySize * 1.45;
    ctx.font = `800 ${Math.max(16, bodySize - 3)}px 'DM Sans', sans-serif`;
    ctx.fillStyle = '#D46A4E';
    ctx.fillText(metaRow, textX, curY);

    curY += bodySize * 1.3;
    ctx.font = `700 ${bodySize}px 'DM Sans', sans-serif`;
    ctx.fillStyle = '#2F3E37';
    wrapLines(ctx, coatText, 900).forEach((line) => {
      ctx.fillText(line, textX, curY);
      curY += bodySize * 1.24;
    });

    if (dnaText.trim()) {
      const dnaFont = Math.max(15, bodySize - 5);
      ctx.font = `700 ${dnaFont}px 'DM Sans', sans-serif`;
      const fullDna = `DNA: ${dnaText.trim()}`;
      const boxW = Math.min(940, ctx.measureText(fullDna).width + 44);
      const boxX = isEditorial ? archX : 540 - boxW / 2;
      roundRectPath(ctx, boxX, curY - 12, boxW, dnaFont + 22, 14, 14, 14, 14);
      ctx.fillStyle = isSage ? '#FFFFFF' : '#F6F4EE';
      ctx.fill();
      ctx.strokeStyle = '#E2DCCD';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#2E5A44';
      ctx.textAlign = 'center';
      ctx.fillText(fullDna, boxX + boxW / 2, curY + dnaFont / 2 - 1);
      ctx.textAlign = isEditorial ? 'left' : 'center';
      curY += dnaFont + 30;
    }

    ctx.font = `italic 600 ${quoteSize}px 'Playfair Display', serif`;
    ctx.fillStyle = '#2E5A44';
    curY += 6;
    wrapLines(ctx, quoteText, 880).forEach((line) => {
      ctx.fillText(line, textX, curY);
      curY += quoteSize * 1.24;
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

    const a = document.createElement('a');
    const safeName = (selectedDog?.name || 'puppy').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `okcfrenchies-${safeName}-${template}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const posX = Math.max(0, Math.min(100, 50 - panX * 0.15));
  const posY = Math.max(0, Math.min(100, 35 - panY * 0.15));

  return (
    <div className="min-h-screen bg-[#EFECE3] text-[#1C2621] pb-16">
      <Helmet>
        <title>Instagram Card Studio | OKC Frenchies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Admin Toolbar */}
      <div className="bg-white border-b border-[#EAE5D9] px-4 sm:px-8 py-4 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#2E5A44]">
              🌿 Instagram Card Studio
            </h1>
            <p className="text-sm text-[#5C6B63]">
              Pick a layout template, drag the photo inside the window, edit DOB/age/quotes, and export 1080×1350 PNGs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setPanX(0);
                setPanY(0);
                setZoom(1);
              }}
              className="px-4 py-2 rounded-full bg-[#F6F4EE] border border-[#D9D2C3] text-sm font-bold text-[#1C2621] hover:bg-[#EAE5D9] transition"
            >
              Reset Photo
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-full bg-[#2E5A44] text-white text-sm font-bold hover:bg-[#234735] transition shadow-sm"
            >
              ⬇ Download 1080×1350 PNG
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
        {/* Left Controls */}
        <aside className="bg-white border border-[#EAE5D9] rounded-3xl p-5 space-y-4 shadow-sm">
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-widest text-[#2E5A44] mb-2">
              1. Layout Template
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['arch', 'Botanical Arch'],
                  ['editorial', 'Editorial Card'],
                  ['sage', 'Sage Mat Frame']
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTemplate(key)}
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
              3. Window &amp; Photo Framing
            </div>
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
              5. Font Sizes
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
          </div>
        </aside>

        {/* Right Live 1080x1350 Preview (scaled 0.5x) */}
        <main className="flex flex-col items-center gap-3">
          <div className="text-xs sm:text-sm font-semibold text-[#5C6B63] bg-white px-4 py-1.5 rounded-full border border-[#EAE5D9]">
            💡 Drag directly on the puppy photo to move it around!
          </div>

          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{ width: 540, height: 675 }}
          >
            <div
              style={{
                width: 1080,
                height: 1350,
                transform: 'scale(0.5)',
                transformOrigin: 'top left',
                background: template === 'sage' ? '#2E5A44' : '#F6F4EE',
                padding: template === 'sage' ? 36 : 26,
                display: 'flex',
                flexDirection: 'column',
                userSelect: 'none'
              }}
            >
              <div
                style={{
                  flex: 1,
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
                      style={{
                        background: '#F4D37E',
                        color: '#1C2621',
                        fontSize: 21,
                        fontWeight: 800,
                        padding: '9px 24px',
                        borderRadius: 999
                      }}
                    >
                      {pillText}
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#2E5A44' }}>
                      @okcfrenchies
                    </div>
                  </div>
                )}

                <div
                  onPointerDown={(e) => {
                    dragRef.current = {
                      active: true,
                      sx: e.clientX,
                      sy: e.clientY,
                      bx: panX,
                      by: panY
                    };
                    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                  }}
                  onPointerMove={(e) => {
                    if (!dragRef.current.active) return;
                    setPanX(dragRef.current.bx + (e.clientX - dragRef.current.sx) * 2);
                    setPanY(dragRef.current.by + (e.clientY - dragRef.current.sy) * 2);
                  }}
                  onPointerUp={() => {
                    dragRef.current.active = false;
                  }}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: archHeight,
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
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: `${posX}% ${posY}%`,
                      transform:
                        zoom > 1
                          ? `translate(${panX * 0.5}px, ${panY * 0.5}px) scale(${zoom})`
                          : `scale(${zoom})`,
                      transformOrigin: 'center center',
                      pointerEvents: 'none'
                    }}
                  />
                </div>

                {template !== 'sage' && (
                  <div
                    style={{
                      marginTop: -25,
                      marginLeft: template === 'editorial' ? 24 : 0,
                      position: 'relative',
                      zIndex: 2,
                      background: '#F4D37E',
                      color: '#1C2621',
                      fontSize: 23,
                      fontWeight: 800,
                      padding: '9px 30px',
                      borderRadius: 999,
                      boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                    }}
                  >
                    {pillText}
                  </div>
                )}

                <div
                  style={{
                    marginTop: template === 'sage' ? 16 : 10,
                    fontSize: 19,
                    fontWeight: 800,
                    color: '#2E5A44',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase'
                  }}
                >
                  🌿 OKC Frenchies &amp; Mini Bulldogs
                </div>

                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: h1Size,
                    fontWeight: 700,
                    lineHeight: 1.03,
                    marginTop: 4,
                    color: '#1C2621'
                  }}
                >
                  {headline}
                </div>

                <div
                  style={{
                    marginTop: 8,
                    fontSize: Math.max(16, bodySize - 3),
                    fontWeight: 800,
                    color: '#D46A4E',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase'
                  }}
                >
                  {metaRow}
                </div>

                <div
                  style={{
                    fontSize: bodySize,
                    color: '#2F3E37',
                    fontWeight: 700,
                    marginTop: 6,
                    maxWidth: 920,
                    lineHeight: 1.24
                  }}
                >
                  {coatText}
                </div>

                {dnaText.trim() && (
                  <div
                    style={{
                      marginTop: 10,
                      background: template === 'sage' ? '#FFFFFF' : '#F6F4EE',
                      border: '1.5px solid #E2DCCD',
                      borderRadius: 14,
                      padding: '7px 20px',
                      fontSize: Math.max(15, bodySize - 5),
                      fontWeight: 700,
                      color: '#2E5A44',
                      maxWidth: 940,
                      lineHeight: 1.3
                    }}
                  >
                    <strong style={{ color: '#1C2621', marginRight: 6 }}>DNA:</strong>
                    {dnaText}
                  </div>
                )}

                <div
                  style={{
                    marginTop: 12,
                    fontFamily: "'Playfair Display', serif",
                    fontStyle: 'italic',
                    fontWeight: 600,
                    fontSize: quoteSize,
                    color: '#2E5A44',
                    maxWidth: 900,
                    lineHeight: 1.24
                  }}
                >
                  {quoteText}
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SocialStudio;

