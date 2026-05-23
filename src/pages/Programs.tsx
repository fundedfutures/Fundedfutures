import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Globe, GraduationCap } from 'lucide-react';
import { Button, Card } from '../components/UI';

const programs = [
  {
    title: "Student Education Sponsorship",
    description: "Our flagship program provides holistic support for high-potential students. We cover tuition, uniforms, and provide a dedicated mentor to guide them through their academic journey.",
    icon: <GraduationCap className="w-8 h-8" />,
    color: "bg-forest-green",
    detail: "We provide students with direct funding to cover school fees, uniforms, books, textbooks, and transport."
  },
  {
    title: "School Fee Support",
    description: "Crisis funding for students at risk of being sent home due to temporary family financial struggles. We step in to bridge the gap and keep their seats in the classroom.",
    icon: <Heart className="w-8 h-8" />,
    color: "bg-frosted-blue",
    detail: "Emergency funding for students at risk of being sent home, covering what they need to stay in class."
  },
  {
    title: "Educational Resources",
    description: "Ensuring students have the tools they need to succeed. We provide textbooks, learning materials, and school supplies to marginalized communities.",
    icon: <BookOpen className="w-8 h-8" />,
    color: "bg-deep-slate",
    detail: "Funding for the essential materials a student needs to learn — books, textbooks, and supplies."
  }
];

export default function Programs() {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-snow pt-32 pb-20 px-[5%]"
    >
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-forest-green mb-12 hover:gap-3 transition-all font-bold"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="max-w-4xl mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-8 leading-tight text-deep-slate"
          >
            Our <span className="text-forest-green">Programs</span>
          </motion.h1>
          <p className="text-xl md:text-2xl text-deep-slate/70 max-w-2xl leading-relaxed">
            We build sustainable pathways to success through direct financial support and holistic student development. 
          </p>
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
          {programs.map((prog, idx) => (
            <Card
              key={idx}
              className="p-10 border-frosted-blue/10 cursor-default"
            >
              <div className={`${prog.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-105 transition-transform duration-500`}>
                {prog.icon}
              </div>
              <h3 className="text-2xl font-display font-bold mb-6 text-deep-slate">{prog.title}</h3>
              <p className="text-deep-slate/70 mb-8 leading-relaxed flex-grow">
                {prog.description}
              </p>
              <p className="text-sm font-semibold text-deep-slate/80 leading-relaxed border-t border-gray-100 pt-6">
                {prog.detail}
              </p>
            </Card>
          ))}
        </motion.div>

        {/* Global Impact Banner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-20 bg-forest-green text-snow rounded-[4rem] text-center relative overflow-hidden"
        >
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <Globe className="w-16 h-16 mb-8 text-frosted-blue opacity-80" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 italic">
              "Based in Kenya, with a vision to grow our impact globally."
            </h2>
            <div className="w-24 h-1 bg-frosted-blue/30 rounded-full mb-12" />
            
            <Button 
              variant="muted" 
              className="bg-white text-forest-green hover:bg-white/90 px-10 py-5 rounded-full font-bold"
              onClick={() => navigate('/donate')}
            >
              Support Our Mission
            </Button>
          </div>

          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-snow/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-deep-slate/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </motion.div>
      </div>
    </motion.div>
  );
}
