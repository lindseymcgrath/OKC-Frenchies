import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
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
  TextCardTheme,
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
  { label: string; shortLabel: string; swatch: string; bg: string; text: string; border: string; hasBg: boolean; shadow?: boolean }
> = {
  white: { label: 'Crisp White', shortLabel: 'White', swatch: '#FFFFFF', bg: '#FFFFFF', text: '#1C2621', border: '#EAE5D9', hasBg: true, shadow: true },
  cream: { label: 'Botanical Cream', shortLabel: 'Cream', swatch: '#E8DFCE', bg: '#E8DFCE', text: '#1C2621', border: '#CFC1A9', hasBg: true, shadow: true },
  oat: { label: 'Lilac Taupe', shortLabel: 'Lilac Taupe', swatch: '#B59E99', bg: '#B59E99', text: '#1C2621', border: '#967F7A', hasBg: true, shadow: true },
  champagne: { label: 'French Slate', shortLabel: 'Slate Blue', swatch: '#5A7385', bg: '#5A7385', text: '#FFFFFF', border: '#465C6C', hasBg: true, shadow: true },
  gold: { label: 'Warm Gold', shortLabel: 'Gold', swatch: '#F4D37E', bg: '#F4D37E', text: '#1C2621', border: '#E5C165', hasBg: true, shadow: true },
  'sage-mist': { label: 'Olive Sage', shortLabel: 'Olive Sage', swatch: '#8B9D83', bg: '#8B9D83', text: '#1C2621', border: '#6E8067', hasBg: true, shadow: true },
  sage: { label: 'Deep Forest', shortLabel: 'Forest', swatch: '#2E5A44', bg: '#2E5A44', text: '#FFFFFF', border: '#2E5A44', hasBg: true, shadow: true },
  mocha: { label: 'Espresso Mocha', shortLabel: 'Mocha', swatch: '#3B2B23', bg: '#3B2B23', text: '#F4D37E', border: '#5A4337', hasBg: true, shadow: true },
  charcoal: { label: 'Charcoal Ink', shortLabel: 'Charcoal', swatch: '#1C2621', bg: '#1C2621', text: '#F6F4EE', border: '#34443C', hasBg: true, shadow: true },
  terracotta: { label: 'Warm Terracotta', shortLabel: 'Terracotta', swatch: '#D46A4E', bg: '#D46A4E', text: '#FFFFFF', border: '#D46A4E', hasBg: true, shadow: true },
  blush: { label: 'Soft Rose', shortLabel: 'Soft Rose', swatch: '#F9E4E2', bg: '#F9E4E2', text: '#8C2F2B', border: '#EBC6C2', hasBg: true, shadow: true },
  berry: { label: 'Deep Berry', shortLabel: 'Berry', swatch: '#8C2F2B', bg: '#8C2F2B', text: '#F9E4E2', border: '#A33E39', hasBg: true, shadow: true },
  frosted: {
    label: 'Dark Glass',
    shortLabel: 'Glass',
    swatch: 'rgba(28,38,33,0.84)',
    bg: 'rgba(28,38,33,0.84)',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.22)',
    hasBg: true,
    shadow: true
  },
  'none-dark': { label: 'No Pill (Dark Text)', shortLabel: 'No Pill (Dark)', swatch: 'transparent', bg: 'transparent', text: '#1C2621', border: 'transparent', hasBg: false },
  'none-light': { label: 'No Pill (Light Text)', shortLabel: 'No Pill (Light)', swatch: 'transparent', bg: 'transparent', text: '#FFFFFF', border: 'transparent', hasBg: false }
};

const TEXT_COLOR_SWATCHES: { value: string; label: string; hex: string }[] = [
  { value: '', label: 'Auto', hex: 'linear-gradient(135deg,#1C2621 50%,#F4D37E 50%)' },
  { value: '#FFFFFF', label: 'White', hex: '#FFFFFF' },
  { value: '#E8DFCE', label: 'Cream', hex: '#E8DFCE' },
  { value: '#F4D37E', label: 'Gold', hex: '#F4D37E' },
  { value: '#B59E99', label: 'Lilac Taupe', hex: '#B59E99' },
  { value: '#8B9D83', label: 'Olive Sage', hex: '#8B9D83' },
  { value: '#2E5A44', label: 'Forest', hex: '#2E5A44' },
  { value: '#5A7385', label: 'Slate Blue', hex: '#5A7385' },
  { value: '#3B2B23', label: 'Mocha', hex: '#3B2B23' },
  { value: '#1C2621', label: 'Charcoal', hex: '#1C2621' },
  { value: '#D46A4E', label: 'Terracotta', hex: '#D46A4E' },
  { value: '#F9E4E2', label: 'Soft Rose', hex: '#F9E4E2' },
  { value: '#8C2F2B', label: 'Berry', hex: '#8C2F2B' }
];

const SAVED_PRESETS_KEY = 'okcfrenchies_studio_saved_layouts_v1';
const DRAFT_STORAGE_KEY = 'okcfrenchies_studio_draft_v3';
const SAVED_AI_CARDS_KEY = 'okcfrenchies_studio_ai_history_v1';

const FRAME_PRESET_OPTIONS: { key: FramePreset; label: string }[] = [
  { key: 'arch', label: '🌿 Botanical Arch' },
  { key: 'cameo', label: '🪞 Oval Cameo' },
  { key: 'editorial', label: '🖼️ Editorial Polaroid' },
  { key: 'sage', label: '🌲 Gallery Mat' },
  { key: 'minimal', label: '✨ Full Bleed' },
  { key: 'no-photo', label: '📝 Text Card' }
];

const TEXT_CARD_THEME_OPTIONS: { key: TextCardTheme; label: string }[] = [
  { key: 'arch-crest', label: '🏛️ Boutique Arch' },
  { key: 'magazine-border', label: '📰 Vogue Double-Border' },
  { key: 'cameo-medallion', label: '🪞 Oval Medallion' },
  { key: 'ribbon-banner', label: '🏷️ Top Header Card' },
  { key: 'split-quote', label: '🌗 Split Two-Tone' },
  { key: 'minimal-luxe', label: '✨ Minimal Full-Bleed' }
];

const applyColorAlpha = (color: string, opacity?: number): string => {
  if (opacity === undefined || opacity >= 0.999) return color;
  if (!color || color === 'transparent') return 'transparent';
  const alpha = Math.max(0, Math.min(1, opacity));
  const rgbaMatch = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i);
  if (rgbaMatch) {
    const baseA = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
    return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${(baseA * alpha).toFixed(3)})`;
  }
  const hex = color.replace('#', '').trim();
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }
  return color;
};

interface BrandRemixRecipe {
  name: string;
  preset: FramePreset;
  bgStyle: BgStyle;
  windowStyle: BgStyle;
  photoDim?: number;
  pills: Partial<Record<string, PillStyle>>;
  textColors?: Partial<Record<string, string>>;
  visibleIds: string[];
}

// 28 Designer Shuffle Looks: Mixes Zero-Pill Editorial Typography, 1-Badge Whisper Hybrids, Magazine Full-Bleeds & Curated Pill Cards!
const BRAND_REMIX_RECIPES: BrandRemixRecipe[] = [
  // --- ZERO-PILL PURE EDITORIAL TYPOGRAPHY (Colored Serif & Sans Text!) ---
  {
    name: 'Vogue Botanical Editorial',
    preset: 'arch',
    bgStyle: 'sage-mist',
    windowStyle: 'cream-editorial',
    pills: {
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      quote: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#2E5A44',
      breedAge: '#D46A4E',
      coat: '#1C2621',
      quote: '#3B2B23',
      contact: '#2E5A44'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'quote', 'contact']
  },
  {
    name: 'Parisian White Polaroid',
    preset: 'editorial',
    bgStyle: 'oat-latte',
    windowStyle: 'pure-white',
    pills: {
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      quote: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#3B2B23',
      breedAge: '#D46A4E',
      coat: '#2E5A44',
      quote: '#1C2621',
      contact: '#3B2B23'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'quote', 'contact']
  },
  {
    name: 'Midnight Emerald Monograph',
    preset: 'arch',
    bgStyle: 'cream-editorial',
    windowStyle: 'forest-luxe',
    pills: {
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light',
      quote: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      name: '#F4D37E',
      breedAge: '#B59E99',
      coat: '#FFFFFF',
      quote: '#F6F4EE',
      contact: '#F4D37E'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'quote', 'contact']
  },
  {
    name: 'Dogue Magazine Cover',
    preset: 'minimal',
    bgStyle: 'charcoal-ink',
    windowStyle: 'pure-white',
    photoDim: 0.28,
    pills: {
      handle: 'none-light',
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light'
    },
    textColors: {
      handle: '#F4D37E',
      name: '#FFFFFF',
      breedAge: '#F4D37E',
      coat: '#F6F4EE'
    },
    visibleIds: ['handle', 'name', 'breedAge', 'coat']
  },
  {
    name: 'Berry & Rose Couture',
    preset: 'cameo',
    bgStyle: 'blush-botanical',
    windowStyle: 'pure-white',
    pills: {
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      quote: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#8C2F2B',
      breedAge: '#D46A4E',
      coat: '#1C2621',
      quote: '#3B2B23',
      contact: '#8C2F2B'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'quote', 'contact']
  },
  {
    name: 'Espresso Gold Gallery',
    preset: 'sage',
    bgStyle: 'oat-latte',
    windowStyle: 'espresso-mocha',
    pills: {
      handle: 'none-light',
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      handle: '#F6F4EE',
      name: '#F4D37E',
      breedAge: '#B59E99',
      coat: '#FFFFFF',
      contact: '#F6F4EE'
    },
    visibleIds: ['handle', 'name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Charcoal Silk Cameo',
    preset: 'cameo',
    bgStyle: 'sage-mist',
    windowStyle: 'charcoal-ink',
    pills: {
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light',
      quote: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      name: '#F6F4EE',
      breedAge: '#F4D37E',
      coat: '#FFFFFF',
      quote: '#B59E99',
      contact: '#F4D37E'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'quote', 'contact']
  },
  {
    name: 'French Slate Luxe Arch',
    preset: 'arch',
    bgStyle: 'cream-editorial',
    windowStyle: 'warm-sand',
    pills: {
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      name: '#F4D37E',
      breedAge: '#F6F4EE',
      coat: '#FFFFFF',
      contact: '#F4D37E'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Clean Gallery Monograph',
    preset: 'sage',
    bgStyle: 'forest-luxe',
    windowStyle: 'cream-editorial',
    pills: {
      handle: 'none-dark',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      quote: 'none-dark'
    },
    textColors: {
      handle: '#2E5A44',
      name: '#2E5A44',
      breedAge: '#D46A4E',
      coat: '#3B2B23',
      quote: '#1C2621'
    },
    visibleIds: ['handle', 'name', 'breedAge', 'coat', 'quote']
  },
  {
    name: 'Golden Hour Full-Bleed',
    preset: 'minimal',
    bgStyle: 'espresso-mocha',
    windowStyle: 'pure-white',
    photoDim: 0.3,
    pills: {
      status: 'none-light',
      name: 'none-light',
      quote: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      status: '#F4D37E',
      name: '#F4D37E',
      quote: '#FFFFFF',
      contact: '#F6F4EE'
    },
    visibleIds: ['status', 'name', 'quote', 'contact']
  },

  // --- WHISPER HYBRIDS (1 Single Accent Pill + Colored Typography!) ---
  {
    name: 'Botanical Whisper Arch',
    preset: 'arch',
    bgStyle: 'sage-mist',
    windowStyle: 'pure-white',
    pills: {
      status: 'sage',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#2E5A44',
      breedAge: '#3B2B23',
      coat: '#D46A4E',
      contact: '#2E5A44'
    },
    visibleIds: ['status', 'name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Slate & Gold Polaroid',
    preset: 'editorial',
    bgStyle: 'cream-editorial',
    windowStyle: 'warm-sand',
    pills: {
      sex: 'gold',
      name: 'none-light',
      breedAge: 'none-light',
      coat: 'none-light',
      quote: 'none-light'
    },
    textColors: {
      name: '#FFFFFF',
      breedAge: '#F4D37E',
      coat: '#F6F4EE',
      quote: '#F6F4EE'
    },
    visibleIds: ['sex', 'name', 'breedAge', 'coat', 'quote']
  },
  {
    name: 'Blush Cameo Whisper',
    preset: 'cameo',
    bgStyle: 'blush-botanical',
    windowStyle: 'cream-editorial',
    pills: {
      status: 'berry',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#8C2F2B',
      breedAge: '#3B2B23',
      coat: '#2E5A44',
      contact: '#D46A4E'
    },
    visibleIds: ['status', 'name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Frosted Masthead Cover',
    preset: 'minimal',
    bgStyle: 'forest-luxe',
    windowStyle: 'pure-white',
    photoDim: 0.22,
    pills: {
      coat: 'frosted',
      name: 'none-light',
      breedAge: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      name: '#FFFFFF',
      breedAge: '#F4D37E',
      contact: '#F6F4EE'
    },
    visibleIds: ['coat', 'name', 'breedAge', 'contact']
  },
  {
    name: 'Lilac Taupe Monograph',
    preset: 'arch',
    bgStyle: 'oat-latte',
    windowStyle: 'cream-editorial',
    pills: {
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'sage',
      contact: 'none-dark'
    },
    textColors: {
      name: '#3B2B23',
      breedAge: '#2E5A44',
      contact: '#3B2B23'
    },
    visibleIds: ['name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Terracotta Polaroid',
    preset: 'editorial',
    bgStyle: 'terracotta-clay',
    windowStyle: 'pure-white',
    pills: {
      status: 'terracotta',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      contact: 'none-dark'
    },
    textColors: {
      name: '#1C2621',
      breedAge: '#D46A4E',
      coat: '#2E5A44',
      contact: '#3B2B23'
    },
    visibleIds: ['status', 'name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Emerald & Gold Cameo',
    preset: 'cameo',
    bgStyle: 'forest-luxe',
    windowStyle: 'cream-editorial',
    pills: {
      status: 'gold',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      quote: 'none-dark'
    },
    textColors: {
      name: '#2E5A44',
      breedAge: '#3B2B23',
      coat: '#D46A4E',
      quote: '#1C2621'
    },
    visibleIds: ['status', 'name', 'breedAge', 'coat', 'quote']
  },
  {
    name: 'Olive Sage Minimal Mat',
    preset: 'sage',
    bgStyle: 'sage-mist',
    windowStyle: 'pure-white',
    pills: {
      handle: 'none-dark',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'sage-mist',
      contact: 'none-dark'
    },
    textColors: {
      handle: '#2E5A44',
      name: '#1C2621',
      breedAge: '#2E5A44',
      contact: '#D46A4E'
    },
    visibleIds: ['handle', 'name', 'breedAge', 'coat', 'contact']
  },
  {
    name: 'Berry Velvet Whisper',
    preset: 'arch',
    bgStyle: 'berry-wine',
    windowStyle: 'pure-white',
    pills: {
      sex: 'blush',
      name: 'none-dark',
      breedAge: 'none-dark',
      coat: 'none-dark',
      nutrition: 'none-dark'
    },
    textColors: {
      name: '#8C2F2B',
      breedAge: '#3B2B23',
      coat: '#1C2621',
      nutrition: '#2E5A44'
    },
    visibleIds: ['sex', 'name', 'breedAge', 'coat', 'nutrition']
  },
  {
    name: 'Gold Badge Cover',
    preset: 'minimal',
    bgStyle: 'charcoal-ink',
    windowStyle: 'pure-white',
    photoDim: 0.24,
    pills: {
      status: 'gold',
      name: 'none-light',
      coat: 'none-light',
      contact: 'none-light'
    },
    textColors: {
      name: '#FFFFFF',
      coat: '#F6F4EE',
      contact: '#F4D37E'
    },
    visibleIds: ['status', 'name', 'coat', 'contact']
  },

  // --- CURATED BOUTIQUE PILL STACKS (2-3 Balanced Accent Pills, Zero Overlap!) ---
  {
    name: 'OKC Signature Arch',
    preset: 'arch',
    bgStyle: 'sage-mist',
    windowStyle: 'cream-editorial',
    pills: {
      status: 'gold',
      sex: 'blush',
      name: 'none-dark',
      coat: 'sage',
      nutrition: 'mocha'
    },
    textColors: { name: '#2E5A44' },
    visibleIds: ['status', 'sex', 'name', 'coat', 'nutrition']
  },
  {
    name: 'Sire Emerald Cameo',
    preset: 'cameo',
    bgStyle: 'forest-luxe',
    windowStyle: 'oat-latte',
    pills: {
      status: 'gold',
      name: 'none-dark',
      coat: 'sage',
      contact: 'mocha'
    },
    textColors: { name: '#1C2621' },
    visibleIds: ['status', 'name', 'coat', 'contact']
  },
  {
    name: 'Espresso & Lilac Polaroid',
    preset: 'editorial',
    bgStyle: 'espresso-mocha',
    windowStyle: 'oat-latte',
    pills: {
      sex: 'mocha',
      name: 'none-dark',
      coat: 'white',
      nutrition: 'sage'
    },
    textColors: { name: '#3B2B23' },
    visibleIds: ['sex', 'name', 'coat', 'nutrition']
  },
  {
    name: 'Slate & Cream Gallery',
    preset: 'sage',
    bgStyle: 'warm-sand',
    windowStyle: 'cream-editorial',
    pills: {
      status: 'champagne',
      name: 'none-dark',
      coat: 'white',
      contact: 'charcoal'
    },
    textColors: { name: '#1C2621' },
    visibleIds: ['status', 'name', 'coat', 'contact']
  },
  {
    name: 'Full-Bleed Raw Spotlight',
    preset: 'minimal',
    bgStyle: 'forest-luxe',
    windowStyle: 'pure-white',
    photoDim: 0.2,
    pills: {
      status: 'frosted',
      name: 'none-light',
      breedAge: 'cream',
      nutrition: 'gold'
    },
    textColors: { name: '#FFFFFF' },
    visibleIds: ['status', 'name', 'breedAge', 'nutrition']
  },
  {
    name: 'Inverted Forest Luxe',
    preset: 'arch',
    bgStyle: 'cream-editorial',
    windowStyle: 'forest-luxe',
    pills: {
      status: 'gold',
      name: 'none-light',
      coat: 'sage-mist',
      contact: 'frosted'
    },
    textColors: { name: '#F4D37E' },
    visibleIds: ['status', 'name', 'coat', 'contact']
  },
  {
    name: 'Soft Rose & Forest Arch',
    preset: 'arch',
    bgStyle: 'blush-botanical',
    windowStyle: 'pure-white',
    pills: {
      sex: 'blush',
      name: 'none-dark',
      coat: 'berry',
      contact: 'sage'
    },
    textColors: { name: '#1C2621' },
    visibleIds: ['sex', 'name', 'coat', 'contact']
  },
  {
    name: 'Warm Gold & Charcoal Polaroid',
    preset: 'editorial',
    bgStyle: 'gold-luxe',
    windowStyle: 'charcoal-ink',
    pills: {
      status: 'gold',
      name: 'none-light',
      coat: 'champagne',
      contact: 'frosted'
    },
    textColors: { name: '#F4D37E' },
    visibleIds: ['status', 'name', 'coat', 'contact']
  }
];

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
  windowStyle: BgStyle = 'pure-white',
  textCardTheme: TextCardTheme = 'arch-crest'
) => {
  const outerTheme = BG_STYLES[bgStyle] || BG_STYLES['cream-editorial'];
  const winTheme = BG_STYLES[windowStyle] || BG_STYLES['pure-white'];

  if (preset === 'no-photo') {
    const isMinimalLuxe = textCardTheme === 'minimal-luxe';
    const isCameo = textCardTheme === 'cameo-medallion';
    const isMagazine = textCardTheme === 'magazine-border';
    const isRibbon = textCardTheme === 'ribbon-banner';
    const isSplit = textCardTheme === 'split-quote';
    const padX = isCameo ? 64 : isMagazine ? 46 : 50;
    const padY = isCameo ? 74 : isMagazine ? 46 : 50;
    return {
      outerBg1: outerTheme.bg1,
      outerBg2: outerTheme.bg2,
      hasCard: !isMinimalLuxe,
      hasPhoto: false,
      textCardTheme,
      cardX: padX,
      cardY: padY,
      cardW: 1080 - padX * 2,
      cardH: canvasH - padY * 2,
      cardBg: winTheme.cardBg,
      cardBorder: winTheme.border,
      cardTopR: isCameo ? 999 : isMagazine || isRibbon || isSplit ? 38 : 220,
      cardBottomR: isCameo ? 999 : 40,
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
      textCardTheme,
      cardX: 0,
      cardY: 0,
      cardW: 1080,
      cardH: canvasH,
      cardBg: 'transparent',
      cardBorder: 'transparent',
      cardTopR: 0,
      cardBottomR: 0,
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
    textCardTheme,
    cardX: pad,
    cardY: pad,
    cardW,
    cardH,
    cardBg: winTheme.cardBg,
    cardBorder: winTheme.border,
    cardTopR: preset === 'arch' ? 230 : 42,
    cardBottomR: 40,
    photoX,
    photoY,
    photoW,
    photoH: clampedArch,
    photoTopR: preset === 'arch' ? 210 : preset === 'cameo' ? 999 : 28,
    photoBottomR: preset === 'cameo' ? 999 : 26
  };
};

// Estimate rendered height of a TextLayer (accounting for multi-line wrapping & pill padding)
const estimateLayerHeight = (layer: TextLayer): number => {
  const pal = PILL_PALETTE[layer.pill] || PILL_PALETTE.cream;
  const padX = pal.hasBg ? 26 : 8;
  const innerW = Math.max(80, layer.pillWidth - padX * 2);
  const avgCharW = layer.fontSize * (layer.font === 'sans' ? 0.56 : 0.52);
  const rawLines = (layer.text || '').split('\n');
  let lineCount = 0;
  for (const rl of rawLines) {
    const estW = rl.length * avgCharW;
    lineCount += Math.max(1, Math.ceil(estW / innerW));
  }
  lineCount = Math.max(1, lineCount);
  const padY = pal.hasBg ? layer.padY : Math.min(layer.padY, 6);
  return lineCount * (layer.fontSize * 1.26) + padY * 2;
};

// Guarantee zero vertical/horizontal overlap & stay strictly inside [minTop, maxBottom]
const resolveLayerOverlaps = (
  layers: TextLayer[],
  minTop: number,
  maxBottom: number,
  centerSoloPair = true
): TextLayer[] => {
  let working = layers.map((l) => {
    // Clamp horizontal edges inside the 1080px canvas with safe margins
    const clampedWidth = Math.min(l.pillWidth, 980);
    const halfW = clampedWidth / 2;
    const clampedX = Math.max(44 + halfW, Math.min(1080 - 44 - halfW, l.x));
    return { ...l, pillWidth: clampedWidth, x: clampedX };
  });

  if (centerSoloPair) {
    const statusVis = working.find((l) => l.id === 'status' && l.visible);
    const sexVis = working.find((l) => l.id === 'sex' && l.visible);
    if (statusVis && !sexVis) {
      working = working.map((l) =>
        l.id === 'status'
          ? { ...l, x: 540, pillWidth: Math.max(l.pillWidth, Math.min(620, l.text.length * 14 + 70)) }
          : l
      );
    } else if (sexVis && !statusVis) {
      working = working.map((l) => (l.id === 'sex' ? { ...l, x: 540 } : l));
    } else if (statusVis && sexVis && Math.abs(statusVis.y - sexVis.y) <= 18) {
      // Ensure side-by-side status + sex pills never touch horizontally
      working = working.map((l) => {
        if (l.id === 'status') return { ...l, x: 350, pillWidth: Math.min(l.pillWidth, 400) };
        if (l.id === 'sex') return { ...l, x: 730, pillWidth: Math.min(l.pillWidth, 240) };
        return l;
      });
    }
  }

  const inZone = working.filter((l) => {
    if (!l.visible) return false;
    const h = estimateLayerHeight(l);
    return l.y + h / 2 >= minTop - 24 && l.y - h / 2 <= maxBottom + 24;
  });

  if (inZone.length <= 1) {
    if (inZone.length === 1) {
      const only = inZone[0];
      const h = estimateLayerHeight(only);
      const cy = Math.max(minTop + h / 2, Math.min(maxBottom - h / 2, only.y));
      return working.map((l) => (l.id === only.id ? { ...l, y: Math.round(cy) } : l));
    }
    return working;
  }

  type RowGroup = { ids: string[]; y: number; h: number; hasPill: boolean };
  const sorted = [...inZone].sort((a, b) => a.y - b.y);
  const buildRows = (src: TextLayer[]): RowGroup[] => {
    const map = new Map(src.map((l) => [l.id, l]));
    const rows: RowGroup[] = [];
    for (const base of sorted) {
      const item = map.get(base.id) || base;
      const itemH = estimateLayerHeight(item);
      const itemHasPill = Boolean(PILL_PALETTE[item.pill]?.hasBg);
      const last = rows[rows.length - 1];
      if (last && Math.abs(item.y - last.y) <= 18) {
        const collidesX = last.ids.some((rid) => {
          const other = map.get(rid)!;
          const aL = item.x - item.pillWidth / 2;
          const aR = item.x + item.pillWidth / 2;
          const bL = other.x - other.pillWidth / 2;
          const bR = other.x + other.pillWidth / 2;
          return Math.min(aR, bR) - Math.max(aL, bL) > -16;
        });
        if (!collidesX) {
          last.ids.push(item.id);
          last.h = Math.max(last.h, itemH);
          last.hasPill = last.hasPill || itemHasPill;
          continue;
        }
      }
      rows.push({ ids: [item.id], y: item.y, h: itemH, hasPill: itemHasPill });
    }
    return rows;
  };

  let rows = buildRows(working);
  const availH = maxBottom - minTop;
  const calcMinNeeded = (rs: RowGroup[], gapScale = 1) => {
    let sum = 0;
    for (let i = 0; i < rs.length; i++) {
      sum += rs[i].h;
      if (i > 0) {
        const baseGap = rs[i].hasPill || rs[i - 1].hasPill ? 12 : 7;
        sum += Math.max(4, Math.round(baseGap * gapScale));
      }
    }
    return sum;
  };

  // If the stack is taller than the available zone, gently compact fontSize & padY so nothing clips or collides
  let gapScale = 1;
  if (calcMinNeeded(rows, 1) > availH) {
    gapScale = 0.65;
    const needed = calcMinNeeded(rows, gapScale);
    if (needed > availH) {
      const shrink = Math.max(0.76, availH / needed);
      const zoneIds = new Set(inZone.map((z) => z.id));
      working = working.map((l) => {
        if (!zoneIds.has(l.id)) return l;
        return {
          ...l,
          fontSize: Math.max(17, Math.round(l.fontSize * shrink)),
          padY: Math.max(5, Math.round(l.padY * shrink))
        };
      });
      rows = buildRows(working);
    }
  }

  // Forward pass: push down any row whose top collides with minTop or previous row's bottom + gap
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (i === 0) {
      if (row.y - row.h / 2 < minTop) {
        row.y = minTop + row.h / 2;
      }
    } else {
      const prev = rows[i - 1];
      const minGap = Math.max(
        4,
        Math.round((row.hasPill || prev.hasPill ? 12 : 7) * gapScale)
      );
      const minCenterY = prev.y + prev.h / 2 + minGap + row.h / 2;
      if (row.y < minCenterY) {
        row.y = minCenterY;
      }
    }
  }

  // Backward pass: if bottom-most row exceeds maxBottom, pull rows upward while preserving gaps
  const lastIdx = rows.length - 1;
  if (rows[lastIdx].y + rows[lastIdx].h / 2 > maxBottom) {
    rows[lastIdx].y = maxBottom - rows[lastIdx].h / 2;
    for (let i = lastIdx - 1; i >= 0; i--) {
      const next = rows[i + 1];
      const row = rows[i];
      const minGap = Math.max(
        4,
        Math.round((row.hasPill || next.hasPill ? 12 : 7) * gapScale)
      );
      const maxCenterY = next.y - next.h / 2 - minGap - row.h / 2;
      if (row.y > maxCenterY) {
        row.y = maxCenterY;
      }
    }
    // Final top clamp if space was extremely tight
    if (rows[0].y - rows[0].h / 2 < minTop) {
      rows[0].y = minTop + rows[0].h / 2;
      for (let i = 1; i < rows.length; i++) {
        const prev = rows[i - 1];
        const row = rows[i];
        const minCenterY = prev.y + prev.h / 2 + 4 + row.h / 2;
        if (row.y < minCenterY) row.y = minCenterY;
      }
    }
  }

  const rowYById = new Map<string, number>();
  for (const r of rows) {
    for (const id of r.ids) {
      rowYById.set(id, Math.round(r.y));
    }
  }

  return working.map((l) => (rowYById.has(l.id) ? { ...l, y: rowYById.get(l.id)! } : l));
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
  const surfaceTheme = winTheme;
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
    const rawMinimalLayers: TextLayer[] = [
      {
        id: 'handle',
        label: '@okcfrenchies',
        visible: preset === 'no-photo',
        text: '@okcfrenchies',
        x: 540,
        y: 78,
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
        y: 152,
        fontSize: 24,
        pillWidth: 460,
        padY: 12,
        pill: 'gold',
        font: 'sans'
      },
      {
        id: 'coat',
        label: 'Coat / DNA',
        visible: isStud || preset === 'no-photo',
        text: coatStr,
        x: 540,
        y: preset === 'no-photo' ? Math.round(canvasH * 0.48) : 230,
        fontSize: 25,
        pillWidth: 680,
        padY: 12,
        pill: 'frosted',
        font: 'sans'
      },
      {
        id: 'dna',
        label: 'DNA String',
        visible: false,
        text: dnaStr ? `DNA: ${dnaStr}` : `DNA: ${coatStr || '6-Panel Cleared'}`,
        x: 540,
        y: 305,
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
        y: preset === 'no-photo' ? Math.round(canvasH * 0.62) : 390,
        fontSize: 26,
        pillWidth: 820,
        padY: 14,
        pill: 'cream',
        font: 'serif-italic'
      },
      {
        id: 'name',
        label: 'Meet Name',
        visible: preset === 'no-photo',
        text: isStud ? `Sire: ${dog.name}` : `Meet ${dog.name}`,
        x: 540,
        y: preset === 'no-photo' ? Math.round(canvasH * 0.34) : canvasH - 305,
        fontSize: 64,
        pillWidth: 740,
        padY: 10,
        pill: topTextPill,
        font: 'serif'
      },
      {
        id: 'breedAge',
        label: isStud ? 'Sire Banner' : 'Breed & Age Banner',
        visible: true,
        text: breedAgeStr,
        x: 540,
        y: canvasH - 210,
        fontSize: 32,
        pillWidth: 700,
        padY: 16,
        pill: 'cream',
        font: 'sans'
      },
      {
        id: 'sex',
        label: isStud ? 'Sire Badge' : 'Sex Pill',
        visible: true,
        text: sexLabel,
        x: 540,
        y: canvasH - 128,
        fontSize: 24,
        pillWidth: isStud ? 290 : 230,
        padY: 11,
        pill: sexPillStyle,
        font: 'sans'
      },
      {
        id: 'nutrition',
        label: 'Raw & Plasma Pill',
        visible: false,
        text: '🥩 Fed Raw + Bovine Plasma • RawAndPawCo.com',
        x: 540,
        y: canvasH - 115,
        fontSize: 20,
        pillWidth: 660,
        padY: 11,
        pill: 'mocha',
        font: 'sans'
      },
      {
        id: 'contact',
        label: 'Contact Info',
        visible: false,
        text: 'Text 405.300.8482 • info@okcfrenchies.com',
        x: 540,
        y: canvasH - 52,
        fontSize: 21,
        pillWidth: 660,
        padY: 11,
        pill: 'sage',
        font: 'sans'
      }
    ];

    if (preset === 'no-photo') {
      return resolveLayerOverlaps(rawMinimalLayers, 68, canvasH - 68, false);
    }
    const topPass = resolveLayerOverlaps(
      rawMinimalLayers,
      46,
      Math.round(canvasH * 0.44),
      false
    );
    return resolveLayerOverlaps(topPass, Math.round(canvasH * 0.54), canvasH - 36, false);
  }

  const geom = getFrameGeometry(preset, canvasH, archH, bgStyle, windowStyle);
  const photoBottom = geom.photoY + geom.photoH;
  const cardBottom = geom.cardY + geom.cardH;

  const framedLayers: TextLayer[] = [
    {
      id: 'status',
      label: 'Status Pill',
      visible: true,
      text: statusStr,
      x: preset === 'sage' ? geom.photoX + 195 : 350,
      y: preset === 'sage' ? geom.cardY + 46 : photoBottom + 6,
      fontSize: 20,
      pillWidth: preset === 'sage' ? 360 : 395,
      padY: 10,
      pill: 'gold',
      font: 'sans'
    },
    {
      id: 'sex',
      label: isStud ? 'Sire Badge' : 'Sex Pill',
      visible: true,
      text: sexLabel,
      x: preset === 'sage' ? geom.photoX + 510 : 730,
      y: preset === 'sage' ? geom.cardY + 46 : photoBottom + 6,
      fontSize: 20,
      pillWidth: 235,
      padY: 10,
      pill: sexPillStyle,
      font: 'sans'
    },
    {
      id: 'handle',
      label: '@okcfrenchies',
      visible: preset === 'sage',
      text: '@okcfrenchies',
      x: preset === 'sage' ? geom.photoX + geom.photoW - 115 : 540,
      y: preset === 'sage' ? geom.cardY + 46 : 86,
      fontSize: 21,
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
      y: preset === 'sage' ? photoBottom + 54 : photoBottom + 68,
      fontSize: 56,
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
      y: preset === 'sage' ? photoBottom + 114 : photoBottom + 128,
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
      y: preset === 'sage' ? photoBottom + 162 : photoBottom + 174,
      fontSize: 24,
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
      y: preset === 'sage' ? photoBottom + 212 : photoBottom + 224,
      fontSize: 20,
      pillWidth: 780,
      padY: 9,
      pill: 'cream',
      font: 'sans'
    },
    {
      id: 'quote',
      label: 'Sweet Quote',
      visible: true,
      text: quoteStr,
      x: 540,
      y: photoBottom + (dnaStr ? 278 : 232),
      fontSize: 24,
      pillWidth: 840,
      padY: 10,
      pill: baseTextPill,
      font: 'serif-italic'
    },
    {
      id: 'nutrition',
      label: 'Raw & Plasma Pill',
      visible: false,
      text: '🥩 Fed Raw + Bovine Plasma • RawAndPawCo.com',
      x: 540,
      y: cardBottom - 104,
      fontSize: 20,
      pillWidth: 660,
      padY: 10,
      pill: 'mocha',
      font: 'sans'
    },
    {
      id: 'contact',
      label: 'Contact Pill',
      visible: true,
      text: 'Text 405.300.8482 • info@okcfrenchies.com',
      x: 540,
      y: cardBottom - 46,
      fontSize: 21,
      pillWidth: 650,
      padY: 11,
      pill: surfaceTheme.darkText ? 'sage' : 'gold',
      font: 'sans'
    }
  ];

  const footerTop = preset === 'sage' ? photoBottom + 14 : photoBottom - 22;
  return resolveLayerOverlaps(
    framedLayers,
    footerTop,
    cardBottom - 20,
    preset !== 'sage'
  );
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
      `🥩 Fueled by a raw diet + researched bovine plasma & all-natural supplements from @rawandpawco (RawAndPawCo.com)`,
      `✈️ Same-day nationwide airport shipping & local OKC AI support available!`,
      '',
      `💬 Which trait are you looking to add to your next pairing? Drop a comment or text us! 👇`,
      '',
      `📲 Text Lindsey or Eric: 405.300.8482`,
      `📩 Email: info@okcfrenchies.com`,
      `🌐 OKCFrenchies.com • RawAndPawCo.com`,
      '',
      `#okcfrenchies #rawandpawco #frenchbulldogstud #frenchiegenetics #pinkfrenchie #fluffyfrenchie #oklahomacity`
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
    `🥩 Fed a raw diet with our high-end all-natural supplements—including researched bovine plasma for gut immunity & coat shine (@rawandpawco • RawAndPawCo.com)`,
    `✈️ Raised underfoot in our OKC home • Live FaceTime & Flight Nanny available!`,
    '',
    `📲 Text Lindsey or Eric: 405.300.8482`,
    `📩 Email: info@okcfrenchies.com`,
    `🌐 OKCFrenchies.com • RawAndPawCo.com`,
    '',
    `#okcfrenchies #rawandpawco #frenchbulldog #minibulldog #oklahomacity #frenchiepuppy #rawfeddogs`
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
  if (slide.slideMode && slide.slideMode !== 'puppies' && slide.slideMode !== 'studs') {
    return undefined;
  }
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
  const [remixIdx, setRemixIdx] = useState<number>(0);
  const remixDeckRef = useRef<number[]>([]);
  const [photoLocked, setPhotoLocked] = useState<boolean>(false);
  const [imgNat, setImgNat] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [snapVertical, setSnapVertical] = useState<boolean>(false);
  const [snapHorizontal, setSnapHorizontal] = useState<boolean>(false);
  const [inspectorTab, setInspectorTab] = useState<
    'theme' | 'pill' | 'source' | 'fields' | 'layouts' | 'caption'
  >('theme');
  const [mobileCanvasTall, setMobileCanvasTall] = useState<boolean>(false);
  const stageHostRef = useRef<HTMLDivElement | null>(null);
  const inspectorScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    inspectorScrollRef.current?.scrollTo({ top: 0, behavior: 'auto' });
  }, [inspectorTab]);

  // Caption & Link State
  const [captionText, setCaptionText] = useState<string>(() =>
    buildDefaultDogCaption(defaultStudioDog)
  );
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiCategory, setAiCategory] = useState<string>('did-you-know');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string>('');
  const [savedAiCards, setSavedAiCards] = useState<{ item: TopicCardItem; caption: string }[]>(
    () => {
      try {
        const raw = localStorage.getItem(SAVED_AI_CARDS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    }
  );
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

  // Viewport-Fitted Stage Sizing (Zero Scroll / Zero Bounce on MacBook & Mobile App!)
  const [stageWidth, setStageWidth] = useState<number>(360);
  useEffect(() => {
    const el = stageHostRef.current;
    if (!el) return;
    const computeSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const padX = window.innerWidth < 640 ? 12 : 24;
      const padY = window.innerWidth < 640 ? 8 : 16;
      const maxWFromWidth = Math.max(175, rect.width - padX);
      const maxWFromHeight = Math.max(175, ((rect.height - padY) / canvasH) * 1080);
      const nextW = Math.floor(Math.min(560, maxWFromWidth, maxWFromHeight));
      setStageWidth((prev) => (Math.abs(prev - nextW) >= 1 ? nextW : prev));
    };
    computeSize();
    const ro = new ResizeObserver(() => computeSize());
    ro.observe(el);
    window.addEventListener('resize', computeSize);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeSize);
    };
  }, [canvasH, mobileCanvasTall]);

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

  // Signature Default Theme & Template Builder for EVERY Mode (Puppies, Studs, Coat & DNA, Standards, Did You Know)
  const buildDefaultSlideForMode = (
    targetMode: ContentMode,
    targetRatio: CanvasRatio = ratio,
    slideId = `slide-${Date.now()}`,
    useDefaultEntity = false
  ): { slide: SlideState; dog?: DogRecord; topic?: TopicCardItem } => {
    const ch = getCanvasHeight(targetRatio);

    if (targetMode === 'puppies') {
      const dog =
        !useDefaultEntity && selectedDog?.category === 'Puppy'
          ? selectedDog
          : defaultStudioDog;
      const archH = targetRatio === 'story' ? 1180 : targetRatio === 'square' ? 600 : 800;
      return {
        dog,
        slide: {
          id: slideId,
          preset: 'arch',
          bgStyle: 'sage-mist',
          windowStyle: 'cream-editorial',
          dogId: dog.id,
          slideMode: 'puppies',
          photoSrc: dog.image || '',
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: archH,
          layers: buildLayersForDog(dog, 'arch', ch, archH, 'sage-mist', 'cream-editorial')
        }
      };
    }

    if (targetMode === 'studs') {
      const stud =
        (!useDefaultEntity && selectedDog?.category === 'Stud' ? selectedDog : allStuds[0]) ||
        defaultStudioDog;
      const archH = targetRatio === 'story' ? 1180 : targetRatio === 'square' ? 580 : 800;
      const baseLayers = buildLayersForDog(
        stud,
        'cameo',
        ch,
        archH,
        'forest-luxe',
        'cream-editorial'
      ).map((l) => {
        if (l.id === 'breedAge') return { ...l, pill: 'gold' as PillStyle };
        if (l.id === 'coat') return { ...l, pill: 'sage' as PillStyle };
        if (l.id === 'nutrition') return { ...l, pill: 'mocha' as PillStyle };
        if (l.id === 'status') return { ...l, pill: 'mocha' as PillStyle };
        return l;
      });
      return {
        dog: stud,
        slide: {
          id: slideId,
          preset: 'cameo',
          bgStyle: 'forest-luxe',
          windowStyle: 'cream-editorial',
          dogId: stud.id,
          slideMode: 'studs',
          photoSrc: stud.image || '',
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: archH,
          layers: baseLayers
        }
      };
    }

    if (targetMode === 'glossary') {
      const item =
        (!useDefaultEntity && GLOSSARY_ITEMS.find((g) => g.id === selectedGlossaryId)) ||
        GLOSSARY_ITEMS[0];
      return {
        topic: item,
        slide: {
          id: slideId,
          preset: 'no-photo',
          textCardTheme: 'arch-crest',
          bgStyle: 'forest-luxe',
          windowStyle: 'cream-editorial',
          slideMode: 'glossary',
          topicId: item.id,
          photoSrc: '',
          photoDim: 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: buildTopicLayers(item, ch, 'cream-editorial', 'glossary', 'arch-crest')
        }
      };
    }

    if (targetMode === 'standards') {
      const item =
        (!useDefaultEntity && STANDARDS_AND_BLOG_ITEMS.find((s) => s.id === selectedStandardId)) ||
        STANDARDS_AND_BLOG_ITEMS[0];
      const hasImg = Boolean(item.image);
      return {
        topic: item,
        slide: {
          id: slideId,
          preset: hasImg ? 'minimal' : 'no-photo',
          textCardTheme: 'magazine-border',
          bgStyle: hasImg ? 'forest-luxe' : 'sage-mist',
          windowStyle: 'pure-white',
          slideMode: 'standards',
          topicId: item.id,
          photoSrc: item.image || '',
          photoDim: hasImg ? 0.52 : 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: 800,
          layers: buildTopicLayers(
            item,
            ch,
            hasImg ? 'forest-luxe' : 'pure-white',
            'standards',
            hasImg ? 'arch-crest' : 'magazine-border'
          )
        }
      };
    }

    // 'didyouknow' Default Template: Espresso Mocha + Botanical Cream Top Header Card
    const dykItem =
      DID_YOU_KNOW_ITEMS[(useDefaultEntity ? 0 : selectedDykIndex) % DID_YOU_KNOW_ITEMS.length] ||
      DID_YOU_KNOW_ITEMS[0];
    return {
      topic: dykItem,
      slide: {
        id: slideId,
        preset: 'no-photo',
        textCardTheme: 'ribbon-banner',
        bgStyle: 'espresso-mocha',
        windowStyle: 'cream-editorial',
        slideMode: 'didyouknow',
        topicId: dykItem.id,
        photoSrc: '',
        photoDim: 0,
        panX: 0,
        panY: 0,
        zoom: 1,
        archHeight: 800,
        layers: buildTopicLayers(dykItem, ch, 'cream-editorial', 'didyouknow', 'ribbon-banner')
      }
    };
  };

  // Reset Active Slide to the Signature Default Template of the Current Mode!
  const handleResetActiveSlideToModeDefault = () => {
    const built = buildDefaultSlideForMode(contentMode, ratio, activeSlide.id, false);
    pushHistory(slides);
    setSlides((prev) => prev.map((s, idx) => (idx === activeSlideIdx ? built.slide : s)));
    if (built.dog) {
      setSelectedDogId(built.dog.id);
      setCaptionText(buildDefaultDogCaption(built.dog));
    } else if (built.topic) {
      setCaptionText(buildTopicCaption(built.topic));
    }
    setSelectedLayerId(null);
    setEditingLayerId(null);
    setDraftSavedAt('Slide Reset');
  };

  // Switch Mode Pill & Automatically Load That Mode's Signature Default Template onto Active Slide!
  const handleSelectContentMode = (nextMode: ContentMode) => {
    setContentMode(nextMode);
    setInspectorTab('source');
    if (activeSlide.slideMode === nextMode) return;
    const built = buildDefaultSlideForMode(nextMode, ratio, activeSlide.id, false);
    pushHistory(slides);
    setSlides((prev) => prev.map((s, idx) => (idx === activeSlideIdx ? built.slide : s)));
    if (built.dog) {
      setSelectedDogId(built.dog.id);
      setCaptionText(buildDefaultDogCaption(built.dog));
    } else if (built.topic) {
      setCaptionText(buildTopicCaption(built.topic));
    }
    setSelectedLayerId(null);
    setEditingLayerId(null);
  };

  // Load draft once on mount if present
  const didMountRef = useRef(false);
  useEffect(() => {
    try {
      // Clean up legacy v2 draft that could hold an orphan uploaded photo without dogId sync
      localStorage.removeItem('okcfrenchies_studio_draft_v2');
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.slides) && parsed.slides.length > 0) {
          const isDogVisibleInDefaultFilter = (d: DogRecord) => {
            const st = (d.status || '').toLowerCase();
            return (
              st === 'available' ||
              st === 'pending' ||
              st.includes('keeper') ||
              st.includes('retained') ||
              st.includes('co-own')
            );
          };

          // Keep every puppy/stud slide's photo strictly synced to its dog (unless custom-uploaded specifically for that dog)
          const repairedSlides: SlideState[] = parsed.slides.map((s: SlideState) => {
            const isTopicSlide =
              s.slideMode && s.slideMode !== 'puppies' && s.slideMode !== 'studs';
            if (isTopicSlide) return s;

            const dog = inferDogFromSlide(s, allDogs) || defaultStudioDog;
            if (!dog) return s;
            const belongsToDog =
              s.photoSrc === dog.image ||
              (dog.media || []).some((m) => m.url === s.photoSrc) ||
              (Boolean(s.photoSrc?.startsWith('data:')) && s.customPhotoDogId === dog.id);

            return {
              ...s,
              dogId: dog.id,
              photoSrc: belongsToDog ? s.photoSrc : dog.image || s.photoSrc
            };
          });
          setSlides(repairedSlides);
          if (parsed.ratio) setRatio(parsed.ratio);
          if (parsed.captionText) setCaptionText(parsed.captionText);
          const firstSlide: SlideState = repairedSlides[0];
          const isFirstTopic =
            firstSlide.slideMode &&
            firstSlide.slideMode !== 'puppies' &&
            firstSlide.slideMode !== 'studs';
          if (isFirstTopic && firstSlide.slideMode) {
            setContentMode(firstSlide.slideMode);
          } else {
            const inferredDog = inferDogFromSlide(firstSlide, allDogs) || defaultStudioDog;
            if (inferredDog) {
              setSelectedDogId(inferredDog.id);
              setContentMode(inferredDog.category === 'Stud' ? 'studs' : 'puppies');
              if (
                inferredDog.category !== 'Stud' &&
                !isDogVisibleInDefaultFilter(inferredDog)
              ) {
                setFilterMode('all');
              }
            }
          }
        }
      }
    } catch {
      // ignore corrupt draft
    }
    setTimeout(() => {
      didMountRef.current = true;
    }, 100);
  }, [allDogs, defaultStudioDog]);

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
        const st = (inferred.status || '').toLowerCase();
        const inDefault =
          st === 'available' ||
          st === 'pending' ||
          st.includes('keeper') ||
          st.includes('retained') ||
          st.includes('co-own');
        if (!inDefault) {
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

    // If active slide already has a puppy layout and resetLayout is false, preserve 100% of colors & visibility while re-checking overlap if text wrapped differently!
    const rawNextLayers: TextLayer[] =
      hasExistingDogLayers && !resetLayout
        ? activeSlide.layers.map((existingLayer) => {
            const freshMatch = freshDogLayers.find((fl) => fl.id === existingLayer.id);
            if (!freshMatch) return existingLayer; // Keep custom stickers/pills untouched!
            const wasUnpilledSex =
              existingLayer.id === 'sex' &&
              (existingLayer.pill === 'none-dark' || existingLayer.pill === 'none-light');
            return {
              ...existingLayer,
              text: freshMatch.text,
              pill:
                existingLayer.id === 'sex' && !wasUnpilledSex
                  ? freshMatch.pill
                  : existingLayer.pill
            };
          })
        : freshDogLayers;

    let nextLayers = rawNextLayers;
    if (hasExistingDogLayers && !resetLayout) {
      if (pr === 'minimal') {
        const topPass = resolveLayerOverlaps(rawNextLayers, 46, Math.round(ch * 0.44), false);
        nextLayers = resolveLayerOverlaps(topPass, Math.round(ch * 0.54), ch - 36, false);
      } else if (pr !== 'no-photo') {
        const g = getFrameGeometry(pr, ch, currentArch, currentBg, currentWin);
        const pBottom = g.photoY + g.photoH;
        const cBottom = g.cardY + g.cardH;
        nextLayers = resolveLayerOverlaps(
          rawNextLayers,
          pr === 'sage' ? pBottom + 14 : pBottom - 20,
          cBottom - 20,
          pr !== 'sage'
        );
      }
    }

    updateActiveSlide(
      {
        preset: pr,
        bgStyle: currentBg,
        windowStyle: currentWin,
        dogId: dog.id,
        customPhotoDogId: undefined,
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

  // Load a Topic (Coat & DNA, Standards/Blog, Did You Know) into ONLY the active slide using that mode's default theme (or preserving current custom theme unless resetTheme is true)!
  const loadTopicIntoCard = (
    item: TopicCardItem,
    targetRatio?: CanvasRatio,
    resetTheme = false
  ) => {
    const r = targetRatio || ratio;
    const ch = getCanvasHeight(r);
    const hasImg = Boolean(item.image);
    const defaultBgForMode: BgStyle =
      contentMode === 'didyouknow'
        ? 'espresso-mocha'
        : contentMode === 'glossary'
          ? 'forest-luxe'
          : 'sage-mist';
    const defaultWinForMode: BgStyle =
      contentMode === 'didyouknow'
        ? 'cream-editorial'
        : contentMode === 'glossary'
          ? 'cream-editorial'
          : 'pure-white';

    const keepExistingTopicColors =
      !resetTheme &&
      activeSlide.slideMode === contentMode &&
      activeSlide.preset === 'no-photo' &&
      !hasImg;

    const chosenBg: BgStyle = hasImg
      ? 'forest-luxe'
      : keepExistingTopicColors
        ? activeSlide.bgStyle
        : defaultBgForMode;
    const chosenWin: BgStyle = keepExistingTopicColors
      ? activeSlide.windowStyle || defaultWinForMode
      : defaultWinForMode;

    const defaultTextThemeForMode: TextCardTheme =
      contentMode === 'didyouknow'
        ? 'ribbon-banner'
        : contentMode === 'standards'
          ? 'magazine-border'
          : 'arch-crest';
    const chosenTextTheme: TextCardTheme = keepExistingTopicColors
      ? activeSlide.textCardTheme || defaultTextThemeForMode
      : defaultTextThemeForMode;

    updateActiveSlide(
      {
        preset: hasImg ? 'minimal' : 'no-photo',
        textCardTheme: chosenTextTheme,
        bgStyle: chosenBg,
        windowStyle: chosenWin,
        slideMode: contentMode,
        topicId: item.id,
        photoSrc: item.image || '',
        photoDim: hasImg ? 0.52 : 0,
        panX: 0,
        panY: 0,
        zoom: 1,
        archHeight: 800,
        layers: buildTopicLayers(
          item,
          ch,
          hasImg ? chosenBg : chosenTextTheme === 'minimal-luxe' ? chosenBg : chosenWin,
          contentMode,
          hasImg ? 'arch-crest' : chosenTextTheme
        )
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

  // Handle Template Preset Switch on Active Slide (Preserves ALL AI/Topic text or custom stickers while switching frame!)
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
    const isDogSlide =
      (!activeSlide.slideMode ||
        activeSlide.slideMode === 'puppies' ||
        activeSlide.slideMode === 'studs') &&
      activeSlide.layers.some((l) => l.id === 'breedAge' || l.id === 'name' || l.id === 'sex');

    if (isDogSlide && selectedDog) {
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
            font: prev.font,
            textColor: prev.textColor
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
      return;
    }

    // Topic / AI Card Frame Switch: Keep 100% of text layers intact & auto-adjust photo dimming + readability!
    const fallbackPhoto =
      activeSlide.photoSrc || selectedDog?.image || defaultStudioDog?.image || '';
    const nextPhotoDim =
      nextPreset === 'no-photo'
        ? 0
        : activeSlide.photoDim >= 0.2
          ? activeSlide.photoDim
          : 0.48;

    const overDarkPhoto = nextPreset !== 'no-photo';
    const winDarkText = BG_STYLES[currentWin].darkText;
    const adjustedTopicLayers = activeSlide.layers.map((l) => {
      if (overDarkPhoto) {
        if (l.pill === 'none-dark') return { ...l, pill: 'none-light' as PillStyle };
        if (l.id === 'body' && (l.pill === 'white' || l.pill === 'cream' || l.pill === 'oat')) {
          return { ...l, pill: 'frosted' as PillStyle };
        }
        return l;
      }
      // Returning to 'no-photo' arched text card: match windowStyle brightness!
      if (l.pill === 'none-light' && winDarkText) return { ...l, pill: 'none-dark' as PillStyle };
      if (l.pill === 'none-dark' && !winDarkText) return { ...l, pill: 'none-light' as PillStyle };
      if (l.id === 'body' && l.pill === 'frosted' && winDarkText) {
        return { ...l, pill: 'white' as PillStyle };
      }
      return l;
    });

    updateActiveSlide(
      {
        preset: nextPreset,
        textCardTheme: activeSlide.textCardTheme || 'arch-crest',
        bgStyle: currentBg,
        windowStyle: currentWin,
        photoSrc: nextPreset === 'no-photo' ? activeSlide.photoSrc : fallbackPhoto,
        photoDim: nextPhotoDim,
        archHeight: defaultArch,
        layers: adjustedTopicLayers
      },
      true
    );
  };

  // Switch Text Card Architecture Theme (Arch, Vogue Double-Border, Oval Medallion, Top Header, Split Two-Tone, Minimal Full-Bleed) WITHOUT losing text!
  const handleSwitchTextCardTheme = (nextTextTheme: TextCardTheme) => {
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'forest-luxe';
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'cream-editorial';
    const effectiveSurface: BgStyle =
      nextTextTheme === 'minimal-luxe' ? currentBg : currentWin;

    const syntheticItem: TopicCardItem = {
      id: activeSlide.topicId || 'custom',
      badge: activeSlide.layers.find((l) => l.id === 'badge')?.text || '✨ OKC FRENCHIES',
      title: activeSlide.layers.find((l) => l.id === 'headline' || l.id === 'title')?.text || '',
      body: activeSlide.layers.find((l) => l.id === 'body')?.text || '',
      footer: activeSlide.layers.find((l) => l.id === 'footer')?.text || '',
      bgStyle: currentBg,
      shareUrl: 'https://okcfrenchies.com'
    };

    const hasTopicStructure = activeSlide.layers.some(
      (l) => l.id === 'headline' || l.id === 'body' || l.id === 'badge'
    );

    if (hasTopicStructure) {
      const themedTemplate = buildTopicLayers(
        syntheticItem,
        canvasH,
        effectiveSurface,
        activeSlide.slideMode || contentMode,
        nextTextTheme
      );
      const customExtras = activeSlide.layers.filter(
        (el) => !themedTemplate.some((tl) => tl.id === el.id)
      );
      const merged = [
        ...themedTemplate.map((tl) => {
          const prev = activeSlide.layers.find((el) => el.id === tl.id);
          if (!prev) return tl;
          return {
            ...tl,
            visible: prev.visible,
            text: prev.text,
            pillOpacity: prev.pillOpacity
          };
        }),
        ...customExtras
      ];
      const resolved = resolveLayerOverlaps(merged, 86, canvasH - 76, false);
      updateActiveSlide(
        {
          preset: 'no-photo',
          textCardTheme: nextTextTheme,
          bgStyle: currentBg,
          windowStyle: currentWin,
          photoDim: 0,
          layers: resolved
        },
        true
      );
      return;
    }

    // If used on a puppy text-only card, simply switch the decorative card shape & contrast
    const dark = BG_STYLES[effectiveSurface].darkText;
    const adjusted = activeSlide.layers.map((l) => {
      if (l.pill === 'none-dark' && !dark) return { ...l, pill: 'none-light' as PillStyle };
      if (l.pill === 'none-light' && dark) return { ...l, pill: 'none-dark' as PillStyle };
      return l;
    });
    updateActiveSlide(
      {
        preset: 'no-photo',
        textCardTheme: nextTextTheme,
        layers: adjusted
      },
      true
    );
  };

  // Change ONLY the Outer Background Color (NEVER resets card or replaces layers!)
  const handleSwitchBgTheme = (nextBg: BgStyle) => {
    const currentWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    updateActiveSlide(
      {
        bgStyle: nextBg,
        windowStyle: currentWin
      },
      true
    );
  };

  // Change ONLY the Inner Window / Card Color (NEVER resets card or replaces layers!)
  const handleSwitchWindowTheme = (nextWin: BgStyle) => {
    const currentBg: BgStyle =
      activeSlide.bgStyle && BG_STYLES[activeSlide.bgStyle]
        ? activeSlide.bgStyle
        : 'cream-editorial';
    const prevWin: BgStyle =
      activeSlide.windowStyle && BG_STYLES[activeSlide.windowStyle]
        ? activeSlide.windowStyle
        : 'pure-white';
    const prevDark = BG_STYLES[prevWin].darkText;
    const dark = BG_STYLES[nextWin].darkText;
    const adjustUnpilledContrast = activeSlide.preset !== 'minimal';
    const updatedLayers = adjustUnpilledContrast
      ? activeSlide.layers.map((l) => {
          if (l.pill === 'none-dark' && !dark) {
            return {
              ...l,
              pill: 'none-light' as PillStyle,
              textColor: prevDark !== dark ? undefined : l.textColor
            };
          }
          if (l.pill === 'none-light' && dark) {
            return {
              ...l,
              pill: 'none-dark' as PillStyle,
              textColor: prevDark !== dark ? undefined : l.textColor
            };
          }
          return l;
        })
      : activeSlide.layers;
    updateActiveSlide(
      {
        bgStyle: currentBg,
        windowStyle: nextWin,
        layers: updatedLayers
      },
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
    const prevDark = BG_STYLES[currentWin].darkText;
    const dark = BG_STYLES[nextWin].darkText;
    const updatedLayers = activeSlide.layers.map((l) => {
      if (l.pill === 'none-dark' && !dark) {
        return {
          ...l,
          pill: 'none-light' as PillStyle,
          textColor: prevDark !== dark ? undefined : l.textColor
        };
      }
      if (l.pill === 'none-light' && dark) {
        return {
          ...l,
          pill: 'none-dark' as PillStyle,
          textColor: prevDark !== dark ? undefined : l.textColor
        };
      }
      return l;
    });
    updateActiveSlide({ bgStyle: nextBg, windowStyle: nextWin, layers: updatedLayers }, true);
  };

  // Canva-Style 1-Tap Brand Kit Shuffle (Mix & Match Frame, Outer/Inner Colors, Zero-Pill Colored Text & Pills!)
  const handleShuffleBrandLook = (alsoRotatePhoto = false) => {
    // Draw from a shuffled non-repeating deck so every tap mixes Zero-Pill Editorial, Whisper Hybrid & Pill looks!
    if (remixDeckRef.current.length === 0) {
      const indices = BRAND_REMIX_RECIPES.map((_, idx) => idx).filter((idx) => idx !== remixIdx);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      remixDeckRef.current = indices;
    }
    const nextIdx = remixDeckRef.current.pop() ?? (remixIdx + 1) % BRAND_REMIX_RECIPES.length;
    setRemixIdx(nextIdx);
    const recipe = BRAND_REMIX_RECIPES[nextIdx];

    let nextPhotoSrc = activeSlide.photoSrc || selectedDog?.image || '';
    let nextCustomPhotoDogId = activeSlide.customPhotoDogId;
    if (alsoRotatePhoto && galleryPhotos.length > 1) {
      // Filter out parent/litter photos unless user taps them manually, or cycle puppy's own photos first!
      const puppyOwnPhotos = galleryPhotos.filter(
        (u) => !u.includes('poppi') && !u.includes('cafecito')
      );
      const pool = puppyOwnPhotos.length > 1 ? puppyOwnPhotos : galleryPhotos;
      const curPhotoIdx = pool.indexOf(activeSlide.photoSrc);
      nextPhotoSrc = pool[(curPhotoIdx + 1) % pool.length];
      nextCustomPhotoDogId = undefined;
    }

    const isDogSlide =
      (!activeSlide.slideMode ||
        activeSlide.slideMode === 'puppies' ||
        activeSlide.slideMode === 'studs') &&
      activeSlide.layers.some((l) => l.id === 'breedAge' || l.id === 'name' || l.id === 'sex');

    if (isDogSlide && selectedDog) {
      const visibleCount = recipe.visibleIds.length;
      const baseArch =
        ratio === 'story'
          ? 1160
          : ratio === 'square'
            ? 540
            : recipe.preset === 'sage'
              ? 710
              : 760;
      // Give taller footer breathing room when 6+ fields are shown on framed cards
      const defaultArch =
        recipe.preset === 'minimal'
          ? baseArch
          : Math.max(430, baseArch - Math.max(0, visibleCount - 5) * 38);

      const freshLayers = buildLayersForDog(
        selectedDog,
        recipe.preset,
        canvasH,
        defaultArch,
        recipe.bgStyle,
        recipe.windowStyle
      );

      const customLayers = activeSlide.layers.filter(
        (el) => !freshLayers.some((fl) => fl.id === el.id)
      );

      const isStud = selectedDog.category === 'Stud';
      const isFemale = (selectedDog.gender || '').toLowerCase() === 'female';

      const mappedStandardLayers: TextLayer[] = freshLayers.map((fl) => {
        const prev = activeSlide.layers.find((el) => el.id === fl.id);
        const textVal = prev?.text || fl.text;
        let pillChoice: PillStyle = recipe.pills[fl.id] || fl.pill;
        // Keep sex badge gender-smart when a recipe picks blush on a male puppy or stud
        if (fl.id === 'sex' && pillChoice === 'blush' && !isFemale) {
          pillChoice = isStud ? 'gold' : 'sage';
        }
        const visible = recipe.visibleIds.includes(fl.id) && Boolean(textVal.trim());
        return {
          ...fl,
          visible,
          text: textVal,
          pill: pillChoice,
          textColor: recipe.textColors?.[fl.id]
        };
      });

      const combinedLayers = [...mappedStandardLayers, ...customLayers];
      let resolvedLayers: TextLayer[];

      if (recipe.preset === 'minimal') {
        const topResolved = resolveLayerOverlaps(
          combinedLayers,
          46,
          Math.round(canvasH * 0.44),
          false
        );
        resolvedLayers = resolveLayerOverlaps(
          topResolved,
          Math.round(canvasH * 0.54),
          canvasH - 36,
          false
        );
      } else {
        const geom = getFrameGeometry(
          recipe.preset,
          canvasH,
          defaultArch,
          recipe.bgStyle,
          recipe.windowStyle
        );
        const photoBottom = geom.photoY + geom.photoH;
        const cardBottom = geom.cardY + geom.cardH;
        const footerTop = recipe.preset === 'sage' ? photoBottom + 14 : photoBottom - 20;
        resolvedLayers = resolveLayerOverlaps(
          combinedLayers,
          footerTop,
          cardBottom - 20,
          recipe.preset !== 'sage'
        );
      }

      updateActiveSlide(
        {
          preset: recipe.preset,
          bgStyle: recipe.bgStyle,
          windowStyle: recipe.windowStyle,
          dogId: selectedDog.id,
          customPhotoDogId: nextCustomPhotoDogId,
          photoSrc: nextPhotoSrc,
          photoDim: recipe.photoDim ?? 0,
          archHeight: defaultArch,
          layers: resolvedLayers
        },
        true
      );
      setSelectedLayerId(null);
      setEditingLayerId(null);
      return;
    }

    // Topic / AI card shuffle: mixes Text Card Architectures + Zero-Pill Editorial, 1-Badge Whisper & Boutique Pill styles!
    const overPhoto = activeSlide.preset !== 'no-photo';
    const textThemePool: TextCardTheme[] = [
      'arch-crest',
      'magazine-border',
      'cameo-medallion',
      'ribbon-banner',
      'split-quote',
      'minimal-luxe'
    ];
    const nextTextTheme: TextCardTheme = overPhoto
      ? activeSlide.textCardTheme || 'arch-crest'
      : textThemePool[nextIdx % textThemePool.length];

    const surfaceStyle: BgStyle =
      !overPhoto && nextTextTheme === 'minimal-luxe' ? recipe.bgStyle : recipe.windowStyle;
    const dark = overPhoto ? false : BG_STYLES[surfaceStyle].darkText;
    const baseNone: PillStyle = dark ? 'none-dark' : 'none-light';

    // If this is a 'no-photo' Topic/AI card with standard topic layers, rebuild clean geometry for the chosen TextCardTheme while keeping 100% of text!
    const hasTopicStructure =
      !overPhoto &&
      activeSlide.layers.some(
        (l) => l.id === 'headline' || l.id === 'body' || l.id === 'badge'
      );

    if (hasTopicStructure) {
      const syntheticItem: TopicCardItem = {
        id: activeSlide.topicId || 'custom',
        badge: activeSlide.layers.find((l) => l.id === 'badge')?.text || '✨ OKC FRENCHIES',
        title: activeSlide.layers.find((l) => l.id === 'headline' || l.id === 'title')?.text || '',
        body: activeSlide.layers.find((l) => l.id === 'body')?.text || '',
        footer: activeSlide.layers.find((l) => l.id === 'footer')?.text || '',
        bgStyle: recipe.bgStyle,
        shareUrl: 'https://okcfrenchies.com'
      };
      const themedBase = buildTopicLayers(
        syntheticItem,
        canvasH,
        surfaceStyle,
        activeSlide.slideMode || contentMode,
        nextTextTheme
      );
      const customExtras = activeSlide.layers.filter(
        (el) => !themedBase.some((tl) => tl.id === el.id)
      );

      // Determine whether this recipe is a zero-pill editorial look, a 1-badge whisper look, or a pill look
      const recipePillCount = Object.values(recipe.pills).filter(
        (p) => p && PILL_PALETTE[p]?.hasBg
      ).length;
      const isZeroPillTopic =
        recipePillCount === 0 ||
        nextTextTheme === 'minimal-luxe' ||
        nextTextTheme === 'magazine-border';
      const isWhisperTopic = recipePillCount === 1 || nextTextTheme === 'cameo-medallion';

      const primaryTextColor =
        nextTextTheme === 'split-quote'
          ? '#FFFFFF'
          : recipe.textColors?.name || (dark ? '#1C2621' : '#FFFFFF');
      const accentTextColor =
        recipe.textColors?.status ||
        recipe.textColors?.breedAge ||
        (dark ? '#2E5A44' : '#F4D37E');
      const secondaryTextColor =
        recipe.textColors?.coat ||
        recipe.textColors?.contact ||
        (dark ? '#3B2B23' : '#FAF7F0');

      const remixedTopic = [
        ...themedBase.map((tl) => {
          const prev = activeSlide.layers.find((el) => el.id === tl.id);
          const visible = prev ? prev.visible : tl.visible;
          const text = prev ? prev.text : tl.text;
          if (tl.id === 'badge') {
            if (nextTextTheme === 'ribbon-banner' || nextTextTheme === 'split-quote') {
              return { ...tl, visible, text, pill: 'gold' as PillStyle, textColor: undefined };
            }
            if (isZeroPillTopic) {
              return { ...tl, visible, text, pill: baseNone, textColor: accentTextColor };
            }
            return {
              ...tl,
              visible,
              text,
              pill: (recipe.pills.status || recipe.pills.breedAge || (dark ? 'sage' : 'gold')) as PillStyle,
              textColor: undefined
            };
          }
          if (tl.id === 'headline') {
            if (nextTextTheme === 'split-quote') {
              return { ...tl, visible, text, pill: 'none-light' as PillStyle, textColor: '#FFFFFF' };
            }
            return { ...tl, visible, text, pill: baseNone, textColor: primaryTextColor };
          }
          if (tl.id === 'body') {
            if (isZeroPillTopic || isWhisperTopic || nextTextTheme === 'split-quote') {
              return { ...tl, visible, text, pill: baseNone, textColor: secondaryTextColor };
            }
            return {
              ...tl,
              visible,
              text,
              pill: (dark ? 'cream' : 'frosted') as PillStyle,
              textColor: undefined
            };
          }
          if (tl.id === 'footer') {
            if (isZeroPillTopic) {
              return { ...tl, visible, text, pill: baseNone, textColor: accentTextColor };
            }
            return {
              ...tl,
              visible,
              text,
              pill: (recipe.pills.contact || recipe.pills.coat || (dark ? 'terracotta' : 'gold')) as PillStyle,
              textColor: undefined
            };
          }
          return { ...tl, visible, text };
        }),
        ...customExtras
      ];

      const resolvedTopicLayers = resolveLayerOverlaps(remixedTopic, 86, canvasH - 76, false);
      updateActiveSlide(
        {
          textCardTheme: nextTextTheme,
          bgStyle: recipe.bgStyle,
          windowStyle: recipe.windowStyle,
          layers: resolvedTopicLayers
        },
        true
      );
      return;
    }

    // Over-photo Topic / AI card shuffle
    const recipePillCount = Object.values(recipe.pills).filter(
      (p) => p && PILL_PALETTE[p]?.hasBg
    ).length;
    const isZeroPillTopic = recipePillCount === 0;
    const isWhisperTopic = recipePillCount === 1;

    const primaryTextColor = '#FFFFFF';
    const accentTextColor = '#F4D37E';
    const secondaryTextColor = '#FAF7F0';

    const rawTopicLayers: TextLayer[] = activeSlide.layers.map((l) => {
      if (l.id.includes('badge') || l.id === 'tag') {
        if (isZeroPillTopic) {
          return {
            ...l,
            pill: 'none-light' as PillStyle,
            textColor: accentTextColor
          };
        }
        return {
          ...l,
          pill: (recipe.pills.status || recipe.pills.breedAge || 'gold') as PillStyle,
          textColor: undefined
        };
      }
      if (l.id === 'title' || l.id === 'headline') {
        return {
          ...l,
          pill: 'none-light' as PillStyle,
          textColor: primaryTextColor
        };
      }
      if (l.id === 'body') {
        if (isZeroPillTopic || isWhisperTopic) {
          return {
            ...l,
            pill: 'none-light' as PillStyle,
            textColor: secondaryTextColor
          };
        }
        return {
          ...l,
          pill: 'frosted' as PillStyle,
          pillOpacity: 0.78,
          textColor: undefined
        };
      }
      if (l.id === 'footer') {
        if (isZeroPillTopic || isWhisperTopic) {
          return {
            ...l,
            pill: 'none-light' as PillStyle,
            textColor: accentTextColor
          };
        }
        return {
          ...l,
          pill: (recipe.pills.contact || recipe.pills.coat || 'gold') as PillStyle,
          textColor: undefined
        };
      }
      if (l.pill === 'none-dark' || l.pill === 'none-light') {
        return { ...l, pill: 'none-light' as PillStyle, textColor: primaryTextColor };
      }
      return l;
    });

    const resolvedTopicLayers = resolveLayerOverlaps(
      rawTopicLayers,
      88,
      canvasH - 76,
      false
    );

    updateActiveSlide(
      {
        bgStyle: recipe.bgStyle,
        windowStyle: recipe.windowStyle,
        photoDim: Math.max(activeSlide.photoDim || 0.42, 0.38),
        layers: resolvedTopicLayers
      },
      true
    );
  };

  // Multi-Slide Carousel Builder
  const handleBuildAutoCarousel = () => {
    pushHistory(slides);
    const isDogSlide =
      (!activeSlide.slideMode ||
        activeSlide.slideMode === 'puppies' ||
        activeSlide.slideMode === 'studs') &&
      activeSlide.layers.some((l) => l.id === 'breedAge' || l.id === 'name' || l.id === 'sex');

    if (isDogSlide && selectedDog) {
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

  const addNewDefaultSlide = () => {
    pushHistory(slides);
    const built = buildDefaultSlideForMode(contentMode, ratio, `slide-${Date.now()}`, false);
    setSlides((prev) => [...prev, built.slide]);
    setActiveSlideIdx(slides.length);
    setSelectedLayerId(null);
    setEditingLayerId(null);
  };

  const duplicateCurrentSlide = () => {
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
    setEditingLayerId(null);
    setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
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
      setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
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
    setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
  };

  // Save & Apply Custom User Layout Presets
  const handleSaveLayoutPreset = () => {
    const name = newPresetName.trim() || `My Layout ${savedLayouts.length + 1}`;
    const presetItem: SavedLayoutPreset = {
      id: `layout-${Date.now()}`,
      name,
      preset: activeSlide.preset,
      textCardTheme: activeSlide.textCardTheme || 'arch-crest',
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
      pillOpacity: sl.pillOpacity,
      font: sl.font,
      textColor: sl.textColor,
      text: freshTextMap.get(sl.id) || sl.sampleText || sl.label
    }));

    const isDogMode = Boolean(selectedDog && (contentMode === 'puppies' || contentMode === 'studs'));
    const currentPhotoBelongsToSelectedDog =
      isDogMode &&
      selectedDog &&
      (activeSlide.photoSrc === selectedDog.image ||
        (selectedDog.media || []).some((m) => m.url === activeSlide.photoSrc) ||
        (Boolean(activeSlide.photoSrc?.startsWith('data:')) &&
          activeSlide.customPhotoDogId === selectedDog.id));

    updateActiveSlide(
      {
        preset: saved.preset,
        textCardTheme: saved.textCardTheme || 'arch-crest',
        bgStyle: saved.bgStyle,
        windowStyle: saved.windowStyle || 'pure-white',
        photoDim: saved.photoDim,
        archHeight: saved.archHeight,
        ...(isDogMode && selectedDog
          ? {
              dogId: selectedDog.id,
              customPhotoDogId: currentPhotoBelongsToSelectedDog
                ? activeSlide.customPhotoDogId
                : undefined,
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

  // Unified Drag & 4-Way Handle + Offset Crosshair State
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
    viaCrosshair?: boolean;
    crossOffX?: number;
    crossOffY?: number;
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

      const keepPhotoOverlay =
        activeSlide.slideMode === 'didyouknow' && activeSlide.preset !== 'no-photo' && Boolean(activeSlide.photoSrc);
      const targetPreset: FramePreset = keepPhotoOverlay ? activeSlide.preset : 'no-photo';
      const targetTextTheme: TextCardTheme = activeSlide.textCardTheme || 'ribbon-banner';
      const targetWin: BgStyle = activeSlide.windowStyle || 'cream-editorial';
      const baseAiLayers = buildTopicLayers(
        generatedItem,
        canvasH,
        targetTextTheme === 'minimal-luxe' ? chosenBg : targetWin,
        'didyouknow',
        keepPhotoOverlay ? 'arch-crest' : targetTextTheme
      ).map((l) => {
        if (!keepPhotoOverlay) return l;
        if (l.pill === 'none-dark') return { ...l, pill: 'none-light' as PillStyle };
        if (l.id === 'body') return { ...l, pill: 'frosted' as PillStyle };
        return l;
      });

      updateActiveSlide(
        {
          preset: targetPreset,
          textCardTheme: targetTextTheme,
          bgStyle: chosenBg,
          windowStyle: targetWin,
          slideMode: 'didyouknow',
          topicId: generatedItem.id,
          photoSrc: keepPhotoOverlay ? activeSlide.photoSrc : '',
          photoDim: keepPhotoOverlay ? Math.max(0.45, activeSlide.photoDim) : 0,
          panX: 0,
          panY: 0,
          zoom: 1,
          archHeight: activeSlide.archHeight || 800,
          layers: baseAiLayers
        },
        true
      );
      const nextCaption = cardData.caption || buildTopicCaption(generatedItem);
      setCaptionText(nextCaption);

      // Save to Recent AI Cards history so you never lose a generated AI card!
      setSavedAiCards((prev) => {
        const nextList = [{ item: generatedItem, caption: nextCaption }, ...prev].slice(0, 10);
        try {
          localStorage.setItem(SAVED_AI_CARDS_KEY, JSON.stringify(nextList));
        } catch {
          // ignore storage quota
        }
        return nextList;
      });
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

    const tTheme: TextCardTheme = slide.textCardTheme || 'arch-crest';
    const geom = getFrameGeometry(
      slide.preset,
      canvasH,
      slide.archHeight,
      slide.bgStyle,
      slide.windowStyle || 'pure-white',
      tTheme
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
        geom.cardBottomR,
        geom.cardBottomR
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
        geom.cardBottomR,
        geom.cardBottomR
      );
      ctx.strokeStyle = geom.cardBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (!geom.hasPhoto) {
      const winTheme = BG_STYLES[slide.windowStyle || 'cream-editorial'] || BG_STYLES['cream-editorial'];
      const outerTheme = BG_STYLES[slide.bgStyle || 'forest-luxe'] || BG_STYLES['forest-luxe'];
      const accentStroke = winTheme.darkText ? 'rgba(46,90,68,0.22)' : 'rgba(244,211,126,0.32)';
      ctx.save();
      if (tTheme === 'arch-crest') {
        roundRectPath(ctx, 76, 76, 1080 - 152, canvasH - 152, 196, 196, 28, 28);
        ctx.strokeStyle = accentStroke;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (tTheme === 'magazine-border') {
        roundRectPath(ctx, 72, 72, 1080 - 144, canvasH - 144, 24, 24, 24, 24);
        ctx.strokeStyle = accentStroke;
        ctx.lineWidth = 3;
        ctx.stroke();
        roundRectPath(ctx, 88, 88, 1080 - 176, canvasH - 176, 18, 18, 18, 18);
        ctx.strokeStyle = accentStroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (tTheme === 'cameo-medallion') {
        roundRectPath(ctx, 90, 100, 1080 - 180, canvasH - 200, 999, 999, 999, 999);
        ctx.strokeStyle = accentStroke;
        ctx.lineWidth = 3;
        ctx.stroke();
      } else if (tTheme === 'ribbon-banner') {
        ctx.save();
        roundRectPath(ctx, geom.cardX, geom.cardY, geom.cardW, 148, 38, 38, 0, 0);
        ctx.fillStyle = outerTheme.swatch === winTheme.swatch ? '#2E5A44' : outerTheme.bg1;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(geom.cardX, geom.cardY + 148);
        ctx.lineTo(geom.cardX + geom.cardW, geom.cardY + 148);
        ctx.strokeStyle = '#F4D37E';
        ctx.lineWidth = 4;
        ctx.stroke();
        ctx.restore();
      } else if (tTheme === 'split-quote') {
        const splitH = Math.round(canvasH * 0.44) - geom.cardY;
        ctx.save();
        roundRectPath(ctx, geom.cardX, geom.cardY, geom.cardW, splitH, 38, 38, 0, 0);
        ctx.fillStyle = outerTheme.darkText ? '#2E5A44' : outerTheme.bg1;
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(geom.cardX + 90, geom.cardY + splitH);
        ctx.lineTo(geom.cardX + geom.cardW - 90, geom.cardY + splitH);
        ctx.strokeStyle = '#F4D37E';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();
      } else if (tTheme === 'minimal-luxe') {
        const lineStroke = outerTheme.darkText ? 'rgba(46,90,68,0.28)' : 'rgba(244,211,126,0.38)';
        ctx.beginPath();
        ctx.moveTo(160, 165);
        ctx.lineTo(1080 - 160, 165);
        ctx.moveTo(160, canvasH - 175);
        ctx.lineTo(1080 - 160, canvasH - 175);
        ctx.strokeStyle = lineStroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
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

      const pal = PILL_PALETTE[layer.pill] || PILL_PALETTE.cream;
      const padX = pal.hasBg ? 26 : 8;
      const innerMaxW = Math.max(60, layer.pillWidth - padX * 2);
      const textLines = wrapLines(ctx, layer.text, innerMaxW);
      const lineH = fontSize * 1.24;
      const boxW = layer.pillWidth;
      const boxH = textLines.length * lineH + layer.padY * 2;
      const bx = layer.x - boxW / 2;
      const by = layer.y - boxH / 2;
      const r = textLines.length > 1 || layer.padY > 28 ? 32 : 999;

      const pillOpacity = layer.pillOpacity !== undefined ? layer.pillOpacity : 1;
      if (pal.hasBg && pillOpacity > 0.01) {
        ctx.save();
        if (pal.shadow && pillOpacity > 0.15) {
          ctx.shadowColor = `rgba(0,0,0,${(0.16 * pillOpacity).toFixed(3)})`;
          ctx.shadowBlur = 22;
          ctx.shadowOffsetY = 8;
        }
        roundRectPath(ctx, bx, by, boxW, boxH, r, r, r, r);
        ctx.fillStyle = applyColorAlpha(pal.bg, pillOpacity);
        ctx.fill();
        ctx.restore();

        roundRectPath(ctx, bx, by, boxW, boxH, r, r, r, r);
        ctx.strokeStyle = applyColorAlpha(pal.border, Math.min(1, pillOpacity * 1.15));
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (
        layer.pill === 'none-light' ||
        pillOpacity < 0.35 ||
        (!pal.hasBg &&
          (layer.textColor === '#FFFFFF' ||
            layer.textColor === '#F4D37E' ||
            layer.textColor === '#F6F4EE' ||
            layer.textColor === '#E8DFCE'))
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
    activeSlide.windowStyle || 'pure-white',
    activeSlide.textCardTheme || 'arch-crest'
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
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col bg-[#EFECE3] text-[#1C2621] overscroll-none">
      <Helmet>
        <title>Instagram Card Studio | OKC Frenchies Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Compact App-Shell Top Header Bar (Zero Vertical Bloat!) */}
      <header className="shrink-0 bg-white border-b border-[#EAE5D9] px-2 sm:px-4 py-1.5 z-30">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <Link
              to="/"
              className="shrink-0 px-2 py-1 rounded-full bg-[#F6F4EE] border border-[#DDD6C7] text-[11px] font-extrabold text-[#3E4D45] hover:bg-[#EAE5D9] transition"
              title="Back to OKC Frenchies website"
            >
              ← Site
            </Link>
            <span className="hidden sm:inline font-serif text-base font-bold text-[#2E5A44] shrink-0">
              🌿 Studio
            </span>

            {/* Ratio Switcher */}
            <div className="flex bg-[#F6F4EE] rounded-full p-0.5 border border-[#E2DCCD] text-[10px] sm:text-xs font-bold shrink-0">
              {(
                [
                  ['feed', '4:5'],
                  ['story', '9:16'],
                  ['square', '1:1']
                ] as const
              ).map(([rKey, rLabel]) => (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => handleSwitchRatio(rKey)}
                  className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full touch-manipulation cursor-pointer transition ${
                    ratio === rKey ? 'bg-[#2E5A44] text-white' : 'text-[#5C6B63]'
                  }`}
                >
                  {rLabel}
                </button>
              ))}
            </div>

            {/* Desktop Quick Content Mode Pills */}
            <div className="hidden xl:flex items-center gap-1 pl-1 border-l border-[#EAE5D9]">
              {(
                [
                  ['puppies', '🐾 Puppies'],
                  ['studs', '👑 Studs'],
                  ['glossary', '🧬 DNA'],
                  ['standards', '🏡 Blog'],
                  ['didyouknow', '💡 AI & Facts']
                ] as const
              ).map(([modeKey, modeLabel]) => (
                <button
                  key={modeKey}
                  type="button"
                  onClick={() => handleSelectContentMode(modeKey)}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold border touch-manipulation cursor-pointer transition ${
                    contentMode === modeKey
                      ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                      : 'bg-[#F6F4EE] text-[#3E4D45] border-[#DDD6C7] hover:bg-[#EAE5D9]'
                  }`}
                >
                  {modeLabel}
                </button>
              ))}
            </div>

            {draftSavedAt && (
              <span className="hidden 2xl:inline text-[11px] font-bold text-[#5C6B63] shrink-0">
                ✓ Saved
              </span>
            )}
          </div>

                          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleResetActiveSlideToModeDefault}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold border bg-[#F6F4EE] border-[#D9D2C3] text-[#2E5A44] hover:bg-[#EAE5D9] touch-manipulation cursor-pointer transition"
              title="Reset current slide to this section's default template & theme"
            >
              🔄<span className="hidden sm:inline"> Reset</span>
            </button>
            <button
              type="button"
              disabled={history.length === 0}
              onClick={handleUndo}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-extrabold border bg-[#F6F4EE] border-[#D9D2C3] text-[#1C2621] disabled:opacity-40 touch-manipulation cursor-pointer"
              title="Undo last change"
            >
              ↩<span className="hidden md:inline"> Undo</span>
            </button>
            {geom.hasPhoto && (
              <button
                type="button"
                onClick={() => setPhotoLocked((v) => !v)}
                className={`px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold border touch-manipulation cursor-pointer transition ${
                  photoLocked
                    ? 'bg-[#F4D37E] border-[#D9B451] text-[#1C2621]'
                    : 'bg-[#F6F4EE] border-[#D9D2C3] text-[#5C6B63]'
                }`}
                title={photoLocked ? 'Unlock photo panning' : 'Lock photo position'}
              >
                {photoLocked ? '🔒' : '🔓'}
                <span className="hidden md:inline">{photoLocked ? ' Locked' : ' Lock'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleExportSlides(slides.length > 1, true)}
              className="sm:hidden px-2.5 py-1 rounded-full bg-[#2E5A44] text-white text-[11px] font-extrabold shadow-sm touch-manipulation cursor-pointer"
            >
              📲 Share{slides.length > 1 ? ` (${slides.length})` : ''}
            </button>
            <button
              type="button"
              onClick={() => handleExportSlides(false, false)}
              className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold hover:bg-[#234735] transition shadow-sm cursor-pointer"
            >
              ⬇ PNG
            </button>
            <button
              type="button"
              onClick={() => handleExportSlides(false, false)}
              className="sm:hidden px-2 py-1 rounded-full bg-[#F6F4EE] border border-[#2E5A44] text-[#2E5A44] text-[11px] font-extrabold touch-manipulation cursor-pointer"
              title="Download PNG"
            >
              ⬇
            </button>
            {slides.length > 1 && (
              <button
                type="button"
                onClick={() => handleExportSlides(true, false)}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-full bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm cursor-pointer"
              >
                📚 All ({slides.length})
              </button>
            )}
          </div>
        </div>

        {/* Always-Visible Mobile & Tablet Content Mode Picker Row (Puppies / Studs / DNA / Blog / AI) */}
        <div className="flex xl:hidden items-center gap-1 overflow-x-auto no-scrollbar pt-1.5 mt-1 border-t border-[#F0ECE1]">
          {(
            [
              ['puppies', '🐾 Puppies'],
              ['studs', '👑 Studs'],
              ['glossary', '🧬 Coat & DNA'],
              ['standards', '🏡 Blog'],
              ['didyouknow', '💡 Did You Know & AI']
            ] as const
          ).map(([modeKey, modeLabel]) => (
            <button
              key={modeKey}
              type="button"
              onClick={() => handleSelectContentMode(modeKey)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-extrabold border touch-manipulation cursor-pointer transition ${
                contentMode === modeKey
                  ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                  : 'bg-[#F6F4EE] text-[#3E4D45] border-[#DDD6C7] hover:bg-[#EAE5D9]'
              }`}
            >
              {modeLabel}
            </button>
          ))}
        </div>
      </header>

      {/* Split-Screen Locked Workspace: MacBook Left-Stage / Right-Inspector, Mobile Top-Stage / Bottom-Inspector */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT / TOP: Always-Visible Fixed-Position Stage Pane (Zero Conditional Toolbars = Zero Bounce!) */}
        <main
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedLayerId(null);
              setEditingLayerId(null);
            }
          }}
          className={`${
            mobileCanvasTall ? 'h-[55dvh]' : 'h-[43dvh]'
          } lg:h-full lg:flex-1 min-w-0 shrink-0 flex flex-col items-center bg-[#EFECE3] border-b lg:border-b-0 lg:border-r border-[#DFD9CA] px-2 sm:px-4 py-1 lg:py-2 overflow-hidden order-1`}
        >
          {/* Fixed-Height Strip Above Canvas: Slides + Quick Layer Chips */}
          <div className="w-full max-w-[560px] shrink-0 flex flex-col gap-1">
            {/* Row 1: Slides + Mobile Stage Size Toggle */}
            <div className="h-7 flex items-center justify-between gap-1 bg-white/85 border border-[#EAE5D9] rounded-xl px-1.5">
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
                    className={`shrink-0 px-2 py-0.5 rounded-lg text-[11px] font-extrabold touch-manipulation cursor-pointer transition ${
                      idx === activeSlideIdx
                        ? 'bg-[#2E5A44] text-white'
                        : 'bg-[#F6F4EE] text-[#5C6B63] border border-[#E2DCCD]'
                    }`}
                  >
                    S{idx + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={addNewDefaultSlide}
                  className="shrink-0 px-2 py-0.5 rounded-lg text-[11px] font-extrabold bg-[#E4EFE8] text-[#2E5A44] border border-[#2E5A44]/30 touch-manipulation cursor-pointer"
                  title="Add a fresh slide using this section's default template"
                >
                  + Slide
                </button>
                <button
                  type="button"
                  onClick={duplicateCurrentSlide}
                  className="shrink-0 px-1.5 py-0.5 rounded-lg text-[11px] font-bold bg-[#F6F4EE] text-[#5C6B63] border border-[#D4CEC0] touch-manipulation cursor-pointer"
                  title="Duplicate current slide"
                >
                  ⧉
                </button>
                {slides.length > 1 && (
                  <button
                    type="button"
                    onClick={removeActiveSlide}
                    className="shrink-0 px-1.5 py-0.5 rounded-lg text-[11px] font-extrabold bg-[#FEE2E2] text-[#991B1B] touch-manipulation cursor-pointer"
                    title="Remove current slide"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={handleBuildAutoCarousel}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#F4D37E] text-[#1C2621] border border-[#E2BE62] touch-manipulation cursor-pointer"
                >
                  ✨ 3-Slide
                </button>
                <button
                  type="button"
                  onClick={() => setMobileCanvasTall((v) => !v)}
                  className="lg:hidden px-2 py-0.5 rounded-lg text-[10px] font-extrabold bg-[#F6F4EE] text-[#2E5A44] border border-[#DDD6C7] touch-manipulation cursor-pointer"
                  title="Toggle larger photo preview vs taller editing dock"
                >
                  {mobileCanvasTall ? '🔽 Smaller' : '🔍 Larger'}
                </button>
              </div>
            </div>

            {/* Row 2: Quick Layer Picker & 1-Tap Add/Remove (Fixed 28px Height!) */}
            <div className="h-7 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => {
                  setSelectedLayerId(null);
                  setEditingLayerId(null);
                }}
                className={`shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border touch-manipulation cursor-pointer transition ${
                  !selectedLayerId
                    ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                    : 'bg-white text-[#5C6B63] border-[#DDD6C7]'
                }`}
              >
                {geom.hasPhoto ? '🖼️ Photo' : '🎨 Bg'}
              </button>
              {activeSlide.layers
                .filter((l) => l.visible)
                .map((l) => (
                  <div
                    key={l.id}
                    className={`shrink-0 inline-flex items-center rounded-full text-[11px] font-extrabold border transition ${
                      selectedLayerId === l.id
                        ? 'bg-[#D46A4E] text-white border-[#D46A4E]'
                        : 'bg-white text-[#1C2621] border-[#DDD6C7]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLayerId(l.id);
                        setEditingLayerId(null);
                        setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
                      }}
                      className="pl-2 pr-1 py-0.5 touch-manipulation cursor-pointer"
                    >
                      {l.label}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLayer(l.id, { visible: false }, true);
                        if (selectedLayerId === l.id) {
                          setSelectedLayerId(null);
                          setEditingLayerId(null);
                        }
                      }}
                      title={`Remove ${l.label} from card`}
                      className={`pr-2 pl-0.5 py-0.5 font-black touch-manipulation cursor-pointer ${
                        selectedLayerId === l.id ? 'text-white/90 hover:text-white' : 'text-[#991B1B]'
                      }`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              {activeSlide.layers
                .filter((l) => !l.visible)
                .map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => {
                      updateLayer(l.id, { visible: true }, true);
                      setSelectedLayerId(l.id);
                      setEditingLayerId(null);
                      setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
                    }}
                    title={`Add ${l.label} to card`}
                    className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold border border-dashed border-[#BDB5A4] bg-white/70 text-[#5C6B63] touch-manipulation cursor-pointer"
                  >
                    + {l.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Viewport-Measured Stage Host — Centers Photo & Guarantees 100% Fit Without Scrolling! */}
          <div
            ref={stageHostRef}
            onPointerDown={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedLayerId(null);
                setEditingLayerId(null);
              }
            }}
            className="flex-1 min-h-0 w-full flex items-center justify-center overflow-hidden"
          >
            {/* Interactive Stage */}
            <div
              onTouchStart={handleTouchStartStage}
              onTouchMove={handleTouchMoveStage}
              onTouchEnd={handleTouchEndStage}
              onTouchCancel={handleTouchEndStage}
              style={{
                width: stageWidth,
                height: stageHeight,
                touchAction: 'none',
                contain: 'layout paint',
                isolation: 'isolate'
              }}
              className="relative overflow-hidden rounded-2xl shadow-xl select-none shrink-0"
            >
              <div
                onPointerDown={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  }
                }}
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
                  dragModeRef.current.viaCrosshair = false;
                  setSnapVertical(false);
                  setSnapHorizontal(false);
                }}
                onPointerCancel={() => {
                  dragModeRef.current.type = 'none';
                  dragModeRef.current.viaCrosshair = false;
                  setSnapVertical(false);
                  setSnapHorizontal(false);
                }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 1080,
                  height: canvasH,
                transform: `scale(${stageScale})`,
                transformOrigin: 'top left',
                background: `linear-gradient(155deg, ${geom.outerBg1}, ${geom.outerBg2})`
              }}
            >
              {geom.hasCard && (
                <div
                  onPointerDown={() => {
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  }}
                  style={{
                    position: 'absolute',
                    left: geom.cardX,
                    top: geom.cardY,
                    width: geom.cardW,
                    height: geom.cardH,
                    background: geom.cardBg,
                    border: `2px solid ${geom.cardBorder}`,
                    borderRadius: `${geom.cardTopR}px ${geom.cardTopR}px ${geom.cardBottomR}px ${geom.cardBottomR}px`,
                    boxShadow: '0 24px 60px rgba(28,38,33,0.12)',
                    overflow: 'hidden'
                  }}
                />
              )}

              {/* Photo Window or No-Photo Decorative Text Card Architecture */}
              {!geom.hasPhoto ? (
                (() => {
                  const tTheme = activeSlide.textCardTheme || 'arch-crest';
                  const winTheme =
                    BG_STYLES[activeSlide.windowStyle || 'cream-editorial'] ||
                    BG_STYLES['cream-editorial'];
                  const outerTheme =
                    BG_STYLES[activeSlide.bgStyle || 'forest-luxe'] || BG_STYLES['forest-luxe'];
                  const accentStroke = winTheme.darkText
                    ? 'rgba(46,90,68,0.22)'
                    : 'rgba(244,211,126,0.32)';
                  const deselect = () => {
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
                  };

                  if (tTheme === 'magazine-border') {
                    return (
                      <>
                        <div
                          onPointerDown={deselect}
                          style={{
                            position: 'absolute',
                            left: 72,
                            top: 72,
                            right: 72,
                            bottom: 72,
                            borderRadius: 24,
                            border: `3px solid ${accentStroke}`
                          }}
                        />
                        <div
                          onPointerDown={deselect}
                          style={{
                            position: 'absolute',
                            left: 88,
                            top: 88,
                            right: 88,
                            bottom: 88,
                            borderRadius: 18,
                            border: `1.5px solid ${accentStroke}`
                          }}
                        />
                      </>
                    );
                  }
                  if (tTheme === 'cameo-medallion') {
                    return (
                      <div
                        onPointerDown={deselect}
                        style={{
                          position: 'absolute',
                          left: 90,
                          top: 100,
                          right: 90,
                          bottom: 100,
                          borderRadius: 999,
                          border: `3px solid ${accentStroke}`
                        }}
                      />
                    );
                  }
                  if (tTheme === 'ribbon-banner') {
                    return (
                      <div
                        onPointerDown={deselect}
                        style={{
                          position: 'absolute',
                          left: geom.cardX,
                          top: geom.cardY,
                          width: geom.cardW,
                          height: 148,
                          borderRadius: '38px 38px 0 0',
                          background:
                            outerTheme.swatch === winTheme.swatch ? '#2E5A44' : outerTheme.bg1,
                          borderBottom: '4px solid #F4D37E'
                        }}
                      />
                    );
                  }
                  if (tTheme === 'split-quote') {
                    const splitH = Math.round(canvasH * 0.44) - geom.cardY;
                    return (
                      <div
                        onPointerDown={deselect}
                        style={{
                          position: 'absolute',
                          left: geom.cardX,
                          top: geom.cardY,
                          width: geom.cardW,
                          height: splitH,
                          borderRadius: '38px 38px 0 0',
                          background: outerTheme.darkText ? '#2E5A44' : outerTheme.bg1,
                          borderBottom: '3px solid #F4D37E'
                        }}
                      />
                    );
                  }
                  if (tTheme === 'minimal-luxe') {
                    const lineStroke = outerTheme.darkText
                      ? 'rgba(46,90,68,0.28)'
                      : 'rgba(244,211,126,0.38)';
                    return (
                      <div
                        onPointerDown={deselect}
                        style={{
                          position: 'absolute',
                          left: 160,
                          right: 160,
                          top: 165,
                          bottom: 175,
                          borderTop: `2px solid ${lineStroke}`,
                          borderBottom: `2px solid ${lineStroke}`
                        }}
                      />
                    );
                  }
                  return (
                    <div
                      onPointerDown={deselect}
                      style={{
                        position: 'absolute',
                        left: 76,
                        top: 76,
                        right: 76,
                        bottom: 76,
                        borderRadius: '196px 196px 28px 28px',
                        border: `3px solid ${accentStroke}`
                      }}
                    />
                  );
                })()
              ) : (
                <div
                  onPointerDown={(e) => {
                    if (!e.isPrimary || pinchRef.current.active) return;
                    setSelectedLayerId(null);
                    setEditingLayerId(null);
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

              {/* Freeform Pills with Explicit Width/Padding, 4-Way Handles & Offset Move Crosshair */}
              {activeSlide.layers.map((layer) => {
                if (!layer.visible) return null;
                const isSel = selectedLayerId === layer.id;
                const isEditing = editingLayerId === layer.id;
                const pal = PILL_PALETTE[layer.pill] || PILL_PALETTE.cream;
                const fontSize = layer.fontSize;
                const padX = pal.hasBg ? 26 : 8;

                // Smart Offset Move Crosshair Position (keeps thumb off to the side/below so text is 100% uncovered!)
                const halfW = layer.pillWidth / 2;
                const estLines = Math.max(
                  1,
                  layer.text.split('\n').length,
                  Math.ceil(
                    (layer.text.length * fontSize * 0.54) / Math.max(160, layer.pillWidth - padX * 2)
                  )
                );
                const halfH = (estLines * fontSize * 1.24) / 2 + layer.padY;
                const belowY = layer.y + halfH + 84;
                const placeBelow = belowY <= canvasH - 64;
                const targetCrossY = placeBelow ? belowY : Math.max(64, layer.y - halfH - 84);
                const targetCrossX = placeBelow
                  ? layer.x > 740
                    ? Math.max(68, layer.x - halfW - 58)
                    : Math.min(1012, layer.x + halfW + 58)
                  : Math.max(68, layer.x - halfW - 54);

                const parkedOffX = targetCrossX - layer.x;
                const parkedOffY = targetCrossY - layer.y;

                const isCrosshairDragging =
                  dragModeRef.current.type === 'layer' &&
                  dragModeRef.current.layerId === layer.id &&
                  Boolean(dragModeRef.current.viaCrosshair);

                const activeOffX = isCrosshairDragging
                  ? (dragModeRef.current.crossOffX ?? parkedOffX)
                  : parkedOffX;
                const activeOffY = isCrosshairDragging
                  ? (dragModeRef.current.crossOffY ?? parkedOffY)
                  : parkedOffY;

                // Keep crosshair badge inside visible card bounds even near extreme edges
                const renderOffX = Math.max(48 - layer.x, Math.min(1032 - layer.x, activeOffX));
                const renderOffY = Math.max(
                  48 - layer.y,
                  Math.min(canvasH - 48 - layer.y, activeOffY)
                );

                const edgeRatio = Math.max(
                  Math.abs(renderOffX) / Math.max(24, halfW + 6),
                  Math.abs(renderOffY) / Math.max(20, halfH + 6)
                );
                const tetherStartScale = edgeRatio > 1 ? 1 / edgeRatio : 1;
                const tetherStartX = renderOffX * tetherStartScale;
                const tetherStartY = renderOffY * tetherStartScale;

                const startHandle = (
                  handleType:
                    | 'handle-left'
                    | 'handle-right'
                    | 'handle-top'
                    | 'handle-bottom',
                  e: React.PointerEvent
                ) => {
                  e.stopPropagation();
                  (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
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
                    recordedUndo: false,
                    viaCrosshair: false
                  };
                };

                return (
                  <div
                    key={layer.id}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                      if (!e.isPrimary || pinchRef.current.active || isEditing) return;
                      setSelectedLayerId(layer.id);
                      setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
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
                        recordedUndo: false,
                        viaCrosshair: false
                      };
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
                        background:
                          pal.hasBg && (layer.pillOpacity ?? 1) > 0.01
                            ? applyColorAlpha(pal.bg, layer.pillOpacity)
                            : 'transparent',
                        color: layer.textColor || pal.text,
                        border:
                          pal.hasBg && (layer.pillOpacity ?? 1) > 0.01
                            ? `2px solid ${applyColorAlpha(
                                pal.border,
                                Math.min(1, (layer.pillOpacity ?? 1) * 1.15)
                              )}`
                            : 'none',
                        borderRadius:
                          layer.padY > 28 || layer.text.includes('\n') ? 32 : 999,
                        boxShadow:
                          pal.shadow && pal.hasBg && (layer.pillOpacity ?? 1) > 0.15
                            ? `0 10px 26px rgba(0,0,0,${(0.18 * (layer.pillOpacity ?? 1)).toFixed(3)})`
                            : 'none',
                        textShadow:
                          layer.pill === 'none-light' ||
                          (pal.hasBg && (layer.pillOpacity ?? 1) < 0.35) ||
                          (!pal.hasBg &&
                            (layer.textColor === '#FFFFFF' ||
                              layer.textColor === '#F4D37E' ||
                              layer.textColor === '#F6F4EE' ||
                              layer.textColor === '#E8DFCE'))
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

                          {/* 1-Tap Delete / Hide Button on Top-Right Corner of Selected Pill */}
                          <div
                            onPointerDown={(e) => {
                              e.stopPropagation();
                              updateLayer(layer.id, { visible: false }, true);
                              setSelectedLayerId(null);
                              setEditingLayerId(null);
                            }}
                            title="Remove this pill from card"
                            style={{
                              position: 'absolute',
                              top: -30,
                              right: -30,
                              width: 56,
                              height: 56,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <span
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: 999,
                                background: '#991B1B',
                                color: '#FFF',
                                border: '4px solid #FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 18,
                                fontWeight: 900,
                                boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
                              }}
                            >
                              ✕
                            </span>
                          </div>

                          {/* Offset Move Crosshair Handle (Drag from the side so your finger never covers the pill!) */}
                          <div
                            style={{
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              width: 0,
                              height: 0,
                              zIndex: 45
                            }}
                          >
                            <svg
                              width={1400}
                              height={1400}
                              viewBox="-700 -700 1400 1400"
                              style={{
                                position: 'absolute',
                                left: -700,
                                top: -700,
                                pointerEvents: 'none',
                                overflow: 'visible'
                              }}
                            >
                              <line
                                x1={tetherStartX}
                                y1={tetherStartY}
                                x2={renderOffX}
                                y2={renderOffY}
                                stroke="#FFFFFF"
                                strokeWidth={7}
                                strokeLinecap="round"
                                opacity={0.9}
                              />
                              <line
                                x1={tetherStartX}
                                y1={tetherStartY}
                                x2={renderOffX}
                                y2={renderOffY}
                                stroke="#1C2621"
                                strokeWidth={3.5}
                                strokeDasharray="10 8"
                                strokeLinecap="round"
                              />
                            </svg>

                            <div
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                if (!e.isPrimary || pinchRef.current.active) return;
                                (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                                setSelectedLayerId(layer.id);
                                setEditingLayerId(null);
                                setInspectorTab((prev) => (prev === 'fields' ? 'fields' : 'pill'));
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
                                  recordedUndo: false,
                                  viaCrosshair: true,
                                  crossOffX: activeOffX,
                                  crossOffY: activeOffY
                                };
                              }}
                              title="Drag here to move selection without covering it with your finger"
                              style={{
                                position: 'absolute',
                                left: renderOffX,
                                top: renderOffY,
                                transform: 'translate(-50%, -50%)',
                                width: 128,
                                height: 128,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'grab',
                                touchAction: 'none'
                              }}
                            >
                              <span
                                style={{
                                  width: 72,
                                  height: 72,
                                  borderRadius: 999,
                                  background: '#1C2621',
                                  color: '#F4D37E',
                                  border: '5px solid #FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
                                }}
                              >
                                <svg
                                  width={38}
                                  height={38}
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth={2.5}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="5 9 2 12 5 15" />
                                  <polyline points="9 5 12 2 15 5" />
                                  <polyline points="15 19 12 22 9 19" />
                                  <polyline points="19 9 22 12 19 15" />
                                  <line x1="2" y1="12" x2="22" y2="12" />
                                  <line x1="12" y1="2" x2="12" y2="22" />
                                </svg>
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          </div>

          {/* Fixed 20px Desktop Status Hint — Constant Height So Canvas Never Shifts! */}
          <div className="hidden lg:flex items-center justify-center h-5 shrink-0 text-[11px] font-semibold text-[#5C6B63] truncate max-w-full">
            {selectedLayer
              ? `✥ Drag offset crosshair (or pill) to move "${selectedLayer.label}" • Double-click pill to type • Style in right panel`
              : '👆 Tap any pill to style • Grab ✥ offset crosshair to move without covering text • Pinch to scale'}
          </div>
        </main>

        {/* RIGHT / BOTTOM: Locked-Height 6-Tab Inspector Dock (Photo Remains 100% Visible!) */}
        <aside className="flex-1 lg:flex-none lg:w-[450px] xl:w-[490px] min-h-[160px] lg:h-full bg-white flex flex-col overflow-hidden order-2 shadow-lg lg:shadow-none">
          {/* Pinned 6-Tab Navigation Strip */}
          <nav className="shrink-0 grid grid-cols-6 gap-0.5 bg-[#F6F4EE] border-b border-[#EAE5D9] p-1">
            {(
              [
                ['theme', '🎨', 'Theme'],
                ['pill', '✏️', 'Pill'],
                ['source', '🐶', 'Source'],
                ['fields', '✨', 'Text'],
                ['layouts', '💾', 'Slides'],
                ['caption', '🤖', 'Caption']
              ] as const
            ).map(([tabKey, icon, label]) => {
              const isActive = inspectorTab === tabKey;
              const showPillDot = tabKey === 'pill' && Boolean(selectedLayer);
              return (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setInspectorTab(tabKey)}
                  className={`relative flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-1 py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-extrabold touch-manipulation cursor-pointer transition ${
                    isActive
                      ? 'bg-[#2E5A44] text-white shadow-xs'
                      : 'text-[#3E4D45] hover:bg-[#EAE5D9]/70'
                  }`}
                >
                  <span>{icon}</span>
                  <span className="truncate">{label}</span>
                  {showPillDot && (
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isActive ? 'bg-[#F4D37E]' : 'bg-[#D46A4E]'
                      } absolute top-1 right-1`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Independently Scrollable Tab Content (overflow-anchor: none prevents scroll jumps!) */}
          <div
            ref={inspectorScrollRef}
            style={{ overflowAnchor: 'none' }}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3"
          >
            {/* ==================== TAB 1: THEME, FRAME & COLORS ==================== */}
            {inspectorTab === 'theme' && (
              <div className="space-y-3">
                {/* Canva-Style 1-Tap Brand Shuffle Row */}
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleShuffleBrandLook(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#2E5A44] to-[#3B2B23] text-[#F4D37E] text-xs font-extrabold shadow-xs touch-manipulation cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.99] transition"
                  >
                    <span>✨ Shuffle Brand Look</span>
                    <span className="text-[10px] font-bold text-white/85 truncate max-w-[130px]">
                      ({BRAND_REMIX_RECIPES[remixIdx]?.name})
                    </span>
                  </button>
                  {(contentMode === 'puppies' || contentMode === 'studs') &&
                    galleryPhotos.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleShuffleBrandLook(true)}
                        className="shrink-0 py-2.5 px-3 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#1C2621] text-xs font-extrabold touch-manipulation cursor-pointer active:scale-[0.99] transition"
                        title="Shuffle theme, colors AND cycle through this puppy's photos!"
                      >
                        🎲 + Photo
                      </button>
                    )}
                </div>

                {/* Frame Preset Picker — Wrapped Grid */}
                <div className="space-y-1.5 pt-2 border-t border-[#F0ECE1]">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    Frame &amp; Layout Template
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {FRAME_PRESET_OPTIONS.map(({ key, label }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSwitchPreset(key)}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                          activeSlide.preset === key
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#F6F4EE] text-[#1C2621] border-[#DDD6C7] hover:bg-[#EFECE4]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Card Theme Picker (Shown whenever Text Card is active!) */}
                {activeSlide.preset === 'no-photo' && (
                  <div className="space-y-1.5 pt-2 border-t border-[#F0ECE1]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#D46A4E]">
                      Text Card Style (Blogs, DNA &amp; AI)
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {TEXT_CARD_THEME_OPTIONS.map(({ key, label }) => {
                        const activeTheme = activeSlide.textCardTheme || 'arch-crest';
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => handleSwitchTextCardTheme(key)}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                              activeTheme === key
                                ? 'bg-[#D46A4E] text-white border-[#D46A4E]'
                                : 'bg-[#F6F4EE] text-[#1C2621] border-[#DDD6C7] hover:bg-[#EFECE4]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Outer Background Color Swatches */}
                <div className="space-y-1.5 pt-2 border-t border-[#F0ECE1]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      Outer Background
                    </span>
                    {activeSlide.preset !== 'minimal' &&
                      !(
                        activeSlide.preset === 'no-photo' &&
                        activeSlide.textCardTheme === 'minimal-luxe'
                      ) && (
                        <button
                          type="button"
                          onClick={handleSwapBgAndWindow}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F6F4EE] border border-[#E2DCCD] text-[#D46A4E] touch-manipulation cursor-pointer hover:bg-[#EFECE4]"
                          title="Swap Outer Background and Inner Window colors"
                        >
                          ⇄ Swap Outer &amp; Window
                        </button>
                      )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(Object.entries(BG_STYLES) as [BgStyle, (typeof BG_STYLES)[BgStyle]][]).map(
                      ([bgKey, bgMeta]) => (
                        <button
                          key={bgKey}
                          type="button"
                          onClick={() => handleSwitchBgTheme(bgKey)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                            activeSlide.bgStyle === bgKey
                              ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                              : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621] hover:bg-[#EFECE4]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                            style={{ background: bgMeta.swatch }}
                          />
                          <span>{bgMeta.label.replace(/^[^\s]+\s/, '')}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Inner Window Color Swatches */}
                {activeSlide.preset !== 'minimal' &&
                  !(
                    activeSlide.preset === 'no-photo' &&
                    activeSlide.textCardTheme === 'minimal-luxe'
                  ) && (
                    <div className="space-y-1.5 pt-2 border-t border-[#F0ECE1]">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                        Inner Window / Card Color
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          Object.entries(BG_STYLES) as [BgStyle, (typeof BG_STYLES)[BgStyle]][]
                        ).map(([winKey, winMeta]) => {
                          const activeWin = activeSlide.windowStyle || 'pure-white';
                          return (
                            <button
                              key={winKey}
                              type="button"
                              onClick={() => handleSwitchWindowTheme(winKey)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                                activeWin === winKey
                                  ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                                  : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#1C2621] hover:bg-[#EFECE4]'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                                style={{ background: winMeta.swatch }}
                              />
                              <span>{winMeta.label.replace(/^[^\s]+\s/, '')}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Photo Window Height, Zoom & Dim Sliders */}
                {geom.hasPhoto && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F0ECE1]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      Photo Fit &amp; Lighting
                    </div>
                    {activeSlide.preset !== 'minimal' && activeSlide.preset !== 'no-photo' && (
                      <label className="block text-xs font-bold text-[#3E4D45]">
                        <div className="flex justify-between mb-1">
                          <span>Photo Window Height</span>
                          <span className="text-[#D46A4E]">{activeSlide.archHeight}px</span>
                        </div>
                        <input
                          type="range"
                          min={480}
                          max={ratio === 'story' ? 1480 : ratio === 'square' ? 720 : 1020}
                          value={activeSlide.archHeight}
                          onChange={(e) =>
                            updateActiveSlide({ archHeight: Number(e.target.value) })
                          }
                          className="w-full accent-[#2E5A44]"
                        />
                      </label>
                    )}
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
                          <span className="text-[#D46A4E]">
                            {Math.round(activeSlide.photoDim * 100)}%
                          </span>
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
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 2: SELECTED PILL INSPECTOR ==================== */}
            {inspectorTab === 'pill' && (
              <div className="space-y-3">
                {/* Quick Pill Selector Row Inside Panel */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      Select Pill to Style
                    </span>
                    <button
                      type="button"
                      onClick={addCustomText}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#F6F4EE] border border-[#DDD6C7] text-[#D46A4E] touch-manipulation cursor-pointer"
                    >
                      + Custom Pill
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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
                          className={`px-2.5 py-1 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                            selectedLayerId === l.id
                              ? 'bg-[#D46A4E] text-white border-[#D46A4E]'
                              : 'bg-[#F6F4EE] text-[#1C2621] border-[#DDD6C7] hover:bg-[#EFECE4]'
                          }`}
                        >
                          {l.label}
                        </button>
                      ))}
                  </div>
                </div>

                {selectedLayer ? (
                  <div className="space-y-3 pt-2 border-t border-[#F0ECE1]">
                    {/* Text Editor + Font / Center / Hide Actions */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="text-[11px] font-extrabold text-[#D46A4E]">
                          ✏️ Editing: {selectedLayer.label}
                        </span>
                        <div className="flex items-center gap-1">
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
                            className="px-2.5 py-1 rounded-lg bg-[#F6F4EE] text-xs font-extrabold border border-[#DDD6C7] touch-manipulation cursor-pointer"
                            title="Cycle font (Sans / Serif / Italic Serif)"
                          >
                            Aa{' '}
                            {selectedLayer.font === 'sans'
                              ? 'Sans'
                              : selectedLayer.font === 'serif'
                                ? 'Serif'
                                : 'Italic'}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateLayer(selectedLayer.id, { x: 540 }, true)}
                            className="px-2 py-1 rounded-lg bg-[#F6F4EE] text-xs font-extrabold border border-[#DDD6C7] touch-manipulation cursor-pointer"
                            title="Center horizontally"
                          >
                            ┼ Center
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              updateLayer(selectedLayer.id, { visible: false }, true);
                              setSelectedLayerId(null);
                              setEditingLayerId(null);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#FEE2E2] text-[#991B1B] text-xs font-extrabold touch-manipulation cursor-pointer"
                            title="Hide pill"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={selectedLayer.text.includes('\n') ? 3 : 2}
                        value={selectedLayer.text}
                        onChange={(e) => updateLayer(selectedLayer.id, { text: e.target.value })}
                        placeholder="Edit pill text..."
                        className="w-full rounded-xl border border-[#D46A4E] bg-[#FCFBF8] px-3 py-2 text-base sm:text-xs font-bold outline-none resize-y"
                      />
                    </div>

                    {/* 4 Precision Sliders (Opacity, Text Size, Width, Height) */}
                    <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#F0ECE1]">
                      <label className="block text-[11px] font-bold text-[#3E4D45]">
                        <div className="flex justify-between mb-0.5">
                          <span>Pill Opacity</span>
                          <span className="text-[#D46A4E]">
                            {PILL_PALETTE[selectedLayer.pill]?.hasBg
                              ? `${Math.round((selectedLayer.pillOpacity ?? 1) * 100)}%`
                              : 'No Pill'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          disabled={!PILL_PALETTE[selectedLayer.pill]?.hasBg}
                          value={selectedLayer.pillOpacity ?? 1}
                          onChange={(e) =>
                            updateLayer(selectedLayer.id, { pillOpacity: Number(e.target.value) })
                          }
                          className="w-full accent-[#2E5A44] disabled:opacity-40"
                        />
                      </label>
                      <label className="block text-[11px] font-bold text-[#3E4D45]">
                        <div className="flex justify-between mb-0.5">
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
                        <div className="flex justify-between mb-0.5">
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
                        <div className="flex justify-between mb-0.5">
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

                    {/* Pill Color Swatches — Wrapped Grid */}
                    <div className="pt-2 border-t border-[#F0ECE1] space-y-1.5">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                        Pill Background Color
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(
                          Object.entries(PILL_PALETTE) as [
                            PillStyle,
                            (typeof PILL_PALETTE)[PillStyle]
                          ][]
                        ).map(([pKey, pMeta]) => {
                          const isActive = selectedLayer.pill === pKey;
                          return (
                            <button
                              key={pKey}
                              type="button"
                              onClick={() => updateLayer(selectedLayer.id, { pill: pKey }, true)}
                              title={`Pill Color: ${pMeta.label}`}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold touch-manipulation cursor-pointer transition ${
                                isActive
                                  ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                                  : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#3E4D45] hover:bg-[#EFECE4]'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0"
                                style={{
                                  background: pMeta.hasBg
                                    ? pMeta.swatch
                                    : pKey === 'none-dark'
                                      ? 'repeating-linear-gradient(45deg,#fff,#fff 3px,#1C2621 3px,#1C2621 5px)'
                                      : 'repeating-linear-gradient(45deg,#1C2621,#1C2621 3px,#fff 3px,#fff 5px)'
                                }}
                              />
                              <span>{pMeta.shortLabel}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Text Color Swatches — Wrapped Grid */}
                    <div className="pt-2 border-t border-[#F0ECE1] space-y-1.5">
                      <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                        Text Color
                      </div>
                      <div className="flex flex-wrap gap-1.5">
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
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold touch-manipulation cursor-pointer transition ${
                                isActive
                                  ? 'bg-[#E4EFE8] border-[#2E5A44] text-[#2E5A44] ring-1 ring-[#2E5A44]'
                                  : 'bg-[#F6F4EE] border-[#DDD6C7] text-[#3E4D45] hover:bg-[#EFECE4]'
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
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-[#F6F4EE] border border-[#E2DCCD] p-4 text-center space-y-2">
                    <div className="text-xs font-extrabold text-[#1C2621]">
                      👆 Tap any pill above or directly on the photo to customize it!
                    </div>
                    <p className="text-[11px] text-[#5C6B63]">
                      Once selected, use the <strong>✥ offset crosshair</strong> off to the side of
                      the pill to slide it around without covering the text with your finger.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB 3: SOURCE CONTENT & PHOTOS ==================== */}
            {inspectorTab === 'source' && (
              <div className="space-y-3">
                {/* Content Mode Switcher */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    What Are We Posting Today?
                  </div>
                  <div className="flex flex-wrap gap-1.5">
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
                        onClick={() => handleSelectContentMode(modeKey)}
                        className={`px-3 py-1.5 rounded-full text-xs font-extrabold border touch-manipulation cursor-pointer transition ${
                          contentMode === modeKey
                            ? 'bg-[#2E5A44] text-white border-[#2E5A44]'
                            : 'bg-[#F6F4EE] text-[#3E4D45] border-[#DDD6C7] hover:bg-[#EFECE4]'
                        }`}
                      >
                        {modeLabel}
                      </button>
                    ))}
                  </div>
                </div>

                {(contentMode === 'puppies' || contentMode === 'studs') && (
                  <div className="space-y-3 pt-2 border-t border-[#F0ECE1]">
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
                          className="text-xs font-bold text-[#D46A4E] underline touch-manipulation cursor-pointer"
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
                      className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-base sm:text-sm font-bold"
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
                        onClick={() =>
                          selectedDog && loadDogIntoCard(selectedDog, undefined, undefined, false)
                        }
                        className="flex-1 py-2 px-2.5 rounded-xl bg-[#E4EFE8] border border-[#2E5A44]/30 text-[#2E5A44] text-xs font-extrabold touch-manipulation cursor-pointer"
                      >
                        ✓ Apply {selectedDog?.name} to Slide {activeSlideIdx + 1}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetActiveSlideToModeDefault}
                        className="py-2 px-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#5C6B63] text-xs font-bold touch-manipulation cursor-pointer"
                        title="Reset slide to default template & theme"
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
                                    preset:
                                      activeSlide.preset === 'no-photo'
                                        ? 'minimal'
                                        : activeSlide.preset,
                                    dogId: selectedDog?.id,
                                    customPhotoDogId: undefined,
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
                  </div>
                )}

                {contentMode === 'glossary' && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F0ECE1]">
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
                      className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-base sm:text-sm font-bold"
                    >
                      {GLOSSARY_ITEMS.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.title} ({g.badge.replace('🧬 ', '')})
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const item =
                            GLOSSARY_ITEMS.find((g) => g.id === selectedGlossaryId) ||
                            GLOSSARY_ITEMS[0];
                          if (item) loadTopicIntoCard(item);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold touch-manipulation cursor-pointer"
                      >
                        ✓ Load Term onto Slide {activeSlideIdx + 1}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetActiveSlideToModeDefault}
                        className="py-2 px-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#5C6B63] text-xs font-bold touch-manipulation cursor-pointer"
                        title="Reset slide to Coat & DNA default template"
                      >
                        🔄 Reset
                      </button>
                    </div>
                  </div>
                )}

                {contentMode === 'standards' && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F0ECE1]">
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
                      className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2.5 text-base sm:text-sm font-bold"
                    >
                      {STANDARDS_AND_BLOG_ITEMS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const item =
                            STANDARDS_AND_BLOG_ITEMS.find((s) => s.id === selectedStandardId) ||
                            STANDARDS_AND_BLOG_ITEMS[0];
                          if (item) loadTopicIntoCard(item);
                        }}
                        className="flex-1 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold touch-manipulation cursor-pointer"
                      >
                        ✓ Load Guide onto Slide {activeSlideIdx + 1}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetActiveSlideToModeDefault}
                        className="py-2 px-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#5C6B63] text-xs font-bold touch-manipulation cursor-pointer"
                        title="Reset slide to Standards & Blog default template"
                      >
                        🔄 Reset
                      </button>
                    </div>
                  </div>
                )}

                {contentMode === 'didyouknow' && (
                  <div className="space-y-2.5 pt-2 border-t border-[#F0ECE1]">
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
                        className="px-3 py-1 rounded-full bg-[#F4D37E] text-[#1C2621] text-xs font-extrabold touch-manipulation cursor-pointer"
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
                      className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-base sm:text-xs font-bold"
                    >
                      {DID_YOU_KNOW_ITEMS.map((item, i) => (
                        <option key={item.id} value={i}>
                          {item.badge} — {item.title}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          loadTopicIntoCard(
                            DID_YOU_KNOW_ITEMS[selectedDykIndex % DID_YOU_KNOW_ITEMS.length]
                          )
                        }
                        className="flex-1 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold touch-manipulation cursor-pointer"
                      >
                        ✓ Load Fact onto Slide {activeSlideIdx + 1}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetActiveSlideToModeDefault}
                        className="py-2 px-2.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-[#5C6B63] text-xs font-bold touch-manipulation cursor-pointer"
                        title="Reset slide to Did You Know default template"
                      >
                        🔄 Reset
                      </button>
                    </div>

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
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border touch-manipulation cursor-pointer ${
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
                        placeholder="Optional topic (e.g. 'potty training stubborn Frenchies')..."
                        className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-base sm:text-xs font-medium"
                      />
                      <button
                        type="button"
                        disabled={aiLoading}
                        onClick={() => handleGenerateAiCardAndCaption()}
                        className="w-full py-2.5 rounded-xl bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm disabled:opacity-60 touch-manipulation cursor-pointer"
                      >
                        {aiLoading
                          ? '✨ Creating Card & Caption...'
                          : '✨ Generate New Card + Caption with AI'}
                      </button>
                      {aiError && (
                        <div className="text-[11px] text-[#991B1B] bg-[#FEE2E2] px-3 py-2 rounded-xl font-medium">
                          {aiError}
                        </div>
                      )}

                      {savedAiCards.length > 0 && (
                        <div className="pt-2 border-t border-[#F0ECE1] space-y-1.5">
                          <div className="text-[11px] font-extrabold text-[#2E5A44]">
                            📌 Recent AI Cards (Tap to Reload Anytime)
                          </div>
                          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                            {savedAiCards.map((entry) => (
                              <button
                                key={entry.item.id}
                                type="button"
                                onClick={() => {
                                  loadTopicIntoCard(entry.item);
                                  if (entry.caption) setCaptionText(entry.caption);
                                }}
                                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-[#F6F4EE] hover:bg-[#E4EFE8] border border-[#DDD6C7] text-xs font-bold text-[#1C2621] truncate touch-manipulation cursor-pointer transition"
                              >
                                {entry.item.badge} — {entry.item.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 1-Tap Puppy / Sire Background Photo Overlay for Topic & AI Cards! */}
                {contentMode !== 'puppies' && contentMode !== 'studs' && (
                  <div className="border-t border-[#F0ECE1] pt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                        🐾 Overlay Text Over a Dimmed Puppy / Sire Photo
                      </span>
                      {activeSlide.preset !== 'no-photo' && (
                        <button
                          type="button"
                          onClick={() => handleSwitchPreset('no-photo')}
                          className="text-[11px] font-bold text-[#991B1B] underline touch-manipulation cursor-pointer"
                        >
                          Back to Text Card
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {allDogs
                        .filter((d) => Boolean(d.image))
                        .slice(0, 12)
                        .map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              const nextPreset: FramePreset =
                                activeSlide.preset === 'no-photo' ? 'minimal' : activeSlide.preset;
                              const adjustedLayers = activeSlide.layers.map((l) => {
                                if (l.pill === 'none-dark') {
                                  return { ...l, pill: 'none-light' as PillStyle };
                                }
                                if (
                                  l.id === 'body' &&
                                  (l.pill === 'white' || l.pill === 'cream' || l.pill === 'oat')
                                ) {
                                  return { ...l, pill: 'frosted' as PillStyle };
                                }
                                return l;
                              });
                              updateActiveSlide(
                                {
                                  preset: nextPreset,
                                  photoSrc: d.image || '',
                                  photoDim:
                                    activeSlide.photoDim >= 0.2 ? activeSlide.photoDim : 0.48,
                                  panX: 0,
                                  panY: 0,
                                  layers: adjustedLayers
                                },
                                true
                              );
                            }}
                            title={`Overlay card text on ${d.name}`}
                            className={`flex flex-col items-center gap-0.5 touch-manipulation cursor-pointer ${
                              activeSlide.photoSrc === d.image && activeSlide.preset !== 'no-photo'
                                ? 'opacity-100'
                                : 'opacity-85 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={d.image}
                              alt={d.name}
                              className={`w-12 h-12 rounded-xl object-cover border-2 ${
                                activeSlide.photoSrc === d.image &&
                                activeSlide.preset !== 'no-photo'
                                  ? 'border-[#2E5A44] ring-2 ring-[#CFE2D7]'
                                  : 'border-[#DDD6C7]'
                              }`}
                            />
                            <span className="text-[10px] font-bold text-[#3E4D45] max-w-[54px] truncate">
                              {d.name}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* Camera Roll Upload & Direct Link */}
                <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
                  <label className="w-full flex items-center justify-center gap-2 bg-[#F6F4EE] border-2 border-dashed border-[#BDB5A4] px-4 py-2.5 rounded-2xl text-xs font-bold cursor-pointer hover:bg-[#EFECE3]">
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
                            const isDogMode =
                              contentMode === 'puppies' || contentMode === 'studs';
                            updateActiveSlide(
                              {
                                preset:
                                  activeSlide.preset === 'no-photo'
                                    ? 'minimal'
                                    : activeSlide.preset,
                                ...(isDogMode && selectedDog
                                  ? { dogId: selectedDog.id, customPhotoDogId: selectedDog.id }
                                  : {}),
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

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(directShareUrl);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#E4EFE8] border border-[#2E5A44]/30 text-[#2E5A44] text-xs font-extrabold touch-manipulation cursor-pointer"
                  >
                    {copiedLink
                      ? '✓ Direct Preview Link Copied!'
                      : '🔗 Copy Direct Website Link (For DMs / Stories)'}
                  </button>
                </div>
              </div>
            )}

            {/* ==================== TAB 4: SHOW/HIDE PILLS, BULK TEXT & STAMPS ==================== */}
            {inspectorTab === 'fields' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#2E5A44]">
                      Tap to Toggle Pills
                    </span>
                    <button
                      type="button"
                      onClick={addCustomText}
                      className="text-xs font-extrabold text-[#D46A4E] bg-[#F6F4EE] px-2.5 py-1 rounded-full border border-[#E2DCCD] touch-manipulation cursor-pointer"
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
                        className={`px-2.5 py-1 rounded-full text-xs font-bold border touch-manipulation cursor-pointer transition ${
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
                    Quick-Edit Visible Text (Slide {activeSlideIdx + 1})
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
                          className={`flex-1 rounded-xl border px-2.5 py-1.5 text-base sm:text-xs font-medium ${
                            selectedLayerId === layer.id
                              ? 'border-[#D46A4E] bg-white ring-2 ring-[#D46A4E]/20'
                              : 'border-[#DDD6C7] bg-[#FCFBF8]'
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLayerId(layer.id);
                            setInspectorTab('pill');
                          }}
                          title="Style pill colors & size"
                          className="px-2 py-1.5 rounded-xl bg-[#F6F4EE] border border-[#DDD6C7] text-xs font-bold text-[#2E5A44] touch-manipulation cursor-pointer"
                        >
                          🎨
                        </button>
                        <button
                          type="button"
                          onClick={() => updateLayer(layer.id, { visible: false }, true)}
                          className="px-2 py-1.5 rounded-xl bg-[#F6F4EE] text-xs font-bold text-[#5C6B63] hover:text-[#991B1B] touch-manipulation cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>

                {/* 1-Tap Status Stamps & Stickers Combined Right Here! */}
                <div className="border-t border-[#F0ECE1] pt-2.5 space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    🏷️ 1-Tap Status Stamps &amp; Stickers
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {STAMP_BADGES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => applyStampBadge(st)}
                        className="px-2.5 py-1.5 rounded-full text-xs font-extrabold bg-[#F6F4EE] border border-[#DDD6C7] hover:bg-[#E4EFE8] touch-manipulation cursor-pointer transition"
                      >
                        {st.text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB 5: SLIDES & SAVED LAYOUTS ==================== */}
            {inspectorTab === 'layouts' && (
              <div className="space-y-3">
                {/* Multi-Slide Carousel Controls */}
                <div className="space-y-2">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    Carousel Slides ({slides.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {slides.map((s, idx) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setActiveSlideIdx(idx);
                          setSelectedLayerId(null);
                          setEditingLayerId(null);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold touch-manipulation cursor-pointer transition ${
                          idx === activeSlideIdx
                            ? 'bg-[#2E5A44] text-white'
                            : 'bg-[#F6F4EE] text-[#5C6B63] border border-[#DDD6C7]'
                        }`}
                      >
                        Slide {idx + 1}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={addNewDefaultSlide}
                      className="py-2 px-3 rounded-xl text-xs font-extrabold bg-[#E4EFE8] text-[#2E5A44] border border-[#2E5A44]/30 touch-manipulation cursor-pointer"
                    >
                      + Add Fresh Slide
                    </button>
                    <button
                      type="button"
                      onClick={duplicateCurrentSlide}
                      className="py-2 px-3 rounded-xl text-xs font-extrabold bg-[#F6F4EE] text-[#1C2621] border border-[#DDD6C7] touch-manipulation cursor-pointer"
                    >
                      ⧉ Duplicate Slide
                    </button>
                    <button
                      type="button"
                      onClick={handleBuildAutoCarousel}
                      className="py-2 px-3 rounded-xl text-xs font-extrabold bg-[#F4D37E] text-[#1C2621] border border-[#E2BE62] touch-manipulation cursor-pointer"
                    >
                      ✨ Auto 3-Slide Set
                    </button>
                    {slides.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleExportSlides(true, false)}
                        className="py-2 px-3 rounded-xl text-xs font-extrabold bg-[#D46A4E] text-white touch-manipulation cursor-pointer"
                      >
                        📚 Export All ({slides.length})
                      </button>
                    )}
                  </div>
                </div>

                {/* Saved Custom Go-To Layouts */}
                <div className="border-t border-[#F0ECE1] pt-3 space-y-2.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#2E5A44]">
                    💾 Saved Go-To Layouts ({savedLayouts.length})
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      placeholder="e.g. Lindsey's Go-To Minimal"
                      className="flex-1 rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-base sm:text-xs font-medium"
                    />
                    <button
                      type="button"
                      onClick={handleSaveLayoutPreset}
                      className="px-3.5 py-2 rounded-xl bg-[#2E5A44] text-white text-xs font-extrabold touch-manipulation cursor-pointer"
                    >
                      💾 Save
                    </button>
                  </div>
                  {savedLayouts.length > 0 ? (
                    <div className="space-y-1.5">
                      {savedLayouts.map((sl) => (
                        <div
                          key={sl.id}
                          className="flex items-center justify-between bg-[#F6F4EE] border border-[#E2DCCD] rounded-xl px-3 py-2"
                        >
                          <button
                            type="button"
                            onClick={() => handleApplySavedLayout(sl)}
                            className="text-xs font-extrabold text-[#1C2621] text-left flex-1 hover:text-[#2E5A44] touch-manipulation cursor-pointer"
                          >
                            ✨ {sl.name}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedLayout(sl.id)}
                            className="text-xs font-bold text-[#991B1B] px-2 touch-manipulation cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-[#5C6B63]">
                      Save your favorite frame, color &amp; pill setups here to reuse on any puppy
                      in 1 tap.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB 6: AI CAPTION & DIRECT LINK ==================== */}
            {inspectorTab === 'caption' && (
              <div className="space-y-2.5">
                <div className="space-y-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateAiCaption()}
                    placeholder="Tell AI what to say (e.g., 'ask followers to guess coat color')..."
                    className="w-full rounded-xl border border-[#DDD6C7] bg-[#FCFBF8] px-3 py-2 text-base sm:text-xs font-medium"
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
                        className="px-2.5 py-1 rounded-full bg-[#F6F4EE] border border-[#E2DCCD] text-[11px] font-bold text-[#3E4D45] hover:bg-[#E4EFE8] touch-manipulation cursor-pointer"
                      >
                        {presetIdea}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={aiLoading}
                    onClick={() => handleGenerateAiCaption()}
                    className="w-full py-2 rounded-xl bg-[#D46A4E] text-white text-xs font-extrabold shadow-sm disabled:opacity-60 touch-manipulation cursor-pointer"
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
                  className="w-full rounded-2xl border border-[#DDD6C7] bg-[#FCFBF8] p-2.5 text-base sm:text-xs font-medium leading-relaxed"
                />

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(captionText);
                      setCopiedCaption(true);
                      setTimeout(() => setCopiedCaption(false), 2000);
                    }}
                    className="py-2.5 rounded-full bg-[#2E5A44] text-white text-xs font-extrabold shadow-sm touch-manipulation cursor-pointer"
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
                    className="py-2.5 rounded-full bg-[#F6F4EE] border border-[#2E5A44] text-[#2E5A44] text-xs font-extrabold touch-manipulation cursor-pointer"
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
