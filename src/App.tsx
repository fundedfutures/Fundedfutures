/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
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
  ChevronDown
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
import { Button, Counter, SectionHeader, Card } from './components/UI';

// --- Components ---

const NavDropdown = ({ label, items, className }: { label: string, items: { label: string, to?: string, href?: string }[], className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className={`relative group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <button className="w-full font-medium hover:text-forest-green transition-colors flex items-center justify-center gap-1 py-2">
        {label} <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-56 bg-white rounded-2xl border border-gray-100 overflow-hidden py-2"
          >
            {items.map((item, idx) => (
              item.to ? (
                <Link
                  key={idx}
                  to={item.to}
                  className="block px-6 py-3 text-sm hover:bg-forest-green/5 hover:text-forest-green transition-colors font-medium border-b border-gray-50 last:border-0"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className="block px-6 py-3 text-sm hover:bg-forest-green/5 hover:text-forest-green transition-colors font-medium border-b border-gray-50 last:border-0"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCookiePopup, setShowCookiePopup] = useState(false);
  const navigate = useNavigate();
  const { openContact } = useContact();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    // Popups logic
    const cookieDismissed = localStorage.getItem('cookieDismissed');

    if (!cookieDismissed) {
      setTimeout(() => setShowCookiePopup(true), 1500);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const dismissCookie = () => {
    setShowCookiePopup(false);
    localStorage.setItem('cookieDismissed', 'true');
  };

  return (
    <div className="min-h-screen selection:bg-forest-green/30">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-smooth px-[5%] py-4 ${isScrolled ? 'bg-snow/80 backdrop-blur-xl border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="#" className="text-2xl font-display font-bold">
            fund<span className="text-forest-green">ED</span> futures
          </a>
          
          <div className="hidden md:flex flex-1 ml-12 justify-between items-center bg-white/50 backdrop-blur-sm rounded-full px-2">
            <Link to="/" className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3">Home</Link>
            <a href="/#our-mission" className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3">Mission</a>
            
            <NavDropdown 
              label="Impact" 
              className="flex-1"
              items={[
                { label: 'Impact Stories', to: '/impact-stories' },
                { label: 'Direct Impact Areas', to: '/impact-areas' }
              ]} 
            />

            <a href="/#get-involved" className="flex-1 text-center font-medium hover:text-forest-green transition-colors py-3">Get Involved</a>
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white absolute top-full left-0 w-full overflow-hidden border-b border-gray-100"
            >
              <div className="flex flex-col p-6 gap-6">
                <Link to="/" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <a href="/#our-mission" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Our Mission</a>
                
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-forest-green">Impact</p>
                  <Link to="/impact-stories" className="block text-lg font-medium ml-4" onClick={() => setIsMenuOpen(false)}>Impact Stories</Link>
                  <Link to="/impact-areas" className="block text-lg font-medium ml-4" onClick={() => setIsMenuOpen(false)}>Direct Impact Areas</Link>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-forest-green">How It Works</p>
                  <Link to="/how-it-works/identify" className="block text-lg font-medium ml-4" onClick={() => setIsMenuOpen(false)}>We Identify</Link>
                  <Link to="/how-it-works/fund" className="block text-lg font-medium ml-4" onClick={() => setIsMenuOpen(false)}>We Fund</Link>
                  <Link to="/how-it-works/follow-through" className="block text-lg font-medium ml-4" onClick={() => setIsMenuOpen(false)}>We Follow Through</Link>
                </div>

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
        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-off-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]" />
          
          <div className="relative z-10 text-center px-6 max-w-4xl py-20">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-deep-slate"
            >
              A better world begins in the mind of a child
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl md:text-2xl text-deep-slate/80 mb-10 max-w-2xl mx-auto"
            >
              Empowering the next generation of Kenyan leaders through accessible education, direct funding, and lifelong mentorship.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button 
                variant="primary" 
                className="flex items-center justify-center gap-2 w-full sm:w-auto"
                onClick={() => navigate('/donate')}
              >
                Support a Student <ArrowRight size={18} />
              </Button>
              <Button 
                variant="muted" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/learn-story')}
              >
                Learn Our Story
              </Button>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 w-20 h-20 bg-forest-green/10 rounded-full blur-2xl"
          />
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-10 w-32 h-32 bg-frosted-blue/20 rounded-full blur-3xl"
          />
        </section>

        {/* Our Mission */}
        <section id="our-mission" className="py-20 md:py-32 px-[5%] bg-[#f7fcfb]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden border border-gray-100 order-2 md:order-1"
            >
              <img 
                src="https://i.imgur.com/c2tmG1v.jpeg" 
                alt="Community context" 
                className="w-full h-full object-cover hover:scale-105 transition-smooth duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-slate/40 to-transparent" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6 text-center md:text-left order-1 md:order-2"
            >
              <h2 className="text-4xl md:text-6xl leading-tight">Our Mission</h2>
              <p className="text-base md:text-lg leading-relaxed opacity-90">
                Education is a fundamental right, yet for thousands of students across Kenya, financial barriers make schooling an impossible dream. fundED futures was born from a simple belief: that poverty should never be a barrier to potential.
              </p>
              <p className="text-base md:text-lg leading-relaxed opacity-90">
                We work directly with community leaders and local schools to identify high-potential students in marginalized areas, providing not just school fees, but the uniforms, books, and psychological support they need to thrive.
              </p>
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
                <Button 
                  onClick={() => navigate('/impact-areas')}
                  className="flex items-center justify-center gap-4 bg-white !text-deep-slate border border-forest-green/10 !py-6 !rounded-[2rem] hover:bg-forest-green/5"
                >
                  <div className="w-10 h-10 bg-forest-green/10 rounded-full flex items-center justify-center text-forest-green group-hover:bg-forest-green group-hover:text-white transition-colors">
                    <HandHeart size={20} />
                  </div>
                  <span className="font-bold text-base">Direct Impact</span>
                </Button>
                <Button 
                  onClick={() => navigate('/programs')}
                  className="flex items-center justify-center gap-4 bg-white !text-deep-slate border border-frosted-blue/20 !py-6 !rounded-[2rem] hover:bg-frosted-blue/10"
                >
                  <div className="w-10 h-10 bg-frosted-blue/20 rounded-full flex items-center justify-center text-frosted-blue group-hover:bg-frosted-blue group-hover:text-white transition-colors">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-bold text-base">View Our Programs</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-32 px-[5%] bg-white">
          <div className="max-w-7xl mx-auto">
            <SectionHeader 
              title="How It Works" 
              subtitle="A simple, transparent process for lasting change." 
            />
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
            >
              {[
                { step: '01', title: 'We Identify', desc: 'We locate students in need across Kenya through our network of educators and village elders.', icon: <Globe className="text-forest-green" />, to: '/how-it-works/identify' },
                { step: '02', title: 'We Fund', desc: 'Direct payments for school fees, materials, and health insurance ensure every cent goes to the student.', icon: <Heart className="text-forest-green" />, to: '/how-it-works/fund' },
                { step: '03', title: 'We Follow Through', desc: 'We track academic progress and provide mentoring through university and early career stages.', icon: <GraduationCap className="text-forest-green" />, to: '/how-it-works/follow-through' },
              ].map((item, idx) => (
                <Card 
                  key={idx}
                  onClick={() => navigate(item.to)}
                  className="bg-snow p-8 md:p-10 border-forest-green/5 text-center md:text-left"
                >
                  <div className="mb-6 flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                    <span className="text-forest-green font-bold text-2xl opacity-50">{item.step}</span>
                    <div className="p-4 bg-white rounded-2xl group-hover:bg-forest-green group-hover:text-white transition-smooth border border-gray-50">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl mb-4 font-display">{item.title}</h3>
                  <p className="opacity-70 leading-relaxed text-sm md:text-base">{item.desc}</p>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Impact Stories */}
        <section id="impact" className="py-24 md:py-32 px-[5%] bg-snow">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-forest-green font-bold text-sm tracking-widest uppercase mb-4">Lives Transformed</p>
              <h2 className="text-4xl md:text-5xl font-display font-medium">Stories of Impact</h2>
            </div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
              className="space-y-12"
            >
              {[
                { 
                  name: "Favour",
                  age: "12",
                  story: "Favour is a young, intelligent girl with dreams of becoming a doctor, but those dreams need protecting now before it's too late. Despite everything, Favour consistently tops her class and stays within the top three, but mounting pressure at home threatens to chip away at those marks. keeping her in school is where it starts.",
                  image: "https://i.imgur.com/mCCRmmY.jpeg"
                },
                { 
                  name: "Kelvin",
                  age: "13",
                  story: "Kelvin has been drawn to wiring and engineering for as long as he can remember. He holds tightly to his dream of becoming an engineer, and right now, that dream needs someone to hold it with him as school fees are mounting and the threat of him being forced to leave school is very real.",
                  image: "https://i.imgur.com/J2wiqwH.jpeg"
                },
                { 
                  name: "Raynor",
                  age: "5",
                  story: "Raynor is currently out of school due to fee arrears. He is five years old and already facing a closed door. Raynor deserves a real shot at the future he was born to have, and school fees are the one bump in the road you can help him cross.",
                  image: "https://i.imgur.com/eugm70o.jpeg"
                }
              ].map((item, idx) => (
                <Card 
                  key={idx}
                  className="p-0 border-green-50 flex flex-col md:flex-row !rounded-[3rem]"
                  onClick={() => navigate('/impact-stories')}
                >
                  {/* Card Image */}
                  <div className="md:w-1/3 lg:w-1/4 h-64 md:h-64 relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      referrerPolicy="no-referrer" 
                    />
                    <div className="absolute inset-0 bg-forest-green/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Card Content */}
                  <div className="md:w-2/3 lg:w-3/4 p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-[2px] bg-forest-green" />
                      <p className="text-forest-green font-bold text-sm tracking-widest uppercase">
                        {item.name}, Age {item.age}
                      </p>
                    </div>
                    <p className="text-lg md:text-2xl text-deep-slate/90 leading-relaxed font-display italic">
                      "{item.story}"
                    </p>
                  </div>
                </Card>
              ))}
            </motion.div>
            
            <div className="mt-20 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                variant="primary" 
                className="px-10 py-4 transition-all"
                onClick={() => navigate('/donate')}
              >
                Help Change a Life
              </Button>
              <Button 
                variant="muted" 
                className="px-10 py-4 border-forest-green text-forest-green hover:bg-forest-green/5 transition-all font-bold rounded-full border-2"
                onClick={() => navigate('/impact-stories')}
              >
                Discover Impact
              </Button>
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section id="get-involved" className="py-24 px-[5%]">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto bg-frosted-blue rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl mb-8">Start Making an Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
                {[
                  { icon: <Heart className="text-deep-slate" />, title: 'Donate', desc: 'One-time or monthly support for school fees and materials.', btn: 'Donate Now' },
                  { icon: <Users className="text-deep-slate" />, title: 'Volunteer', desc: 'Share your professional skills or mentor a child remotely.', btn: 'Apply to Join' },
                  { icon: <Share2 className="text-deep-slate" />, title: 'Spread the Word', desc: 'Share our mission with your network and help us grow.', btn: 'Get Media Kit' },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col h-full space-y-6">
                    <div className="flex-grow space-y-4">
                      <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        {item.icon}
                      </div>
                      <h3 className="text-2xl font-display font-bold">{item.title}</h3>
                      <p className="opacity-80 leading-relaxed min-h-[3rem] flex items-center justify-center">
                        {item.desc}
                      </p>
                    </div>
                  <Button 
                    variant="primary" 
                    className="w-full mt-auto"
                    onClick={() => {
                      if (item.title === 'Volunteer') navigate('/join-volunteer');
                      else if (item.title === 'Spread the Word') navigate('/share-work');
                      else navigate('/donate');
                    }}
                  >
                    {item.btn}
                  </Button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-green/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          </motion.div>
        </section>

        {/* Newsletter CTA */}
        <section className="pb-24 px-[5%] text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mx-auto"
          >
            <Button 
              variant="ghost" 
              className="group relative overflow-hidden px-12 py-5 text-xl border-forest-green text-forest-green hover:text-white transition-all duration-500 rounded-full w-full sm:w-auto"
              onClick={() => navigate('/subscribe')}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Never miss an update
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-forest-green translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Button>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-deep-slate text-white pt-24 pb-12 px-[5%]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/10">
            <div className="col-span-1 lg:col-span-1">
              <a href="#" className="text-2xl font-display font-bold mb-6 block">
                fund<span className="text-forest-green">ED</span> futures
              </a>
              <p className="opacity-70 mb-8 max-w-xs italic">
                "A better world begins in the mind of a child"
              </p>
              <div className="flex gap-4">
                {[Twitter, Instagram, Facebook, Music].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-forest-green transition-colors">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-forest-green uppercase tracking-widest text-sm font-bold mb-6">Explore</h4>
              <ul className="space-y-4 opacity-70">
                <li><Link to="/learn-story" className="hover:text-forest-green transition-colors">Our Story</Link></li>
                <li><Link to="/how-it-works/identify" className="hover:text-forest-green transition-colors">Selection Process</Link></li>
                <li><Link to="/impact-areas" className="hover:text-forest-green transition-colors">Direct Impact</Link></li>
                <li><Link to="/share-work" className="hover:text-forest-green transition-colors">Share Our Work</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-forest-green uppercase tracking-widest text-sm font-bold mb-6">Support</h4>
              <ul className="space-y-4 opacity-70">
                <li><Link to="/faq" className="hover:text-forest-green transition-colors">FAQs</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-forest-green transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms-of-use" className="hover:text-forest-green transition-colors">Terms of Use</Link></li>
                <li><Link to="/join-volunteer" className="hover:text-forest-green transition-colors">Volunteer</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-forest-green uppercase tracking-widest text-sm font-bold mb-6">Newsletter</h4>
              <p className="opacity-70 text-sm mb-4">Stay updated with our latest student success stories.</p>
              <form 
                className="flex gap-2" 
                onSubmit={(e) => { 
                  e.preventDefault(); 
                  const email = (e.currentTarget.elements.namedItem('footer-email') as HTMLInputElement).value;
                  navigate('/subscribe', { state: { email } });
                }}
              >
                <input 
                  id="footer-email"
                  name="footer-email"
                  type="email" 
                  placeholder="Email address" 
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-forest-green w-full"
                  required
                />
                <button type="submit" className="bg-forest-green p-2 rounded-full hover:bg-forest-green/80 transition-colors">
                  <ArrowRight size={18} />
                </button>
              </form>
              <p 
                className="mt-4 text-xs text-forest-green font-bold cursor-pointer hover:underline"
                onClick={openContact}
              >
                Contact: fundedfuturesorg@gmail.com
              </p>
            </div>
          </div>
          
          <div className="pt-12 text-center text-sm">
            <p className="text-forest-green font-bold">© {new Date().getFullYear()} fundED futures. All rights reserved. Based in Nairobi, Kenya.</p>
          </div>
        </div>
      </footer>

      {/* Popups */}
      <AnimatePresence>
        {showCookiePopup && (
          <motion.div 
            initial={{ y: 50, x: '-50%', opacity: 0 }}
            animate={{ y: 0, x: '-50%', opacity: 1 }}
            exit={{ y: 50, x: '-50%', opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-md bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-200 text-center"
          >
            <h4 className="text-lg font-display font-bold mb-3">Cookie Preferences</h4>
            <p className="text-sm text-muted-text mb-8 leading-relaxed">
              We use cookies to enhance your experience and analyze our impact. By clicking "Accept", you consent to our use of cookies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="primary" className="text-xs py-2.5 px-8 w-full sm:w-auto" onClick={dismissCookie}>Accept Cookies</Button>
              <Button variant="ghost" className="text-xs py-2.5 px-8 w-full sm:w-auto border-gray-200" onClick={dismissCookie}>Reject</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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
