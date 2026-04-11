'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-in-out px-8 md:px-[8vw] py-4 flex justify-between items-center ${
        scrolled
          ? 'bg-[var(--glass)] backdrop-blur-[20px] saturate-[180%] border-b border-[var(--border)] shadow-[var(--shadow-sm)]'
          : 'bg-transparent'
      }`}
    >
      <Link href="/" className="flex items-center gap-[2px]">
        <div className="flex items-baseline">
          <span className="font-display text-[28px] font-bold text-[var(--accent-blue)]">S</span>
          <span className="font-body text-[20px] font-bold text-[var(--text-primary)]">ambhavna</span>
        </div>
        <div className="flex flex-col justify-end h-full ml-2 pb-1">
          <span className="font-body text-[11px] text-[var(--text-muted)] tracking-[0.1em] uppercase">Trust Clinic</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {['Services', 'About', 'Doctors', 'Contact'].map((item) => (
          <Link
            key={item}
            href={`/#${item.toLowerCase()}`}
            className="font-body text-[14px] font-medium text-[var(--text-secondary)] relative group hover:text-[var(--accent-blue)] transition-colors"
          >
            {item}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[var(--accent-blue)] transition-all duration-300 group-hover:w-full" />
          </Link>
        ))}
      </div>

      <Link
        href="/booking"
        className="font-body text-[14px] font-semibold bg-[var(--accent-blue)] text-white px-[22px] py-[10px] rounded-full hover:bg-[var(--accent-indigo)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-blue)] transition-all duration-250 cursor-hover"
      >
        Book Appointment
      </Link>
    </nav>
  );
}
