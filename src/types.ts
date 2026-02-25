export interface Trait {
  id: string;
  code: string;
  name: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Ultra-Rare' | 'Legendary';
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
  link: string;
  benefits: string[];
}

export interface Dog {
  id: string;
  name: string;
  breed: string;
  gender: 'Male' | 'Female';
  dna: string;
  description: string;
  image: string;
  price: string;
  type: 'Puppy' | 'Stud';
}