import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Target,
  Users,
  Globe,
  BookOpen,
  CheckCircle,
  X,
  Phone,
} from 'lucide-react';
import { Button } from '../components/UI';

const teamMembers = [
  { name: "Xavi Odumbe", role: "Technology & Operations", desc: "Oversees technology infrastructure and coordinates department workflows", phone: "0710640206" },
  { name: "Kagiri Gitahi", role: "Church Partnerships", desc: "Oversees relations with Saint Austin's", phone: "0739821625" },
  { name: "Nicole Matheka", role: "Church Partnerships & Marketing", desc: "Oversees Saint John the Evangelist Karen", phone: "0111664810" },
  { name: "Joshua Okumu", role: "Church Partnerships", desc: "Oversees CITAM Valley Road", phone: "0769957357" },
  { name: "Aidan Muiga", role: "Finance & Reporting", desc: "Controls finances and tracks all incoming donations", phone: "0710654482" },
  { name: "Nelson Onyango", role: "Social Media & Marketing", desc: "Ensures wide brand reach and accessibility", phone: "0791006610" },
  { name: "Kyle Kwena", role: "Profile & Wellness", desc: "Manages children's profiles and wellness", phone: "0701365334" },
  { name: "Dylan Mungatta", role: "Relations Officer", desc: "Manages school and community relations", phone: "0722509803" },
];

const milestones = [
  { icon: <CheckCircle size={18} />, text: "Profiled 125 children from target communities" },
  { icon: <CheckCircle size={18} />, text: "Fundraising partnerships with Saint Austin's & Saint John the Evangelist Karen" },
  { icon: <CheckCircle size={18} />, text: "Launched a dedicated website for online donations" },
  { icon: <CheckCircle size={18} />, text: "Identified channels: school events, church fundraisers, charity tournaments, NGOs & independent donors" },
];

type Member = {
  name: string;
  role: string;
  desc: string;
  phone: string;
};

export default function LearnOurStory() {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="min-h-screen bg-snow text-deep-slate font-body overflow-x-hidden">

      {/* ── Member Popup ── */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
              onClick={() => setSelectedMember(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[210] w-[90%] max-w-sm bg-white rounded-[2rem] p-8 border border-gray-100"
            >
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-forest-green hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 bg-forest-green/10 rounded-2xl flex items-center justify-center text-forest-green font-bold text-2xl mb-6">
                {selectedMember.name.charAt(0)}
              </div>

              <h3 className="text-2xl font-display font-bold text-deep-slate">
                {selectedMember.name}
              </h3>
              <p className="text-xs font-bold text-forest-green uppercase tracking-widest mt-1 mb-4">
                {selectedMember.role}
              </p>
              <p className="text-sm text-muted-text leading-relaxed mb-6">
                {selectedMember.desc}
              </p>

              
              <a
                href={`tel:${selectedMember.phone}`}
                className="flex items-center gap-3 bg-forest-green/10 hover:bg-forest-green hover:text-white transition-colors rounded-xl px-5 py-3 text-forest-green font-bold text-sm w-full"
              >
                <Phone size={16} />
                {selectedMember.phone}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-center justify-center bg-forest-green text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img
          src="https://i.imgur.com/c2tmG1v.jpeg"
          alt="School children in Kenya"
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
        />
        <div className="relative z-20 text-center px-6 max-w-5xl pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="w-10 h-1 bg-white/40" />
            <p className="text-sm font-bold tracking-[0.4em] uppercase">About Us &amp; Our Story</p>
            <span className="w-10 h-1 bg-white/40" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-display font-bold leading-tight"
          >
            Who We Are &amp; <br /><i>Why We Started</i>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            A student-led initiative born from a single charity visit and a conviction that
            privilege carries responsibility.
          </motion.p>
        </div>
      </section>

      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 bg-white/90 backdrop-blur px-6 py-3 rounded-full text-muted-text hover:text-forest-green transition-all font-medium border border-gray-100"
      >
        <ArrowLeft size={20} /> Home
      </button>

      <div className="max-w-5xl mx-auto px-6 py-24 space-y-36">

        {/* ── Origin Story ── */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight">
              It started with a charity visit and a moment of <i>reckoning.</i>
            </h2>
            <p className="text-xl text-muted-text leading-relaxed">
              A few years ago, our founder went on a charity visit with their school. Seeing the
              conditions these children were living in — despite their joy — made one thing
              undeniably clear: the opportunity to learn, to grow, to simply be in a classroom, is
              not equally distributed. That moment planted the seed.
            </p>
            <p className="text-xl text-muted-text leading-relaxed">
              That is why, this year, FundED Futures was born.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-video rounded-[3rem] overflow-hidden border border-gray-100"
          >
            <img
              src="https://i.imgur.com/I1yj9CJ.jpeg"
              alt="Student focused on study"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </section>

        {/* ── Who We Are ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-display font-bold">Who We Are</h2>
            <p className="text-lg text-muted-text leading-relaxed">
              FundED Futures is a <strong>student-led non-profit initiative</strong> founded at
              Strathmore School, driven by a team of eight students from Strathmore School and the
              Nairobi International School. Our goal is to finance the educational needs of children
              from underserved communities across Kenya.
            </p>
            <p className="text-lg text-muted-text leading-relaxed">
              We have identified <strong>125 children</strong> from slum communities and children's
              homes whose educational needs we are committed to supporting. Our fundraising target is{' '}
              <strong>KSH 3,200,000</strong>, to be raised between May and November 2026.
            </p>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-frosted-blue/20 rounded-[3rem] p-4">
              <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden border border-white">
                <img
                  src="https://i.imgur.com/7cpCsAt.jpeg"
                  alt="Mission in action"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-[2.5rem] max-w-[240px] border border-gray-100 hidden lg:block">
              <p className="text-xs italic font-medium opacity-80 mb-2">
                "Opportunity is the fuel of potential. We ensure that fuel never runs dry."
              </p>
              <span className="text-[10px] font-bold text-forest-green uppercase tracking-widest">
                — The Founder
              </span>
            </div>
          </div>
        </section>

        {/* ── Core Pillars ── */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">Our Four Pillars</h2>
            <p className="text-lg text-muted-text">
              Everything we do is guided by these core commitments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <Heart size={22} />,
                title: 'Radical Empathy',
                desc: 'We place ourselves in the shoes of the families we serve — every decision starts there.',
              },
              {
                icon: <Target size={22} />,
                title: 'Precision Impact',
                desc: 'Every shilling is tracked and verified for maximum efficacy. No middle-man, no cash handling by parents.',
              },
              {
                icon: <Users size={22} />,
                title: 'Community Wisdom',
                desc: "We don't impose solutions; we listen to local leaders and community voices first.",
              },
              {
                icon: <Globe size={22} />,
                title: 'Global Responsibility',
                desc: 'Empowering one child in Kenya strengthens the global future. Local action, global consequence.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-5 p-6 bg-white rounded-[2rem] border border-gray-100 hover:border-forest-green/30 transition-all"
              >
                <div className="w-12 h-12 bg-forest-green/10 rounded-xl flex items-center justify-center text-forest-green flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <span className="font-bold block mb-1">{item.title}</span>
                  <span className="text-sm text-muted-text leading-relaxed">{item.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Progress So Far ── */}
        <section className="py-20 bg-frosted-blue/10 rounded-[4rem] px-8 md:px-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Progress So Far</h2>
            <p className="text-lg text-muted-text">
              We've been running for a few months, and we've already hit the ground running.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100"
              >
                <span className="text-forest-green mt-0.5 flex-shrink-0">{m.icon}</span>
                <p className="text-sm font-medium leading-relaxed">{m.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── Meet the Team ── */}
        <section className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">Meet the Team</h2>
            <p className="text-lg text-muted-text max-w-2xl leading-relaxed">
              Click any card to get in touch. Eight students. Equal ownership. One shared mission.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {/* Austin Muniu — light green featured card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() =>
                setSelectedMember({
                  name: 'Austin Muniu',
                  role: 'Founder',
                  desc: 'Overall oversight and running of the project — the vision holder who set everything in motion.',
                  phone: '0785669667',
                })
              }
              className="sm:col-span-2 lg:col-span-1 flex flex-col gap-3 p-7 bg-forest-green/10 border border-forest-green/20 text-deep-slate rounded-[2rem] cursor-pointer hover:border-forest-green/50 hover:bg-forest-green/15 transition-all"
            >
              <div className="w-12 h-12 bg-forest-green/20 rounded-xl flex items-center justify-center text-forest-green">
                <BookOpen size={22} />
              </div>
              <div>
                <span className="font-bold text-lg block text-deep-slate">Austin Muniu</span>
                <span className="text-xs text-forest-green uppercase tracking-widest font-bold">
                  Founder
                </span>
              </div>
              <p className="text-sm text-muted-text leading-relaxed">
                Overall oversight and running of the project — the vision holder who set everything
                in motion.
              </p>
            </motion.div>

            {/* Xavi Odumbe — light green card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() =>
                setSelectedMember(
                  teamMembers.find((m) => m.name === 'Xavi Odumbe') ?? null
                )
              }
              className="flex flex-col gap-3 p-6 bg-forest-green/10 border border-forest-green/20 rounded-[2rem] cursor-pointer hover:border-forest-green/50 hover:bg-forest-green/15 transition-all"
            >
              <div className="w-10 h-10 bg-forest-green/20 rounded-xl flex items-center justify-center text-forest-green font-bold text-sm">
                X
              </div>
              <div>
                <span className="font-bold block text-deep-slate">Xavi Odumbe</span>
                <span className="text-xs text-forest-green font-bold uppercase tracking-widest">
                  Technology &amp; Operations
                </span>
              </div>
              <p className="text-sm text-muted-text leading-relaxed">
                Oversees technology infrastructure and coordinates department workflows
              </p>
            </motion.div>

            {/* Remaining team members */}
            {teamMembers
              .filter((m) => m.name !== 'Xavi Odumbe')
              .map((member, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  onClick={() => setSelectedMember(member)}
                  className="flex flex-col gap-3 p-6 bg-white border border-gray-100 rounded-[2rem] hover:border-forest-green/30 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 bg-forest-green/10 rounded-xl flex items-center justify-center text-forest-green font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold block">{member.name}</span>
                    <span className="text-xs text-forest-green font-bold uppercase tracking-widest">
                      {member.role}
                    </span>
                  </div>
                  <p className="text-sm text-muted-text leading-relaxed">{member.desc}</p>
                </motion.div>
              ))}
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="text-center pb-20 space-y-8">
          <h2 className="text-5xl md:text-7xl font-display font-bold">
            Join us in <br /><i>Funding the Future.</i>
          </h2>
          <p className="text-xl text-muted-text max-w-xl mx-auto">
            Whether you donate, volunteer, or share our story — you are part of the solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              variant="primary"
              className="w-full sm:w-auto px-12"
              onClick={() => navigate('/donate')}
            >
              Donate Powerfully
            </Button>
            <Button
              variant="ghost"
              className="w-full sm:w-auto px-12"
              onClick={() => navigate('/join-volunteer')}
            >
              Become a Volunteer
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
