import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Share2, Download } from 'lucide-react';
import { Button } from '../components/UI';

const WEBSITE_URL = 'https://fundededucationfutures.com';
const PAYBILL_NUMBER = '303030';
const PAYBILL_ACCOUNT = 'UGC9#FundedFutures';

const SHARE_ASSETS = [
  {
    id: 1,
    title: "Education is a Right",
    description: "A series of visuals for Instagram & Snapchat stories.",
    image: "https://i.imgur.com/I1yj9CJ.jpeg",
    platforms: ["Instagram", "Snapchat"],
    story:
      "Education is a right, not a privilege. When a child has the support to stay in school, a whole future stays open. Help fundED futures keep education within reach for students across Kenya."
  },
  {
    id: 3,
    title: "Student Stories Loop",
    description: "Short vertical video frames for TikTok & Reels.",
    image: "https://i.imgur.com/2ZF1CuH.jpeg",
    platforms: ["TikTok", "Reels"],
    story:
      "Behind every student is a dream worth protecting. Share the fundED futures story and help connect more children with the fees, materials, and encouragement they need to keep learning."
  }
];

type ShareAsset = (typeof SHARE_ASSETS)[number];

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text: string, maxCharacters: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxCharacters && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function createPosterSvg(asset: ShareAsset) {
  const storyLines = wrapText(asset.story, 36);
  const storyMarkup = storyLines
    .slice(0, 7)
    .map(
      (line, index) =>
        `<text x="72" y="${560 + index * 36}" class="story">${escapeXml(line)}</text>`,
    )
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
      <defs>
        <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d8f0ed"/>
          <stop offset="100%" stop-color="#9fcfca"/>
        </linearGradient>
        <clipPath id="imageClip">
          <rect x="0" y="0" width="1080" height="430" rx="0"/>
        </clipPath>
        <style>
          .brand { font: 700 36px Arial, sans-serif; letter-spacing: 1px; }
          .eyebrow { font: 700 22px Arial, sans-serif; letter-spacing: 4px; }
          .title { font: 700 66px Arial, sans-serif; }
          .story { font: 400 28px Arial, sans-serif; }
          .small { font: 700 22px Arial, sans-serif; }
        </style>
      </defs>
      <rect width="1080" height="1350" fill="url(#background)"/>
      <image href="${escapeXml(asset.image)}" x="0" y="0" width="1080" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#imageClip)"/>
      <rect x="0" y="0" width="1080" height="430" fill="#153b3b" opacity="0.38"/>
      <text x="72" y="92" fill="#ffffff" class="brand">fundED futures</text>
      <text x="72" y="505" fill="#1d4c49" class="eyebrow">SHARE THE MISSION</text>
      <text x="72" y="625" fill="#163f3d" class="title">${escapeXml(asset.title)}</text>
      ${storyMarkup}
      <line x1="72" y1="850" x2="1008" y2="850" stroke="#1d4c49" stroke-opacity="0.25"/>
      <text x="72" y="925" fill="#163f3d" class="small">Support education in Kenya</text>
      <text x="72" y="978" fill="#163f3d" class="small">Paybill ${PAYBILL_NUMBER}  •  ${escapeXml(PAYBILL_ACCOUNT)}</text>
      <text x="72" y="1060" fill="#163f3d" class="small">${WEBSITE_URL.replace('https://', '')}</text>
      <text x="72" y="1255" fill="#163f3d" class="brand">A better world begins in the mind of a child.</text>
    </svg>
  `.trim();
}

function downloadPoster(asset: ShareAsset) {
  const blob = new Blob([createPosterSvg(asset)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${asset.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function getShareText(asset: ShareAsset) {
  return `${asset.title}

${asset.story}

Support fundED futures:
Paybill ${PAYBILL_NUMBER}
Account: ${PAYBILL_ACCOUNT}
${WEBSITE_URL}`;
}

export default function ShareWork() {
  const navigate = useNavigate();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(WEBSITE_URL);
    alert("Website link copied!");
  };

  const handleCopyAsset = async (asset: ShareAsset) => {
    await navigator.clipboard.writeText(getShareText(asset));
    alert("Share text copied!");
  };

  const handleShareAsset = async (asset: ShareAsset) => {
    if (navigator.share) {
      await navigator.share({
        title: asset.title,
        text: getShareText(asset),
        url: WEBSITE_URL,
      });
      return;
    }

    await handleCopyAsset(asset);
  };

  return (
    <div className="min-h-screen bg-snow text-deep-slate font-body">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-text hover:text-forest-green transition-colors mb-12 font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Share Our Mission</h1>
          <p className="text-xl text-muted-text max-w-2xl mx-auto">
            Your voice is powerful. Use these visuals to spread awareness and help us reach more children.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {SHARE_ASSETS.map((asset, idx) => (
            <motion.div 
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] overflow-hidden border border-frosted-blue/20 flex flex-col"
            >
              <div className="h-64 relative overflow-hidden group">
                <img 
                  src={asset.image} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-forest-green/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label={`Download ${asset.title}`}
                    onClick={() => downloadPoster(asset)}
                    className="bg-white p-4 rounded-full text-forest-green hover:bg-forest-green hover:text-white transition-colors"
                  >
                    <Download size={24} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Share ${asset.title}`}
                    onClick={() => handleShareAsset(asset)}
                    className="bg-white p-4 rounded-full text-forest-green hover:bg-forest-green hover:text-white transition-colors"
                  >
                    <Share2 size={24} />
                  </button>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {asset.platforms.map(p => (
                    <span key={p} className="text-[10px] font-bold uppercase tracking-widest bg-frosted-blue/20 text-deep-slate px-3 py-1 rounded-full">{p}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-display font-bold">{asset.title}</h3>
                <p className="text-muted-text">{asset.description}</p>
                <div className="pt-4 flex gap-4">
                  <Button
                    variant="primary"
                    className="flex-1 py-3 text-sm"
                    onClick={() => downloadPoster(asset)}
                  >
                    Download Asset
                  </Button>
                  <button
                    type="button"
                    aria-label={`Copy ${asset.title} share text`}
                    onClick={() => handleCopyAsset(asset)}
                    className="bg-snow p-3 rounded-2xl text-muted-text hover:text-forest-green transition-colors border border-gray-100"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 bg-forest-green text-white rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Quick Share Link</h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Alternatively, you can just share our website link directly with your friends and family.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-3xl font-mono text-sm max-w-sm truncate">
                {WEBSITE_URL}
              </div>
              <Button 
                variant="gold" 
                className="py-5 px-10 flex items-center gap-2"
                onClick={handleCopyLink}
              >
                <Copy size={18} /> Copy Website Link
              </Button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </div>
    </div>
  );
}
