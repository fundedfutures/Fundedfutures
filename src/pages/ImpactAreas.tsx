import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Globe, 
  Baby, 
  Users, 
  Scale, 
  BookOpen, 
  X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/UI';

const impactAreas = [
  {
    title: "Access to Education",
    description: "Expanding access to education for marginalized children across communities in Kenya.",
    icon: <Globe size={32} />,
    image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2022&auto=format&fit=crop"
  },
  {
    title: "Early Learning",
    description: "Supporting communities in Kenya to improve access and quality learning for all children in the early years.",
    icon: <Baby size={32} />,
    image: "https://i.imgur.com/fXTrPWb.jpeg"
  },
  {
    title: "Gender Equality",
    description: "Committed to ensuring all girls and boys in communities in Kenya have the same opportunities for education.",
    icon: <Users size={32} />,
    image: "https://i.imgur.com/9OnvAiN.jpeg"
  },
  {
    title: "Inclusive Education",
    description: "Making education more accessible and free of discrimination so that no child is left behind.",
    icon: <Scale size={32} />,
    image: "https://i.imgur.com/7cpCsAt.jpeg"
  },
  {
    title: "Learning",
    description: "Helping millions more children in communities in Kenya learn the essential skills they need to thrive in the 21st century.",
    icon: <BookOpen size={32} />,
    image: "https://i.imgur.com/7zkUXXt.jpeg"
  },
  {
    title: "Safe Learning",
    description: "Addressing violence in and around schools that affects children's learning, safety, and school attendance.",
    icon: <Scale size={32} />,
    image: "https://i.imgur.com/TMBfL75.jpeg"
  }
];

export default function ImpactAreas() {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<any>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-snow pt-32 pb-24 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-forest-green font-semibold mb-8 hover:gap-3 transition-all">
          <ArrowLeft size={20} />
          Back to Home
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 text-deep-slate">Impact Areas</h1>
          <p className="text-lg md:text-xl text-muted-text max-w-3xl leading-relaxed">
            Our focus areas represent the most critical challenges and opportunities in education across communities in Kenya. By addressing these key sectors, we ensure a holistic approach to student success and community development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {impactAreas.map((area, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              onClick={() => setSelectedArea(area)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={area.image} 
                  alt={area.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <span className="text-white text-sm font-medium">Learn more</span>
                </div>
                <div className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center text-forest-green">
                  {area.icon}
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-display font-bold mb-3 text-deep-slate group-hover:text-forest-green transition-colors">
                  {area.title}
                </h3>
                <p className="text-sm text-muted-text leading-relaxed line-clamp-3">
                  {area.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedArea && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6 py-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedArea(null)}
              className="absolute inset-0 bg-deep-slate/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden"
            >
              <button 
                onClick={() => setSelectedArea(null)}
                className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-deep-slate hover:bg-forest-green hover:text-white transition-colors border border-gray-100"
              >
                <X size={20} />
              </button>
              
              <div className="h-64 relative">
                <img 
                  src={selectedArea.image} 
                  alt={selectedArea.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <div className="w-16 h-16 bg-forest-green text-white rounded-2xl flex items-center justify-center mb-4">
                    {selectedArea.icon}
                  </div>
                </div>
              </div>
              
              <div className="p-10 pt-6">
                <h2 className="text-3xl font-display font-bold mb-4 text-deep-slate">{selectedArea.title}</h2>
                <p className="text-lg text-muted-text leading-relaxed mb-8">
                  {selectedArea.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="primary" 
                    className="flex-grow"
                    onClick={() => navigate('/donate')}
                  >
                    Support These Initiatives
                  </Button>
                  <Button variant="ghost" className="flex-grow" onClick={() => setSelectedArea(null)}>Close Details</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
