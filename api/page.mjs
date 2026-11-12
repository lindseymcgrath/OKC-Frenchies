import {
  INDEX_HTML,
  PUPPIES_DATA,
  STUDS_DATA,
  BLOG_DATA,
  SEO_DATA
} from './_htmlTemplate.mjs';

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
    image: 'https://okcfrenchies.com/og/home.jpg'
  },
  '/french-bulldog-puppies-for-sale': {
    title: SEO_DATA.Puppies.title,
    description: SEO_DATA.Puppies.description,
    image: 'https://okcfrenchies.com/og/puppies.jpg'
  },
  '/puppies': {
    title: SEO_DATA.Puppies.title,
    description: SEO_DATA.Puppies.description,
    image: 'https://okcfrenchies.com/og/puppies.jpg'
  },
  '/french-bulldog-stud-service': {
    title: SEO_DATA.Studs.title,
    description: SEO_DATA.Studs.description,
    image: 'https://okcfrenchies.com/og/studs.jpg'
  },
  '/studs': {
    title: SEO_DATA.Studs.title,
    description: SEO_DATA.Studs.description,
    image: 'https://okcfrenchies.com/og/studs.jpg'
  },
  '/french-bulldog-coat-color-genetics': {
    title: SEO_DATA.Genetics.title,
    description: SEO_DATA.Genetics.description,
    image: 'https://okcfrenchies.com/og/genetics.jpg'
  },
  '/genetics': {
    title: SEO_DATA.Genetics.title,
    description: SEO_DATA.Genetics.description,
    image: 'https://okcfrenchies.com/og/genetics.jpg'
  },
  '/french-bulldog-breeding-blog': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/blog': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/journal': {
    title: SEO_DATA.Blog.title,
    description: SEO_DATA.Blog.description,
    image: 'https://okcfrenchies.com/og/blog.jpg'
  },
  '/french-bulldog-breeding-protocol': {
    title: SEO_DATA.Protocol.title,
    description: SEO_DATA.Protocol.description,
    image: 'https://okcfrenchies.com/og/protocol.jpg'
  },
  '/protocol': {
    title: SEO_DATA.Protocol.title,
    description: SEO_DATA.Protocol.description,
    image: 'https://okcfrenchies.com/og/protocol.jpg'
  },
  '/buyer-education': {
    title: SEO_DATA.BuyerEducation.title,
    description: SEO_DATA.BuyerEducation.description,
    image: 'https://okcfrenchies.com/og/buyer-education.jpg'
  },
  '/puppy-inquiry-form': {
    title: SEO_DATA.Inquiry.title,
    description: SEO_DATA.Inquiry.description,
    image: 'https://okcfrenchies.com/og/inquiry.jpg'
  },
  '/inquiry': {
    title: SEO_DATA.Inquiry.title,
    description: SEO_DATA.Inquiry.description,
    image: 'https://okcfrenchies.com/og/inquiry.jpg'
  },
  '/application': {
    title: SEO_DATA.Application.title,
    description: SEO_DATA.Application.description,
    image: 'https://okcfrenchies.com/og/application.jpg'
  }
};

export default function handler(req, res) {
  try {
    const rawUrl = req.url || '/';
    const parsed = new URL(rawUrl, 'https://okcfrenchies.com');
    const pathname = parsed.pathname.replace(/\/+$/, '') || '/';

    const meta = ROUTE_META[pathname] || ROUTE_META['/'];
    let title = meta.title;
    let description = meta.description;
    let image = meta.image;
    const pageUrl = `https://okcfrenchies.com${pathname}${parsed.search}`;

    const dogQuery = parsed.searchParams.get('dog');
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
        title = `${match.name} (${match.breed}) | OKC Frenchies`;
        description = `${match.status || match.type} • ${match.dna} • ${match.price}. ${match.description || ''}`.trim();
        image = `https://okcfrenchies.com/og/dogs/${slugify(match.name)}.jpg`;
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
  } catch (err) {
    console.error('api/page error:', err);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(INDEX_HTML);
  }
}

