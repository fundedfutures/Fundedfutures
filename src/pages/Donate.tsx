import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Lock,
  Heart,
  CheckCircle2,
  Copy,
  X,
  ChevronDown
} from 'lucide-react';
import { Button, Card } from '../components/UI';

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxvKet1fJYxLHm8GShvLuZLxsx3rP5T0snZuz2aDh02dJPKLRgjcxIR_ETk8-nInC5j/exec";

const PAYMENT_METHODS = [
  { 
    id: 'mpesa', 
    name: 'M-PESA Paybill', 
    label: 'M-PESA',
    description: 'Pay via Business No. 303030 — Acc: UGC9#fundedfutures'
  }
];

const CURRENCY_CONFIG: Record<string, { 
  name: string; 
  symbol: string; 
  flag: string; 
  min: number; 
  max: number; 
  step: number;
  presets: number[];
}> = {
  KES: { 
    name: 'Kenyan Shilling', 
    symbol: 'KES', 
    flag: '🇰🇪', 
    min: 50, 
    max: 1000000, 
    step: 1,
    presets: [500, 1000, 5000, 10000, 50000] 
  },
  USD: { 
    name: 'US Dollar', 
    symbol: '$', 
    flag: '🇺🇸', 
    min: 10, 
    max: 10000, 
    step: 1,
    presets: [10, 50, 100, 500, 1000] 
  },
  GBP: { 
    name: 'British Pound', 
    symbol: '£', 
    flag: '🇬🇧', 
    min: 10, 
    max: 10000, 
    step: 1,
    presets: [10, 50, 100, 500, 1000] 
  },
  EUR: { 
    name: 'Euro', 
    symbol: '€', 
    flag: '🇪🇺', 
    min: 10, 
    max: 10000, 
    step: 1,
    presets: [10, 50, 100, 500, 1000] 
  },
  CAD: { 
    name: 'Canadian Dollar', 
    symbol: 'CA$', 
    flag: '🇨🇦', 
    min: 10, 
    max: 10000, 
    step: 1,
    presets: [10, 50, 100, 500, 1000] 
  },
  AUD: { 
    name: 'Australian Dollar', 
    symbol: 'A$', 
    flag: '🇦🇺', 
    min: 10, 
    max: 10000, 
    step: 1,
    presets: [10, 50, 100, 500, 1000] 
  },
  ZAR: { 
    name: 'South African Rand', 
    symbol: 'R', 
    flag: '🇿🇦', 
    min: 100, 
    max: 100000, 
    step: 1,
    presets: [100, 500, 1000, 5000, 10000] 
  },
  NGN: { 
    name: 'Nigerian Naira', 
    symbol: '₦', 
    flag: '🇳🇬', 
    min: 500, 
    max: 5000000, 
    step: 100,
    presets: [500, 1000, 5000, 50000, 100000] 
  },
};

const MILESTONES: Record<string, { threshold: number; message: string }[]> = {
  KES: [
    { threshold: 50, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 200, message: "Two hundred shillings — a child's exercise books for a term." },
    { threshold: 500, message: "Five hundred shillings closer to a brighter classroom. Thank you." },
    { threshold: 1000, message: "A thousand shillings — a child's supplies for a full term. Beautiful." },
    { threshold: 2000, message: "Two thousand shillings — a child's books and supplies for a term. Beautiful." },
    { threshold: 5000, message: "Half of a child's term fees. You are halfway to something incredible." },
    { threshold: 10000, message: "You've just covered a full term's school fees for one child. Thank you!" },
    { threshold: 20000, message: "Two children will stay in school because of you. That's extraordinary!" },
    { threshold: 50000, message: "You are becoming a cornerstone of this community. Thank you!" },
    { threshold: 100000, message: "One hundred thousand shillings. You've just sponsored an entire year of education for a child. Life-changing." },
    { threshold: 250000, message: "A quarter of a million shillings — you are rewriting futures." },
    { threshold: 500000, message: "Halfway to a million — your heart is as big as your vision." },
    { threshold: 1000000, message: "One million shillings. You have just transformed the future of an entire community. From every child, every family, and every member of our team — asante sana. Thank you." },
  ],
  USD: [
    { threshold: 10, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 50, message: "Fifty dollars — a child's books and supplies for a term." },
    { threshold: 100, message: "A hundred dollars closer to a brighter classroom. Thank you." },
    { threshold: 500, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 1000, message: "Two children will stay in school because of you. That's extraordinary!" },
    { threshold: 2500, message: "You are becoming a cornerstone of this community. Thank you!" },
    { threshold: 5000, message: "Five thousand dollars. You've just sponsored an entire year of education for a child. Life-changing." },
    { threshold: 10000, message: "Ten thousand dollars. You have just transformed the future of an entire community. Thank you, from the bottom of our hearts." },
  ],
  GBP: [
    { threshold: 10, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 50, message: "Fifty pounds — a child's books and supplies for a term." },
    { threshold: 100, message: "A hundred pounds closer to a brighter classroom. Thank you." },
    { threshold: 500, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 1000, message: "Two children will stay in school because of you. That's extraordinary!" },
    { threshold: 2500, message: "You are becoming a cornerstone of this community. Thank you!" },
    { threshold: 5000, message: "Five thousand pounds. You've just sponsored an entire year of education for a child. Life-changing." },
    { threshold: 10000, message: "Ten thousand pounds. You have just transformed the future of an entire community. Thank you, from the bottom of our hearts." },
  ],
  EUR: [
    { threshold: 10, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 50, message: "Fifty euros — a child's books and supplies for a term." },
    { threshold: 500, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 5000, message: "Five thousand euros. Life-changing generosity. Thank you." },
    { threshold: 10000, message: "Ten thousand euros. You have transformed the future of an entire community. Thank you." },
  ],
  CAD: [
    { threshold: 10, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 50, message: "Fifty Canadian dollars — a child's books and supplies for a term." },
    { threshold: 500, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 5000, message: "Five thousand dollars. Life-changing generosity. Thank you." },
    { threshold: 10000, message: "Ten thousand dollars. You have transformed the future of an entire community. Thank you." },
  ],
  AUD: [
    { threshold: 10, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 50, message: "Fifty Australian dollars — a child's books and supplies for a term." },
    { threshold: 500, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 5000, message: "Five thousand dollars. Life-changing generosity. Thank you." },
    { threshold: 10000, message: "Ten thousand dollars. You have transformed the future of an entire community. Thank you." },
  ],
  ZAR: [
    { threshold: 100, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 500, message: "Five hundred rand — a child's books and supplies." },
    { threshold: 5000, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 50000, message: "Fifty thousand rand. Life-changing generosity. Thank you." },
    { threshold: 100000, message: "One hundred thousand rand. You have transformed the future of an entire community. Thank you." },
  ],
  NGN: [
    { threshold: 500, message: "Every journey begins with a single step. Thank you for taking yours!" },
    { threshold: 5000, message: "Five thousand naira — a child's books and supplies for a term." },
    { threshold: 50000, message: "You've just covered a term's school fees for one child. Thank you!" },
    { threshold: 500000, message: "Half a million naira. Life-changing generosity. Thank you." },
    { threshold: 5000000, message: "Five million naira. You have transformed the future of an entire community. Thank you." },
  ],
};

const InstructionModal = ({ isOpen, onClose, method, amount, currency }: any) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!method) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const businessNo = "303030";
  const accountNo = "UGC9#fundedfutures";
  const config = CURRENCY_CONFIG[currency];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-deep-slate/80 backdrop-blur-md z-[200]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[201] p-6">
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-snow max-w-md w-full rounded-[3rem] p-8 md:p-10 pointer-events-auto relative border border-white/20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
            >
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-3 bg-white/50 hover:bg-white rounded-full text-deep-slate transition-all z-20"
              >
                <X size={20} />
              </button>

              <div className="relative z-10 text-center">
                <h3 className="text-2xl font-display font-bold text-deep-slate mb-2">
                  Lipa na <span className="text-forest-green italic">M-PESA</span>
                </h3>
                <p className="text-sm text-muted-text font-medium mb-8">Follow these steps carefully</p>
                
                <div className="space-y-4 text-left">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-text font-bold uppercase tracking-widest text-[10px]">Business Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">{businessNo}</span>
                        <button 
                          onClick={() => copyToClipboard(businessNo, 'business')}
                          className={`p-2 rounded-lg transition-all ${copiedField === 'business' ? 'bg-forest-green text-white' : 'bg-forest-green/5 text-forest-green hover:bg-forest-green/10'}`}
                        >
                          {copiedField === 'business' ? <span className="text-[10px] font-bold">Copied!</span> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                      <span className="text-muted-text font-bold uppercase tracking-widest text-[10px]">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-lg">{accountNo}</span>
                        <button 
                          onClick={() => copyToClipboard(accountNo, 'account')}
                          className={`p-2 rounded-lg transition-all ${copiedField === 'account' ? 'bg-forest-green text-white' : 'bg-forest-green/5 text-forest-green hover:bg-forest-green/10'}`}
                        >
                          {copiedField === 'account' ? <span className="text-[10px] font-bold">Copied!</span> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-50">
                      <span className="text-muted-text font-bold uppercase tracking-widest text-[10px]">Amount</span>
                      <span className="font-mono font-bold text-lg text-forest-green">{config.symbol} {amount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-forest-green/5 p-4 rounded-2xl">
                    <ol className="text-xs space-y-2 font-medium text-deep-slate/80 list-decimal list-inside">
                      <li>Go to <span className="font-bold">Lipa na M-PESA</span> menu</li>
                      <li>Select <span className="font-bold">Pay Bill</span></li>
                      <li>Enter the Business No. and Account No. above</li>
                      <li>Enter your <span className="font-bold">M-PESA PIN</span> to complete</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <Button 
                    variant="primary" 
                    className="w-full py-5 text-lg"
                    onClick={onClose}
                  >
                    I have made the payment
                  </Button>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-text opacity-50">
                    Then enter your code in the summary field
                  </p>
                </div>
              </div>
              
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-forest-green/5 rounded-full blur-3xl pointer-events-none" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function Donate() {
  const navigate = useNavigate();
  const [currencyCode, setCurrencyCode] = useState<string>('KES');
  const [amount, setAmount] = useState<number>(500);
  const [amountInput, setAmountInput] = useState<string>('500');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('mpesa');
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');

  const config = CURRENCY_CONFIG[currencyCode];

  const activeMilestone = useMemo(() => {
    const currencyMilestones = MILESTONES[currencyCode] || [];
    const reached = currencyMilestones.filter(m => amount >= m.threshold);
    return reached.length > 0 ? reached[reached.length - 1] : null;
  }, [amount, currencyCode]);

  const handleCurrencyChange = (code: string) => {
    setCurrencyCode(code);
    const newMin = CURRENCY_CONFIG[code].min;
    setAmount(newMin);
    setAmountInput(String(newMin));
    setPaymentMethod('mpesa');
    setError('');
    setCurrencyDropdownOpen(false);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setAmount(val);
    setAmountInput(String(val));
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setAmountInput(raw);
    const num = parseInt(raw);
    if (!isNaN(num)) {
      const clamped = Math.min(Math.max(num, config.min), config.max);
      setAmount(clamped);
    }
  };

  const handleAmountInputBlur = () => {
    const num = parseInt(amountInput);
    if (isNaN(num) || num < config.min) {
      setAmount(config.min);
      setAmountInput(String(config.min));
    } else if (num > config.max) {
      setAmount(config.max);
      setAmountInput(String(config.max));
    } else {
      setAmount(num);
      setAmountInput(String(num));
    }
  };

  const handlePresetClick = (val: number) => {
    setAmount(val);
    setAmountInput(String(val));
  };

  const handleMethodSelect = (methodId: string) => {
    setPaymentMethod(methodId);
    
    if (methodId === 'mpesa') {
      const businessNo = "303030";
      const accountNo = "UGC9#fundedfutures";
      const mpesaUrl = `mpesa://paybill?business=${businessNo}&account=${accountNo}&amount=${amount}`;
      try {
        window.location.href = mpesaUrl;
      } catch (e) {
        console.log("Deep link not supported");
      }
    }
    
    setShowInstructions(true);
    setError('');
  };

  const handleDonate = async () => {
    if (!confirmationCode || confirmationCode.trim().length < 5) {
      setError('A valid confirmation code is mandatory to track your donation.');
      return;
    }
    setError('');
    setIsProcessing(true);

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script requires no-cors from browser
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: donorName.trim() || 'Anonymous',
          donorEmail: donorEmail.trim(),
          amount,
          currency: currencyCode,
          confirmationCode: confirmationCode.trim().toUpperCase(),
          timestamp: new Date().toISOString(),
        }),
      });
      // no-cors means we can't read the response, but the script still receives it
    } catch (err) {
      // Silently fail — don't block the donor from the thank-you page
      console.error('Logging error:', err);
    }

    setIsProcessing(false);
    navigate('/thank-you');
  };

  return (
    <div className="min-h-screen bg-snow text-deep-slate font-body relative overflow-x-hidden selection:bg-forest-green/20">
      <InstructionModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)}
        method={PAYMENT_METHODS.find(m => m.id === paymentMethod)}
        amount={amount}
        currency={currencyCode}
      />

      <header className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-between sticky top-0 bg-snow/80 backdrop-blur-md z-50">
        <div className="text-2xl font-display font-bold">
          fund<span className="text-forest-green">ED</span> futures
        </div>
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-text hover:text-forest-green transition-colors font-bold group text-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Site
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-display font-bold text-deep-slate"
          >
            Create <span className="text-forest-green italic">Impact</span>
          </motion.h1>
          <p className="text-lg text-muted-text max-w-xl mx-auto font-medium">
            Your contribution provides school fees, uniforms, and books directly to children in need.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">

            {/* Currency Selector — Dropdown */}
            <div className="bg-white p-8 rounded-[3rem] border border-gray-100 relative">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text mb-4">Preferred Currency</label>
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full flex items-center justify-between px-6 py-4 bg-snow rounded-2xl border-2 border-transparent hover:border-forest-green/20 transition-all font-bold"
              >
                <span className="flex items-center gap-3 text-lg">
                  <span>{config.flag}</span>
                  <span>{currencyCode}</span>
                  <span className="text-muted-text font-normal text-sm">— {config.name}</span>
                </span>
                <ChevronDown size={18} className={`text-forest-green transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {currencyDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-8 right-8 top-full mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden"
                  >
                    {Object.entries(CURRENCY_CONFIG).map(([code, cfg]) => (
                      <button
                        key={code}
                        onClick={() => handleCurrencyChange(code)}
                        className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-forest-green/5 transition-colors font-medium ${code === currencyCode ? 'bg-forest-green/5 text-forest-green' : 'text-deep-slate'}`}
                      >
                        <span className="text-xl">{cfg.flag}</span>
                        <span className="font-bold">{code}</span>
                        <span className="text-muted-text text-sm font-normal">— {cfg.name}</span>
                        {code === currencyCode && <CheckCircle2 size={16} className="ml-auto text-forest-green" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Donation Amount */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
              
              {/* Manual Amount Input */}
              <div className="mb-8">
                <label className="block text-xs font-bold uppercase tracking-widest text-muted-text mb-3">Enter Amount</label>
                <div className="flex items-center gap-3 bg-snow rounded-2xl px-6 py-4 border-2 border-transparent focus-within:border-forest-green/30 transition-all">
                  <span className="text-forest-green font-bold text-lg opacity-60">{config.symbol}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amountInput}
                    onChange={handleAmountInputChange}
                    onBlur={handleAmountInputBlur}
                    className="flex-1 bg-transparent outline-none font-bold text-2xl text-deep-slate placeholder:text-muted-text/30"
                    placeholder={String(config.min)}
                  />
                  <span className="text-muted-text text-xs font-bold uppercase tracking-widest">{currencyCode}</span>
                </div>
                <p className="text-[10px] text-muted-text mt-2 ml-2 font-medium">
                  Min: {config.symbol}{config.min.toLocaleString()} — Max: {config.symbol}{config.max.toLocaleString()}
                </p>
              </div>

              {/* Milestone message */}
              <div className="text-center mb-8 min-h-[3rem] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {activeMilestone && (
                    <motion.p
                      key={`${currencyCode}-${activeMilestone.threshold}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="text-forest-green font-display italic text-lg leading-relaxed px-4"
                    >
                      "{activeMilestone.message}"
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-8">
                <input 
                  type="range"
                  min={config.min}
                  max={config.max}
                  step={config.step}
                  value={amount}
                  onChange={handleSliderChange}
                  className="w-full h-3 bg-snow rounded-full appearance-none cursor-pointer accent-forest-green"
                />

                {/* Preset buttons */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                  {config.presets.map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePresetClick(p)}
                      className={`py-3 rounded-2xl border-2 font-bold transition-all text-sm ${
                        amount === p ? 'bg-forest-green border-forest-green text-white' : 'border-gray-50 bg-gray-50 text-muted-text hover:border-gray-200'
                      }`}
                    >
                      {p.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text mb-8">Payment Secure Channel</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className={`relative flex flex-col p-8 rounded-[2.5rem] border-2 transition-all text-left group overflow-hidden active:scale-95 ${
                        isSelected ? 'border-forest-green bg-white shadow-xl shadow-forest-green/10' : 'border-gray-50 bg-snow hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className={`px-4 py-2 rounded-xl transition-all ${
                          isSelected ? 'bg-forest-green text-white shadow-md' : 'bg-forest-green/5 text-forest-green border border-forest-green/10'
                        }`}>
                          <span className="text-xs font-black tracking-widest uppercase">{method.label}</span>
                        </div>
                      </div>
                      <h4 className="font-bold text-lg text-deep-slate mb-1">{method.name}</h4>
                      <p className="text-xs text-muted-text font-medium">{method.description}</p>
                      
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-forest-green">
                          <CheckCircle2 size={24} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Checkout Summary */}
          <aside className="lg:col-span-5 space-y-8 sticky top-36">
            <div className="bg-deep-slate text-snow p-10 rounded-[3rem] relative overflow-hidden">
              <div className="relative z-10 space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-forest-green">
                    <ShieldCheck size={24} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Donation Verification</span>
                  </div>
                  <h3 className="text-2xl font-display font-bold">Checkout Summary</h3>
                </div>

                <div className="space-y-6">
                  {/* Donor Name */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50">Your Name (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-forest-green/50 transition-all font-medium text-snow placeholder:text-white/20"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                  </div>

                  {/* Donor Email — NEW */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 flex items-center justify-between">
                      Email Address
                      <span className="text-forest-green text-[9px] px-2 py-0.5 bg-forest-green/10 rounded-full">For receipt</span>
                    </label>
                    <input 
                      type="email"
                      placeholder="e.g. john@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-forest-green/50 transition-all font-medium text-snow placeholder:text-white/20"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                    />
                    <p className="text-[10px] text-white/30 font-medium ml-1">
                      You'll receive a thank-you email and bi-annual updates.
                    </p>
                  </div>
                  
                  {/* Confirmation Code */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 flex items-center justify-between">
                      Confirmation Code
                      <span className="text-forest-green text-[9px] px-2 py-0.5 bg-forest-green/10 rounded-full">Mandatory</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter M-Pesa Transaction Code"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-forest-green/50 transition-all font-bold text-snow placeholder:text-white/20 uppercase tracking-widest"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value)}
                    />
                    <p className="text-[10px] text-white/30 font-medium ml-1">
                      e.g. UEG2Y4M57P — found in your M-PESA SMS
                    </p>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-sm font-medium opacity-60">Total Donation</span>
                    <span className="text-4xl font-display font-bold text-forest-green">
                      {config.symbol}{amount.toLocaleString()}
                    </span>
                  </div>

                  {error && (
                    <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-red-400 text-xs font-bold mb-6 bg-red-400/10 p-4 rounded-xl border border-red-400/20">
                      {error}
                    </motion.p>
                  )}

                  <Button 
                    variant="gold" 
                    className="w-full py-6 text-xl"
                    onClick={handleDonate}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="w-6 h-6 border-3 border-deep-slate/20 border-t-deep-slate rounded-full animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        Submit Donation <ArrowRight size={20} />
                      </span>
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-2 opacity-30 pt-6">
                  <Lock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
                </div>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-forest-green/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            <Card className="bg-snow border-frosted-blue/10 p-8">
              <div className="flex items-center gap-4 mb-4">
                <Heart className="text-forest-green" size={24} />
                <h4 className="font-bold text-deep-slate">Your Impact</h4>
              </div>
              <p className="text-sm text-deep-slate/60 leading-relaxed font-medium">
                Every shilling or dollar goes directly to vetted schools in Kenya to pay for tuition and meals. You will receive an educational update twice a year.
              </p>
            </Card>
          </aside>
        </div>
      </main>

      <footer className="py-20 border-t border-gray-100 text-center opacity-30">
        <div className="font-display font-bold text-2xl mb-2">fund<span className="text-forest-green">ED</span> futures</div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Nurturing Potential • Africa & Beyond</p>
      </footer>
    </div>
  );
}
