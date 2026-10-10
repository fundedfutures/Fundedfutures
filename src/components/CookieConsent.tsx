import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './UI';
import { updateAnalyticsConsent } from './Analytics';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener('open-cookie-preferences', reopen);
    const timer = window.setTimeout(() => { if (!localStorage.getItem('analyticsConsent')) setVisible(true); }, 1500);
    return () => { window.clearTimeout(timer); window.removeEventListener('open-cookie-preferences', reopen); };
  }, []);
  const choose = (accepted: boolean) => { updateAnalyticsConsent(accepted); setVisible(false); };
  return <AnimatePresence>{visible && (
    <motion.div initial={{ y: 50, x: '-50%', opacity: 0 }} animate={{ y: 0, x: '-50%', opacity: 1 }} exit={{ y: 50, x: '-50%', opacity: 0 }} className="fixed bottom-6 left-1/2 z-[100] w-[92%] max-w-md bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] border border-gray-200 text-center">
      <h4 className="text-lg font-display font-bold mb-3">Cookie Preferences</h4>
      <p className="text-sm text-muted-text mb-8 leading-relaxed">With your permission, we use Google Analytics to understand visits and website interactions. Rejecting analytics keeps tracking disabled.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button variant="primary" className="text-xs py-2.5 px-8 w-full sm:w-auto" onClick={() => choose(true)}>Accept Cookies</Button>
        <Button variant="ghost" className="text-xs py-2.5 px-8 w-full sm:w-auto border-gray-200" onClick={() => choose(false)}>Reject</Button>
      </div>
    </motion.div>
  )}</AnimatePresence>;
}
