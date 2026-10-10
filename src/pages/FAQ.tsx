import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, HelpCircle, ShieldCheck, Users, GraduationCap, Heart, BarChart3 } from 'lucide-react';
import { Button } from '../components/UI';
import { useContact } from '../context/ContactContext';

const faqs = [
  {
    question: "How do donations reach students?",
    answer: "Transparency is our core value. Funds are paid directly to verified schools for tuition and educational expenses. We never route money through parents, guardians, or intermediaries, ensuring every shilling goes toward the education for which it was intended.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "Who selects the students?",
    answer: "Our identification process is community-led. We work with local leaders, teachers, and social workers to identify high-potential students in marginalized areas whose education is at risk. Selection is based on academic potential, financial need, and community verification.",
    icon: <Users className="w-5 h-5" />
  },
  {
    question: "What programs does FundED Futures offer?",
    answer: "We offer student education sponsorship, emergency school fee support, and distribution of essential resources like books and uniforms. Currently, we operate across Africa with a clear vision to expand our footprint and impact globally.",
    icon: <GraduationCap className="w-5 h-5" />
  },
  {
    question: "How can I volunteer?",
    answer: "We are always looking for passionate individuals to join our family! You can volunteer as a mentor, assist with student verification, or support our operations. Visit our 'Join Our Volunteer Family' page to fill out an application.",
    link: "/join-volunteer",
    linkText: "Apply to Volunteer",
    icon: <Heart className="w-5 h-5" />
  },
  {
    question: "How transparent is your process?",
    answer: "We provide regular updates and verification reports for all sponsorships. By eliminating middlemen and paying schools directly, we maintain a 1:1 impact ratio where donors can see exactly how their contributions changed a student's life.",
    icon: <ShieldCheck className="w-5 h-5" />
  },
  {
    question: "What impact have you made so far?",
    answer: "To date, we have helped hundreds of students stay in school who would otherwise have been sent home. You can view detailed metrics and personal stories on our Impact Stories page.",
    link: "/impact-stories",
    linkText: "View Impact Stories",
    icon: <BarChart3 className="w-5 h-5" />
  }
];

export default function FAQ() {
  const navigate = useNavigate();
  const { openContact } = useContact();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-snow pt-32 pb-20 px-[5%]"
    >
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-forest-green mb-12 hover:gap-3 transition-all font-bold"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="mb-20 text-center">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-frosted-blue/10 rounded-[2rem] flex items-center justify-center text-frosted-blue mx-auto mb-8"
          >
            <HelpCircle size={40} />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 text-deep-slate">
            Common <span className="text-forest-green">Questions</span>
          </h1>
          <p className="text-xl text-deep-slate/60 max-w-xl mx-auto">
            Everything you need to know about how we work and how your support makes a difference.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div 
                data-analytics-action="faq_toggle" id={`faq-item-${idx}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className={`
                  w-full text-left p-8 rounded-[2.5rem] transition-all cursor-pointer border relative overflow-hidden
                  ${openIndex === idx 
                    ? 'bg-white border-forest-green/20' 
                    : 'bg-white/50 border-gray-100 hover:bg-white hover:border-forest-green/10'}
                `}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center transition-colors
                      ${openIndex === idx ? 'bg-forest-green text-white' : 'bg-frosted-blue/10 text-frosted-blue'}
                    `}>
                      {faq.icon}
                    </div>
                    <h3 className={`text-xl font-bold transition-colors ${openIndex === idx ? 'text-forest-green' : 'text-deep-slate'}`}>
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown 
                    size={24} 
                    className={`text-forest-green transition-transform duration-500 ${openIndex === idx ? 'rotate-180' : ''}`} 
                  />
                </div>

                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 pl-18">
                        <p className="text-deep-slate/70 leading-relaxed text-lg mb-6">
                          {faq.answer}
                        </p>
                        {faq.link && (
                          <Button 
                            variant="primary" 
                            className="bg-forest-green/10 text-forest-green hover:bg-forest-green hover:text-white border-none py-3 px-6 rounded-2xl text-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(faq.link!);
                            }}
                          >
                            {faq.linkText}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 3D Glass Effect */}
                <div className="absolute inset-0 border border-white/20 rounded-[2.5rem] pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-12 bg-deep-slate text-snow rounded-[4rem] text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold mb-6">Still have questions?</h2>
            <p className="text-lg opacity-70 mb-10">Our team is here to help you understand your impact.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button 
                variant="primary" 
                onClick={openContact}
                className="px-10 py-5"
              >
                Contact Us
              </Button>
              <Button 
                variant="ghost" 
                className="!text-snow border-white/20 hover:bg-white/5 px-10 py-5"
                onClick={() => navigate('/donate')}
              >
                Donate Now
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </motion.div>
  );
}
