import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby2o7plRd1ocCBxzxPCpm9OurMRQWUFb14Ui1noNRonnlFO0a3j2Taf7dGZlM8XiJfv/exec';

const countries = [
  "Kenya", "United Kingdom", "United States", "Canada", "Australia", "South Africa", "Nigeria", "Ethiopia",
  "Germany", "France", "Japan", "India", "China", "Brazil", "Mexico", "Egypt", "Ghana", "Rwanda", "Uganda", "Tanzania"
].sort();

const roles = [
  "Student", "Professional", "Journalist", "NGO Representative", "Government Official", "Educator", "Researcher", "Other"
];

const newsletterOptions = ["Monthly Newsletter", "Weekly Digest"];

export default function Subscribe() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false); // instant guard against double submits
  const [selectAll, setSelectAll] = useState(false);
  const [preferences, setPreferences] = useState<string[]>([]);
  const location = useLocation();

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    country: '',
    role: '',
    consent: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check for email passed in state from homepage
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const toggleAll = () => {
    if (selectAll) {
      setPreferences([]);
    } else {
      setPreferences([...newsletterOptions]);
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors.preferences;
        return newErrors;
      });
    }
    setSelectAll(!selectAll);
  };

  const handleToggle = (item: string) => {
    setPreferences(prev => {
      const next = prev.includes(item) ? prev.filter(p => p !== item) : [...prev, item];
      setSelectAll(next.length === newsletterOptions.length);
      if (next.length > 0) {
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.preferences;
          return newErrors;
        });
      }
      return next;
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role) newErrors.role = "Role / Organisation is required";
    if (preferences.length === 0) newErrors.preferences = "Please select at least one newsletter option";
    if (!formData.consent) newErrors.consent = "You must agree to the privacy policy and terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block duplicate submissions immediately
    if (submittingRef.current) return;
    if (!validate()) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          country: formData.country,
          role: formData.role,
          preferences: preferences
        })
      });
      setSubmitted(true);
      setIsSubmitting(false);
      // submittingRef stays true until the form is reset, so no repeat submits
    } catch {
      setSubmitError('Something went wrong. Please check your connection and try again.');
      submittingRef.current = false; // allow retry only on real failure
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setIsSubmitting(false);
    setSubmitError('');
    submittingRef.current = false;
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      country: '',
      role: '',
      consent: false
    });
    setPreferences([]);
    setSelectAll(false);
    setErrors({});
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white pt-32 pb-24 px-[5%]">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-forest-green font-semibold mb-12 hover:gap-3 transition-all">
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Success Modal */}
        <AnimatePresence>
          {submitted && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="absolute inset-0 bg-deep-slate/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 text-center border border-gray-100"
              >
                <button
                  onClick={resetForm}
                  className="absolute top-6 right-6 text-muted-text hover:text-deep-slate transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="w-20 h-20 bg-forest-green/10 text-forest-green rounded-full flex items-center justify-center mx-auto mb-8">
                  <Check size={40} />
                </div>
                <h1 className="text-2xl font-display font-bold mb-4 text-deep-slate">Thank you for signing up!</h1>
                <p className="text-muted-text mb-10 leading-relaxed">
                  You're all set to stay informed with us. Check your inbox for our latest updates.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full py-4 rounded-full bg-forest-green text-white font-bold hover:opacity-90 transition-all"
                >
                  Dismiss
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-deep-slate">Subscribe</h1>
          <p className="text-lg text-muted-text mb-12 leading-relaxed">
            Stay up to date with our latest news and updates by signing up for our newsletter.
          </p>

          <form onSubmit={handleSubmit} className="space-y-12" noValidate>
            {/* Preferences Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className={`text-xl font-bold transition-colors ${errors.preferences ? 'text-red-500' : 'text-deep-slate'}`}>
                  Subscription Preferences
                </h2>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-forest-green text-sm font-semibold hover:underline"
                >
                  {selectAll ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 transition-colors ${errors.preferences ? 'text-red-500' : 'text-forest-green'}`}>
                    Newsletters
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {newsletterOptions.map(opt => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={preferences.includes(opt)}
                          onChange={() => handleToggle(opt)}
                          className={`w-5 h-5 rounded border-gray-300 text-forest-green transition-colors focus:ring-forest-green ${errors.preferences ? 'border-red-500 bg-red-50' : ''}`}
                        />
                        <span className="text-muted-text group-hover:text-deep-slate transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                  {errors.preferences && <p className="text-red-500 text-xs mt-3 font-medium">{errors.preferences}</p>}
                </div>
              </div>
            </section>

            {/* Personal Info Section */}
            <section className="space-y-8 border-t border-gray-100 pt-12">
              <h2 className="text-xl font-bold text-deep-slate mb-8">Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors ${errors.firstName ? 'text-red-500' : 'text-deep-slate'}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-1 ${errors.firstName ? 'border-red-500 bg-red-50/30 focus:ring-red-500' : 'border-gray-200 focus:border-forest-green focus:ring-forest-green'}`}
                    placeholder="Jane"
                  />
                  {errors.firstName && <p className="text-red-500 text-xs font-medium">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors ${errors.lastName ? 'text-red-500' : 'text-deep-slate'}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-1 ${errors.lastName ? 'border-red-500 bg-red-50/30 focus:ring-red-500' : 'border-gray-200 focus:border-forest-green focus:ring-forest-green'}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-500 text-xs font-medium">{errors.lastName}</p>}
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className={`text-sm font-semibold transition-colors ${errors.email ? 'text-red-500' : 'text-deep-slate'}`}>
                    Email Address (required)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-1 ${errors.email ? 'border-red-500 bg-red-50/30 focus:ring-red-500' : 'border-gray-200 focus:border-forest-green focus:ring-forest-green'}`}
                    placeholder="jane.doe@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs font-medium">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-deep-slate">Country (optional)</label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-forest-green focus:ring-1 focus:ring-forest-green outline-none bg-white transition-all"
                  >
                    <option value="">Select a country</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-sm font-semibold transition-colors ${errors.role ? 'text-red-500' : 'text-deep-slate'}`}>
                    Role/Organisation
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border bg-white transition-all outline-none focus:ring-1 ${errors.role ? 'border-red-500 bg-red-50/30 focus:ring-red-500' : 'border-gray-200 focus:border-forest-green focus:ring-forest-green'}`}
                  >
                    <option value="">Select a role</option>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.role && <p className="text-red-500 text-xs font-medium">{errors.role}</p>}
                </div>
              </div>
            </section>

            {/* Consent Section */}
            <section className="pt-8 space-y-8">
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.consent}
                    onChange={(e) => handleInputChange('consent', e.target.checked)}
                    className={`mt-1 w-5 h-5 rounded border-gray-300 text-forest-green focus:ring-forest-green transition-all ${errors.consent ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  <span className={`text-sm leading-relaxed transition-colors ${errors.consent ? 'text-red-500' : 'text-muted-text'}`}>
                    I have read and agree to the <Link to="/privacy-policy" className="text-forest-green hover:underline">privacy policy</Link> and <Link to="/terms-of-use" className="text-forest-green hover:underline">terms of use</Link>.
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs font-medium">{errors.consent}</p>}
              </div>

              {submitError && (
                <p className="text-red-500 text-sm font-medium text-center">{submitError}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-lg rounded-full bg-forest-green text-white font-bold transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </section>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
