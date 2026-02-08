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
    description: 'Easy-to-Digest Dehydrated Goat Milk: A natural source of calcium, protein, and essential fatty acids that is gentle on the tummy and perfect for sensitive systems.',
    image: 'https://rawandpawco.com/cdn/shop/files/raw-and-paw-naturals-goat-brew-goat-milk-supplement-for-dogs.png?v=1770078727',
    price: '$34.99',
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
    name: 'Plasma',
    subtitle: 'K9 Super Supplements',
    description: 'Made from premium bovine plasma, naturally rich in bioactive compounds scientifically shown to support healing. Think of it as immune insurance for your dog.',
    image: 'https://rawandpawco.com/cdn/shop/files/raw-and-paw-naturals-bovine-plasma-dog-supplement.png?v=1770078019',
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
    description: 'Wild-Caught Salmon Oil provides a rich source of EPA & DHA to support a healthy skin & coat, soothe achy joints, and promote a balanced inflammatory response.',
    image: 'https://rawandpawco.com/cdn/shop/files/raw-and-paw-naturals-omega-mania-dog-oil-blend.png?v=1770083721&width=2890',
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
    id: 'raw-beef',
    name: 'Raw Beef Blend',
    subtitle: 'Foundation Nutrition',
    description: 'The base of our program. 80/10/10 premium raw beef blends sourced for maximum muscle development.',
    // Fixed: Replaced 404 image
    image: 'https://images.unsplash.com/photo-1628260412297-a3377e45006f?auto=format&fit=crop&q=80&w=600',
    price: 'From $4.50/lb',
    link: 'https://rawandpawco.com/collections/raw',
    benefits: [
        'Bio-Appropriate Nutrition',
        'Maximum Muscle Density',
        'Natural Enzyme Intake'
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
