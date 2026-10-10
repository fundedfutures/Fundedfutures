import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, X, ExternalLink, MessageCircle } from 'lucide-react';

interface ContactPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactPopup({ isOpen, onClose }: ContactPopupProps) {
  const email = 'fundedfuturesorg@gmail.com';
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep-slate/60 backdrop-blur-sm z-[100] cursor-pointer"
          />

          {/* Popup Container */}
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-snow w-full max-w-lg rounded-[3rem] p-6 sm:p-10 pointer-events-auto relative max-h-[85dvh] overflow-y-auto overflow-x-hidden border border-frosted-blue/20"
            >
              <button
                onClick={onClose}
                aria-label="Close contact" className="absolute top-6 right-6 p-2 hover:bg-frosted-blue/10 rounded-full transition-colors text-muted-text hover:text-deep-slate group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: "reverse", ease: "easeInOut" }}
                  className="w-20 h-20 bg-forest-green/10 rounded-[2rem] flex items-center justify-center text-forest-green mb-8"
                >
                  <MessageCircle size={40} />
                </motion.div>

                <h2 className="text-4xl font-display font-bold text-deep-slate mb-4">
                  Get in <span className="text-forest-green">Touch</span>
                </h2>
                
                <p className="text-deep-slate/60 mb-10 text-lg leading-relaxed">
                  Have questions about our programs or want to support our mission? We'd love to hear from you.
                </p>

                <div className="w-full space-y-4">
                  <motion.a
                    href={gmailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-between gap-2 bg-white p-4 sm:p-6 rounded-[2rem] border border-forest-green/10 group hover:border-forest-green/30 transition-all font-medium"
                  >
                    <div className="min-w-0 flex items-center gap-2 sm:gap-4">
                      <div className="shrink-0 w-10 sm:w-12 h-12 bg-forest-green rounded-2xl flex items-center justify-center text-white">
                        <Mail size={24} />
                      </div>
                      <div className="min-w-0 text-left">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-text">Direct Email</p>
                        <p className="text-sm sm:text-lg break-all font-bold text-deep-slate">{email}</p>
                      </div>
                    </div>
                    <ExternalLink size={20} className="shrink-0 text-forest-green/40 group-hover:text-forest-green transition-colors" />
                  </motion.a>
                </div>

                <p className="mt-10 text-sm font-bold uppercase tracking-widest text-muted-text/50">
                  FundED Futures Organization
                </p>
              </div>

              {/* Decorative background elements */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-forest-green/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-frosted-blue/10 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
