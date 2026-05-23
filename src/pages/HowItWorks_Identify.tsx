import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Target, Users, ArrowRight } from 'lucide-react';
import { Button } from '../components/UI';

export default function HowItWorks_Identify() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-snow text-deep-slate font-body"
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-text hover:text-forest-green transition-colors mb-12 font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-20 h-20 bg-forest-green/10 rounded-[2rem] flex items-center justify-center text-forest-green mb-8"
          >
            <Search size={32} />
          </motion.div>
          <h1 className="text-4xl md:text-7xl font-display font-bold mb-6">We Identify</h1>
          <p className="text-xl text-muted-text max-w-4xl leading-relaxed">
            Finding the right students is the most critical part of our mission. We look for those with the highest potential and the greatest need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Our Selection Process</h2>
              <p className="text-lg opacity-80 leading-relaxed">
                We don't just pick names from a list. Our process involves deep community engagement and rigorous verification to ensure that every sponsorship goes to a child who truly needs it.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: <Users size={20} />, title: "Community Referrals", desc: "We work with local community leaders and school teachers who know the families personally." },
                { icon: <Target size={20} />, title: "Needs Assessment", desc: "Our team conducts home visits to understand the living conditions and financial background of each applicant." },
                { icon: <CheckCircle size={20} />, title: "Merit Verification", desc: "We look for students who have shown a consistent commitment to their education despite their circumstances." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-forest-green border border-gray-100 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="opacity-70 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1541976844346-f18aeac57b06?q=80&w=1000&auto=format&fit=crop" 
                alt="Community identification" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-frosted-blue rounded-[3rem] translate-x-8 translate-y-8 -z-10 opacity-30" />
          </div>
        </div>

        <div className="mt-32 p-12 bg-deep-slate text-white rounded-[4rem] text-center">
          <h2 className="text-3xl font-display font-bold mb-10">Ready to support an identified student?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ opacity: 0.9 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/how-it-works/fund')}
              className="bg-forest-green text-snow px-10 py-5 rounded-[2rem] font-bold transition-all flex items-center gap-3 group"
            >
              <span>Next: We Fund</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <Button variant="outline" className="px-10 py-5 border-white/20 text-white hover:bg-white hover:text-deep-slate rounded-[2rem]" onClick={() => navigate('/donate')}>Donate Now</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
