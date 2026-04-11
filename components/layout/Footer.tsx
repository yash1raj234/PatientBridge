import Link from 'next/link';
import { Github, Twitter, Linkedin, MapPin, Phone, Mail, Stethoscope } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-[80px] px-[8vw] pb-[40px]">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-[60px]">
        
        {/* Col 1 */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-[2px]">
              <span className="font-display text-[28px] font-bold text-white">S</span>
              <span className="font-body text-[20px] font-bold text-white">ambhavna</span>
            </div>
            <span className="font-body text-[11px] text-[rgba(255,255,255,0.6)] tracking-[0.1em] uppercase block mt-1">
              Trust Clinic
            </span>
          </div>
          <p className="font-body text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.6]">
            Three decades of compassionate healthcare and intelligent pre-screening.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-[var(--text-muted)] hover:text-white transition-colors cursor-hover"><Github size={18} /></a>
            <a href="#" className="text-[var(--text-muted)] hover:text-white transition-colors cursor-hover"><Twitter size={18} /></a>
            <a href="#" className="text-[var(--text-muted)] hover:text-white transition-colors cursor-hover"><Linkedin size={18} /></a>
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <h4 className="font-body text-[16px] font-semibold text-white mb-6">Quick Links</h4>
          <ul className="flex flex-col gap-4">
            {['Home', 'About Us', 'Our Doctors', 'Testimonials', 'Book Appointment'].map((link) => (
              <li key={link}>
                <Link href={link === 'Book Appointment' ? '/booking' : '#'} className="font-body text-[14px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-hover">
                  {link}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/login" className="font-body text-[14px] text-[var(--accent-sky)] hover:text-white transition-colors cursor-hover flex items-center gap-2">
                <Stethoscope size={14} />
                Doctor Portal
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <h4 className="font-body text-[16px] font-semibold text-white mb-6">Services</h4>
          <ul className="flex flex-col gap-4">
            {['General Consultation', 'AI Pre-Screening', 'Bhopal Gas Relief Care', 'Ayurvedic Care', 'Follow-up Checkups'].map((link) => (
              <li key={link}>
                <Link href="#" className="font-body text-[14px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors cursor-hover">
                  {link}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 */}
        <div>
          <h4 className="font-body text-[16px] font-semibold text-white mb-6">Contact</h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-[rgba(255,255,255,0.6)] mt-[2px] shrink-0" />
              <span className="font-body text-[14px] text-[rgba(255,255,255,0.6)] leading-[1.6]">
                12 Clinic Road, Trust District<br />Bhopal, MP 462001
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-[rgba(255,255,255,0.6)] shrink-0" />
              <span className="font-body text-[14px] text-[rgba(255,255,255,0.6)]">
                +91 755 242 4110
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-[rgba(255,255,255,0.6)] shrink-0" />
              <span className="font-body text-[14px] text-[rgba(255,255,255,0.6)]">
                care@sambhavnatrust.org
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="pt-6 border-t border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body text-[13px] text-[rgba(255,255,255,0.4)]">
          © 2025 Sambhavna Trust Clinic. All rights reserved.
        </p>
        <p className="font-body text-[13px] text-[rgba(255,255,255,0.4)]">
          Built with ♥ for Bhopal, India
        </p>
      </div>
    </footer>
  );
}
