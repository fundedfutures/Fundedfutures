import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertCircle, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/UI';

export default function Volunteer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: null as Date | null,
    whyJoin: '',
    skills: '',
    experience: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarView, setCalendarView] = useState(new Date(new Date().setFullYear(new Date().getFullYear() - 13)));

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 13);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

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

  const [submitted, setSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    // Basic phone validation (can be adjusted)
    return /^\+?[0-9\s-]{8,}$/.test(phone);
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

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const newErrors = {
    name: formData.name.trim() === '' ? 'This field is invalid' : '',
    email: !validateEmail(formData.email) ? 'This field is invalid' : '',
    phone: !validatePhone(formData.phone) ? 'This field is invalid' : '',
    birthDate: !formData.birthDate ? 'This field is invalid' : ''
  };

  setErrors(newErrors);

  if (!newErrors.name && !newErrors.email && !newErrors.phone && !newErrors.birthDate) {
    fetch('https://script.google.com/macros/s/AKfycbyh-BKQPAw2uoL5RjvUYGbAtcZKMDiqRsWvD9fbONyXtqsMMc7sBNDvFnTzZgYPY3c/exec', {
      method: 'POST',
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate?.toLocaleDateString('en-KE'),
        whyJoin: formData.whyJoin,
        skills: formData.skills,
        experience: formData.experience
      })
    })
    .then(() => {
      setSubmitted(true);
      setTimeout(() => navigate('/'), 5000);
    })
    .catch(() => {
      setSubmitted(true);
      setTimeout(() => navigate('/'), 5000);
    });
  }
};

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
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Full Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex. Jane Doe"
                className={`w-full bg-snow border-2 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold ${errors.name ? 'border-red-400' : 'border-transparent focus:border-forest-green/20'}`}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] uppercase font-bold tracking-widest ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={10} /> {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Email Address *</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                className={`w-full bg-snow border-2 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold ${errors.email ? 'border-red-400' : 'border-transparent focus:border-forest-green/20'}`}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] uppercase font-bold tracking-widest ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={10} /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Phone Number *</label>
              <input 
                type="text" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+254 700 000000"
                className={`w-full bg-snow border-2 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold ${errors.phone ? 'border-red-400' : 'border-transparent focus:border-forest-green/20'}`}
              />
              <AnimatePresence>
                {errors.phone && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] uppercase font-bold tracking-widest ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={10} /> {errors.phone}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2 relative">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Date of Birth (Min. 13 Years Old) *</label>
              <div 
                id="birthdate-picker-trigger"
                onClick={() => setShowCalendar(!showCalendar)}
                className={`w-full bg-snow border-2 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold cursor-pointer flex justify-between items-center group relative overflow-hidden ${errors.birthDate ? 'border-red-400' : 'border-transparent focus:border-forest-green/20'}`}
              >
                <span className={formData.birthDate ? 'text-deep-slate' : 'text-muted-text/50 font-normal'}>
                  {formData.birthDate ? formData.birthDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Select birthday'}
                </span>
                <Calendar size={20} className="text-forest-green opacity-50 group-hover:opacity-100 transition-opacity" />
                
              {/* Reflection Effect removed */}
              </div>
              
              <AnimatePresence>
                {errors.birthDate && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-400 text-[10px] uppercase font-bold tracking-widest ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={10} /> {errors.birthDate}
                  </motion.p>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showCalendar && (
                  <>
                    <div 
                      id="calendar-backdrop"
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowCalendar(false)}
                    />
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
                          <button 
                            id="prev-month-btn"
                            type="button"
                            onClick={() => changeMonth(-1)}
                            className="p-2 hover:bg-snow rounded-full transition-colors"
                          >
                            <ChevronLeft size={16} className="text-forest-green" />
                          </button>
                          <button 
                            id="next-month-btn"
                            type="button"
                            onClick={() => changeMonth(1)}
                            className="p-2 hover:bg-snow rounded-full transition-colors"
                          >
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
                                ${isSelected 
                                  ? 'bg-forest-green text-white scale-110' 
                                  : 'hover:bg-snow text-deep-slate'}
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
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Why do you want to join FundED Futures?</label>
              <textarea 
                name="whyJoin"
                value={formData.whyJoin}
                onChange={handleChange}
                rows={4}
                placeholder="Share your motivation..."
                className="w-full bg-snow border-2 border-transparent focus:border-forest-green/20 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold resize-none"
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Key Skills</label>
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
              <label className="block text-xs font-bold uppercase tracking-widest text-muted-text ml-2">Work Experience</label>
              <input 
                type="text" 
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience or roles"
                className="w-full bg-snow border-2 border-transparent focus:border-forest-green/20 px-8 py-5 rounded-[2rem] outline-none transition-all font-bold"
              />
            </div>

            <div className="md:col-span-2 pt-8">
              <Button 
                variant="primary" 
                className="w-full py-6 text-xl"
                onClick={handleSubmit}
              >
                Submit Application
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
