import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { FlaskConical, ShoppingBag, X, CheckCircle2, Disc, Calculator, Sun, Utensils, ArrowRight, Activity, ShieldPlus } from 'lucide-react';
import SEO from './SEO';

interface StackItem {
  name: string;
  description: string;
  link: string;
  image?: string;
}

const DAILY_STACK: StackItem[] = [
  {
    name: 'Goat Brew',
    description: '1,000mg Bovine Colostrum & Probiotics. The ultimate immune system starter.',
    link: 'https://rawandpawco.com/products/goat-brew-goat-milk-dog-supplement',
    image: PRODUCTS.find((p) => p.id === 'goat-brew')?.image
  },
  {
    name: 'Plasma',
    description: 'Pure antibodies and growth factors to seal the gut lining.',
    link: 'https://rawandpawco.com/products/raw-and-paw-naturals-bovine-plasma-dog-supplement',
    image: PRODUCTS.find((p) => p.id === 'plasma')?.image
  },
  {
    name: 'Omega Mania',
    description: 'Cognitive fuel and coat density. Essential fatty acids for the day ahead.',
    link: 'https://rawandpawco.com/products/raw-and-paw-naturals-omega-mania-dog-oil-blend',
    image: PRODUCTS.find((p) => p.id === 'omega-mania')?.image
  }
];

const PERFORMANCE_STACK: StackItem[] = [
  {
    name: "Gentleman's Litter",
    description: 'Performance enhancer for our active studs. Zinc and Magnesium load.',
    link: 'https://rawandpawco.com/collections/supplements',
    image: 'https://lh3.googleusercontent.com/d/1dSmxbA3g-4qVRzxvBhd-ueijtfna77Ct=s1000'
  },
  {
    name: 'Joint Support',
    description: 'Glucosamine & Chondroitin for heavy bone development and joint longevity.',
    link: 'https://rawandpawco.com/collections/supplements',
    image: 'https://lh3.googleusercontent.com/d/1znd-3Egcq27kfY7DSwkmcAzia_KWvmDE=s1000'
  }
];

const Protocol: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedStack, setSelectedStack] = useState<{ title: string; items: StackItem[] } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const stackParam = searchParams.get('stack');
    const productParam = searchParams.get('product');

    if (stackParam === 'daily') setSelectedStack({ title: 'The Daily Protocol', items: DAILY_STACK });
    else if (stackParam === 'performance') setSelectedStack({ title: 'Performance & Studs', items: PERFORMANCE_STACK });
    else setSelectedStack(null);

    if (productParam) {
      const found = PRODUCTS.find((p) => p.id === productParam);
      setSelectedProduct(found || null);
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams]);

  const openStack = (type: string, title: string, items: StackItem[], updateUrl = true) => {
    setSelectedStack({ title, items });
    if (updateUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('stack', type);
      setSearchParams(newParams);
    }
  };

  const closeStack = () => {
    setSelectedStack(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('stack');
    setSearchParams(newParams, { replace: true });
  };

  const openProduct = (product: Product, updateUrl = true) => {
    setSelectedProduct(product);
    if (updateUrl) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('product', product.id);
      setSearchParams(newParams);
    }
  };

  const closeProduct = () => {
    setSelectedProduct(null);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('product');
    setSearchParams(newParams, { replace: true });
  };

  const [weight, setWeight] = useState<string>('');
  const [stage, setStage] = useState<string>('adult');

  useEffect(() => {
    if (selectedProduct || selectedStack) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProduct, selectedStack]);

  const calculatedAmount = useMemo(() => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return null;

    let percentage = 0.025;
    if (stage === 'puppy_young') percentage = 0.08;
    if (stage === 'puppy_old') percentage = 0.05;
    if (stage === 'active') percentage = 0.035;

    const dailyLbs = w * percentage;
    const dailyOz = dailyLbs * 16;

    return {
      lbs: dailyLbs.toFixed(2),
      oz: Math.round(dailyOz)
    };
  }, [weight, stage]);

  return (
    <section id="protocol" className="py-24 bg-[#EFECE4]/60 border-t border-[#E2DDD2] relative overflow-hidden text-[#1C2621]">
      <div className="max-w-[1340px] mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-[#E3EFE8] text-[#2E5A44] font-sans font-bold text-xs px-4 py-1.5 rounded-full mb-4">
            <FlaskConical size={15} /> Powered by Raw &amp; Paw Co.
          </span>

          <h2 className="font-display font-bold text-4xl md:text-5xl text-[#1C2621] mb-4">
            Our Sunlit Nutrition Protocol
          </h2>

          <p className="font-sans text-[#5C6B63] max-w-2xl mx-auto text-base leading-relaxed">
            Healthy puppies start with whole-food nutrition. We raise every litter and stud on tailored supplement stacks for{' '}
            <span className="text-[#2E5A44] font-bold">gut health</span>,{' '}
            <span className="text-[#2E5A44] font-bold">immune strength</span>, and{' '}
            <span className="text-[#D46A4E] font-bold">plush coat density</span>.
          </p>
        </div>

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Left Column: Feeding Regimen */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-end justify-between border-b border-[#DCD6C8] pb-3 mb-4">
              <h3 className="font-display font-bold text-2xl text-[#1C2621]">Daily Feeding Regimen</h3>
              <span className="font-sans text-[#2E5A44] text-xs font-bold tracking-wider uppercase">
                How We Raise Our Dogs
              </span>
            </div>

            {/* Daily Protocol Card */}
            <div
              onClick={() => openStack('daily', 'The Daily Protocol', DAILY_STACK)}
              className="bg-white border border-[#EAE5D9] p-7 md:p-8 rounded-3xl shadow-xs hover:border-[#2E5A44] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Sun size={110} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#F4D37E]/40 rounded-2xl text-[#1C2621]">
                    <Utensils size={22} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-2xl text-[#1C2621] group-hover:text-[#2E5A44] transition-colors">
                      The Daily Stack
                    </h4>
                    <span className="text-xs font-bold text-[#5C6B63] uppercase tracking-wider">
                      Foundation Nutrition for Puppies &amp; Adults
                    </span>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="text-[#2E5A44] group-hover:translate-x-1 transition-transform" size={22} />
                  </div>
                </div>
                <p className="font-sans text-[#5C6B63] text-sm leading-relaxed mb-6 max-w-xl">
                  Our universal protocol fed 1x daily for adults and 3x daily for growing puppies. Focuses on gut sealing, colostrum immune loading, and plush coat health.
                </p>
                <div className="bg-[#F6F4EE] p-5 rounded-2xl border border-[#EAE5D9]">
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-sm font-semibold text-[#1C2621]">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#2E5A44] shrink-0" /> Goat Brew (Probiotics)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#2E5A44] shrink-0" /> Plasma (Immune System)
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#2E5A44] shrink-0" /> Omega Mania (Coat &amp; Brain)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Performance Stack Card */}
            <div
              onClick={() => openStack('performance', 'Performance & Studs', PERFORMANCE_STACK)}
              className="bg-white border border-[#EAE5D9] p-7 md:p-8 rounded-3xl shadow-xs hover:border-[#2E5A44] hover:shadow-md transition-all relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                <Activity size={110} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#E3EFE8] rounded-2xl text-[#2E5A44]">
                    <ShieldPlus size={22} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-2xl text-[#1C2621] group-hover:text-[#2E5A44] transition-colors">
                      Performance &amp; Studs
                    </h4>
                    <span className="text-xs font-bold text-[#5C6B63] uppercase tracking-wider">
                      Active Dog Add-Ons
                    </span>
                  </div>
                  <div className="ml-auto">
                    <ArrowRight className="text-[#2E5A44] group-hover:translate-x-1 transition-transform" size={22} />
                  </div>
                </div>
                <p className="font-sans text-[#5C6B63] text-sm leading-relaxed mb-6 max-w-xl">
                  Specialized additions for our active studs and mamas. Supports reproductive vitality, heavy bone density, and long-term joint comfort.
                </p>
                <div className="bg-[#F6F4EE] p-5 rounded-2xl border border-[#EAE5D9]">
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans text-sm font-semibold text-[#1C2621]">
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#D46A4E] shrink-0" /> Gentleman’s Litter
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#D46A4E] shrink-0" /> Joint Support
                    </li>
                    <li className="flex items-center gap-2.5">
                      <CheckCircle2 size={16} className="text-[#D46A4E] shrink-0" /> Added to Daily Stack
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Tools & Calculator */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="flex items-end justify-between border-b border-[#DCD6C8] pb-3 mb-2 lg:mb-0">
              <h3 className="font-display font-bold text-2xl text-[#1C2621]">Feeding Tools</h3>
              <span className="font-sans text-[#5C6B63] text-xs font-bold uppercase tracking-wider">
                Daily Setup
              </span>
            </div>

            {/* Flat Plate */}
            <div className="bg-white border border-[#EAE5D9] p-7 rounded-3xl shadow-xs flex flex-col">
              <Disc className="text-[#2E5A44] mb-4" size={34} />
              <h3 className="font-display font-bold text-2xl text-[#1C2621] mb-1">The Flat Plate</h3>
              <p className="font-sans text-[#2E5A44] text-xs font-bold uppercase tracking-wider mb-3">
                Made for Flat-Faced Breeds
              </p>
              <p className="font-sans text-[#5C6B63] text-sm leading-relaxed mb-5">
                We feed on a <strong>9-inch Stainless Steel Flat Plate</strong>. Eliminating bowl edges prevents Frenchie chin acne and keeps wrinkles clean.
              </p>
              <a
                href="https://rawandpawco.com/products/stainless-steel-flat-feeding-plate"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#2E5A44] hover:text-[#D46A4E] text-xs font-bold uppercase tracking-wider transition-colors mt-auto"
              >
                <ShoppingBag size={14} /> Shop Flat Plate →
              </a>
            </div>

            {/* Intake Calculator */}
            <div className="bg-white border border-[#EAE5D9] p-7 rounded-3xl shadow-xs flex flex-col">
              <div className="flex items-center gap-2.5 mb-5">
                <Calculator className="text-[#D46A4E]" size={22} />
                <span className="text-[#1C2621] font-display font-bold text-xl">
                  Raw Feeding Calculator
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C6B63] mb-1.5">
                    Dog Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#F6F4EE] border border-[#DCD6C8] rounded-xl p-3 text-[#1C2621] font-sans font-bold focus:border-[#2E5A44] focus:outline-none"
                    placeholder="25"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#5C6B63] mb-1.5">
                    Life Stage
                  </label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                    className="w-full bg-[#F6F4EE] border border-[#DCD6C8] rounded-xl p-3 text-[#1C2621] font-sans font-semibold focus:border-[#2E5A44] focus:outline-none"
                  >
                    <option value="puppy_young">Puppy (2–4 Months)</option>
                    <option value="puppy_old">Puppy (4–12 Months)</option>
                    <option value="adult">Adult (Maintenance)</option>
                    <option value="active">Active / Stud / Pregnant</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-[#EAE5D9]">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#5C6B63]">
                    Daily Total
                  </span>
                  <div className="text-right">
                    {calculatedAmount ? (
                      <>
                        <span className="block font-display font-bold text-2xl text-[#2E5A44]">
                          {calculatedAmount.lbs} lbs
                        </span>
                        <span className="text-xs text-[#D46A4E] font-bold">
                          ({calculatedAmount.oz} oz / day)
                        </span>
                      </>
                    ) : (
                      <span className="font-display text-xl text-[#5C6B63]">--</span>
                    )}
                  </div>
                </div>
                <a
                  href="https://rawandpawco.com/collections/raw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#2E5A44] hover:bg-[#234735] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
                >
                  Shop Raw &amp; Supplements
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Essentials Collection */}
        <div>
          <h3 className="font-display font-bold text-3xl text-[#1C2621] mb-8">
            The Essentials Collection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                onClick={() => openProduct(product)}
                className="bg-white border border-[#EAE5D9] rounded-3xl p-5 flex flex-col items-center text-center hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="w-full aspect-square mb-4 overflow-hidden bg-[#F6F4EE] rounded-2xl border border-[#EAE5D9]">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-display font-bold text-xl text-[#1C2621] group-hover:text-[#2E5A44] transition-colors">
                  {product.name}
                </h4>
                <p className="font-sans text-[#2E5A44] text-[11px] font-bold uppercase tracking-wider mt-0.5 mb-2">
                  {product.subtitle}
                </p>
                <p className="font-sans text-[#5C6B63] text-xs leading-relaxed mb-4 line-clamp-3">
                  {product.description}
                </p>
                <div className="mt-auto pt-3 border-t border-[#F0ECE1] w-full flex items-center justify-between px-1">
                  <span className="font-sans font-extrabold text-base text-[#D46A4E]">
                    {product.price}
                  </span>
                  <span className="text-xs font-bold text-[#2E5A44] group-hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stack Modal */}
      {selectedStack && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#1C2621]/60 backdrop-blur-sm"
          onClick={closeStack}
        >
          <SEO
            title={`${selectedStack.title} | Protocol Stack`}
            description={`View the ${selectedStack.title} recommended feeding regimen.`}
          />
          <div
            className="relative z-10 w-full max-w-4xl bg-[#F6F4EE] border border-[#DCD6C8] rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8 border-b border-[#DCD6C8] flex justify-between items-center bg-white">
              <div>
                <h2 className="font-display font-bold text-3xl text-[#1C2621]">{selectedStack.title}</h2>
                <p className="text-[#5C6B63] text-xs font-bold uppercase tracking-wider mt-1">
                  Recommended Feeding Regimen
                </p>
              </div>
              <button
                onClick={closeStack}
                className="p-2 bg-[#F6F4EE] text-[#1C2621] hover:bg-[#E3EFE8] rounded-full cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {selectedStack.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#EAE5D9] rounded-2xl p-5 flex flex-col h-full"
                  >
                    <div className="aspect-square bg-[#F6F4EE] mb-4 overflow-hidden rounded-xl border border-[#EAE5D9]">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#2E5A44]">
                          <FlaskConical size={32} />
                        </div>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl text-[#1C2621] mb-2">{item.name}</h3>
                    <p className="text-sm text-[#5C6B63] leading-relaxed mb-5 flex-grow">
                      {item.description}
                    </p>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-[#2E5A44] hover:bg-[#234735] text-white rounded-full text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
                    >
                      <ShoppingBag size={14} /> Shop Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#1C2621]/60 backdrop-blur-sm"
          onClick={closeProduct}
        >
          <SEO
            title={`${selectedProduct.name} | Raw & Paw Protocol`}
            description={selectedProduct.description}
            image={selectedProduct.image}
          />
          <div
            className="relative z-10 w-full max-w-4xl bg-white border border-[#DCD6C8] rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeProduct}
              className="absolute top-4 right-4 z-50 p-2 text-[#1C2621] bg-white/90 rounded-full shadow-sm cursor-pointer"
            >
              <X size={22} />
            </button>

            <div className="w-full md:w-1/2 bg-[#F6F4EE] relative h-64 md:h-auto">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <span className="block font-sans text-[#2E5A44] text-xs font-bold tracking-wider uppercase mb-2">
                {selectedProduct.subtitle}
              </span>
              <h2 className="font-display font-bold text-3xl text-[#1C2621] mb-4">
                {selectedProduct.name}
              </h2>
              <p className="font-sans text-[#5C6B63] text-sm leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              <div className="mb-6">
                <h4 className="font-sans text-xs font-bold text-[#1C2621] uppercase tracking-wider mb-3">
                  Key Benefits
                </h4>
                <ul className="space-y-2">
                  {selectedProduct.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-[#5C6B63] text-sm">
                      <CheckCircle2 size={16} className="text-[#2E5A44] mt-0.5 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-6 border-t border-[#EAE5D9] flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-[#5C6B63] text-xs font-bold uppercase tracking-wider">
                    Price
                  </span>
                  <span className="font-display font-bold text-2xl text-[#D46A4E]">
                    {selectedProduct.price}
                  </span>
                </div>
                <a
                  href={selectedProduct.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-[#2E5A44] hover:bg-[#234735] text-white font-bold text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} /> Buy at Raw &amp; Paw Co.
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Protocol;
