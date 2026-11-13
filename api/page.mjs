import {
  INDEX_HTML,
  PUPPIES_DATA,
  STUDS_DATA,
  BLOG_DATA,
  SEO_DATA
} from './_htmlTemplate.mjs';

const OG_VER = 'v=5';

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeHtml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const ROUTE_META = {
  '/': {
    title: SEO_DATA.Home.title,
    description: SEO_DATA.Home.description,
    image: `https://okcfrenchies.com/og/home.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/'
  },
  '/french-bulldog-puppies-for-sale': {
    title: SEO_DATA.Puppies.title,
    description: SEO_DATA.Puppies.description,
    image: `https://okcfrenchies.com/og/puppies.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-puppies-for-sale'
  },
  '/puppies': {
    title: SEO_DATA.Puppies.title,
    description: SEO_DATA.Puppies.description,
    image: `https://okcfrenchies.com/og/puppies.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-puppies-for-sale'
  },
  '/puppies-for-sale': {
    title: SEO_DATA.Puppies.title,
    description: SEO_DATA.Puppies.description,
    image: `https://okcfrenchies.com/og/puppies.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-puppies-for-sale'
  },
  '/french-bulldog-stud-service': {
    title: SEO_DATA.Studs.title,
    description: SEO_DATA.Studs.description,
    image: `https://okcfrenchies.com/og/studs.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-stud-service'
  },
  '/studs': {
    title: SEO_DATA.Studs.title,
    description: SEO_DATA.Studs.description,
    image: `https://okcfrenchies.com/og/studs.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-stud-service'
  },
  '/french-bulldog-coat-color-genetics': {
    title: SEO_DATA.Genetics.title,
    description: SEO_DATA.Genetics.description,
    image: `https://okcfrenchies.com/og/genetics.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-coat-color-genetics'
  },
  '/genetics': {
    title: SEO_DATA.Genetics.title,
    description: SEO_DATA.Genetics.description,
    image: `https://okcfrenchies.com/og/genetics.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-coat-color-genetics'
  },
  '/french-bulldog-breeding-blog': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: `https://okcfrenchies.com/og/blog.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-breeding-blog'
  },
  '/blog': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: `https://okcfrenchies.com/og/blog.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-breeding-blog'
  },
  '/journal': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: `https://okcfrenchies.com/og/blog.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-breeding-blog'
  },
  '/french-bulldog-breeding-protocol': {
    title: SEO_DATA.Protocol.title,
    description: SEO_DATA.Protocol.description,
    image: `https://okcfrenchies.com/og/protocol.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-breeding-protocol'
  },
  '/protocol': {
    title: SEO_DATA.Protocol.title,
    description: SEO_DATA.Protocol.description,
    image: `https://okcfrenchies.com/og/protocol.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/french-bulldog-breeding-protocol'
  },
  '/buyer-education': {
    title: SEO_DATA.BuyerEducation.title,
    description: SEO_DATA.BuyerEducation.description,
    image: `https://okcfrenchies.com/og/buyer-education.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/buyer-education'
  },
  '/puppy-inquiry-form': {
    title: SEO_DATA.Inquiry.title,
    description: SEO_DATA.Inquiry.description,
    image: `https://okcfrenchies.com/og/inquiry.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/puppy-inquiry-form'
  },
  '/inquiry': {
    title: SEO_DATA.Inquiry.title,
    description: SEO_DATA.Inquiry.description,
    image: `https://okcfrenchies.com/og/inquiry.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/puppy-inquiry-form'
  },
  '/application': {
    title: SEO_DATA.Application.title,
    description: SEO_DATA.Application.description,
    image: `https://okcfrenchies.com/og/application.jpg?${OG_VER}`,
    canonical: 'https://okcfrenchies.com/application'
  }
};

export default function handler(req, res) {
  try {
    const rawUrl = req.url || '/';
    const parsed = new URL(rawUrl, 'https://okcfrenchies.com');
    const rewrittenPath =
      parsed.searchParams.get('__path') ||
      req.headers?.['x-matched-path'] ||
      req.headers?.['x-invoke-path'] ||
      parsed.pathname;
    const pathname = String(rewrittenPath || '/').replace(/\/+$/, '') || '/';

    const cleanSearchParams = new URLSearchParams(parsed.searchParams);
    cleanSearchParams.delete('__path');
    const cleanSearch = cleanSearchParams.toString() ? `?${cleanSearchParams.toString()}` : '';

    const meta = ROUTE_META[pathname] || ROUTE_META['/'];
    let title = meta.title;
    let description = meta.description;
    let image = meta.image;
    let canonical = meta.canonical || `https://okcfrenchies.com${pathname}`;
    const pageUrl = `https://okcfrenchies.com${pathname}${cleanSearch}`;

    // Support both /puppies/:slug, /studs/:slug AND ?dog=Name
    const pathDogMatch = pathname.match(/^\/(?:puppies|studs|french-bulldog-puppies-for-sale|french-bulldog-stud-service)\/([^/]+)$/i);
    const dogQuery = pathDogMatch ? decodeURIComponent(pathDogMatch[1]) : parsed.searchParams.get('dog');

    if (dogQuery) {
      const q = dogQuery.toLowerCase();
      const allDogs = [...PUPPIES_DATA, ...STUDS_DATA];
      const match = allDogs.find(
        (d) =>
          String(d.name || '').toLowerCase() === q ||
          slugify(d.name) === q ||
          String(d.id || '').toLowerCase() === q
      );
      if (match) {
        title = `Meet ${match.name} (${match.breed}) | OKC Frenchies`;
        description = `${match.status || match.type} • ${match.gender || ''} • ${match.dna}. ${match.description || 'Raised in-home in Oklahoma City. Text 405.300.8482.'}`.trim();
        image = `https://okcfrenchies.com/og/dogs/${slugify(match.name)}.jpg?${OG_VER}`;
        canonical = pageUrl;
      }
    }

    const postQuery = parsed.searchParams.get('post');
    if (postQuery) {
      const q = postQuery.toLowerCase();
      const match = BLOG_DATA.find(
        (p) =>
          String(p.id || '').toLowerCase() === q ||
          String(p.title || '').toLowerCase() === q
      );
      if (match) {
        title = `${match.title} | OKC Frenchies Journal`;
        description = match.summary || description;
        if (match.image) {
          image = match.image.startsWith('http')
            ? match.image
            : `https://okcfrenchies.com${match.image}`;
        }
      }
    }

    let html = INDEX_HTML;
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
    html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${escapeHtml(canonical)}">`);
    html = html.replace(/<meta name="title" content="[^"]*">/, `<meta name="title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${escapeHtml(pageUrl)}">`);
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(description)}">`);
    html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(image)}">`);
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${escapeHtml(title)}">`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${escapeHtml(description)}">`);

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.status(200).send(html);
  } catch (err) {
    console.error('api/page error:', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(INDEX_HTML);
  }
}
