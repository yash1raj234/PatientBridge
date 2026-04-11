'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, CalendarPlus, Download, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Badge } from '@/components/ui/Badge';
import { AI_REPORT_MOCK } from '@/lib/mockData';
import { Button } from '@/components/ui/Button';
import { format } from 'date-fns';

interface BookingData {
  patientName: string;
  age: string;
  phone: string;
  complaint: string;
  doctorName: string;
  date: string;
  time: string;
}

export default function ConfirmationPage() {
  const [reportExpanded, setReportExpanded] = useState(false);
  const [booking, setBooking] = useState<BookingData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('patientAppointment');
    if (saved) {
      try {
        setBooking(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    const end = Date.now() + 2 * 1000;
    const colors = ['#1B4FD8', '#0D9488', '#C9A84C'];

    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }, []);

  const patientName = booking?.patientName ?? 'Priya Verma';
  const doctorName  = booking?.doctorName  ?? 'Dr. Ananya Sharma';
  const appointmentTime = booking?.time ?? '09:30 AM';
  const appointmentDate = booking?.date
    ? format(new Date(booking.date), 'EEEE, MMMM d, yyyy')
    : 'Monday, June 16, 2025';
  const refCode = 'STC-' + (booking ? new Date(booking.date).getFullYear() : 2025) + '-' + Math.floor(1000 + Math.random() * 9000);

  const handleDownloadPDF = () => {
    const rows = [
      { label: 'PATIENT',   value: patientName },
      { label: 'DATE',      value: appointmentDate },
      { label: 'TIME',      value: appointmentTime },
      { label: 'DOCTOR',    value: doctorName },
      { label: 'LOCATION',  value: 'Sambhavna Trust Clinic, Bhopal' },
      { label: 'REFERENCE', value: refCode },
    ];

    const printWindow = window.open('', '_blank', 'width=700,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Appointment Receipt — ${patientName}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; padding: 40px; color: #111827; }
          .card { background: white; border-radius: 16px; overflow: hidden; max-width: 560px; margin: 0 auto; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
          .header { background: #1B4FD8; color: white; padding: 28px 32px; }
          .header-label { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.8; margin-bottom: 6px; }
          .header-title { font-size: 24px; font-weight: 700; }
          .header-sub { font-size: 13px; opacity: 0.75; margin-top: 4px; }
          .body { padding: 32px; }
          .row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f1f5f9; }
          .row:last-child { border-bottom: none; }
          .row-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #94a3b8; font-weight: 600; }
          .row-value { font-size: 15px; font-weight: 500; color: #111827; }
          .row-value.accent { color: #1B4FD8; font-family: monospace; font-weight: 700; }
          .row-value.muted { color: #94a3b8; font-family: monospace; }
          .report { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-top: 24px; }
          .report-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 600; margin-bottom: 12px; }
          .report-summary { font-size: 13px; color: #475569; line-height: 1.7; font-style: italic; }
          .symptoms { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
          .symptom { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 4px 12px; font-size: 12px; color: #475569; }
          .footer { text-align: center; padding: 20px 32px; background: #f8fafc; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; }
          @media print {
            body { background: white; padding: 0; }
            .card { box-shadow: none; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="header-label">Appointment Receipt</div>
            <div class="header-title">Sambhavna Trust Clinic</div>
            <div class="header-sub">Bhopal, Madhya Pradesh</div>
          </div>
          <div class="body">
            ${rows.map(r => `
              <div class="row">
                <span class="row-label">${r.label}</span>
                <span class="row-value ${r.label === 'TIME' ? 'accent' : r.label === 'REFERENCE' ? 'muted' : ''}">${r.value}</span>
              </div>
            `).join('')}
            <div class="report">
              <div class="report-title">AI Pre-Consultation Summary</div>
              <div class="report-summary">${AI_REPORT_MOCK.summary}</div>
              <div class="symptoms">
                ${AI_REPORT_MOCK.keySymptoms.map(s => `<span class="symptom">${s}</span>`).join('')}
              </div>
            </div>
          </div>
          <div class="footer">
            care@sambhavnatrust.org &nbsp;·&nbsp; +91 755 242 4110
          </div>
        </div>
        <script>window.onload = function() { window.print(); }<\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const appointmentRows = [
    { label: 'PATIENT',   value: patientName },
    { label: 'DATE',      value: appointmentDate },
    { label: 'TIME',      value: <span className="font-mono text-[var(--accent-blue)] font-bold">{appointmentTime}</span> },
    { label: 'DOCTOR',    value: doctorName },
    { label: 'LOCATION',  value: 'Sambhavna Trust Clinic, Bhopal' },
    { label: 'REFERENCE', value: <span className="font-mono text-[var(--text-muted)]">{refCode}</span> },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-[100px]">

      <div className="max-w-[600px] mx-auto pt-[100px] px-6">

        {/* Animated Success Icon */}
        <div className="flex justify-center mb-7">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[rgba(13,148,136,0.1)] border-2 border-[var(--accent-teal)] flex items-center justify-center relative z-10">
              <svg className="w-10 h-10 text-[var(--accent-teal)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  d="M20 6L9 17l-5-5"
                />
              </svg>
            </div>
            <motion.div
              className="absolute inset-0 rounded-full bg-[rgba(13,148,136,0.2)] z-0"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />
          </div>
        </div>

        <div className="text-center mb-10 fade-up">
          <h1 className="font-display text-[40px] md:text-[48px] text-[var(--text-primary)] leading-[1.1] mb-4">
            Appointment<br />
            <span className="italic text-[var(--accent-blue)]">Confirmed.</span>
          </h1>
          <p className="font-body text-[16px] text-[var(--text-secondary)] max-w-[440px] mx-auto">
            We have securely forwarded your details and AI pre-consultation report to {doctorName}.
          </p>
        </div>

        {/* Appointment Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-[var(--shadow-md)] mb-8"
        >
          <div className="bg-[var(--accent-blue)] px-7 py-4 flex justify-between items-center">
            <span className="font-mono text-[11px] text-white tracking-[0.15em] font-medium">CONFIRMED</span>
            <CheckCircle size={18} className="text-white" />
          </div>

          <div className="p-7">
            {appointmentRows.map((row, i, arr) => (
              <div key={row.label} className={`flex justify-between items-center py-[14px] ${i !== arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
                <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.08em]">{row.label}</span>
                <span className="font-body text-[15px] font-medium text-[var(--text-primary)]">{row.value}</span>
              </div>
            ))}
          </div>

          <div className="px-7 py-5 bg-[var(--bg-muted)] flex flex-wrap gap-3">
            <Button variant="ghost" size="sm" leftIcon={<CalendarPlus size={16} />} className="text-[13px]">
              Add to Calendar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Download size={16} />}
              className="text-[13px]"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </Button>
          </div>
        </motion.div>

        {/* AI Report Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-sm)] overflow-hidden transition-colors hover:border-[var(--border-blue)]">
            <button
              className="w-full px-6 py-5 flex justify-between items-center cursor-hover"
              onClick={() => setReportExpanded(!reportExpanded)}
            >
              <span className="font-body text-[15px] font-semibold text-[var(--text-primary)]">Pre-Consultation AI Report</span>
              <ChevronDown size={20} className={`text-[var(--text-muted)] transition-transform duration-300 ${reportExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {reportExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pt-2 border-t border-[var(--border)] mx-6 mt-[-10px]">
                    <p className="font-body text-[14px] text-[var(--text-secondary)] italic mb-5 leading-relaxed bg-[var(--bg-secondary)] p-4 rounded-xl border border-[var(--border)]">
                      "{AI_REPORT_MOCK.summary}"
                    </p>

                    <div className="mb-5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider">SYMPTOMS:</span>
                      <div className="flex flex-wrap gap-2">
                        {AI_REPORT_MOCK.keySymptoms.map(s => (
                          <span key={s} className="bg-[var(--bg-muted)] border border-[var(--border)] font-body text-[12px] px-3 py-1 rounded-full text-[var(--text-secondary)]">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-5 flex items-center gap-3">
                      <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider">RISK LEVEL:</span>
                      <Badge variant="teal">LOW RISK</Badge>
                    </div>

                    <div>
                      <span className="font-mono text-[11px] text-[var(--text-muted)] tracking-wider block mb-2">DOCTOR FOCUS:</span>
                      <ul className="flex flex-col gap-2">
                        {AI_REPORT_MOCK.focusPoints.map(p => (
                          <li key={p} className="flex gap-2 items-start font-body text-[13px] text-[var(--text-secondary)]">
                            <ChevronRight size={14} className="text-[var(--accent-blue)] mt-0.5 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="font-body text-[18px] font-semibold text-[var(--text-primary)] mb-5">What Happens Next?</h3>
          <div className="relative pl-6 pb-2">

            <div className="absolute left-2.5 top-2 bottom-6 w-[2px] bg-gradient-to-b from-[var(--border)] to-transparent" />

            {[
              { title: 'Arrive 10 mins early', desc: 'Please check in at the reception upon arrival.' },
              { title: 'Doctor Review Complete', desc: `${doctorName} has already reviewed your report.` },
              { title: 'Personalized Care', desc: 'The consultation will focus entirely on solutions.' }
            ].map((step) => (
              <div key={step.title} className="relative mb-6 last:mb-0">
                <div className="absolute -left-[30px] top-1 w-[20px] h-[20px] rounded-full bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center relative z-10 transition-colors">
                  <span className="w-2 h-2 rounded-full bg-[var(--border)]" />
                </div>
                <h4 className="font-body text-[15px] font-medium text-[var(--text-primary)] absolute left-0 top-[2px]">{step.title}</h4>
                <p className="font-body text-[13px] text-[var(--text-secondary)] top-6 relative pt-0.5 max-w-[280px]">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <Link href="/" className="cursor-hover">
              <Button variant="secondary">Return Home</Button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
