// Serverless & Vite dev helper for syncing live Google Reviews (Places API v1 + Legacy fallback)

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const PLACE_ID_CACHE = new Map();
const REVIEWS_CACHE = new Map();

const BRAND_DEFAULTS = {
  'raw-and-paw': {
    businessName: 'Raw & Paw Co.',
    searchQuery: 'Raw & Paw Co 2150 S Douglas Blvd Midwest City OK',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Raw+%26+Paw+Co+2150+S+Douglas+Blvd+Midwest+City+OK',
    fallbackRating: 5.0,
    fallbackTotalReviews: 42
  },
  'okc-frenchies': {
    businessName: 'OKC Frenchies',
    searchQuery: 'OKC Frenchies Oklahoma City OK',
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=OKC+Frenchies+Oklahoma+City+OK',
    fallbackRating: 5.0,
    fallbackTotalReviews: 0
  }
};

// Only real verbatim public customer quotes for Raw & Paw Co. (zero fabricated quotes).
// OKC Frenchies intentionally has [] fallback until live Google Places reviews are fetched.
const VERIFIED_FALLBACK_REVIEWS = {
  'raw-and-paw': [
    {
      id: 'rp-google-jalayne',
      authorName: 'Jalayne J.',
      rating: 5,
      relativeTime: 'Verified Google Review',
      text: 'Love the food, love the free shipping, & love the price. Worth every dime.',
      googleMapsUri:
        'https://www.google.com/maps/search/?api=1&query=Raw+%26+Paw+Co+2150+S+Douglas+Blvd+Midwest+City+OK'
    },
    {
      id: 'rp-google-tiquan',
      authorName: 'Tiquan P.',
      rating: 5,
      relativeTime: 'Verified Customer Review',
      text: "The wellness bundle is the way to go. Everything works hand and hand with each other. Plus you get a discount. Can't beat it. I highly recommend.",
      googleMapsUri: 'https://rawandpawco.com/collections/stacks'
    },
    {
      id: 'rp-google-mila',
      authorName: 'Mila Z.',
      rating: 5,
      relativeTime: 'Verified Customer Review',
      text: "Raw and Paw was recommended to me by the breeder I got my bully from... putting my baby on goat brew and their whole naturals line it's the only thing I will ever give him.",
      googleMapsUri: 'https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement'
    },
    {
      id: 'rp-google-courageous',
      authorName: 'Courageous G.',
      rating: 5,
      relativeTime: 'Verified Google Review',
      text: "I would have to rate your products a 10 unbelievably my dogs love and enjoy the products. They won't even eat their food without their protein and probiotics. Simply the best.",
      googleMapsUri:
        'https://www.google.com/maps/search/?api=1&query=Raw+%26+Paw+Co+2150+S+Douglas+Blvd+Midwest+City+OK'
    },
    {
      id: 'rp-google-brayden',
      authorName: 'Brayden',
      rating: 5,
      relativeTime: 'Verified Customer Review',
      text: "Switching my dogs to an all raw diet with Raw and Paw Co. completely changed my German Shepherd and my fluffy Frenchie's lives. They love it, they're so healthy, and they get SO excited for dinner time now!",
      googleMapsUri: 'https://rawandpawco.com'
    }
  ],
  'okc-frenchies': []
};

const normalizeBrand = (raw) =>
  raw === 'okc-frenchies' || raw === 'okcfrenchies' ? 'okc-frenchies' : 'raw-and-paw';

const readEnv = (envSource, ...keys) => {
  for (const k of keys) {
    const val = envSource?.[k];
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  return '';
};

const resolveExplicitPlaceId = (brand, envSource) => {
  if (brand === 'raw-and-paw') {
    return readEnv(
      envSource,
      'GOOGLE_PLACE_ID_RAW_PAW',
      'VITE_GOOGLE_PLACE_ID_RAW_PAW',
      'GOOGLE_PLACE_ID',
      'VITE_GOOGLE_PLACE_ID'
    );
  }
  return readEnv(
    envSource,
    'GOOGLE_PLACE_ID_OKC_FRENCHIES',
    'VITE_GOOGLE_PLACE_ID_OKC_FRENCHIES',
    'GOOGLE_PLACE_ID',
    'VITE_GOOGLE_PLACE_ID'
  );
};

async function findPlaceId(brand, apiKey) {
  if (PLACE_ID_CACHE.has(brand)) return PLACE_ID_CACHE.get(brand);
  const query = BRAND_DEFAULTS[brand].searchQuery;

  // Primary: Places API (New) Text Search
  try {
    const resp = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName'
      },
      body: JSON.stringify({ textQuery: query, pageSize: 1 })
    });
    if (resp.ok) {
      const data = await resp.json();
      const id = data?.places?.[0]?.id;
      if (id) {
        PLACE_ID_CACHE.set(brand, id);
        return id;
      }
    }
  } catch {
    // Fall back to Legacy Find Place API
  }

  // Fallback: Legacy Places Find Place From Text
  try {
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
      query
    )}&inputtype=textquery&fields=place_id,name&key=${encodeURIComponent(apiKey)}`;
    const resp = await fetch(legacyUrl);
    if (resp.ok) {
      const data = await resp.json();
      const id = data?.candidates?.[0]?.place_id;
      if (id) {
        PLACE_ID_CACHE.set(brand, id);
        return id;
      }
    }
  } catch {
    // Ignore lookup failure
  }

  return '';
}

const normalizeV1Reviews = (place, fallbackMapsUrl) => {
  const list = Array.isArray(place?.reviews) ? place.reviews : [];
  return list
    .map((r, idx) => {
      const text = String(r?.originalText?.text || r?.text?.text || '').trim();
      if (!text) return null;
      return {
        id: r?.name || `google-v1-${idx}`,
        authorName: String(r?.authorAttribution?.displayName || 'Google Reviewer').trim(),
        authorPhotoUrl: r?.authorAttribution?.photoUri || undefined,
        rating: Number(r?.rating) || 5,
        relativeTime: String(r?.relativePublishTimeDescription || 'Google Review').trim(),
        publishTime: r?.publishTime || undefined,
        text,
        googleMapsUri: r?.googleMapsUri || place?.googleMapsUri || fallbackMapsUrl
      };
    })
    .filter(Boolean);
};

const normalizeLegacyReviews = (result, fallbackMapsUrl) => {
  const list = Array.isArray(result?.reviews) ? result.reviews : [];
  return list
    .map((r, idx) => {
      const text = String(r?.text || '').trim();
      if (!text) return null;
      return {
        id: `google-legacy-${r?.time || idx}-${idx}`,
        authorName: String(r?.author_name || 'Google Reviewer').trim(),
        authorPhotoUrl: r?.profile_photo_url || undefined,
        rating: Number(r?.rating) || 5,
        relativeTime: String(r?.relative_time_description || 'Google Review').trim(),
        publishTime: r?.time ? new Date(r.time * 1000).toISOString() : undefined,
        text,
        googleMapsUri: r?.author_url || result?.url || fallbackMapsUrl
      };
    })
    .filter(Boolean);
};

/**
 * Fetches live Google Places reviews for `raw-and-paw` or `okc-frenchies`,
 * caching results for 1 hour and falling back cleanly when credentials are absent.
 */
export async function fetchGoogleReviewsPayload(queryParams = {}, envSource = process.env) {
  const brand = normalizeBrand(queryParams.brand);
  const forceRefresh = queryParams.refresh === '1' || queryParams.refresh === 'true';
  const meta = BRAND_DEFAULTS[brand];
  const apiKey = readEnv(
    envSource,
    'GOOGLE_PLACES_API_KEY',
    'VITE_GOOGLE_PLACES_API_KEY',
    'GOOGLE_MAPS_API_KEY'
  );

  const cached = REVIEWS_CACHE.get(brand);
  if (!forceRefresh && cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return cached.payload;
  }

  if (!apiKey) {
    return {
      configured: false,
      live: false,
      brand,
      businessName: meta.businessName,
      rating: meta.fallbackRating,
      totalReviews: meta.fallbackTotalReviews,
      googleMapsUrl: meta.googleMapsUrl,
      reviews: VERIFIED_FALLBACK_REVIEWS[brand],
      message:
        'Set GOOGLE_PLACES_API_KEY in .env.local or Vercel Environment Variables to auto-sync live Google Reviews.'
    };
  }

  const placeId = resolveExplicitPlaceId(brand, envSource) || (await findPlaceId(brand, apiKey));
  if (!placeId) {
    return {
      configured: true,
      live: false,
      brand,
      businessName: meta.businessName,
      rating: meta.fallbackRating,
      totalReviews: meta.fallbackTotalReviews,
      googleMapsUrl: meta.googleMapsUrl,
      reviews: VERIFIED_FALLBACK_REVIEWS[brand],
      message:
        brand === 'okc-frenchies'
          ? 'Set GOOGLE_PLACE_ID_OKC_FRENCHIES to pull OKC Frenchies Google Business reviews.'
          : 'Could not auto-resolve Google Place ID; set GOOGLE_PLACE_ID_RAW_PAW explicitly.'
    };
  }

  // Primary: Google Places API (New)
  try {
    const cleanPlaceId = placeId.replace(/^places\//, '');
    const v1Resp = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(cleanPlaceId)}?languageCode=en`,
      {
        headers: {
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask':
            'id,displayName,rating,userRatingCount,googleMapsUri,reviews'
        }
      }
    );
    if (v1Resp.ok) {
      const place = await v1Resp.json();
      const reviews = normalizeV1Reviews(place, meta.googleMapsUrl);
      const payload = {
        configured: true,
        live: true,
        brand,
        placeId: cleanPlaceId,
        businessName: place?.displayName?.text || meta.businessName,
        rating: Number(place?.rating) || meta.fallbackRating,
        totalReviews: Number(place?.userRatingCount) || reviews.length || meta.fallbackTotalReviews,
        googleMapsUrl: place?.googleMapsUri || meta.googleMapsUrl,
        reviews: reviews.length > 0 ? reviews : VERIFIED_FALLBACK_REVIEWS[brand],
        fetchedAt: new Date().toISOString()
      };
      REVIEWS_CACHE.set(brand, { ts: Date.now(), payload });
      return payload;
    }
  } catch {
    // Fall through to legacy Place Details API
  }

  // Fallback: Legacy Place Details API
  try {
    const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(
      placeId
    )}&fields=name,rating,user_ratings_total,url,reviews&reviews_sort=newest&key=${encodeURIComponent(
      apiKey
    )}`;
    const legResp = await fetch(legacyUrl);
    if (legResp.ok) {
      const data = await legResp.json();
      if (data?.status === 'OK' && data?.result) {
        const result = data.result;
        const reviews = normalizeLegacyReviews(result, meta.googleMapsUrl);
        const payload = {
          configured: true,
          live: true,
          brand,
          placeId,
          businessName: result?.name || meta.businessName,
          rating: Number(result?.rating) || meta.fallbackRating,
          totalReviews:
            Number(result?.user_ratings_total) || reviews.length || meta.fallbackTotalReviews,
          googleMapsUrl: result?.url || meta.googleMapsUrl,
          reviews: reviews.length > 0 ? reviews : VERIFIED_FALLBACK_REVIEWS[brand],
          fetchedAt: new Date().toISOString()
        };
        REVIEWS_CACHE.set(brand, { ts: Date.now(), payload });
        return payload;
      }
    }
  } catch {
    // Fall back gracefully below
  }

  return {
    configured: true,
    live: false,
    brand,
    placeId,
    businessName: meta.businessName,
    rating: meta.fallbackRating,
    totalReviews: meta.fallbackTotalReviews,
    googleMapsUrl: meta.googleMapsUrl,
    reviews: VERIFIED_FALLBACK_REVIEWS[brand],
    message: 'Google Places API request failed; serving verified snapshot.'
  };
}

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const query = req.query || {};
    const payload = await fetchGoogleReviewsPayload(query, process.env);
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).json(payload);
  } catch (err) {
    res.status(200).json({
      configured: false,
      live: false,
      brand: 'raw-and-paw',
      businessName: BRAND_DEFAULTS['raw-and-paw'].businessName,
      rating: BRAND_DEFAULTS['raw-and-paw'].fallbackRating,
      totalReviews: BRAND_DEFAULTS['raw-and-paw'].fallbackTotalReviews,
      googleMapsUrl: BRAND_DEFAULTS['raw-and-paw'].googleMapsUrl,
      reviews: VERIFIED_FALLBACK_REVIEWS['raw-and-paw'],
      message: err?.message || 'Unable to fetch Google Reviews'
    });
  }
}
