import { createClient } from '@supabase/supabase-js';
import type {
  BrandThemeId,
  BrandThemeKit,
  CanvasRatio,
  ContentMode,
  FramePreset,
  PhotoOverlayLayer,
  SavedLayoutPreset,
  SlideState
} from '../pages/socialStudioPresets';

const SUPABASE_URL = 'https://phesicyzrddvediskbop.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_33VtkOkPtZVJTpYxx6N2Kg_agIQ5X4h';

export const VAULT_EMAIL = 'studio-vault@okcfrenchies.com';
export const VAULT_STORAGE_BUCKET = 'studio-media';
export const VAULT_AUTH_STORAGE_KEY = 'okcfrenchies_studio_vault_auth_v1';

const getEnv = (key: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string> }).env?.[key]) {
    return (import.meta as { env?: Record<string, string> }).env![key];
  }
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key] || '';
  }
  return '';
};

/** Derives the auth password from a simple 4+ digit quick PIN passcode. */
export const deriveVaultPassword = (pin: string): string => `okc-studio-vault-v1#${pin.trim()}`;

export const studioSupabase = createClient(
  getEnv('VITE_SUPABASE_URL') || SUPABASE_URL,
  getEnv('VITE_SUPABASE_ANON_KEY') || SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: VAULT_AUTH_STORAGE_KEY,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  }
);

export interface CloudProjectRecord {
  id: string;
  title: string;
  brandTheme?: BrandThemeId;
  contentMode: ContentMode;
  ratio: CanvasRatio;
  slideCount: number;
  isFavorite: boolean;
  captionText: string;
  thumbnailUrl?: string;
  renderedImageUrls: string[];
  slidesData: SlideState[];
  createdAt: string;
  updatedAt: string;
}

export interface StudioVaultPreferences {
  favoritePresets: FramePreset[];
  customThemes: BrandThemeKit[];
  cloudUploads: string[];
}

export interface VaultHydrationPayload {
  templates: SavedLayoutPreset[];
  projects: CloudProjectRecord[];
  preferences: StudioVaultPreferences;
}

const generateSafeUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `proj-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const hashStringShort = (input: string): string => {
  let h1 = 0x811c9dc5;
  let h2 = 0x9e3779b9;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193);
    h2 ^= c;
    h2 = Math.imul(h2, 0x85ebca6b);
  }
  return `${(h1 >>> 0).toString(36)}${(h2 >>> 0).toString(36)}-${input.length.toString(36)}`;
};

const dataUrlToBlob = (dataUrl: string): { blob: Blob; ext: string; mime: string } | null => {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/s);
  if (!match) return null;
  const mime = match[1].toLowerCase();
  const base64 = match[2];
  try {
    const bin = atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) {
      bytes[i] = bin.charCodeAt(i);
    }
    const ext = mime.includes('png')
      ? 'png'
      : mime.includes('webp')
        ? 'webp'
        : mime.includes('gif')
          ? 'gif'
          : 'jpg';
    return {
      blob: new Blob([bytes], { type: mime }),
      ext,
      mime
    };
  } catch {
    return null;
  }
};

/** Unlocks the Social Studio Cloud Vault with the PIN passcode. */
export const unlockStudioVault = async (
  pin: string
): Promise<{ ok: boolean; error?: string; userId?: string }> => {
  const clean = pin.trim();
  if (clean.length < 4) {
    return { ok: false, error: 'Enter your PIN passcode (at least 4 digits).' };
  }
  const { data, error } = await studioSupabase.auth.signInWithPassword({
    email: VAULT_EMAIL,
    password: deriveVaultPassword(clean)
  });
  if (error || !data.user) {
    const msg = error?.message || 'Unable to unlock Cloud Vault.';
    if (msg.toLowerCase().includes('invalid login credentials')) {
      return { ok: false, error: 'Incorrect PIN passcode. Please try again.' };
    }
    return { ok: false, error: msg };
  }
  return { ok: true, userId: data.user.id };
};

/** Updates the quick PIN passcode for the unlocked Studio Vault account. */
export const changeStudioVaultPin = async (
  newPin: string
): Promise<{ ok: boolean; error?: string }> => {
  const clean = newPin.trim();
  if (clean.length < 4) {
    return { ok: false, error: 'New PIN must be at least 4 digits or characters.' };
  }
  const { error } = await studioSupabase.auth.updateUser({
    password: deriveVaultPassword(clean)
  });
  if (error) {
    return { ok: false, error: error.message || 'Unable to update PIN.' };
  }
  return { ok: true };
};

/** Signs out of the Cloud Vault session on this browser. */
export const lockStudioVault = async (): Promise<void> => {
  await studioSupabase.auth.signOut();
};

/** Returns the active unlocked Vault user ID, or null if locked. */
export const getVaultUserId = async (): Promise<string | null> => {
  const { data } = await studioSupabase.auth.getSession();
  return data.session?.user?.id ?? null;
};

/** Subscribes to Cloud Vault lock/unlock state changes. */
export const onVaultAuthChange = (
  cb: (unlocked: boolean, userId: string | null) => void
): (() => void) => {
  const {
    data: { subscription }
  } = studioSupabase.auth.onAuthStateChange((_event, session) => {
    cb(Boolean(session?.user), session?.user?.id ?? null);
  });
  return () => subscription.unsubscribe();
};

/** Creates a compact JPEG thumbnail Blob from a rendered PNG Blob. */
export const createThumbnailBlobFromBlob = (
  pngBlob: Blob,
  maxDim = 380,
  quality = 0.82
): Promise<Blob | null> =>
  new Promise((resolve) => {
    const objUrl = URL.createObjectURL(pngBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth || 1080;
        const h = img.naturalHeight || 1350;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        const tw = Math.max(1, Math.round(w * scale));
        const th = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objUrl);
          resolve(null);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(img, 0, 0, tw, th);
        canvas.toBlob(
          (thumb) => {
            URL.revokeObjectURL(objUrl);
            resolve(thumb);
          },
          'image/jpeg',
          quality
        );
      } catch {
        URL.revokeObjectURL(objUrl);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(null);
    };
    img.src = objUrl;
  });

/** Creates a tiny local preview data URL when saving templates before Cloud Vault unlock. */
export const createThumbnailDataUrlFromBlob = (
  pngBlob: Blob,
  maxDim = 240,
  quality = 0.72
): Promise<string | undefined> =>
  new Promise((resolve) => {
    const objUrl = URL.createObjectURL(pngBlob);
    const img = new Image();
    img.onload = () => {
      try {
        const w = img.naturalWidth || 1080;
        const h = img.naturalHeight || 1350;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        const tw = Math.max(1, Math.round(w * scale));
        const th = Math.max(1, Math.round(h * scale));
        const canvas = document.createElement('canvas');
        canvas.width = tw;
        canvas.height = th;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objUrl);
          resolve(undefined);
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, tw, th);
        ctx.drawImage(img, 0, 0, tw, th);
        const url = canvas.toDataURL('image/jpeg', quality);
        URL.revokeObjectURL(objUrl);
        resolve(url);
      } catch {
        URL.revokeObjectURL(objUrl);
        resolve(undefined);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      resolve(undefined);
    };
    img.src = objUrl;
  });

/** Uploads a Blob to Supabase Storage under the authenticated user's folder. */
export const uploadVaultBlob = async (
  userId: string,
  subpath: string,
  blob: Blob,
  contentType: string
): Promise<string | null> => {
  const fullPath = `${userId}/${subpath.replace(/^\/+/, '')}`;
  const { error } = await studioSupabase.storage.from(VAULT_STORAGE_BUCKET).upload(fullPath, blob, {
    upsert: true,
    contentType,
    cacheControl: '31536000'
  });
  if (error) {
    console.warn('Studio Vault storage upload failed:', error.message);
    return null;
  }
  const { data } = studioSupabase.storage.from(VAULT_STORAGE_BUCKET).getPublicUrl(fullPath);
  return data.publicUrl || null;
};

/** Uploads base64 data:image/* strings once using a content hash and returns the public HTTPS URL. */
export const uploadDataUrlIfNeeded = async (userId: string, src: string): Promise<string> => {
  if (!src || !src.startsWith('data:image/')) return src;
  const decoded = dataUrlToBlob(src);
  if (!decoded) return src;
  const hash = hashStringShort(src);
  const url = await uploadVaultBlob(
    userId,
    `uploads/img-${hash}.${decoded.ext}`,
    decoded.blob,
    decoded.mime
  );
  return url || src;
};

const sanitizeOverlaysMediaToCloud = async (
  userId: string,
  overlays: PhotoOverlayLayer[] | undefined
): Promise<PhotoOverlayLayer[] | undefined> => {
  if (!overlays || overlays.length === 0) return overlays;
  const next: PhotoOverlayLayer[] = [];
  for (const ov of overlays) {
    if (ov.mediaType !== 'video' && ov.src?.startsWith('data:image/')) {
      const uploadedUrl = await uploadDataUrlIfNeeded(userId, ov.src);
      next.push({ ...ov, src: uploadedUrl });
    } else {
      next.push({ ...ov });
    }
  }
  return next;
};

/** Converts any base64 custom photos on slides or overlays to permanent Supabase Storage URLs. */
export const sanitizeSlidesMediaToCloud = async (
  userId: string,
  slides: SlideState[]
): Promise<SlideState[]> => {
  const out: SlideState[] = [];
  for (const s of slides) {
    const nextPhotoSrc = s.photoSrc?.startsWith('data:image/')
      ? await uploadDataUrlIfNeeded(userId, s.photoSrc)
      : s.photoSrc;
    const nextOverlays = await sanitizeOverlaysMediaToCloud(userId, s.photoOverlays);
    out.push({
      ...s,
      photoSrc: nextPhotoSrc,
      ...(nextOverlays ? { photoOverlays: nextOverlays } : {})
    });
  }
  return out;
};

interface DbTemplateRow {
  id: string;
  client_id: string;
  name: string;
  brand_theme: string | null;
  preset: string;
  ratio: string;
  is_favorite: boolean;
  thumbnail_url: string | null;
  template_data: SavedLayoutPreset;
  updated_at: string;
}

interface DbProjectRow {
  id: string;
  title: string;
  brand_theme: string | null;
  content_mode: ContentMode;
  ratio: CanvasRatio;
  slide_count: number;
  is_favorite: boolean;
  caption_text: string;
  thumbnail_url: string | null;
  rendered_image_urls: string[] | null;
  slides_data: SlideState[];
  created_at: string;
  updated_at: string;
}

interface DbPreferencesRow {
  favorite_presets: FramePreset[] | null;
  custom_themes: BrandThemeKit[] | null;
  cloud_uploads: string[] | null;
}

const mapDbTemplateToPreset = (row: DbTemplateRow): SavedLayoutPreset => {
  const data = (row.template_data || {}) as Partial<SavedLayoutPreset>;
  return {
    ...data,
    id: row.client_id || data.id || row.id,
    name: row.name || data.name || 'Saved Layout',
    brandTheme: row.brand_theme || data.brandTheme,
    preset: (row.preset || data.preset || 'arch') as FramePreset,
    bgStyle: (data.bgStyle || 'cream-editorial') as SavedLayoutPreset['bgStyle'],
    photoDim: typeof data.photoDim === 'number' ? data.photoDim : 0.14,
    archHeight: typeof data.archHeight === 'number' ? data.archHeight : 540,
    layers: Array.isArray(data.layers) ? data.layers : [],
    ratio: (row.ratio || data.ratio || 'feed') as CanvasRatio,
    isFavorite: row.is_favorite,
    thumbnailUrl: row.thumbnail_url || data.thumbnailUrl,
    cloudId: row.id,
    updatedAt: row.updated_at
  };
};

const mapDbProjectToRecord = (row: DbProjectRow): CloudProjectRecord => ({
  id: row.id,
  title: row.title,
  brandTheme: row.brand_theme || undefined,
  contentMode: (row.content_mode || 'puppies') as ContentMode,
  ratio: (row.ratio || 'feed') as CanvasRatio,
  slideCount: row.slide_count || (row.slides_data?.length ?? 1),
  isFavorite: Boolean(row.is_favorite),
  captionText: row.caption_text || '',
  thumbnailUrl: row.thumbnail_url || undefined,
  renderedImageUrls: Array.isArray(row.rendered_image_urls) ? row.rendered_image_urls : [],
  slidesData: Array.isArray(row.slides_data) ? row.slides_data : [],
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

/** Loads saved templates, finished projects, and studio preferences for the signed-in vault. */
export const fetchVaultAll = async (): Promise<VaultHydrationPayload | null> => {
  const userId = await getVaultUserId();
  if (!userId) return null;

  const [tplRes, projRes, prefRes] = await Promise.all([
    studioSupabase
      .from('studio_templates')
      .select('id, client_id, name, brand_theme, preset, ratio, is_favorite, thumbnail_url, template_data, updated_at')
      .order('is_favorite', { ascending: false })
      .order('updated_at', { ascending: false }),
    studioSupabase
      .from('studio_projects')
      .select('id, title, brand_theme, content_mode, ratio, slide_count, is_favorite, caption_text, thumbnail_url, rendered_image_urls, slides_data, created_at, updated_at')
      .order('is_favorite', { ascending: false })
      .order('updated_at', { ascending: false }),
    studioSupabase
      .from('studio_preferences')
      .select('favorite_presets, custom_themes, cloud_uploads')
      .eq('owner_id', userId)
      .maybeSingle()
  ]);

  if (tplRes.error) console.warn('Failed loading templates:', tplRes.error.message);
  if (projRes.error) console.warn('Failed loading projects:', projRes.error.message);
  if (prefRes.error) console.warn('Failed loading preferences:', prefRes.error.message);

  const prefRow = prefRes.data as DbPreferencesRow | null;
  return {
    templates: ((tplRes.data || []) as DbTemplateRow[]).map(mapDbTemplateToPreset),
    projects: ((projRes.data || []) as DbProjectRow[]).map(mapDbProjectToRecord),
    preferences: {
      favoritePresets: Array.isArray(prefRow?.favorite_presets) ? prefRow!.favorite_presets : [],
      customThemes: Array.isArray(prefRow?.custom_themes) ? prefRow!.custom_themes : [],
      cloudUploads: Array.isArray(prefRow?.cloud_uploads) ? prefRow!.cloud_uploads : []
    }
  };
};

/** Upserts a saved template (with optional slide PNG rendered to a JPEG thumbnail) into Supabase. */
export const upsertCloudTemplate = async (
  presetItem: SavedLayoutPreset,
  slidePngBlob?: Blob | null
): Promise<SavedLayoutPreset | null> => {
  const userId = await getVaultUserId();
  if (!userId) return null;

  let thumbUrl =
    presetItem.thumbnailUrl && presetItem.thumbnailUrl.startsWith('http')
      ? presetItem.thumbnailUrl
      : undefined;

  if (slidePngBlob) {
    const thumbBlob = await createThumbnailBlobFromBlob(slidePngBlob, 380, 0.82);
    if (thumbBlob) {
      const uploaded = await uploadVaultBlob(
        userId,
        `templates/${presetItem.id}-thumb-${Date.now()}.jpg`,
        thumbBlob,
        'image/jpeg'
      );
      if (uploaded) thumbUrl = uploaded;
    }
  } else if (presetItem.thumbnailUrl?.startsWith('data:image/')) {
    const decoded = dataUrlToBlob(presetItem.thumbnailUrl);
    if (decoded) {
      const uploaded = await uploadVaultBlob(
        userId,
        `templates/${presetItem.id}-thumb-${Date.now()}.${decoded.ext}`,
        decoded.blob,
        decoded.mime
      );
      if (uploaded) thumbUrl = uploaded;
    }
  }

  const sanitizedOverlays = await sanitizeOverlaysMediaToCloud(userId, presetItem.photoOverlays);
  const nowIso = new Date().toISOString();
  const cleanTemplateData: SavedLayoutPreset = {
    ...presetItem,
    ...(sanitizedOverlays ? { photoOverlays: sanitizedOverlays } : {}),
    thumbnailUrl: thumbUrl,
    isFavorite: presetItem.isFavorite ?? true,
    updatedAt: nowIso
  };

  const { data, error } = await studioSupabase
    .from('studio_templates')
    .upsert(
      {
        owner_id: userId,
        client_id: presetItem.id,
        name: presetItem.name,
        brand_theme: presetItem.brandTheme || null,
        preset: presetItem.preset,
        ratio: presetItem.ratio || 'feed',
        is_favorite: presetItem.isFavorite ?? true,
        thumbnail_url: thumbUrl || null,
        template_data: cleanTemplateData,
        updated_at: nowIso
      },
      { onConflict: 'owner_id,client_id' }
    )
    .select('id, client_id, name, brand_theme, preset, ratio, is_favorite, thumbnail_url, template_data, updated_at')
    .single();

  if (error || !data) {
    console.warn('upsertCloudTemplate failed:', error?.message);
    return null;
  }
  return mapDbTemplateToPreset(data as DbTemplateRow);
};

/** Migrates any unsynced localStorage saved layouts into the authenticated Cloud Vault. */
export const syncLocalTemplatesToCloud = async (
  localPresets: SavedLayoutPreset[],
  existingCloudClientIds: Set<string>
): Promise<SavedLayoutPreset[]> => {
  const synced: SavedLayoutPreset[] = [];
  for (const item of localPresets) {
    if (existingCloudClientIds.has(item.id)) continue;
    const res = await upsertCloudTemplate(item);
    if (res) synced.push(res);
  }
  return synced;
};

/** Toggles favorite star state on a cloud-saved template. */
export const toggleCloudTemplateFavorite = async (
  clientId: string,
  isFavorite: boolean
): Promise<boolean> => {
  const userId = await getVaultUserId();
  if (!userId) return false;
  const { error } = await studioSupabase
    .from('studio_templates')
    .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
    .eq('owner_id', userId)
    .eq('client_id', clientId);
  return !error;
};

/** Deletes a saved template from Supabase by its client_id. */
export const deleteCloudTemplate = async (clientId: string): Promise<boolean> => {
  const userId = await getVaultUserId();
  if (!userId) return false;
  const { error } = await studioSupabase
    .from('studio_templates')
    .delete()
    .eq('owner_id', userId)
    .eq('client_id', clientId);
  return !error;
};

/** Saves or updates a finished project, rendering full-res 1080px PNGs + thumbnail to Storage. */
export const saveCloudProject = async (params: {
  existingProjectId?: string | null;
  title: string;
  brandTheme?: BrandThemeId;
  contentMode: ContentMode;
  ratio: CanvasRatio;
  captionText: string;
  isFavorite: boolean;
  slides: SlideState[];
  renderSlide: (slide: SlideState) => Promise<Blob | null>;
  onProgress?: (label: string) => void;
}): Promise<{ project: CloudProjectRecord; sanitizedSlides: SlideState[] } | null> => {
  const userId = await getVaultUserId();
  if (!userId) return null;

  params.onProgress?.('Syncing custom photos...');
  const sanitizedSlides = await sanitizeSlidesMediaToCloud(userId, params.slides);
  const projectFolder = params.existingProjectId || generateSafeUuid();
  const stamp = Date.now();
  const renderedImageUrls: string[] = [];
  let thumbnailUrl: string | undefined;

  for (let i = 0; i < sanitizedSlides.length; i += 1) {
    params.onProgress?.(`Rendering HD slide ${i + 1} of ${sanitizedSlides.length}...`);
    const pngBlob = await params.renderSlide(sanitizedSlides[i]);
    if (pngBlob) {
      const slideUrl = await uploadVaultBlob(
        userId,
        `projects/${projectFolder}/slide-${i + 1}-${stamp}.png`,
        pngBlob,
        'image/png'
      );
      if (slideUrl) {
        renderedImageUrls.push(slideUrl);
      }
      if (i === 0) {
        const thumbBlob = await createThumbnailBlobFromBlob(pngBlob, 380, 0.82);
        if (thumbBlob) {
          const uploadedThumb = await uploadVaultBlob(
            userId,
            `projects/${projectFolder}/thumb-${stamp}.jpg`,
            thumbBlob,
            'image/jpeg'
          );
          if (uploadedThumb) thumbnailUrl = uploadedThumb;
        }
      }
    }
  }

  params.onProgress?.('Saving project to Cloud Vault...');
  const nowIso = new Date().toISOString();
  const cleanTitle = params.title.trim() || 'Untitled Studio Project';

  if (params.existingProjectId) {
    const { data, error } = await studioSupabase
      .from('studio_projects')
      .update({
        title: cleanTitle,
        brand_theme: params.brandTheme || null,
        content_mode: params.contentMode,
        ratio: params.ratio,
        slide_count: sanitizedSlides.length,
        is_favorite: params.isFavorite,
        caption_text: params.captionText || '',
        thumbnail_url: thumbnailUrl || renderedImageUrls[0] || null,
        rendered_image_urls: renderedImageUrls,
        slides_data: sanitizedSlides,
        updated_at: nowIso
      })
      .eq('owner_id', userId)
      .eq('id', params.existingProjectId)
      .select('id, title, brand_theme, content_mode, ratio, slide_count, is_favorite, caption_text, thumbnail_url, rendered_image_urls, slides_data, created_at, updated_at')
      .single();

    if (!error && data) {
      return {
        project: mapDbProjectToRecord(data as DbProjectRow),
        sanitizedSlides
      };
    }
  }

  const { data, error } = await studioSupabase
    .from('studio_projects')
    .insert({
      id: projectFolder,
      owner_id: userId,
      title: cleanTitle,
      brand_theme: params.brandTheme || null,
      content_mode: params.contentMode,
      ratio: params.ratio,
      slide_count: sanitizedSlides.length,
      is_favorite: params.isFavorite,
      caption_text: params.captionText || '',
      thumbnail_url: thumbnailUrl || renderedImageUrls[0] || null,
      rendered_image_urls: renderedImageUrls,
      slides_data: sanitizedSlides,
      updated_at: nowIso
    })
    .select('id, title, brand_theme, content_mode, ratio, slide_count, is_favorite, caption_text, thumbnail_url, rendered_image_urls, slides_data, created_at, updated_at')
    .single();

  if (error || !data) {
    console.warn('saveCloudProject failed:', error?.message);
    return null;
  }
  return {
    project: mapDbProjectToRecord(data as DbProjectRow),
    sanitizedSlides
  };
};

/** Toggles favorite star state on a cloud-saved project. */
export const toggleCloudProjectFavorite = async (
  projectId: string,
  isFavorite: boolean
): Promise<boolean> => {
  const userId = await getVaultUserId();
  if (!userId) return false;
  const { error } = await studioSupabase
    .from('studio_projects')
    .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
    .eq('owner_id', userId)
    .eq('id', projectId);
  return !error;
};

const extractStoragePath = (publicUrl: string | undefined, userId: string): string | null => {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${VAULT_STORAGE_BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  const path = decodeURIComponent(publicUrl.slice(idx + marker.length).split('?')[0]);
  return path.startsWith(`${userId}/`) ? path : null;
};

/** Deletes a saved finished project and best-effort removes its rendered PNGs from Storage. */
export const deleteCloudProject = async (project: CloudProjectRecord): Promise<boolean> => {
  const userId = await getVaultUserId();
  if (!userId) return false;

  const storagePaths = Array.from(
    new Set(
      [project.thumbnailUrl, ...project.renderedImageUrls]
        .map((u) => extractStoragePath(u, userId))
        .filter((p): p is string => Boolean(p))
    )
  );
  if (storagePaths.length > 0) {
    await studioSupabase.storage.from(VAULT_STORAGE_BUCKET).remove(storagePaths).catch(() => {});
  }

  const { error } = await studioSupabase
    .from('studio_projects')
    .delete()
    .eq('owner_id', userId)
    .eq('id', project.id);
  return !error;
};

/** Merges and persists studio preferences (starred built-in presets, custom themes, cloud uploads). */
export const saveVaultPreferences = async (
  patch: Partial<StudioVaultPreferences>
): Promise<void> => {
  const userId = await getVaultUserId();
  if (!userId) return;

  const { data: existing } = await studioSupabase
    .from('studio_preferences')
    .select('favorite_presets, custom_themes, cloud_uploads')
    .eq('owner_id', userId)
    .maybeSingle();

  const row = existing as DbPreferencesRow | null;
  const merged: StudioVaultPreferences = {
    favoritePresets:
      patch.favoritePresets !== undefined
        ? patch.favoritePresets
        : Array.isArray(row?.favorite_presets)
          ? row!.favorite_presets
          : [],
    customThemes:
      patch.customThemes !== undefined
        ? patch.customThemes
        : Array.isArray(row?.custom_themes)
          ? row!.custom_themes
          : [],
    cloudUploads:
      patch.cloudUploads !== undefined
        ? patch.cloudUploads
        : Array.isArray(row?.cloud_uploads)
          ? row!.cloud_uploads
          : []
  };

  await studioSupabase.from('studio_preferences').upsert(
    {
      owner_id: userId,
      favorite_presets: merged.favoritePresets,
      custom_themes: merged.customThemes,
      cloud_uploads: merged.cloudUploads,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'owner_id' }
  );
};
