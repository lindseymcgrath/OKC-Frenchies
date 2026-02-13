import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
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
    <HashRouter>
      {/* ✅ NEW: Global Print Styles for High-End PDF Exports */}
      <style>{`
        @media print {
          /* Hide non-essential UI */
          nav, footer, button, input, .print\\:hidden, .no-scrollbar {
            display: none !important;
          }

          /* Reset Background for Ink Efficiency */
          body, html, main {
            background: white !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Reformat Results Container */
          .max-w-6xl {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
          }

          /* Professional Puppy Rows */
          .space-y-2 > div {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 12px !important;
            display: flex !important;
            flex-direction: row !important;
            color: black !important;
          }

          /* Ensure images and text stay together */
          img {
            max-width: 100px !important;
          }

          h2, h4 { color: #0f172a !important; }
          .text-luxury-teal { color: #0d9488 !important; font-weight: 700 !important; }
          
          /* Footer Credit on PDF */
          .max-w-6xl::after {
            content: "Genetic Analysis provided by OKC Frenchies Analysis Pro. Theoretical estimates only.";
            display: block;
            text-align: center;
            font-size: 8pt;
            color: #94a3b8;
            margin-top: 20px;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-luxury-teal selection:text-black font-sans">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puppies" element={<Puppies />} />
            <Route path="/studs" element={<Studs />} />
            <Route path="/genetics" element={<Genetics />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/journal" element={<Blog />} />
            <Route path="/protocol" element={<Protocol />} />
            <Route path="/inquiry" element={<Inquiry />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
};

export default App;