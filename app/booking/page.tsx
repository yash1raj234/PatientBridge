'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore, startOfDay } from 'date-fns';
import { MOCK_DOCTORS } from '@/lib/mockData';

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM'
];

export default function BookingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(MOCK_DOCTORS[0]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', age: '', phone: '', complaint: '' });
  
  // Dynamic Start Month
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date())); 
  const [slideDirection, setSlideDirection] = useState(0);

  const handleNextMonth = () => {
    setSlideDirection(1);
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  const handlePrevMonth = () => {
    setSlideDirection(-1);
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const today = startOfDay(new Date());

  const handleDateSelect = (date: Date) => {
    if (isBefore(date, today)) return;
    setSelectedDate(date);
    setTimeout(() => setStep(3), 400); // go to step 3 (Time slots)
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setTimeout(() => setStep(4), 400); // go to step 4 (Details)
  };

  const isFormComplete = formData.name && formData.age && formData.phone && formData.complaint;

  const handleConfirm = () => {
    if (isFormComplete && selectedDate && selectedTime && selectedDoctor) {
      // Persist booking so dashboard and confirmation page can read it
      const booking = {
        patientName: formData.name,
        age: formData.age,
        phone: formData.phone,
        complaint: formData.complaint,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        date: selectedDate.toISOString(),
        time: selectedTime,
      };
      localStorage.setItem('patientAppointment', JSON.stringify(booking));
      router.push('/symptom-chat');
    }
  };

  const docInitials = selectedDoctor.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('');

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] px-6 md:px-[8vw] py-[100px]">
      
      <div className="mb-8">
        <div className="font-mono text-[12px] text-[var(--text-muted)] mb-4 uppercase tracking-widest">
          <Link href="/" className="hover:text-[var(--accent-blue)] transition-colors cursor-hover">Home</Link> / Book Appointment
        </div>
        <h1 className="font-display text-[40px] text-[var(--text-primary)]">Book Your Appointment</h1>
        <p className="font-body text-[16px] text-[var(--text-secondary)]">Please follow the steps to book your slot.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* LEFT STICKY PANEL */}
        <div className="w-full lg:w-[380px] shrink-0 sticky top-[100px]">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-[var(--shadow-sm)] transition-all">
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(27,79,216,0.15)] to-[rgba(13,148,136,0.15)] border-2 border-[var(--border-blue)] flex items-center justify-center shrink-0">
                <span className="font-display text-[26px] text-[var(--accent-blue)]">{docInitials}</span>
              </div>
              <div>
                <h3 className="font-display text-[22px] text-[var(--text-primary)] leading-tight">{selectedDoctor.name}</h3>
                <p className="font-body text-[14px] font-medium text-[var(--accent-teal)]">{selectedDoctor.specialty}</p>
                <div className="line-clamp-1 group relative">
                  <p className="font-body text-[13px] text-[var(--text-muted)] mt-1 truncate max-w-[180px]">{selectedDoctor.qualifications}</p>
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[var(--border)] my-6" />

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-[var(--accent-blue)] shrink-0 mt-[2px]" />
                <span className="font-body text-[14px] text-[var(--text-secondary)]">Sambhavna Trust Clinic, Bhopal</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-[var(--accent-blue)] shrink-0 mt-[2px]" />
                <span className="font-body text-[14px] text-[var(--text-secondary)]">Mon–Sat: 9:00 AM – 5:00 PM</span>
              </div>
            </div>

            <AnimatePresence>
              {(selectedDate || selectedTime || selectedDoctor) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="h-[1px] bg-[var(--border)] my-6" />
                  <h4 className="font-body text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-4">Your Selection</h4>
                  <div className="bg-[var(--bg-muted)] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-body text-[14px] text-[var(--text-secondary)]">Doctor:</span>
                      <span className="font-body text-[14px] font-medium text-[var(--text-primary)] truncate max-w-[150px]">{selectedDoctor.name}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between items-center">
                        <span className="font-body text-[14px] text-[var(--text-secondary)]">Date:</span>
                        <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">{format(selectedDate, 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between items-center">
                        <span className="font-body text-[14px] text-[var(--text-secondary)]">Time:</span>
                        <span className="font-mono text-[14px] font-medium text-[var(--accent-blue)]">{selectedTime}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="font-body text-[14px] text-[var(--text-secondary)]">Duration:</span>
                      <span className="font-body text-[14px] font-medium text-[var(--text-primary)]">30 minutes</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8">
              <Button 
                onClick={handleConfirm}
                fullWidth 
                size="lg"
                disabled={!(step === 4 && isFormComplete && selectedDate && selectedTime && selectedDoctor)}
              >
                Continue to Assessment
              </Button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Steps) */}
        <div className="flex-1 w-full">
          
          <div className="flex items-center gap-2 mb-8 bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-xl shadow-[var(--shadow-sm)] overflow-x-auto">
            {['Doctor', 'Date', 'Time', 'Details'].map((label, i) => (
              <div key={label} className="flex items-center flex-1 min-w-[120px]">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => step > i + 1 && setStep(i + 1)}
                    disabled={step <= i + 1}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[13px] transition-colors ${
                      step > i + 1 ? 'bg-[var(--accent-teal)] text-white border-[var(--accent-teal)] cursor-pointer hover:opacity-80' :
                      step === i + 1 ? 'bg-[var(--accent-blue)] text-white border-[var(--accent-blue)]' :
                      'bg-[var(--bg-card)] text-[var(--text-muted)] border-2 border-[var(--border)] cursor-not-allowed'
                    }`}
                  >
                    {step > i + 1 ? <Check size={16} /> : `0${i + 1}`}
                  </button>
                  <span className={`font-body text-[14px] hidden sm:block ${step >= i + 1 ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-muted)]'}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && <div className={`flex-1 h-[2px] mx-4 transition-colors ${step > i + 1 ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border)]'}`} />}
              </div>
            ))}
          </div>

          <div className="w-full relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] p-8 min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: DOCTOR */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: slideDirection * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="font-display text-[22px] text-[var(--text-primary)] mb-8">
                    Choose a Specialist
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_DOCTORS.map((doc, i) => {
                      const init = doc.name.replace('Dr. ', '').split(' ').map(n=>n[0]).join('');
                      return (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => { 
                            setSelectedDoctor(doc); 
                            setSlideDirection(1);
                            setTimeout(() => setStep(2), 300); 
                          }}
                          className={`p-5 rounded-2xl border cursor-hover transition-all duration-300 ${
                            selectedDoctor.id === doc.id
                              ? 'border-[var(--accent-blue)] bg-[rgba(27,79,216,0.03)] shadow-md'
                              : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent-blue)] hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(27,79,216,0.1)] to-[rgba(13,148,136,0.1)] flex items-center justify-center shrink-0">
                              <span className="font-display text-[18px] text-[var(--accent-blue)]">{init}</span>
                            </div>
                            <div>
                              <h3 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">{doc.name}</h3>
                              <p className="font-body text-[12px] text-[var(--accent-teal)] font-medium">{doc.specialty}</p>
                            </div>
                          </div>
                          <p className="font-body text-[13px] text-[var(--text-secondary)] line-clamp-2">{doc.bio}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: CALENDAR */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => {setSlideDirection(-1); setStep(1);}} className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] cursor-hover">
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1 flex justify-between items-center">
                      <button onClick={handlePrevMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors cursor-hover">
                        <ChevronLeft size={20} className="text-[var(--text-primary)]" />
                      </button>
                      <h2 className="font-display text-[22px] text-[var(--text-primary)]">
                        {format(currentMonth, 'MMMM yyyy')}
                      </h2>
                      <button onClick={handleNextMonth} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors cursor-hover">
                        <ChevronRight size={20} className="text-[var(--text-primary)]" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 mb-4">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={`${day}-${i}`} className="text-center font-mono text-[11px] text-[var(--text-muted)] tracking-widest pb-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-2">
                    {/* Empty padding for start of month */}
                    {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    
                    {daysInMonth.map((date) => {
                      const isPast = isBefore(date, today) && !isSameDay(date, today);
                      const isSelected = selectedDate && isSameDay(date, selectedDate);
                      const isToday = isSameDay(date, today);
                      const hasSlots = !isPast && date.getDate() % 2 !== 0;

                      return (
                        <div key={date.toString()} className="flex justify-center cursor-hover">
                          <button
                            onClick={() => { setSlideDirection(1); handleDateSelect(date); }}
                            disabled={isPast || !hasSlots}
                            className={`w-11 h-11 flex flex-col items-center justify-center rounded-full font-body text-[15px] relative transition-all duration-200
                              ${isSelected ? 'bg-[var(--accent-blue)] text-white shadow-md select-none border-transparent' : 
                                isPast || !hasSlots ? 'text-[var(--text-muted)] opacity-30 cursor-not-allowed select-none' : 
                                isToday ? 'border-[1.5px] border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--bg-muted)]' : 
                                'text-[var(--text-primary)] hover:bg-[var(--bg-muted)] border-[1.5px] border-transparent'
                              }`}
                          >
                            <span>{date.getDate()}</span>
                            {hasSlots && !isSelected && !isPast && (
                              <div className="absolute bottom-1.5 w-1 h-1 rounded-full bg-[var(--accent-teal)]" />
                            )}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 3: TIME SLOTS */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => {setSlideDirection(-1); setStep(2)}} className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] cursor-hover">
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-display text-[22px] text-[var(--text-primary)]">
                      Available Times — {selectedDate && format(selectedDate, 'MMM dd')}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {timeSlots.map((time, i) => {
                      const isBoooked = i % 5 === 0;
                      const isSelected = time === selectedTime;

                      return (
                        <motion.button
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: i * 0.04 }}
                          key={time}
                          type="button"
                          onClick={() => { !isBoooked && setSlideDirection(1); handleTimeSelect(time); }}
                          disabled={isBoooked}
                          className={`py-3 rounded-xl border flex flex-col items-center justify-center transition-all duration-200 cursor-hover
                            ${isSelected ? 'bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white shadow-md' :
                              isBoooked ? 'bg-[var(--bg-muted)] border-transparent opacity-50 cursor-not-allowed' :
                              'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--accent-blue)] hover:bg-[rgba(27,79,216,0.04)] text-[var(--text-primary)]'
                            }`}
                        >
                          <span className={`font-mono text-[14px] ${isBoooked ? 'line-through' : ''}`}>
                            {time}
                          </span>
                          {isBoooked && <span className="text-[10px] text-[var(--text-muted)] mt-1 tracking-wider uppercase">Booked</span>}
                          {isSelected && <Check size={14} className="mt-1" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 4: PATIENT FORM */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => {setSlideDirection(-1); setStep(3)}} className="text-[var(--text-muted)] hover:text-[var(--accent-blue)] cursor-hover">
                      <ChevronLeft size={20} />
                    </button>
                    <h2 className="font-display text-[22px] text-[var(--text-primary)]">
                      Your Information
                    </h2>
                  </div>

                  <form className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-5">
                      {/* Name */}
                      <div className="relative w-full">
                        <input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className={`w-full bg-[var(--bg-card)] border ${formData.name ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[22px] px-4 pb-2 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                        />
                        <label 
                          htmlFor="name" 
                          className={`absolute left-4 transition-all pointer-events-none ${
                            formData.name ? 'top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'top-4 text-[14px] text-[var(--text-muted)]'
                          }`}
                        >
                          Full Name
                        </label>
                      </div>

                      {/* Age */}
                      <div className="relative w-full">
                        <input
                          id="age"
                          type="number"
                          min="1" max="120"
                          value={formData.age}
                          onChange={(e) => setFormData({...formData, age: e.target.value})}
                          className={`w-full bg-[var(--bg-card)] border ${formData.age ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[22px] px-4 pb-2 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                        />
                        <label 
                          htmlFor="age" 
                          className={`absolute left-4 transition-all pointer-events-none ${
                            formData.age ? 'top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'top-4 text-[14px] text-[var(--text-muted)]'
                          }`}
                        >
                          Age
                        </label>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="relative w-full">
                      <span className="absolute left-4 top-[17px] font-body text-[15px] text-[var(--text-primary)] z-10 block">+91</span>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full bg-[var(--bg-card)] border ${formData.phone ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[22px] pr-4 pl-[46px] pb-2 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                      />
                      <label 
                        htmlFor="phone" 
                        className={`absolute transition-all pointer-events-none ${
                          formData.phone ? 'left-4 top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'left-[46px] top-4 text-[14px] text-[var(--text-muted)]'
                        }`}
                      >
                        Phone Number
                      </label>
                    </div>

                    {/* Complaint */}
                    <div className="relative w-full">
                      <textarea
                        id="complaint"
                        value={formData.complaint}
                        onChange={(e) => setFormData({...formData, complaint: e.target.value})}
                        className={`w-full min-h-[120px] resize-none bg-[var(--bg-card)] border ${formData.complaint ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[26px] px-4 pb-3 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                      />
                      <label 
                        htmlFor="complaint" 
                        className={`absolute left-4 transition-all pointer-events-none ${
                          formData.complaint ? 'top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'top-4 text-[14px] text-[var(--text-muted)]'
                        }`}
                      >
                        Reason for Visit / Chief Complaint
                      </label>
                    </div>

                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
