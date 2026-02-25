import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// These remain './' because the folders moved WITH App.tsx into /src
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Puppies from './pages/Puppies';
import Studs from './pages/Studs';
import Blog from './pages/Blog';
import Inquiry from './pages/Inquiry';
import Protocol from './pages/Protocol';
import Genetics from './pages/Genetics';
import Calculator from './pages/Calculator';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      {/* 🖨️ Print Styles Preserved */}
      <style>{`
        @media print {
          nav, footer, button, input, .print\\:hidden, .no-scrollbar { display: none !important; }
          body, html, main { background: white !important; color: #0f172a !important; margin: 0 !important; padding: 0 !important; }
          .max-w-6xl { max-width: 100% !important; padding: 0 !important; margin: 0 !important; border: none !important; }
          .space-y-2 > div { background: #f8fafc !important; border: 1px solid #e2e8f0 !important; page-break-inside: avoid !important; break-inside: avoid !important; margin-bottom: 12px !important; display: flex !important; flex-direction: row !important; color: black !important; }
          img { max-width: 100px !important; }
          h2, h4 { color: #0f172a !important; }
          .text-luxury-teal { color: #0d9488 !important; font-weight: 700 !important; }
          .max-w-6xl::after { content: "Genetic Analysis provided by OKC Frenchies Analysis Pro. Theoretical estimates only."; display: block; text-align: center; font-size: 8pt; color: #94a3b8; margin-top: 20px; }
        }
      `}</style>

      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-luxury-teal selection:text-black font-sans">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* 🎯 SEO Long-Tail Slugs - Keep these for Vercel/Google indexing */}
            <Route path="/french-bulldog-puppies-for-sale" element={<Puppies />} />
            <Route path="/french-bulldog-stud-service" element={<Studs />} />
            <Route path="/french-bulldog-coat-color-genetics" element={<Genetics />} />
            <Route path="/french-bulldog-color-calculator" element={<Calculator />} />
            <Route path="/french-bulldog-breeding-blog" element={<Blog />} />
            <Route path="/french-bulldog-breeding-protocol" element={<Protocol />} />
            <Route path="/puppy-inquiry-form" element={<Inquiry />} />

            {/* 🔗 Legacy Redirects */}
            <Route path="/puppies" element={<Puppies />} />
            <Route path="/studs" element={<Studs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/journal" element={<Blog />} />
            <Route path="/protocol" element={<Protocol />} />
            <Route path="/genetics" element={<Genetics />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/inquiry" element={<Inquiry />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;