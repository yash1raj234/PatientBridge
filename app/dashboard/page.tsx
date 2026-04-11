'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Brain, Calendar as CalendarIcon, Settings, LogOut, Bell, Stethoscope, CheckCircle, ChevronRight, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MOCK_APPOINTMENTS, AI_REPORT_MOCK } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

type Appointment = typeof MOCK_APPOINTMENTS[number];

export default function DoctorDashboard() {
  const router = useRouter();
  const [filter, setFilter] = useState<'All' | 'Waiting' | 'Completed'>('All');
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'Details' | 'AI Report' | 'History'>('Details');
  const [patientArrived, setPatientArrived] = useState(false);
  const [activeNav, setActiveNav] = useState(0);
  const [reviewedReports, setReviewedReports] = useState<Set<string>>(new Set());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // Load any appointment booked through the patient flow
  useEffect(() => {
    const saved = localStorage.getItem('patientAppointment');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        const newApt: Appointment = {
          id: 'apt_new',
          patientName: data.patientName ?? 'New Patient',
          age: parseInt(data.age) || 0,
          time: data.time ?? '—',
          status: 'Waiting',
          complaint: data.complaint ?? '—',
          hasAiReport: true,
        };
        // Add only if not already present
        setAppointments(prev =>
          prev.some(a => a.id === 'apt_new') ? prev : [newApt, ...prev]
        );
      } catch {}
    }
  }, []);

  const filteredApts = appointments.filter(apt => {
    if (filter === 'Waiting') return apt.status === 'Waiting';
    if (filter === 'Completed') return apt.status === 'Completed';
    return true;
  });

  const selectedApt = appointments.find(a => a.id === selectedAptId);

  const handleMarkComplete = () => {
    if (!selectedAptId) return;
    setAppointments(prev =>
      prev.map(a => a.id === selectedAptId ? { ...a, status: 'Completed' } : a)
    );
  };

  const handleMarkReviewed = () => {
    if (!selectedAptId) return;
    setReviewedReports(prev => new Set(prev).add(selectedAptId));
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[var(--bg-secondary)] overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[256px] h-full bg-[#0F172A] border-r border-[rgba(255,255,255,0.06)] flex flex-col shrink-0">
        
        {/* Logo */}
        <div className="h-16 px-6 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-[2px]">
          <span className="font-display text-[20px] font-bold text-white">S</span>
          <span className="font-body text-[15px] font-bold text-white">ambhavna</span>
        </div>
        
        {/* Doctor Profile */}
        <div className="p-5 px-6 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center shrink-0">
            <span className="font-display text-[18px] text-white">AS</span>
          </div>
          <div>
            <h3 className="font-body text-[15px] font-medium text-white leading-tight">Dr. Ananya Sharma</h3>
            <p className="font-body text-[12px] text-[rgba(255,255,255,0.5)]">General Physician</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse" />
              <span className="font-mono text-[10px] text-[var(--accent-teal)] tracking-wider">ON DUTY</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {[
            { icon: LayoutDashboard, label: "Today's Schedule" },
            { icon: Users,           label: 'All Patients' },
            { icon: Brain,           label: 'AI Reports' },
            { icon: CalendarIcon,    label: 'Schedule' },
            { icon: Settings,        label: 'Settings' }
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveNav(i)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group cursor-hover
                ${activeNav === i
                  ? 'bg-[rgba(27,79,216,0.25)] border-l-[3px] border-[var(--accent-blue)] rounded-l-none'
                  : 'hover:bg-[rgba(255,255,255,0.06)]'}`}
            >
              <item.icon size={18} className={activeNav === i ? 'text-[var(--accent-blue)]' : 'text-[rgba(255,255,255,0.4)] group-hover:text-white'} />
              <span className={`font-body text-[14px] ${activeNav === i ? 'text-white font-medium' : 'text-[rgba(255,255,255,0.6)] group-hover:text-[rgba(255,255,255,0.9)]'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[rgba(255,255,255,0.06)]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-[rgba(239,68,68,0.1)] w-full transition-colors cursor-hover"
          >
            <LogOut size={18} />
            <span className="font-body text-[14px]">Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Top Bar */}
        <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] px-8 flex justify-between items-center shrink-0">
          <div className="flex items-baseline gap-4">
            <h1 className="font-display text-[20px] text-[var(--text-primary)]">Good Morning, Dr. Sharma 👋</h1>
            <span className="hidden sm:block font-mono text-[12px] text-[var(--text-muted)] tracking-wider">MONDAY, JUNE 16, 2025</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[var(--text-muted)] hover:text-[var(--accent-blue)] transition-colors cursor-hover">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-[var(--bg-card)]" />
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <div className="px-8 py-5 flex gap-5 shrink-0 overflow-x-auto">
          {[
            { label: 'Total Today',     value: String(appointments.length),                                      icon: Users,       format: 'Scheduled',      positive: true },
            { label: 'Waiting',         value: String(appointments.filter(a => a.status === 'Waiting').length),  icon: Clock,       format: 'Current queue' },
            { label: 'AI Reports Ready',value: String(appointments.filter(a => a.hasAiReport).length),           icon: Brain,       format: 'Require review', positive: true },
            { label: 'Completed',       value: String(appointments.filter(a => a.status === 'Completed').length),icon: CheckCircle, format: 'Done today' }
          ].map((stat, i) => (
            <div key={i} className="flex-1 min-w-[200px] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl py-4 px-5 flex items-center justify-between shadow-[var(--shadow-sm)]">
              <div>
                <span className="font-body text-[13px] text-[var(--text-secondary)] mb-1 block">{stat.label}</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-[28px] leading-none text-[var(--text-primary)]">{stat.value}</span>
                  {stat.positive && <span className="font-body text-[11px] text-[var(--accent-teal)] leading-none">{stat.format}</span>}
                  {!stat.positive && <span className="font-body text-[11px] text-[var(--text-muted)] leading-none">{stat.format}</span>}
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[rgba(27,79,216,0.06)] border border-[rgba(27,79,216,0.1)] flex items-center justify-center shrink-0">
                <stat.icon size={18} className="text-[var(--accent-blue)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Content Body Grid */}
        <div className="flex-1 px-8 pb-8 flex gap-6 overflow-hidden">
          
          {/* APPOINTMENTS LIST */}
          <div className="w-[420px] flex flex-col shrink-0">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">Today's Appointments</h2>
              <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full p-1">
                {['All', 'Waiting', 'Completed'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f as any)} 
                    className={`px-3 py-1 text-[12px] font-medium rounded-full transition-colors cursor-hover
                      ${filter === f ? 'bg-[var(--accent-blue)] text-white shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-2 space-y-3 custom-scrollbar">
              <AnimatePresence>
                {filteredApts.map(apt => {
                  const isSelected = selectedAptId === apt.id;
                  
                  return (
                    <motion.div
                      key={apt.id}
                      layoutId={`apt-${apt.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => { setSelectedAptId(apt.id); setPatientArrived(false); }}
                      className={`bg-[var(--bg-card)] border rounded-xl p-4 cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? 'border-[var(--accent-blue)] shadow-[0_0_0_1px_var(--accent-blue),var(--shadow-md)] bg-[rgba(27,79,216,0.02)]' 
                          : 'border-[var(--border)] shadow-[var(--shadow-sm)] hover:translate-y-[-1px] hover:border-[var(--border-blue)] hover:shadow-md'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-[13px] text-[var(--accent-blue)]">{apt.time}</span>
                        {apt.status === 'Waiting' && <Badge variant="amber">Waiting</Badge>}
                        {apt.status === 'In Progress' && <Badge variant="blue">In Progress</Badge>}
                        {apt.status === 'Completed' && <Badge variant="slate">Completed</Badge>}
                      </div>
                      
                      <h3 className="font-body text-[15px] font-semibold text-[var(--text-primary)] mb-2">{apt.patientName}</h3>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-body text-[13px] text-[var(--text-secondary)] truncate max-w-[200px]">
                          Age {apt.age} · {apt.complaint}
                        </span>
                        {apt.hasAiReport && (
                          <span className="font-body text-[12px] font-medium text-[var(--accent-teal)] flex items-center gap-0.5">
                            AI Report <ChevronRight size={14} />
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT DETAIL PANEL */}
          <div className="flex-1 h-full relative border border-[var(--border)] rounded-2xl bg-[var(--bg-card)] shadow-[var(--shadow-sm)] overflow-hidden flex flex-col">
            
            {!selectedAptId ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--bg-secondary)] opacity-80 z-20 transition-opacity">
                <Stethoscope size={48} className="text-[var(--text-muted)] opacity-50 mb-4" />
                <h3 className="font-display text-[22px] text-[var(--text-muted)]">Select an appointment</h3>
                <p className="font-body text-[14px] text-[var(--text-muted)] mt-1">to view patient details and AI reports</p>
              </div>
            ) : null}

            <AnimatePresence mode="wait">
              {selectedApt && (
                <motion.div
                  key={selectedApt.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-full flex flex-col"
                >
                  
                  {/* PANEL HEADER */}
                  <div className="px-7 py-6 border-b border-[var(--border)] flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--border)] to-[var(--bg-muted)] flex items-center justify-center border border-[var(--border)]">
                        <span className="font-display text-[20px] text-[var(--text-secondary)]">{selectedApt.patientName.charAt(0)}</span>
                      </div>
                      <div>
                        <h2 className="font-display text-[24px] text-[var(--text-primary)] leading-tight mb-1">{selectedApt.patientName}</h2>
                        <p className="font-body text-[14px] text-[var(--text-secondary)]">Age {selectedApt.age} · {selectedApt.complaint}</p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<CheckCircle size={16} />}
                      className={selectedApt?.status === 'Completed' ? 'text-[var(--accent-teal)]' : 'text-[var(--text-secondary)]'}
                      onClick={handleMarkComplete}
                    >
                      {selectedApt?.status === 'Completed' ? 'Completed' : 'Mark Complete'}
                    </Button>
                  </div>

                  {/* TABS */}
                  <div className="px-7 border-b border-[var(--border)] flex gap-6 shrink-0 bg-white">
                    {['Details', 'AI Report', 'History'].map(tab => (
                      <button 
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`py-3.5 font-body text-[14px] font-medium relative cursor-hover transition-colors
                          ${activeTab === tab ? 'text-[var(--accent-blue)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
                      >
                        {tab}
                        {activeTab === tab && (
                          <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-blue)]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* TAB CONTENT */}
                  <div className="flex-1 overflow-y-auto p-7 bg-[var(--bg-secondary)]">
                    <AnimatePresence mode="wait">
                      
                      {activeTab === 'Details' && (
                        <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          
                          <div className="bg-white border border-[var(--border)] rounded-xl p-6 mb-6">
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-4">
                              <h3 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">Visit Information</h3>
                              
                              <div className="flex items-center gap-3">
                                <span className="font-body text-[13px] text-[var(--text-secondary)] font-medium">Patient Arrived</span>
                                <button 
                                  onClick={() => setPatientArrived(!patientArrived)}
                                  className={`w-[44px] h-[24px] rounded-full p-1 transition-colors duration-300 relative cursor-hover ${patientArrived ? 'bg-[var(--accent-teal)]' : 'bg-[var(--border)]'}`}
                                >
                                  <motion.div 
                                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                                    animate={{ x: patientArrived ? 20 : 0 }}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                  />
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                              <div>
                                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block">Full Name</span>
                                <span className="font-body text-[15px] text-[var(--text-primary)] mt-1 block font-medium">{selectedApt.patientName}</span>
                              </div>
                              <div>
                                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block">Age</span>
                                <span className="font-body text-[15px] text-[var(--text-primary)] mt-1 block font-medium">{selectedApt.age} Years</span>
                              </div>
                              <div>
                                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block">Phone</span>
                                <span className="font-body text-[15px] text-[var(--text-primary)] mt-1 block font-medium">+91 98765 43210</span>
                              </div>
                              <div>
                                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block">Time</span>
                                <span className="font-body text-[15px] text-[var(--accent-blue)] mt-1 block font-medium">{selectedApt.time}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider uppercase block pt-2 border-t border-[var(--border)] mt-2">Chief Complaint</span>
                                <span className="font-body text-[15px] text-[var(--text-primary)] mt-2 block">{selectedApt.complaint}</span>
                              </div>
                            </div>
                          </div>

                        </motion.div>
                      )}

                      {activeTab === 'AI Report' && (
                        <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          
                          {!selectedApt.hasAiReport ? (
                            <div className="bg-white border text-center py-20 rounded-xl">
                              <Brain size={40} className="mx-auto text-[var(--border)] mb-4" />
                              <p className="font-body text-15 text-[var(--text-secondary)]">No AI Pre-Consultation report available for this appointment.</p>
                            </div>
                          ) : (
                            <div className="bg-white border border-[var(--border)] shadow-[var(--shadow-sm)] rounded-xl overflow-hidden p-7 mb-6 relative">
                              <div className="flex justify-between items-start mb-6 border-b border-[var(--border)] pb-4">
                                <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-widest font-semibold">PRE-CONSULTATION AI REPORT</span>
                                <div className="text-right">
                                  <span className="font-mono text-[11px] text-[var(--text-muted)] block">16-JUN-2025</span>
                                  <span className="font-mono text-[11px] text-[var(--text-muted)] block">REF: STC-841</span>
                                </div>
                              </div>

                              <div className="mb-6">
                                <h4 className="font-body text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2">Clinical Summary</h4>
                                <div className="bg-[rgba(27,79,216,0.03)] border-l-[3px] border-[var(--accent-blue)] rounded-r-lg p-4">
                                  <p className="font-body text-[14px] text-[var(--text-secondary)] leading-[1.7]">
                                    {AI_REPORT_MOCK.summary}
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-[1fr_auto] gap-8 mb-8 items-start">
                                <div>
                                  <h4 className="font-body text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">Key Symptoms</h4>
                                  <div className="flex flex-wrap gap-2">
                                    {AI_REPORT_MOCK.keySymptoms.map(s => (
                                      <span key={s} className="bg-white border border-[var(--border)] rounded-full px-3.5 py-1.5 font-body text-[13px] text-[var(--text-secondary)] shadow-sm">
                                        {s}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-[var(--bg-secondary)] px-5 py-4 rounded-xl border border-[var(--border)] flex flex-col items-center justify-center">
                                  <span className="font-mono text-[10px] text-[var(--text-muted)] tracking-wider mb-2">RISK ASSESS.</span>
                                  <Badge variant="teal" className="text-[12px] px-3">{AI_REPORT_MOCK.riskLevel} RISK</Badge>
                                </div>
                              </div>

                              <div className="mb-8">
                                <h4 className="font-body text-[13px] font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3">Doctor Focus Points</h4>
                                <ul className="flex flex-col gap-3">
                                  {AI_REPORT_MOCK.focusPoints.map((p, i) => (
                                    <li key={i} className="flex gap-3 items-start">
                                      <div className="w-5 h-5 rounded-full bg-[rgba(27,79,216,0.1)] text-[var(--accent-blue)] text-[11px] font-mono flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                      </div>
                                      <span className="font-body text-[14px] text-[var(--text-secondary)] leading-tight pt-0.5">{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <Button
                                fullWidth
                                onClick={handleMarkReviewed}
                                className={
                                  reviewedReports.has(selectedAptId ?? '')
                                    ? 'bg-[rgba(13,148,136,0.1)] border border-[var(--accent-teal)] text-[var(--accent-teal)] cursor-default'
                                    : 'bg-[var(--bg-primary)] border border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-colors'
                                }
                              >
                                {reviewedReports.has(selectedAptId ?? '') ? 'Report Reviewed ✓' : 'Mark as Reviewed ✓'}
                              </Button>
                            </div>
                          )}

                        </motion.div>
                      )}

                      {activeTab === 'History' && (
                        <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div className="text-center py-20">
                            <CalendarIcon size={32} className="mx-auto text-[var(--border)] mb-3" />
                            <p className="font-body text-[14px] text-[var(--text-secondary)]">First time patient. No past history available.</p>
                          </div>
                        </motion.div>
                      )}

                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

    </div>
  );
}
