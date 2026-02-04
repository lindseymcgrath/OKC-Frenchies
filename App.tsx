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
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-luxury-teal selection:text-black font-sans">
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/puppies" element={<Puppies />} />
            <Route path="/studs" element={<Studs />} />
            <Route path="/genetics" element={<Genetics />} />
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