'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlayCircle, ArrowUpRight, MessageCircle, Calendar, Brain, UserCheck, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Chip } from '@/components/ui/Chip';
import { SERVICES, MOCK_TESTIMONIALS, MOCK_DOCTORS } from '@/lib/mockData';
import Link from 'next/link';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), { ssr: false });

export default function LandingPage() {
  const container = useRef(null);

  // GSAP Animations
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.from('.hero-label', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero-line-1', { y: 60, opacity: 0, duration: 0.8 }, '-=0.3')
      .from('.hero-line-2', { y: 60, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-line-3', { y: 60, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-sub', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
      .from('.hero-cta', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
      .from('.hero-trust', { y: 15, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.2');

    // How it works connecting line
    gsap.fromTo('.how-line', 
      { width: 0 }, 
      { 
        width: '100%', 
        scrollTrigger: { 
          trigger: '.how-container', 
          start: 'top 60%', 
          end: 'bottom 40%', 
          scrub: true 
        } 
      }
    );

    // Fade up elements
    gsap.utils.toArray('.fade-up').forEach((el: any) => {
      gsap.from(el, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 82%',
          once: true
        }
      });
    });

  }, { scope: container });

  // 3D Tilt for Service Cards
  const createTilt = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    
    const rotateX = useSpring(useMotionTemplate`${mouseY}deg`, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useMotionTemplate`${mouseX}deg`, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      mouseX.set(((x - centerX) / centerX) * 6);
      mouseY.set(-((y - centerY) / centerY) * 6);
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
  };

  return (
    <main ref={container} className="bg-[var(--bg-primary)] overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-[100dvh] overflow-hidden bg-[var(--bg-primary)] border-b border-[var(--border)]">
        {/* Background decorations */}
        <div className="absolute -top-[100px] -right-[100px] w-[600px] h-[600px] rounded-full bg-[rgba(27,79,216,0.06)] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 -left-[100px] w-[500px] h-[500px] rounded-full bg-[rgba(13,148,136,0.05)] blur-[60px] pointer-events-none" />
        <div 
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 h-full items-center relative z-10">
          {/* Left Column */}
          <div className="pl-6 md:pl-[8vw] pr-6 md:pr-0 pt-20">
            <div className="hero-label inline-block font-mono text-[11px] text-[var(--accent-blue)] bg-[rgba(27,79,216,0.08)] border border-[rgba(27,79,216,0.15)] rounded-full px-[14px] py-[6px] tracking-widest mb-8">
              ✦ Bhopal's Most Trusted Clinic Since 1994
            </div>
            
            <h1 className="font-display text-[44px] md:text-[76px] leading-[1.05] tracking-tight mb-6">
              <span className="block hero-line-1 text-[var(--text-primary)] relative z-10">Compassionate</span>
              <span className="block hero-line-2 relative z-10">
                <span className="text-[var(--text-primary)]">Care,</span>
                <span className="text-[var(--accent-blue)]"> Intelligently</span>
              </span>
              <span className="block hero-line-3 text-[var(--text-primary)] italic relative z-10">Delivered.</span>
            </h1>
            
            <p className="hero-sub font-body text-[17px] text-[var(--text-secondary)] leading-[1.75] max-w-[500px] mb-10">
              Sambhavna Trust Clinic combines 30 years of compassionate healthcare with AI-powered pre-screening — so your doctor knows your story before you walk in.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/booking" className="hero-cta cursor-hover">
                <Button size="lg" className="px-8 font-semibold">Book Appointment →</Button>
              </Link>
              <div className="hero-cta cursor-hover">
                <Button size="lg" variant="secondary" leftIcon={<PlayCircle size={18} />}>Watch How It Works</Button>
              </div>
            </div>
            
            <div className="flex items-center gap-7">
              {['3,000+ Monthly Patients', 'AI Pre-Screening Report', 'AYUSH Certified'].map((trust, i) => (
                <div key={trust} className="hero-trust flex items-center gap-2">
                  {i > 0 && <div className="w-[1px] h-5 bg-[var(--border)] mr-5 hidden md:block" />}
                  <span className="text-[var(--accent-teal)]">✦</span>
                  <span className="font-body text-[13px] text-[var(--text-secondary)]">{trust}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (3D Scene) */}
          <div className="hidden md:block absolute right-0 top-0 w-[52%] h-full">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(27,79,216,0.04)_0%,transparent_70%)]" />
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1.2, delay: 0.4 }}
              className="w-full h-full"
            >
              <HeroScene />
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARQUEE STATS */}
      <section className="bg-[var(--accent-blue)] text-white py-[14px] overflow-hidden whitespace-nowrap flex flex-col gap-1 relative z-20">
        <div className="flex w-max" style={{ animation: 'marqueeLeft 25s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4 font-body text-[13px] font-medium tracking-[0.06em] uppercase">
              <span>3,000+ Monthly Patients <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>AI Pre-Screening <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>Established 1994 <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>20+ Expert Doctors <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>AYUSH Certified <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>Bhopal Gas Relief Care <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
            </div>
          ))}
        </div>
        <div className="flex w-max" style={{ animation: 'marqueeRight 30s linear infinite' }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-8 px-4 font-body text-[13px] font-medium tracking-[0.06em] uppercase">
              <span>Bhopal Gas Relief Care <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>AYUSH Certified <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>20+ Expert Doctors <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>Established 1994 <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>AI Pre-Screening <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
              <span>3,000+ Monthly Patients <span className="opacity-50 text-[var(--accent-sky)] ml-8">✦</span></span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="bg-[var(--bg-secondary)] py-[120px] px-6 md:px-[8vw] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="fade-up relative">
            {/* Watermark 30 */}
            <div className="absolute -bottom-5 -left-5 font-display text-[220px] font-bold text-[var(--border)] leading-none z-0 pointer-events-none opacity-50">30</div>
            
            <div className="relative z-10">
              <div className="inline-block font-mono text-[11px] text-[var(--accent-teal)] bg-[rgba(13,148,136,0.1)] border border-[rgba(13,148,136,0.2)] rounded-full px-4 py-1.5 tracking-[0.15em] mb-6">
                ABOUT SAMBHAVNA
              </div>
              <h2 className="font-display text-[40px] md:text-[52px] font-medium leading-[1.15] mb-8">
                Three Decades of<br />
                Healing Bhopal's<br />
                <span className="italic text-[var(--accent-blue)]">Heart.</span>
              </h2>
              <p className="font-body text-[16px] text-[var(--text-secondary)] leading-[1.8] mb-6 max-w-lg">
                Since 1994, Sambhavna Trust Clinic has provided free and compassionate medical care to the survivors of the Bhopal gas tragedy and those affected by environmental contamination.
              </p>
              <p className="font-body text-[16px] text-[var(--text-secondary)] leading-[1.8] mb-8 max-w-lg">
                Today, we pair our holistic approach to healing—combining modern medicine, Ayurveda, and Yoga—with advanced AI pre-screening to ensure every patient receives the highly personalized care they deserve.
              </p>
              <button className="flex items-center gap-2 font-body text-[14px] font-semibold text-[var(--accent-teal)] group cursor-hover">
                Our Mission <ArrowUpRight size={16} className="transition-transform group-hover:rotate-45" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 fade-up">
            {[
              { num: '30+', label: 'Years Serving Bhopal' },
              { num: '3,000+', label: 'Patients Every Month' },
              { num: '20+', label: 'Specialist Doctors' },
              { num: '100%', label: 'Charitable Trust — Free Care Available' }
            ].map((stat, i) => (
              <Card key={i} hoverable className="group">
                <div className="font-display text-[56px] text-[var(--accent-blue)] leading-tight mb-2 group-hover:scale-105 origin-left transition-transform duration-300">{stat.num}</div>
                <div className="font-body text-[14px] text-[var(--text-secondary)] pr-4">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="bg-[var(--bg-primary)] py-[120px] px-6 md:px-[8vw]">
        <div className="text-center mb-[60px] fade-up flex flex-col items-center">
          <div className="inline-block font-mono text-[11px] text-[var(--accent-blue)] bg-[rgba(27,79,216,0.08)] border border-[rgba(27,79,216,0.15)] rounded-full px-4 py-1.5 tracking-[0.15em] mb-6 uppercase">
            Our Methods
          </div>
          <h2 className="font-display text-[40px] md:text-[52px] mb-4">
            Comprehensive Care <span className="italic text-[var(--accent-blue)]">for Every Need</span>
          </h2>
          <p className="font-body text-[17px] text-[var(--text-secondary)] max-w-[560px]">
            We integrate modern medical practice, traditional wisdom, and artificial intelligence to bring you the best possible healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 fade-up">
          {SERVICES.map((s, i) => {
            const tilt = createTilt();
            const colSpan = i === 0 ? 'md:col-span-5' : i === 1 ? 'md:col-span-7' : i === 2 ? 'md:col-span-4' : i === 3 ? 'md:col-span-4' : 'md:col-span-4';
            const isLarge = i === 1;

            return (
              <motion.div
                key={s.id}
                className={`${colSpan} h-full`}
                style={{ perspective: 800, transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  onMouseMove={tilt.handleMouseMove}
                  onMouseLeave={tilt.handleMouseLeave}
                  style={{ rotateX: tilt.rotateX, rotateY: tilt.rotateY }}
                  className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[20px] p-8 shadow-[var(--shadow-sm)] hover:border-[var(--border-blue)] hover:shadow-[var(--shadow-blue)] transition-colors duration-300 relative overflow-hidden group h-full cursor-hover"
                >
                  <div className="w-12 h-12 rounded-xl bg-[rgba(27,79,216,0.08)] flex items-center justify-center mb-5 relative z-10">
                    <span className="text-[var(--accent-blue)]">✦</span>
                  </div>
                  
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="font-body text-[20px] font-semibold text-[var(--text-primary)]">{s.title}</h3>
                    {isLarge && (
                      <Badge variant="teal" className="scale-90 origin-right tracking-widest text-[10px]">NEW AI</Badge>
                    )}
                  </div>
                  
                  <p className="font-body text-[15px] text-[var(--text-secondary)] leading-relaxed mt-2 relative z-10 w-[90%]">
                    {s.description}
                  </p>

                  <div className="absolute bottom-6 right-6 text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] transform transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={24} />
                  </div>
                  
                  {/* Ghost Icon */}
                  <div className="absolute -top-4 -right-4 text-[100px] text-[var(--accent-blue)] opacity-[0.03] select-none pointer-events-none font-display">
                    {isLarge ? 'AI' : s.title.charAt(0)}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[var(--bg-muted)] py-[100px] px-6 md:px-[8vw] fade-up relative overflow-hidden">
        <div className="text-center mb-[80px]">
          <h2 className="font-display text-[40px] md:text-[48px]">
            Your Journey from <span className="italic text-[var(--accent-blue)]">Booking to Healing</span>
          </h2>
        </div>

        <div className="how-container relative max-w-5xl mx-auto">
          {/* Connecting line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[40px] right-[40px] h-[2px] border-t-2 border-dashed border-[var(--border-blue)]" />
          <div className="how-line hidden md:block absolute top-[28px] left-[40px] h-[2px] bg-[var(--accent-blue)] w-0 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative z-10">
            {[
              { step: '01', title: 'Choose a Slot', icon: Calendar, desc: 'Find a time that works for you online.' },
              { step: '02', title: 'Share Symptoms', icon: MessageCircle, desc: 'Chat with our AI assistant securely.' },
              { step: '03', title: 'AI Prepares Report', icon: Brain, desc: 'Your doctor reviews it before you arrive.' },
              { step: '04', title: 'Meet Your Doctor', icon: UserCheck, desc: 'Focus on healing, not repeating history.' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left relative group">
                <div className="w-14 h-14 rounded-full bg-[var(--bg-card)] border-2 border-[var(--border)] flex items-center justify-center mb-5 group-hover:border-[var(--accent-blue)] group-hover:bg-[rgba(27,79,216,0.08)] transition-all duration-300 relative z-10">
                  <s.icon size={20} className="text-[var(--accent-blue)]" />
                </div>
                <div className="font-mono text-[14px] text-[var(--text-muted)] absolute top-2 right-4 md:static md:mb-1">{s.step}</div>
                <h3 className="font-body text-[18px] font-semibold text-[var(--text-primary)] mb-2 mt-4 md:mt-2">{s.title}</h3>
                <p className="font-body text-[14px] text-[var(--text-secondary)] md:max-w-[180px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[var(--bg-primary)] pt-[100px] overflow-hidden fade-up">
        <div className="text-center px-6 md:px-[8vw] mb-[60px]">
          <div className="inline-block font-mono text-[11px] text-[var(--accent-blue)] bg-[rgba(27,79,216,0.08)] border border-[rgba(27,79,216,0.15)] rounded-full px-4 py-1.5 tracking-[0.15em] mb-4 uppercase">
            Patient Stories
          </div>
          <h2 className="font-display text-[40px] md:text-[48px]">
            Voices of Those <span className="italic text-[var(--accent-blue)]">We've Helped</span>
          </h2>
        </div>

        <div className="flex flex-col gap-4 pb-[80px]">
          <div className="flex w-max pl-4" style={{ animation: 'marqueeLeft 40s linear infinite' }}>
            {MOCK_TESTIMONIALS.map((t, i) => (
              <Card key={`t1-${i}`} padding="md" className="min-w-[340px] w-[340px] mr-4 flex flex-col justify-between cursor-hover shrink-0">
                <div>
                  <div className="flex gap-[2px] mb-3">
                    {[1,2,3,4,5].map(st => <Star key={st} size={14} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  <p className="font-body text-[15px] text-[var(--text-secondary)] italic leading-[1.65]">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[12px] text-white tracking-widest">{t.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-body text-[14px] font-semibold text-[var(--text-primary)] leading-tight">{t.author}</h4>
                    <span className="font-body text-[12px] text-[var(--text-muted)]">{t.type}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex w-max pl-4" style={{ animation: 'marqueeRight 45s linear infinite' }}>
            {[...MOCK_TESTIMONIALS].reverse().map((t, i) => (
              <Card key={`t2-${i}`} padding="md" className="min-w-[340px] w-[340px] mr-4 flex flex-col justify-between cursor-hover shrink-0">
                <div>
                  <div className="flex gap-[2px] mb-3">
                    {[1,2,3,4,5].map(st => <Star key={st} size={14} fill="#F59E0B" color="#F59E0B" />)}
                  </div>
                  <p className="font-body text-[15px] text-[var(--text-secondary)] italic leading-[1.65]">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 mt-5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-[12px] text-white tracking-widest">{t.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-body text-[14px] font-semibold text-[var(--text-primary)] leading-tight">{t.author}</h4>
                    <span className="font-body text-[12px] text-[var(--text-muted)]">{t.type}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS SECTION */}
      <section id="doctors" className="bg-[var(--bg-secondary)] py-[100px] px-6 md:px-[8vw] fade-up">
        <h2 className="font-display text-[40px] md:text-[48px] text-center mb-[60px]">
          Meet Our <span className="italic text-[var(--accent-blue)]">Dedicated Doctors</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_DOCTORS.map((doc) => (
            <Card key={doc.id} padding="none" hoverable className="overflow-hidden flex flex-col cursor-hover">
              <div className="p-8 pb-6 flex-1">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[rgba(27,79,216,0.15)] to-[rgba(13,148,136,0.15)] border-2 border-[var(--border-blue)] flex items-center justify-center mb-5">
                  <span className="font-display text-[28px] text-[var(--accent-blue)]">
                    {doc.name.split(' ')[1].charAt(0)}{doc.name.split(' ').length > 2 ? doc.name.split(' ')[2].charAt(0) : ''}
                  </span>
                </div>
                <h3 className="font-display text-[22px] text-[var(--text-primary)] leading-tight mb-1">{doc.name}</h3>
                <p className="font-body text-[14px] font-medium text-[var(--accent-teal)] mb-3">{doc.specialty}</p>
                <p className="font-body text-[13px] text-[var(--text-secondary)] leading-relaxed line-clamp-3">{doc.bio}</p>
              </div>
              <div className="border-t border-[var(--border)] px-8 py-5 bg-[var(--bg-card)] flex justify-between items-center group/btn">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${doc.availableToday ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse' : 'bg-amber-500'}`} />
                  <span className={`font-body text-[13px] font-medium ${doc.availableToday ? 'text-[var(--accent-teal)]' : 'text-amber-600'}`}>
                    {doc.availableToday ? 'Available Today' : 'Next available: Tmr'}
                  </span>
                </div>
                <Link href="/booking" className="font-body text-[14px] font-semibold text-[var(--accent-blue)] flex items-center gap-1 group-hover/btn:translate-x-1 transition-transform">
                  Book <ChevronRight size={16} />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[var(--accent-blue)] py-[120px] px-6 md:px-[8vw] overflow-hidden relative fade-up">
        {/* Abstract shapes */}
        <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-[rgba(255,255,255,0.04)] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[rgba(56,189,248,0.15)] pointer-events-none blur-3xl" />
        
        {/* Giant text watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[300px] text-white opacity-[0.03] select-none pointer-events-none leading-none z-0">
          HEAL
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-block font-mono text-[11px] text-white bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] rounded-full px-4 py-1.5 tracking-[0.15em] mb-8">
            START YOUR JOURNEY
          </div>
          
          <h2 className="font-display text-[48px] md:text-[64px] text-white leading-tight mb-6">
            Your Doctor is Ready<br />to Listen.
          </h2>
          
          <p className="font-body text-[18px] text-[rgba(255,255,255,0.8)] max-w-[520px] mb-10 leading-relaxed">
            Experience the difference of a clinic that values your time and truly understands your health needs.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link href="/booking" className="cursor-hover">
              <Button size="lg" className="bg-white text-[var(--accent-blue)] hover:bg-[var(--bg-muted)] hover:text-[var(--accent-indigo)] px-10">
                Book Appointment
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-6 md:gap-12">
            <div className="flex flex-col items-center text-white">
              <span className="font-display text-[32px]">3,000+</span>
              <span className="font-body text-[13px] opacity-80 uppercase tracking-wider">Patients</span>
            </div>
            <div className="w-[1px] h-10 bg-white/20" />
            <div className="flex flex-col items-center text-white">
              <span className="font-display text-[32px]">20+</span>
              <span className="font-body text-[13px] opacity-80 uppercase tracking-wider">Doctors</span>
            </div>
            <div className="w-[1px] h-10 bg-white/20" />
            <div className="flex flex-col items-center text-white">
              <span className="font-display text-[32px]">30+</span>
              <span className="font-body text-[13px] opacity-80 uppercase tracking-wider">Years</span>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
