import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '../components/UI';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-snow flex items-center justify-center p-6 selection:bg-forest-green/20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white p-12 md:p-20 rounded-[3rem] border border-gray-100 text-center relative overflow-hidden"
      >
        {/* Abstract background blobs */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-forest-green/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-soft-gold/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-forest-green rounded-full flex items-center justify-center mx-auto mb-10"
          >
            <Heart className="w-12 h-12 text-white fill-white/20" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">Thank You!</h1>
          <p className="text-xl text-deep-slate opacity-80 leading-relaxed mb-12 italic font-display">
            "Thank you for supporting FundED Futures. Your generosity is changing lives in Nairobi's underserved communities."
          </p>

          <div className="space-y-4">
            <Button 
              variant="primary" 
              className="w-full py-4 flex items-center justify-center gap-3 group"
              onClick={() => navigate('/')}
            >
              Back to Home
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full py-4 flex items-center justify-center gap-3 border-gray-200"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'FundED Futures',
                    text: 'I just supported FundED Futures! Join me in empowering the next generation.',
                    url: window.location.origin,
                  }).catch(() => {});
                } else {
                  navigate('/share-work');
                }
              }}
            >
              <Share2 className="w-5 h-5" />
              Share Our Mission
            </Button>
          </div>
          
          <p className="mt-12 text-sm text-muted-text font-medium opacity-60">
            For donation confirmation or receipt requests, please contact fundedfuturesorg@gmail.com.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
