import { useCallback, useEffect, useState } from 'react';

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  relativeTime: string;
  publishTime?: string;
  text: string;
  googleMapsUri?: string;
}

export type GoogleReviewsBrand = 'raw-and-paw' | 'okc-frenchies';

export interface GoogleReviewsState {
  loading: boolean;
  live: boolean;
  configured: boolean;
  businessName: string;
  rating: number;
  totalReviews: number;
  googleMapsUrl: string;
  reviews: GoogleReviewItem[];
  message?: string;
  refresh: () => void;
}

interface CachedPayload {
  ts: number;
  data: Omit<GoogleReviewsState, 'loading' | 'refresh'>;
}

const SESSION_CACHE_PREFIX = 'okcfrenchies_google_reviews_v1_';
const CLIENT_CACHE_TTL_MS = 15 * 60 * 1000;

const readSessionCache = (brand: GoogleReviewsBrand): CachedPayload['data'] | null => {
  try {
    const raw = sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${brand}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedPayload;
    if (parsed && Date.now() - parsed.ts < CLIENT_CACHE_TTL_MS && parsed.data) {
      return parsed.data;
    }
  } catch {
    // Ignore storage issues
  }
  return null;
};

const writeSessionCache = (
  brand: GoogleReviewsBrand,
  data: CachedPayload['data']
) => {
  try {
    sessionStorage.setItem(
      `${SESSION_CACHE_PREFIX}${brand}`,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {
    // Ignore quota errors
  }
};

export function useGoogleReviews(brand: GoogleReviewsBrand): GoogleReviewsState {
  const initialCached = readSessionCache(brand);
  const [state, setState] = useState<Omit<GoogleReviewsState, 'refresh'>>(() =>
    initialCached
      ? { ...initialCached, loading: false }
      : {
          loading: true,
          live: false,
          configured: false,
          businessName: brand === 'okc-frenchies' ? 'OKC Frenchies' : 'Raw & Paw Co.',
          rating: 5.0,
          totalReviews: brand === 'raw-and-paw' ? 42 : 0,
          googleMapsUrl:
            brand === 'okc-frenchies'
              ? 'https://www.google.com/maps/search/?api=1&query=OKC+Frenchies+Oklahoma+City+OK'
              : 'https://www.google.com/maps/search/?api=1&query=Raw+%26+Paw+Co+2150+S+Douglas+Blvd+Midwest+City+OK',
          reviews: []
        }
  );
  const [reloadTick, setReloadTick] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(false);

  const refresh = useCallback(() => {
    setForceRefresh(true);
    setReloadTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const cached = !forceRefresh ? readSessionCache(brand) : null;
    if (cached && !forceRefresh) {
      setState({ ...cached, loading: false });
      return () => {
        cancelled = true;
      };
    }

    setState((prev) => ({ ...prev, loading: true }));
    const qs = new URLSearchParams({ brand });
    if (forceRefresh) qs.set('refresh', '1');

    fetch(`/api/google-reviews?${qs.toString()}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data) => {
        if (cancelled) return;
        const next: CachedPayload['data'] = {
          live: Boolean(data?.live),
          configured: Boolean(data?.configured),
          businessName:
            String(data?.businessName || '') ||
            (brand === 'okc-frenchies' ? 'OKC Frenchies' : 'Raw & Paw Co.'),
          rating: Number(data?.rating) || 5.0,
          totalReviews: Number(data?.totalReviews) || 0,
          googleMapsUrl:
            String(data?.googleMapsUrl || '') ||
            'https://www.google.com/maps/search/?api=1&query=Raw+%26+Paw+Co+2150+S+Douglas+Blvd+Midwest+City+OK',
          reviews: Array.isArray(data?.reviews) ? data.reviews : [],
          message: typeof data?.message === 'string' ? data.message : undefined
        };
        writeSessionCache(brand, next);
        setState({ ...next, loading: false });
        setForceRefresh(false);
      })
      .catch(() => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          message: 'Unable to reach /api/google-reviews'
        }));
        setForceRefresh(false);
      });

    return () => {
      cancelled = true;
    };
  }, [brand, reloadTick, forceRefresh]);

  return { ...state, refresh };
}
