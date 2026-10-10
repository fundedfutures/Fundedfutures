import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

export const Counter = ({ target, label, prefix = "" }: { target: number, label: string, prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = target;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="text-center">
      <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
        {prefix}{count.toLocaleString()}{target > 1 && "+"}
      </h2>
      <p className="text-sm font-medium uppercase tracking-widest opacity-90">{label}</p>
    </div>
  );
};

export const SectionHeader = ({ title, subtitle, centered = true }: { title: string, subtitle?: string, centered?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-12 px-4 ${centered ? 'text-center' : 'text-left lg:text-left'}`}
  >
    <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight">{title}</h2>
    {subtitle && <p className="text-base sm:text-lg opacity-80 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>}
  </motion.div>
);

export const Button = ({ children, variant = 'primary', className = '', onClick, type = 'button', ...props }: any) => {
  const variants: any = {
    primary: 'bg-forest-green text-white hover:bg-forest-green/90',
    ghost: 'bg-transparent border-2 border-forest-green text-deep-slate hover:bg-forest-green/10',
    gold: 'bg-soft-gold text-deep-slate hover:bg-soft-gold/90',
    muted: 'bg-transparent text-muted-text hover:text-deep-slate transition-colors',
  };

  return (
    <motion.button 
      {...props}
      type={type}
      onClick={onClick}
      whileHover={{ opacity: 0.95 }}
      whileTap={{ scale: 0.98 }}
      className={`px-8 py-3 rounded-full font-bold transition-all ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const Card = ({ children, className = "", onClick, ...props }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ 
      y: -2,
    }}
    onClick={onClick}
    data-analytics-action={onClick ? 'card_open' : undefined}
    className={`bg-white rounded-[3rem] border border-gray-100 transition-all duration-300 cursor-pointer overflow-hidden p-8 ${className}`}
    {...props}
  >
    {children}
    <div className="absolute inset-0 border border-white/20 rounded-[3rem] pointer-events-none" />
  </motion.div>
);
