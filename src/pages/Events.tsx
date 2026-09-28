import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, X as CloseIcon, Music, Music4, Flag, CalendarDays, ImageIcon } from 'lucide-react';
import { Button } from '../components/UI';

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO ADD YOUR BANNERS / IMAGES
// 1. Put the image in your project's  public/  folder (e.g. public/golf-banner.jpg)
//    or use a direct image link (e.g. an imgur link).
// 2. Paste it into the `banner` field of the event below, e.g.  banner: '/golf-banner.jpg'
// While `banner` is empty ('') a placeholder box is shown instead.
// ─────────────────────────────────────────────────────────────────────────────

type EventItem = {
  id: string;
  title: string;
  date: string;
  shortDate: string;
  banner: string; // <-- ADD BANNER IMAGE HERE
  icon: React.ReactNode;
  summary: string;
  about: string;
  howItHelps: string;
  extra?: string;
};

const events: EventItem[] = [
  {
    id: 'golf-tournament',
    title: 'Golf Tournament',
    date: 'November 22',
    shortDate: 'Nov 22',
    banner: '', // <-- ADD GOLF TOURNAMENT BANNER HERE
    icon: <Flag size={22} />,
    summary: 'A day on the course where every swing helps keep a child in school.',
    about:
      'A golf tournament is a friendly competition where players or teams play a round of golf, usually in a group format. Participants pay a registration fee to play, and businesses and individuals can sponsor holes, prizes and refreshments. It is a relaxed way to bring supporters, professionals and community members together for a good cause.',
    howItHelps:
      'The money raised from player registrations, sponsorships and donations on the day goes directly toward school fees, uniforms, books and learning materials for the students fundED futures supports across Kenya.',
  },
  {
    id: 'orchestra-concert',
    title: 'Orchestra Concert',
    date: 'December 5',
    shortDate: 'Dec 5',
    banner: '', // <-- ADD ORCHESTRA CONCERT BANNER HERE
    icon: <Music4 size={22} />,
    summary: 'An evening of live orchestral music in support of education.',
    about:
      'An orchestra concert is a live performance by a group of musicians playing instruments such as strings, brass, woodwinds and percussion together. It is a chance to enjoy beautiful music in a warm setting while supporting something meaningful.',
    howItHelps:
      'Proceeds from ticket sales, sponsorships and donations at the concert help us fund school fees, materials and mentorship for students who would otherwise be forced to leave school.',
  },
  {
    id: 'music-concert',
    title: 'Music Concert',
    date: 'December 12',
    shortDate: 'Dec 12',
    banner: '', // <-- ADD MUSIC CONCERT BANNER HERE
    icon: <Music size={22} />,
    summary: 'A big night of live music featuring artists we are bringing on board.',
    about:
      'A music concert is a live show where artists perform for an audience. A benefit concert like this one brings people together through music and turns ticket sales into real support for children who need it.',
    howItHelps:
      'Ticket sales, sponsorships and donations from the night go toward school fees, uniforms, books and materials for the students we support.',
    extra:
      "We are currently in the process of onboarding artists for this concert, including Genesis, Lil Maina and Nikita Kering. The full lineup will be announced as artists are confirmed.",
  },
];

export default function Events() {
  const [selected, setSelected] = useState<EventItem | null>(null);
  const navigate = useNavigate();

  // Lock page scroll and allow Esc to close while the popup is open
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [selected]);

  const Banner = ({ event, className }: { event: EventItem; className: string }) =>
    event.banner ? (
      <img src={event.banner} alt={`${event.title} banner`} className={`${className} object-cover`} referrerPolicy="no-referrer" />
    ) : (
      <div className={`${className} bg-forest-green/10 flex flex-col items-center justify-center text-forest-green/60 gap-2`}>
        <ImageIcon size={32} />
        <span className="text-xs font-medium">Banner coming soon</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-snow px-[5%] py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-forest-green font-bold text-sm mb-10 hover:underline">
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-deep-slate mb-5">Events</h1>
        <p className="text-base md:text-lg text-muted-text max-w-2xl leading-relaxed mb-14">
          Join us at one of our upcoming fundraising events. Every ticket, sponsorship and donation helps keep a child in
          school. Select an event to see more details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              onClick={() => setSelected(event)}
              className="group text-left bg-white rounded-3xl border border-gray-100 overflow-hidden hover:border-forest-green/30 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-green"
            >
              <div className="relative">
                <Banner event={event} className="w-full h-48" />
                <div className="absolute top-4 right-4 w-11 h-11 rounded-xl bg-white/90 flex items-center justify-center text-forest-green">
                  {event.icon}
                </div>
              </div>
              <div className="p-6">
                <p className="flex items-center gap-2 text-forest-green font-bold text-sm mb-2">
                  <CalendarDays size={16} /> {event.date}
                </p>
                <h2 className="text-2xl font-display font-bold text-deep-slate mb-2">{event.title}</h2>
                <p className="text-sm text-muted-text leading-relaxed">{event.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Popup (about 3/4 of the screen on desktop, nearly full on mobile) ── */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-deep-slate/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={selected.title}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2rem] w-full h-[90vh] md:w-3/4 md:h-3/4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-deep-slate hover:bg-white"
              >
                <CloseIcon size={18} />
              </button>

              <Banner event={selected} className="w-full h-56 md:h-72" />

              <div className="p-6 md:p-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-green text-white flex items-center justify-center">{selected.icon}</div>
                  <p className="flex items-center gap-2 text-forest-green font-bold">
                    <CalendarDays size={18} /> {selected.date}
                  </p>
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-deep-slate mb-6">{selected.title}</h3>

                <div className="space-y-6 max-w-3xl">
                  <div>
                    <h4 className="font-bold text-deep-slate mb-2">What is it?</h4>
                    <p className="text-muted-text leading-relaxed">{selected.about}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-deep-slate mb-2">How it helps us raise money</h4>
                    <p className="text-muted-text leading-relaxed">{selected.howItHelps}</p>
                  </div>
                  {selected.extra && (
                    <div className="bg-forest-green/5 rounded-2xl p-5">
                      <h4 className="font-bold text-deep-slate mb-2">Lineup update</h4>
                      <p className="text-muted-text leading-relaxed">{selected.extra}</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-10">
                  <Button variant="primary" className="w-full sm:w-auto px-8" onClick={() => navigate('/donate')}>
                    Support This Event
                  </Button>
                  <Button variant="ghost" className="w-full sm:w-auto px-8 border-forest-green text-forest-green" onClick={() => setSelected(null)}>
                    Close Details
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
