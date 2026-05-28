/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ArrowRight,
  Heart,
  Users,
  Globe,
  BookOpen,
  GraduationCap,
  HandHeart,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  Music,
  ChevronDown,
} from 'lucide-react';

import ImpactAreas from './pages/ImpactAreas';
import Subscribe from './pages/Subscribe';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Donate from './pages/Donate';
import ThankYou from './pages/ThankYou';
import Volunteer from './pages/Volunteer';
import ShareWork from './pages/ShareWork';
import HowItWorks_Identify from './pages/HowItWorks_Identify';
import HowItWorks_Fund from './pages/HowItWorks_Fund';
import HowItWorks_FollowThrough from './pages/HowItWorks_FollowThrough';
import LearnOurStory from './pages/LearnOurStory';
import ImpactStories from './pages/ImpactStories';
import Programs from './pages/Programs';
import FAQ from './pages/FAQ';

import ContactPopup from './components/ContactPopup';
import ScrollToTop from './components/ScrollToTop';
import { ContactProvider, useContact } from './context/ContactContext';
import { Button, SectionHeader, Card } from './components/UI';

// ─────────────────────────────────────────────
// NavDropdown
// ─────────────────────────────────────────────

type NavItem = { label: string; to?: string; href?: string };

function NavDropdown({
  label,
  items,
  className,
}: {
  label: string;
  items: NavItem[];
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const itemClass =
    'block px-6 py-3 text-sm hover:bg-forest-green/5 hover:text-forest-green transition-colors font-medium border-b border-gray-50 last:border-0';

  function renderItem(item: NavItem, idx: number) {
    if (item.to) {
      return (
        <Link
          key={idx}
          to={item.to}
          className={itemClass}
          onClick={() => setIsOpen(false)}
        >
          {item.label}
        </Link>
      );
    }

    return (
      <a
        key={idx}
        href={item.href}
        className={itemClass}
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </a>
    );
  }

  return (
    <div
      className={`relative group ${className ?? ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen((v) => !v)}
    >
      <button className="w-full font-medium hover:text-forest-green transition-colors flex items-center justify-center gap-1 py-2">
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-56 bg-white rounded-2xl border border-gray-100 overflow-hidden py-2"
          >
            {items.map(renderItem)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const navigate = useNavigate();
  const { openContact } = useContact();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    if (!localStorage.getItem('cookieDismissed')) {
      setTimeout(() => setShowCookiePopup(true), 1500);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dismissCookie = () => {
    setShowCookiePopup(false);
    localStorage.setItem('cookieDismissed', 'true');
  };

  return (
    <div className="min-h-screen selection:bg-forest-green/30">

      {/* ── NAV ── */}
      <nav
        className={`fixed top-0 w-full z-50 px-[5%] py-4 transition-smooth ${
          isScrolled
            ? 'bg-snow/80 backdrop-blur-xl border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-display font-bold">
            fund<span className="text-forest-green">ED</span> futures
          </a>

          <div className="hidden md:flex flex-1 ml-12 justify-between items-center bg-white/50 backdrop-blur-sm rounded-full px-2">

            <Link
              to="/"
              className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Home
            </Link>

            <a
              href="/#our-mission"
              className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3"
            >
              Mission
            </a>

            <NavDropdown
              label="Impact"
              className="flex-1"
              items={[
                { label: 'Impact Stories', to: '/impact-stories' },
                { label: 'Direct Impact Areas', to: '/impact-areas' },
              ]}
            />

            <a
              href="/#get-involved"
              className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3"
            >
              Get Involved
            </a>

            <button
              onClick={openContact}
              className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3 cursor-pointer"
            >
              Contact Us
            </button>

            <div className="flex-1 flex justify-center px-2">
              <Button
                variant="primary"
                className="w-full py-2 text-xs uppercase tracking-widest truncate"
                onClick={() => navigate('/donate')}
              >
                Donate
              </Button>
            </div>
          </div>

          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white absolute top-full left-0 w-full overflow-hidden border-b border-gray-100"
            >
              <div className="flex flex-col p-6 gap-6">

                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  Home
                </Link>

                <a
                  href="/#our-mission"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  Our Mission
                </a>

                <Link
                  to="/impact-stories"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  Impact Stories
                </Link>

                <Link
                  to="/impact-areas"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-lg font-medium"
                >
                  Direct Impact Areas
                </Link>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openContact();
                  }}
                  className="text-lg font-medium text-left"
                >
                  Contact Us
                </button>

                <Button
                  variant="primary"
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/donate');
                  }}
                >
                  Donate Now
                </Button>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>

        {/* ── HERO ── */}
        <section id="home" className="relative min-h-screen flex items-center justify-center">
          <div className="relative z-10 text-center px-6 max-w-4xl py-20">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-display font-bold mb-6"
            >
              A better world begins in the mind of a child
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg md:text-2xl mb-10"
            >
              Empowering the next generation of Kenyan leaders through education and mentorship.
            </motion.p>

            <Button onClick={() => navigate('/donate')}>
              Support a Student <ArrowRight size={18} />
            </Button>

          </div>
        </section>

        {/* ── COOKIE POPUP ── */}
        <AnimatePresence>
          {showCookiePopup && (
            <motion.div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white p-6 rounded-2xl shadow-xl">
              <p className="mb-4 text-sm">
                We use cookies to improve experience.
              </p>
              <div className="flex gap-3">
                <Button onClick={dismissCookie}>Accept</Button>
                <Button onClick={dismissCookie}>Reject</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-deep-slate text-white p-10">

        <div className="flex gap-4 mb-6">

          {[Twitter, Instagram, Facebook, Music].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10"
            >
              <Icon size={18} />
            </a>
          ))}

        </div>

        <p className="text-sm opacity-70">
          © {new Date().getFullYear()} fundED futures
        </p>

      </footer>

    </div>
  );
}

// ─────────────────────────────────────────────
// APP ROUTER
// ─────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ContactProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/impact-areas" element={<ImpactAreas />} />
          <Route path="/impact-stories" element={<ImpactStories />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/join-volunteer" element={<Volunteer />} />
          <Route path="/share-work" element={<ShareWork />} />
          <Route path="/how-it-works/identify" element={<HowItWorks_Identify />} />
          <Route path="/how-it-works/fund" element={<HowItWorks_Fund />} />
          <Route path="/how-it-works/follow-through" element={<HowItWorks_FollowThrough />} />
          <Route path="/learn-story" element={<LearnOurStory />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </ContactProvider>
    </BrowserRouter>
  );
}
