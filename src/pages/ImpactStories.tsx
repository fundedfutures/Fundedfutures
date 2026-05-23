import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Quote } from 'lucide-react';
import { Button, Card } from '../components/UI';

const stories = [
  {
    name: "Favour",
    age: 12,
    grade: "Grade 7",
    location: "New Kihumbuini, Kangemi",
    story: "Favour is a young, intelligent girl with dreams of becoming a doctor, but those dreams need protecting now before it's too late. She lives with her mother, as her father frequently abandons the family and contributes nothing. Despite everything, Favour consistently tops her class and stays within the top three, but mounting pressure at home threatens to chip away at those marks. Her mother still carries the added burden of supporting an elderly grandmother whose own sons have walked away. Favour deserves the chance to become the doctor she is capable of being, and right now, keeping her in school is where it starts.",
    image: "https://i.imgur.com/ofcYaI7.jpeg"
  },
  {
    name: "Kelvin",
    age: 13,
    grade: "Grade 8",
    location: "New Kihumbuini, Kangemi",
    story: "Kelvin has been drawn to wiring and engineering for as long as he can remember. He is gifted and curious, but his life has been shaped by loss from the very beginning. His mother, who shielded him from his father's alcoholism, passed away, leaving him with his aunt as guardian while his father retreated to the countryside. His aunt does what she can, but school fees are mounting and the threat of Kelvin being forced to leave school is very real. He holds tightly to his dream of becoming an engineer, and right now, that dream needs someone to hold it with him.",
    image: "https://i.imgur.com/bUhHr0O.jpeg"
  },
  {
    name: "Raynor",
    age: 5,
    grade: "PP2",
    location: "Joy Beginners, Kangemi",
    story: "Raynor's father walked away when he was just two years old, leaving his mother, a hairdresser, to support both Raynor and an aging grandmother with bone problems that require ongoing medical costs. Raynor is currently out of school due to fee arrears. He loves football and swimming, but he always feels left out when it's time for school. He is five years old and already facing a closed door. Raynor deserves a real shot at the future he was born to have, and school fees are the one bump in the road you can help him cross.",
    image: "https://i.imgur.com/eugm70o.jpeg"
  },
  {
    name: "Levinah",
    age: 12,
    grade: "Grade 7",
    location: "Loresho Primary, Kangemi",
    story: "Levinah lost her mother when she was young, and her father was never part of her life. A guardian with no obligation chose to take in Levinah and her two siblings, an act of extraordinary kindness. He works at a post office, doing his best to support three children who are not his own, but his income cannot keep pace with rent, food, and school fees. Levinah has been sent home more than once for unpaid fees, still fighting to hold her place in Grade 7. She did not choose any of this, yet she keeps showing up.",
    image: "https://i.imgur.com/dOiqDts.jpeg"
  },
  {
    name: "Adrian",
    age: 9,
    grade: "Grade 3",
    location: "Hillstar, Kangemi",
    story: "Adrian is a young footballer with a dream to chase and the ambition to back it up. Inspired by his older brother and his father, he has been passionate about football from a young age, but he has never been given the environment or opportunity to let that talent be seen. He doesn't have a conducive place to study or reliable food to keep his body strong. Every child deserves the chance to fully chase their dreams, and for Adrian, the barrier standing in the way right now is school fees.",
    image: "https://i.imgur.com/csYrt0d.jpeg"
  },
  {
    name: "Hope",
    age: 16,
    grade: "Form 3",
    location: "Kangemi",
    story: "Hope — At sixteen, Hope carries a weight that would break most adults, navigating a life that has been stripped of its foundation in a devastatingly short time. After the consecutive losses of his father and brother, his family's remaining stability vanished when his mother lost her employment, leaving him stuck at home and unable to attend Form 3 due to unpaid school fees. Despite the profound psychological toll of his grief and the precarious nature of his living conditions, Hope's intellectual light remains undimmed; he recently ranked 7th out of 49 students, a testament to his resilience in the face of absolute hardship. Referred to us by a neighbor who understands the sting of poverty, Hope is driven by a singular, selfless ambition: to master the world of IT so he can become the provider his family so desperately needs. He is a young man of immense potential standing at a crossroads, needing only the bridge of financial support to turn his academic brilliance into a career that can lift his mother out of despair.",
    image: "https://i.imgur.com/mCCRmmY.jpeg"
  }
];

export default function ImpactStories() {
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-10 leading-tight">
              Students We're <span className="text-forest-green">Fighting For</span>
            </h1>
            <div className="relative p-8 md:p-12 bg-frosted-blue/20 rounded-[3rem] border border-frosted-blue/30 overflow-hidden group">
              <Quote className="absolute -top-4 -left-4 w-24 h-24 text-frosted-blue/20 rotate-18" />
              <p className="text-2xl md:text-3xl text-deep-slate/90 leading-relaxed font-display italic relative z-10">
                "These are the students at the centre of our mission. Every donation brings us one step closer to reaching them."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          {stories.map((story, idx) => (
            <Card
              key={idx}
              className="p-0 !rounded-[4rem]"
            >
              <div className="h-72 overflow-hidden relative">
                <img 
                  src={story.image} 
                  alt={story.name} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-slate/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                  <div className="text-white">
                    <p className="font-bold text-lg mb-1">{story.location}</p>
                    <p className="text-sm opacity-80">{story.grade}</p>
                  </div>
                </div>
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-5 py-2 rounded-full">
                  <p className="text-forest-green font-bold text-sm">Age {story.age}</p>
                </div>
              </div>

              <div className="p-10 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-10 h-[2px] bg-forest-green" />
                  <h3 className="text-3xl font-display font-medium text-deep-slate">{story.name}</h3>
                </div>
                <p className="text-deep-slate/80 leading-relaxed mb-8 flex-grow italic">
                  "{story.story}"
                </p>
                <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Verified Story</span>
                  <div className="w-10 h-10 rounded-full bg-frosted-blue/10 flex items-center justify-center text-frosted-blue group-hover:bg-forest-green group-hover:text-white transition-colors">
                    <Heart size={18} fill="currentColor" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Closing Message */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-40 p-12 md:p-20 bg-deep-slate text-snow rounded-[4rem] relative overflow-hidden text-center"
        >
          <div className="relative z-10 max-w-4xl mx-auto">
            <Quote className="w-16 h-16 text-forest-green mb-8 mx-auto opacity-50" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-10 leading-tight">
              Giving with Transparency
            </h2>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-12 italic">
              "Your donation does not just pay a school fee. It keeps a dream alive. Every shilling you give goes directly to a verified school, never to parents or intermediaries, ensuring full transparency and real impact."
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] relative group"
            >
              <p className="text-lg md:text-2xl font-bold text-snow leading-relaxed tracking-wide">
                Every contribution transforms a <span className="text-forest-green">student's future</span>. Your gift reaches the <span className="text-frosted-blue">classroom directly</span>, creating lasting change in education and opportunity.
              </p>
            </motion.div>
            
            <Button
              variant="primary"
              onClick={() => navigate('/donate')}
              className="text-xl flex items-center gap-3 mx-auto"
            >
              Donate Now <ArrowRight size={24} />
            </Button>
          </div>

          {/* Decorative accents */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-frosted-blue/10 rounded-full blur-3xl" />
        </motion.div>
      </div>
    </motion.div>
  );
}
