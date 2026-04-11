'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Stethoscope, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px]"
      >
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-8 md:p-10 shadow-[var(--shadow-md)]">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-blue)] flex items-center justify-center mb-6 shadow-[var(--shadow-blue)]">
              <Stethoscope className="text-white" size={32} />
            </div>
            <h1 className="font-display text-[32px] text-[var(--text-primary)] mb-2">Doctor Portal</h1>
            <p className="font-body text-[15px] text-[var(--text-secondary)]">
              Access your schedule and patient reports
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div className="relative w-full">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full bg-[var(--bg-primary)] border ${email ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[22px] px-4 pb-2 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                placeholder=" "
              />
              <label 
                htmlFor="email" 
                className={`absolute left-4 transition-all pointer-events-none ${
                  email ? 'top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'top-[18px] text-[14px] text-[var(--text-muted)]'
                }`}
              >
                Email Address
              </label>
            </div>

            <div className="relative w-full">
              <Lock className="absolute right-4 top-[18px] text-[var(--text-muted)]" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full bg-[var(--bg-primary)] border ${password ? 'border-[var(--accent-blue)]' : 'border-[var(--border)]'} rounded-xl pt-[22px] px-4 pb-2 font-body text-[15px] outline-none focus:border-[var(--accent-blue)] focus:ring-[3px] focus:ring-[rgba(27,79,216,0.1)] transition-all`}
                placeholder=" "
              />
              <label 
                htmlFor="password" 
                className={`absolute left-4 transition-all pointer-events-none ${
                  password ? 'top-2 text-[11px] text-[var(--accent-blue)] font-semibold' : 'top-[18px] text-[14px] text-[var(--text-muted)]'
                }`}
              >
                Password
              </label>
            </div>

            <div className="flex justify-end">
              <button type="button" className="font-body text-[13px] text-[var(--accent-blue)] font-medium hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              loading={isLoading}
              rightIcon={!isLoading && <ArrowRight size={18} />}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-[var(--border)] flex items-start gap-3">
            <ShieldCheck className="text-[var(--accent-teal)] shrink-0 mt-0.5" size={16} />
            <p className="font-body text-[12px] text-[var(--text-muted)] leading-relaxed">
              This portal is for Sambhavna Trust Clinic medical staff only. All access is logged and monitored.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
            <Link href="/" className="font-body text-[14px] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors">
                ← Back to Homepage
            </Link>
        </div>
      </motion.div>
    </div>
  );
}
