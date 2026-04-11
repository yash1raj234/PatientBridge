'use client';

import { useEffect } from 'react';
import CustomCursor from '../ui/CustomCursor';
import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from '../PageTransition';
import { usePathname } from 'next/navigation';

// Pages that are full-screen apps — no navbar, no footer
const FULLSCREEN_PAGES = ['/dashboard', '/symptom-chat'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';
  const isFullScreen = FULLSCREEN_PAGES.includes(pathname);

  useEffect(() => {
    if (isDashboard) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isDashboard]);

  return (
    <>
      <CustomCursor />
      {!isFullScreen && <Navbar />}
      <PageTransition>{children}</PageTransition>
      {!isFullScreen && <Footer />}
    </>
  );
}
