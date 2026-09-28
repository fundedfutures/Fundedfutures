import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzYO7PdOL92bD-lUeGeKd96uhCfFfzvGCsJ-IM1Z-h7xUY9Pl7xP10giYJlVd2ry_Z7/exec';

const COMMITTEES = [
  'Finance',
  'Marketing',
  'Logistics',
  'Community Service',
  'Membership and Relations',
  'IT'
];

// Next 16 available interview days: Wednesday to Saturday only
const getInterviewDates = () => {
  const dates: Date[] = [];
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 2); // give the team at least 2 days notice
  while (dates.length < 16) {
    const day = d.getDay(); // 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
    if (day >= 3 && day <= 6) dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
};

const FieldError = ({ message }: { message: string }) => (
  <AnimatePresence>
    {message && (
      <motion.p
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="text-red-400 text-[10px] uppercase font-bold tracking-widest ml-4 flex items-center gap-1"
      >
        <AlertCircle size={10} /> {message}
      </motion.p>
    )}
  </AnimatePresence>
);

export default function Volunteer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: null as Date | null,
    whyJoin: '',
    committees: [] as string[],
    skills: '',
    experience: '',
    interviewDate: null as Date | null
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    interviewDate: ''
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarView, setCalendarView] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 13)));
  const [interviewDates] = useState(getInterviewDates);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const submittingRef = useRef(false); // instant guard against double submits

  // Redirect home 5 seconds after success
  useEffect(() => {
    if (!submitted) return;
    const t = setTimeout(() => navigate('/'), 5000);
    return () => clearTimeout(t);
  }, [submitted, navigate]);

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handleDateSelect = (day: number) => {
    const selected = new Date(calendarView.getFullYear(), calendarView.getMonth(), day);
    if (selected <= maxDate) {
      setFormData(prev => ({ ...prev, birthDate: selected }));
      setErrors(prev => ({ ...prev, birthDate: '' }));
      setShowCalendar(false);
    }
  };

  const changeMonth = (delta: number) => {
    setCalendarView(new Date(calendarView.getFullYear(), calendarView.getMonth() + delta, 1));
  };

  const changeYear = (year: number) => {
    setCalendarView(new Date(year, calendarView.getMonth(), 1));
  };

  const changeMonthByName = (monthIndex: number) => {
    setCalendarView(new Date(calendarView.getFullYear(), monthIndex, 1));
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^\+?[0-9\s-]{8,}$/.test(phone);

  const formatLongDate = (d: Date) =>
    d.toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const MAX_COMMITTEES = 2;

  const toggleCommittee = (committee: string) => {
    setFormData(prev => {
      if (prev.committees.includes(committee)) {
        return { ...prev, committees: prev.committees.filter(c => c !== committee) };
      }
      if (prev.committees.length >= MAX_COMMITTEES) return prev; // ignore extra picks
      return { ...prev, committees: [...prev.committees, committee] };
    });
  };

  const selectInterviewDate = (d: Date) => {
    setFormData(prev => ({ ...prev, interviewDate: d }));
    setErrors(prev => ({ ...prev, interviewDate: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Real-time validation
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: value.trim() === '' ? 'This field is invalid' : '' }));
    }
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: !validateEmail(value) ? 'This field is invalid' : '' }));
    }
    if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: !validatePhone(value) ? 'This field is invalid' : '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Block duplicate submissions immediately
    if (submittingRef.current) return;

    const newErrors = {
      name: formData.name.trim() === '' ? 'This field is invalid' : '',
      email: !validateEmail(formData.email) ? 'This field is invalid' : '',
      phone: !validatePhone(formData.phone) ? 'This field is invalid' : '',
      birthDate: !formData.birthDate ? 'This field is invalid' : '',
      interviewDate: !formData.interviewDate ? 'Please pick an interview date' : ''
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          birthDate: formData.birthDate?.toLocaleDateString('en-KE'),
          whyJoin: formData.whyJoin,
          committees: formData.committees.join(', '),
          skills: formData.skills,
          experience: formData.experience,
          interviewDate: formData.interviewDate ? formatLongDate(formData.interviewDate) : ''
        })
      });
      setSubmitted(true);
    } catch {
      setSubmitError('Something went wrong. Please check your connection and try again.');
      submittingRef.current = false; // allow retry only on real failure
      setIsSubmitting(false);
    }
  };

  // Thank-you card (replaces the form after submitting)
  if (submitted) {
    return (
      <div className="min-h-screen bg-snow text-deep-slate font-body flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[3rem] p-10 md:p-16 border border-frosted-blue/30 text-center max-w-xl"
        >
          <CheckCircle size={64} className="text-forest-green mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">Thank you for registering!</h1>
          <p className="text-muted-text mb-2">
            We've sent a confirmation email to {formData.email}. A member of our team will be in touch soon.
          </p>
          <p className="text-sm text-muted-text/70 italic">Taking you back to the home page shortly...</p>
        </motion.div>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `w-full bg-snow border-2 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold ${hasError ? 'border-red-400' : 'border-transparent focus:border-forest-green/20'}`;
  const labelClass = 'block text-xs font-bold uppercase tracking-widest text-muted-text ml-2';

  return (
    <div className="min-h-screen bg-snow text-deep-slate font-body">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-text hover:text-forest-green transition-colors mb-12 font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-frosted-blue/30">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Join Our Volunteer Family</h1>
            <p className="text-lg text-muted-text max-w-2xl mx-auto italic">
              Your time and expertise can change the trajectory of a child's life.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className={labelClass}>Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ex. Jane Doe" className={inputClass(!!errors.name)} />
              <FieldError message={errors.name} />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Email Address *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass(!!errors.email)} />
              <FieldError message={errors.email} />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Phone Number *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254 700 000000" className={inputClass(!!errors.phone)} />
              <FieldError message={errors.phone} />
            </div>

            <div className="space-y-2 relative">
              <label className={labelClass}>Date of Birth (Min. 13 Years Old) *</label>
              <div
                id="birthdate-picker-trigger"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`${inputClass(!!errors.birthDate)} cursor-pointer flex justify-between items-center group relative overflow-hidden`}
              >
                <span className={formData.birthDate ? 'text-deep-slate' : 'text-muted-text/50 font-normal'}>
                  {formData.birthDate ? formData.birthDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select birthday'}
                </span>
                <Calendar size={20} className="text-forest-green opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <FieldError message={errors.birthDate} />

              <AnimatePresence>
                {showCalendar && (
                  <>
                    <div id="calendar-backdrop" className="fixed inset-0 z-40" onClick={() => setShowCalendar(false)} />
                    <motion.div
                      id="calendar-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute left-0 right-0 top-full mt-4 bg-white rounded-[2.5rem] z-50 p-6 border border-frosted-blue/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <select
                          id="month-selector"
                          value={calendarView.getMonth()}
                          onChange={(e) => changeMonthByName(parseInt(e.target.value))}
                          className="bg-snow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-forest-green outline-none border-none cursor-pointer hover:bg-forest-green/5 transition-colors"
                        >
                          {months.map((month, i) => (
                            <option key={month} value={i}>{month}</option>
                          ))}
                        </select>

                        <select
                          id="year-selector"
                          value={calendarView.getFullYear()}
                          onChange={(e) => changeYear(parseInt(e.target.value))}
                          className="bg-snow px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-forest-green outline-none border-none cursor-pointer hover:bg-forest-green/5 transition-colors"
                        >
                          {Array.from({ length: 100 }, (_, i) => maxDate.getFullYear() - i).map(year => (
                            <option key={year} value={year}>{year}</option>
                          ))}
                        </select>

                        <div className="flex gap-1">
                          <button id="prev-month-btn" type="button" onClick={() => changeMonth(-1)} className="p-2 hover:bg-snow rounded-full transition-colors">
                            <ChevronLeft size={16} className="text-forest-green" />
                          </button>
                          <button id="next-month-btn" type="button" onClick={() => changeMonth(1)} className="p-2 hover:bg-snow rounded-full transition-colors">
                            <ChevronRight size={16} className="text-forest-green" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(dayName => (
                          <div key={dayName} className="text-[10px] font-bold text-center text-muted-text/50 uppercase tracking-tighter">
                            {dayName}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: getFirstDayOfMonth(calendarView.getMonth(), calendarView.getFullYear()) }).map((_, i) => (
                          <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: getDaysInMonth(calendarView.getMonth(), calendarView.getFullYear()) }).map((_, i) => {
                          const dayNum = i + 1;
                          const dateObj = new Date(calendarView.getFullYear(), calendarView.getMonth(), dayNum);
                          const isDisabled = dateObj > maxDate;
                          const isSelected = formData.birthDate?.getTime() === dateObj.getTime();

                          return (
                            <button
                              key={dayNum}
                              id={`day-${dayNum}`}
                              type="button"
                              disabled={isDisabled}
                              onClick={() => handleDateSelect(dayNum)}
                              className={`
                                py-2 rounded-xl text-xs font-bold transition-all
                                ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110'}
                                ${isSelected ? 'bg-forest-green text-white scale-110' : 'hover:bg-snow text-deep-slate'}
                              `}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className={labelClass}>Why do you want to join FundED Futures?</label>
              <textarea
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                rows={4}
                placeholder="Share your motivation..."
                className="w-full bg-snow border-2 border-transparent focus:border-forest-green/20 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold resize-none"
              ></textarea>
            </div>

            {/* Preferred committees (checklist) */}
            <div className="md:col-span-2 space-y-3">
              <label className={labelClass}>Preferred Committees</label>
              <div className="flex flex-wrap gap-3">
                {COMMITTEES.map(committee => {
                  const checked = formData.committees.includes(committee);
                  const locked = !checked && formData.committees.length >= MAX_COMMITTEES;
                  return (
                    <button
                      key={committee}
                      type="button"
                      role="checkbox"
                      aria-checked={checked}
                      aria-disabled={locked}
                      onClick={() => toggleCommittee(committee)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-full border-2 text-sm font-bold transition-all ${
                        checked
                          ? 'bg-forest-green text-white border-forest-green'
                          : locked
                            ? 'bg-snow text-deep-slate border-transparent opacity-40 cursor-not-allowed'
                            : 'bg-snow text-deep-slate border-transparent hover:border-forest-green/20'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-md border-2 flex items-center justify-center ${checked ? 'bg-white border-white' : 'border-muted-text/40'}`}>
                        {checked && <CheckCircle size={12} className="text-forest-green" />}
                      </span>
                      {committee}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Key Skills</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="Coding, Design, Teaching, etc."
                className="w-full bg-snow border-2 border-transparent focus:border-forest-green/20 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className={labelClass}>Work Experience</label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience or roles"
                className="w-full bg-snow border-2 border-transparent focus:border-forest-green/20 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold"
              />
            </div>

            {/* Preferred interview date (Wed - Fri only) */}
            <div className="md:col-span-2 space-y-3">
              <label className={labelClass}>Preferred Interview Date (Wed – Sat) *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {interviewDates.map(d => {
                  const selected = formData.interviewDate?.getTime() === d.getTime();
                  return (
                    <button
                      key={d.getTime()}
                      type="button"
                      onClick={() => selectInterviewDate(d)}
                      className={`px-4 py-3 rounded-2xl border-2 text-xs font-bold transition-all ${
                        selected
                          ? 'bg-forest-green text-white border-forest-green'
                          : 'bg-snow text-deep-slate border-transparent hover:border-forest-green/20'
                      }`}
                    >
                      <span className="block uppercase tracking-widest opacity-70">
                        {d.toLocaleDateString('en-KE', { weekday: 'short' })}
                      </span>
                      {d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
                    </button>
                  );
                })}
              </div>
              <FieldError message={errors.interviewDate} />
              <p className="text-xs text-muted-text italic ml-2">
                We'll do our best to interview you on this date, but we may reach out a little sooner or later.
              </p>
            </div>

            <div className="md:col-span-2 pt-8">
              {submitError && (
                <p className="text-red-400 text-xs font-bold mb-4 text-center flex items-center justify-center gap-1">
                  <AlertCircle size={14} /> {submitError}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-xl rounded-[2rem] bg-forest-green text-white font-bold transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
