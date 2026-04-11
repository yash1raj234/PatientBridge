'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShieldCheck, Send } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isTyping?: boolean;
}

const INIT_QUESTIONS = [
  "Hello! I'm the Sambhavna AI Assistant. I'll help prepare your consultation with Dr. Sharma. What brings you in today?",
  "Thank you for sharing that. How long have you been experiencing this?",
  "I see. On a scale of 1 to 10, how would you rate the discomfort?",
  "Are you currently taking any medications or supplements?",
  "Have you experienced this before, or is this a new symptom?",
  "One last question — do you have any known allergies?"
];

export default function SymptomChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: INIT_QUESTIONS[0] }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    // Scroll within the chat container only — not the whole page
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAiTyping, reportReady]);

  const handleSend = () => {
    if (!inputValue.trim() || isAiTyping || reportReady) return;

    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const nextIndex = questionIndex + 1;
    setQuestionIndex(nextIndex);

    if (nextIndex < INIT_QUESTIONS.length) {
      setIsAiTyping(true);
      const delays = [800, 800, 600, 600, 1000, 1200];
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: INIT_QUESTIONS[nextIndex] }]);
      }, delays[nextIndex] || 800);
    } else {
      setIsAiTyping(true);
      setTimeout(() => {
        setIsAiTyping(false);
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Perfect. I have everything I need. Preparing your pre-consultation report for Dr. Sharma now..." }]);
        
        setTimeout(() => {
          setReportReady(true);
          // Redirect after showing completion state
          setTimeout(() => {
            router.push('/confirmation');
          }, 3000);
        }, 1500);

      }, 1200);
    }
  };

  const totalQuestions = INIT_QUESTIONS.length;

  return (
    <div className="h-screen bg-[var(--bg-primary)] flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="h-16 bg-[var(--bg-card)] border-b border-[var(--border)] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/booking" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--bg-muted)] transition-colors cursor-hover">
            <ArrowLeft size={18} className="text-[var(--text-primary)]" />
          </Link>
          <h1 className="font-body text-[16px] font-semibold text-[var(--text-primary)]">Pre-Consultation Chat</h1>
        </div>

        <div className="flex items-center gap-2 bg-[rgba(13,148,136,0.1)] border border-[rgba(13,148,136,0.2)] rounded-full px-3 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-teal)] animate-pulse" />
          <span className="font-mono text-[11px] text-[var(--accent-teal)] tracking-wider">LIVE AI</span>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-[12px] text-[var(--accent-blue)]">09:30 AM</p>
            <p className="font-body text-[13px] text-[var(--text-secondary)]">Dr. Ananya Sharma</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
            <span className="font-display text-[16px] text-white">AS</span>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR (Desktop) */}
        <div className="hidden md:flex w-[300px] bg-[var(--bg-secondary)] border-r border-[var(--border)] p-6 flex-col justify-between">
          <div>
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 mb-8 shadow-[var(--shadow-sm)]">
              <h3 className="font-body text-[14px] font-semibold text-[var(--text-primary)] mb-1">Patient Details</h3>
              <p className="font-body text-[13px] text-[var(--text-secondary)] mb-4">Priya Verma, 34 yrs</p>
              
              <div className="h-[1px] bg-[var(--border)] mb-4" />
              
              <p className="font-body text-[12px] text-[var(--text-muted)] mb-1">APPOINTMENT</p>
              <p className="font-mono text-[14px] text-[var(--accent-blue)] mb-1">Today, 09:30 AM</p>
              <p className="font-body text-[13px] text-[var(--text-secondary)]">Dr. Ananya Sharma</p>
            </div>

            <div>
              <p className="font-body text-[12px] text-[var(--text-muted)] tracking-wider uppercase mb-3">Conversation Progress</p>
              
              <div className="w-full h-1.5 bg-[var(--border)] rounded-full mb-3 overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--accent-blue)] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.min(questionIndex, totalQuestions) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <p className="font-body text-[13px] text-[var(--text-secondary)] mb-6">
                Question {Math.min(questionIndex + 1, totalQuestions)} of {totalQuestions}
              </p>

              <div className="flex gap-2">
                {[...Array(totalQuestions)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`flex-1 h-1.5 rounded-full transition-colors duration-300
                      ${i < questionIndex ? 'bg-[var(--accent-teal)]' :
                        i === questionIndex ? 'bg-[var(--accent-blue)] animate-pulse' :
                        'bg-[var(--border)]'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-[rgba(255,255,255,0.5)] p-4 rounded-xl border border-[rgba(255,255,255,0.8)]">
            <ShieldCheck size={16} className="text-[var(--accent-teal)] shrink-0 mt-0.5" />
            <p className="font-body text-[12px] text-[var(--text-secondary)] leading-[1.6]">
              Your responses are securely encrypted and only shared with your reviewing doctor.
            </p>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-[var(--bg-primary)]">
          
          <div ref={chatScrollRef} className="flex-1 overflow-y-auto px-4 md:px-10 py-8 scroll-smooth">
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              
              {messages.map((m) => (
                <motion.div 
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex flex-col max-w-[85%] md:max-w-[72%] ${m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  {m.sender === 'ai' && (
                    <div className="flex items-center gap-2 mb-2 ml-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                        <span className="font-mono text-[9px] text-white">AI</span>
                      </div>
                      <span className="font-body text-[12px] text-[var(--text-muted)]">Sambhavna Assistant</span>
                    </div>
                  )}

                  <div className={`
                    px-5 py-3.5 rounded-2xl font-body text-[15px] leading-[1.6] shadow-sm
                    ${m.sender === 'user' 
                      ? 'bg-[var(--accent-blue)] text-white rounded-tr-sm' 
                      : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-primary)] rounded-tl-sm'}
                  `}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isAiTyping && (
                <div className="flex flex-col self-start items-start max-w-[72%]">
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-teal)] flex items-center justify-center">
                      <span className="font-mono text-[9px] text-white">AI</span>
                    </div>
                  </div>
                  <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex gap-1.5 items-center object-contain">
                    <motion.div className="w-2 h-2 rounded-full bg-[var(--border)]" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-[var(--border)]" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.15 }} />
                    <motion.div className="w-2 h-2 rounded-full bg-[var(--border)]" animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.3 }} />
                  </div>
                </div>
              )}

              {/* REPORT READY CARD */}
              <AnimatePresence>
                {reportReady && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="self-center w-full max-w-md mt-6"
                  >
                    <div className="bg-gradient-to-br from-[rgba(13,148,136,0.08)] to-[rgba(27,79,216,0.06)] border border-[rgba(13,148,136,0.25)] rounded-2xl p-8 text-center shadow-[var(--shadow-md)]">
                      <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-6 relative">
                        <svg className="w-10 h-10 text-[var(--accent-teal)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <motion.path 
                            initial={{ pathLength: 0 }} 
                            animate={{ pathLength: 1 }} 
                            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                            d="M20 6L9 17l-5-5"
                          />
                        </svg>
                      </div>
                      
                      <h2 className="font-display text-[28px] text-[var(--text-primary)] mb-2">Report Ready!</h2>
                      <p className="font-body text-[14px] text-[var(--text-secondary)] mb-6">
                        Your pre-consultation summary has been securely transmitted to Dr. Sharma.
                      </p>
                      
                      <p className="font-mono text-[12px] text-[var(--accent-teal)] mb-3">Redirecting to confirmation...</p>
                      
                      <div className="h-1 w-full bg-[rgba(13,148,136,0.2)] rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-[var(--accent-teal)]"
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 2.5, ease: "linear" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* INPUT BAR */}
          <div className="bg-[var(--bg-card)] border-t border-[var(--border)] p-4 md:px-8 py-4 shrink-0">
            <div className="max-w-3xl mx-auto flex items-end gap-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-[16px] p-2 pl-4 focus-within:border-[var(--accent-blue)] focus-within:ring-[3px] focus-within:ring-[rgba(27,79,216,0.1)] transition-all">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={reportReady}
                placeholder="Type your answer here..."
                className="flex-1 bg-transparent border-none outline-none resize-none font-body text-[15px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] py-[10px] min-h-[44px] max-h-[100px] overflow-y-auto"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!inputValue.trim() || reportReady}
                className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all cursor-hover
                  ${inputValue.trim() && !reportReady
                    ? 'bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-indigo)] hover:scale-105' 
                    : 'bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed text-opacity-50'}`}
              >
                <Send size={16} className={`${inputValue.trim() && !reportReady ? 'ml-1' : ''}`} />
              </button>
            </div>
            <p className="text-center font-body text-[11px] text-[var(--text-muted)] mt-2">
              Press Enter to send, Shift+Enter for newline.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
