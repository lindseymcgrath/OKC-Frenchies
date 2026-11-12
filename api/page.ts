import type { VercelRequest, VercelResponse } from '@vercel/node';
import { INDEX_HTML } from './_htmlTemplate';
import puppiesData from '../src/data/puppies.json';
import studsData from '../src/data/studs.json';
import blogData from '../src/data/blog.json';
import seoData from '../src/data/seo.json';

const slugify = (s: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const escapeHtml = (str: string) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const ROUTE_META: Record<string, { title: string; description: string; image: string }> = {
  '/': {
    title: seoData.Home.title,
    description: seoData.Home.description,
    image: 'https://okcfrenchies.com/og/home.jpg'
  },
  '/french-bulldog-puppies-for-sale': {
    title: seoData.Puppies.title,
    description: seoData.Puppies.description,
    image: 'https://okcfrenchies.com/og/puppies.jpg'
  },
  '/puppies': {
    title: seoData.Puppies.title,
    description: seoData.Puppies.description,
    image: 'https://okcfrenchies.com/og/puppies.jpg'
  },
  '/french-bulldog-stud-service': {
    title: seoData.Studs.title,
    description: seoData.Studs.description,
    image: 'https://okcfrenchies.com/og/studs.jpg'
  },
  '/studs': {
    title: seoData.Studs.title,
    description: seoData.Studs.description,
    image: 'https://okcfrenchies.com/og/studs.jpg'
  },
  '/french-bulldog-coat-color-genetics': {
    title: seoData.Genetics.title,
    description: seoData.Genetics.description,
    image: 'https://okcfrenchies.com/og/genetics.jpg'
  },
  '/genetics': {
    title: seoData.Genetics.title,
    description: seoData.Genetics.description,
    image: 'https://okcfrenchies.com/og/genetics.jpg'
  },
  '/french-bulldog-breeding-blog': {
    title: seoData.Blog.title,
    description: seoData.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/blog': {
    title: seoData.Blog.title,
    description: seoData.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/journal': {
    title: seoData.Blog.title,
    description: seoData.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/french-bulldog-breeding-protocol': {
    title: seoData.Protocol.title,
    description: seoData.Protocol.description,
    image: 'https://okcfrenchies.com/og/protocol.jpg'
  },
  '/protocol': {
    title: seoData.Protocol.title,
    description: seoData.Protocol.description,
    image: 'https://okcfrenchies.com/og/protocol.jpg'
  },
  '/buyer-education': {
    title: seoData.BuyerEducation.title,
    description: seoData.BuyerEducation.description,
    image: 'https://okcfrenchies.com/og/buyer-education.jpg'
  },
  '/puppy-inquiry-form': {
    title: seoData.Inquiry.title,
    description: seoData.Inquiry.description,
    image: 'https://okcfrenchies.com/og/inquiry.jpg'
  },
  '/inquiry': {
    title: seoData.Inquiry.title,
    description: seoData.Inquiry.description,
    image: 'https://okcfrenchies.com/og/inquiry.jpg'
  },
  '/application': {
    title: seoData.Application.title,
    description: seoData.Application.description,
    image: 'https://okcfrenchies.com/og/application.jpg'
  }
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  const rawUrl = req.url || '/';
  const parsed = new URL(rawUrl, 'https://okcfrenchies.com');
  const pathname = parsed.pathname.replace(/\/+$/, '') || '/';

  let meta = ROUTE_META[pathname] || ROUTE_META['/'];
  let title = meta.title;
  let description = meta.description;
  let image = meta.image;
  const pageUrl = `https://okcfrenchies.com${pathname}${parsed.search}`;

  // Per-dog preview (?dog=Alice, ?dog=Brew, etc.)
  const dogQuery = parsed.searchParams.get('dog');
  if (dogQuery) {
    const q = dogQuery.toLowerCase();
    const allDogs = [...(puppiesData as any[]), ...(studsData as any[])];
    const match = allDogs.find(
      (d) => d.name.toLowerCase() === q || slugify(d.name) === q || d.id.toLowerCase() === q
    );
    if (match) {
      title = `${match.name} (${match.breed}) | OKC Frenchies`;
      description = `${match.status || match.type} • ${match.dna} • ${match.price}. ${match.description || ''}`.trim();
      image = `https://okcfrenchies.com/og/dogs/${slugify(match.name)}.jpg`;
    }
  }

  // Per-blog-post preview (?post=...)
  const postQuery = parsed.searchParams.get('post');
  if (postQuery) {
    const q = postQuery.toLowerCase();
    const match = (blogData as any[]).find(
      (p) => p.id.toLowerCase() === q || p.title.toLowerCase() === q
    );
    if (match) {
      title = `${match.title} | OKC Frenchies Journal`;
      description = match.summary || description;
      if (match.image) {
        image = match.image.startsWith('http') ? match.image : `https://okcfrenchies.com${match.image}`;
      }
    }
  }

  let html = INDEX_HTML;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = html.replace(/<meta name="title" content="[^"]*">/, `<meta name="title" content="${escapeHtml(title)}">`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(description)}">`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(title)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(description)}">`);
  html = html.replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${escapeHtml(image)}">\n    <meta property="og:url" content="${escapeHtml(pageUrl)}">`);
  html = html.replace(/<meta property="twitter:title" content="[^"]*">/, `<meta property="twitter:title" content="${escapeHtml(title)}">`);
  html = html.replace(/<meta property="twitter:description" content="[^"]*">/, `<meta property="twitter:description" content="${escapeHtml(description)}">`);
  html = html.replace(/<meta property="twitter:image" content="[^"]*">/, `<meta property="twitter:image" content="${escapeHtml(image)}">`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
}

