import { Trait, Product, Dog } from './types';

export const TRAITS: Trait[] = [
  {
    id: '1',
    code: 'Visual eA',
    name: 'Intense Black',
    description: 'The elusive intense black modifier. Creating deep, rich coats that define the modern exotic look.',
    rarity: 'Legendary'
  },
  {
    id: '2',
    code: 'RSPO2 Furnishings',
    name: 'The Floodle',
    description: 'The ultimate soft-coated aesthetic. Combining long hair genes with furnishings for a living plush texture.',
    rarity: 'Ultra-Rare'
  },
  {
    id: '3',
    code: 'Full Pink',
    name: 'Dilution Masterpiece',
    description: 'Visible pink hues in the coat and eyes, representing the pinnacle of color genetics.',
    rarity: 'Rare'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'goat-brew',
    name: 'Goat Brew',
    subtitle: 'Raw & Paw Naturals',
    description: 'Targeted Nutrition for Puppy Weaning, Nursing Support, and Gut Recovery (60 Serving). Easy-to-digest dehydrated goat milk with bovine colostrum and probiotics.',
    image: 'https://cdn.shopify.com/s/files/1/0714/2726/0656/files/raw-paw-goat-brew-instant-powder-60-serving_600x.png.webp?v=1771290574',
    price: '$49.99',
    link: 'https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement',
    benefits: [
        '1,000mg Bovine Colostrum',
        '500 Million CFUs Probiotics',
        'Taurine for Core Health',
        'Complete Vitamin Boost'
    ]
  },
  {
    id: 'plasma',
    name: 'Plasma™',
    subtitle: 'K9 Super Supplements',
    description: 'Made from premium bovine plasma, naturally rich in bioactive immunoglobulins scientifically shown to support gut repair, inflammation reduction, and immune strength.',
    image: 'https://cdn.shopify.com/s/files/1/0714/2726/0656/files/raw-and-paw-naturals-bovine-plasma-dog-supplement_600x.png.webp?v=1770078019',
    price: '$49.99',
    link: 'https://rawandpawco.com/products/raw-and-paw-naturals-bovine-plasma-dog-supplement',
    benefits: [
        'Rich in Immunoglobulins (IgG)',
        'Repairs Leaky Gut',
        'Neutralizes Pathogens',
        'Bioactive Growth Factors'
    ]
  },
  {
    id: 'omega-mania',
    name: 'Omega Mania',
    subtitle: 'K9 Super Supplements',
    description: 'Wild-Caught Salmon & 4-Oil Omega 3-6-9 Blend to support plush skin & coat density, soothe joints, and promote a balanced inflammatory response.',
    image: 'https://cdn.shopify.com/s/files/1/0714/2726/0656/files/raw-and-paw-naturals-omega-mania-dog-oil-blend_600x.png.webp?v=1770083721',
    price: '$29.99',
    link: 'https://rawandpawco.com/products/raw-and-paw-naturals-omega-mania-dog-oil-blend',
    benefits: [
        'MCT Oil for Cognitive Focus',
        'Flaxseed Oil (Omega 3 & 6)',
        'Wheatgerm Oil (Vitamin E)',
        'Supports Reproductive Health'
    ]
  },
  {
    id: 'heavy-hitter',
    name: 'Heavy Hitter™',
    subtitle: 'Performance Muscle & Recovery',
    description: 'Plasma-powered beef weight gainer and immune support designed to build lean muscle density, bone strength, and top-condition coat health.',
    image: 'https://cdn.shopify.com/s/files/1/0714/2726/0656/files/heavy-hitter-beef-weight-gainer-immune-support-for-dogs_600x.png.webp?v=1770076586',
    price: '$49.99',
    link: 'https://rawandpawco.com/products/heavy-hitter-beef-weight-gainer',
    benefits: [
        'Plasma-Powered Recovery',
        'Healthy Weight & Muscle Gain',
        'High-Protein Beef Formula'
    ]
  }
];

export const SHOWCASE: any[] = [
  {
    id: 'd1',
    name: 'Kronos',
    breed: 'French Bulldog',
    gender: 'Male',
    dna: 'at/at co/co d/d E/e',
    description: 'A structural phenomenon. Massive headpiece, short back, and thick bone density wrapped in a platinum coat.',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800',
    price: '$6,500',
    type: 'Puppy',
    badges: [{ label: 'Structure', color: 'bg-luxury-teal/10 text-luxury-teal border-luxury-teal/30' }],
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'd2',
    name: 'Duchess',
    breed: 'Mini English Bulldog',
    gender: 'Female',
    dna: 'Lilac Tri / Merino',
    description: 'The future of the Mini English program. Heavy rope, clean eyes, and a temperament of pure gold.',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800',
    price: '$8,000',
    type: 'Puppy',
    badges: [{ label: 'Lilac', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' }],
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=800' }]
  },
  {
    id: 'd3',
    name: 'Viper',
    breed: 'French Bulldog',
    gender: 'Male',
    dna: 'Isabella Producer',
    description: 'Our premier stud. Proven producer of structure and color. Open for lock-ins for the 2025 season.',
    image: 'https://images.unsplash.com/photo-1605897472359-85e4b94d685d?auto=format&fit=crop&q=80&w=800',
    price: 'Stud Service',
    type: 'Stud',
    badges: [{ label: 'Isabella', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }],
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1605897472359-85e4b94d685d?auto=format&fit=crop&q=80&w=800' }]
  }
];