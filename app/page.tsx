"use client";

import React, { useEffect, useState, useRef, memo, useSyncExternalStore } from "react";
import Image from "next/image";
import Script from "next/script";

const subscribeToNothing = () => () => {};
const getMountedClientSnapshot = () => true;
const getMountedServerSnapshot = () => false;
const getThemeSnapshot = () => document.documentElement.getAttribute("data-theme") === "dark";
const getServerThemeSnapshot = () => false;
const subscribeToTheme = (onStoreChange: () => void) => {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
};

// --- UI COMPONENTS ---

// Premium Custom SVG Logo for WebAgen
const WebAgenLogo = memo(({ className = "w-8 h-8", shadow = true }: { className?: string, shadow?: boolean }) => (
  <svg 
    className={className} 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    style={{ 
      boxShadow: shadow ? '0 8px 16px rgba(99,102,241,0.25)' : 'none', 
      borderRadius: '10px',
      flexShrink: 0
    }}
  >
    <rect width="32" height="32" rx="10" fill="url(#logoGradMain)" />
    {/* The 'W' Shape */}
    <path d="M7 14L12 24L16 16L20 24L25 14" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* The 'A' Crossbar */}
    <path d="M10.5 20H21.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    {/* The AI Node / Spark */}
    <circle cx="16" cy="8" r="2.5" fill="white" />
    <defs>
      <linearGradient id="logoGradMain" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818CF8" />
        <stop offset="1" stopColor="#4338CA" />
      </linearGradient>
    </defs>
  </svg>
));
WebAgenLogo.displayName = 'WebAgenLogo';

// Reusable Component for the Live Automated Browser Demo
const MockSiteContent = memo(({ chatState, siteLoaded, urlText }: { chatState: string, siteLoaded: boolean, urlText: string }) => (
  <div className="mock-site-bg" aria-hidden="true">
    <div className="mock-browser-bar">
      <div className="flex gap-1.5 absolute left-4">
        <div className="w-3 h-3 rounded-full bg-rose-400/90 shadow-inner"></div>
        <div className="w-3 h-3 rounded-full bg-amber-400/90 shadow-inner"></div>
        <div className="w-3 h-3 rounded-full bg-emerald-400/90 shadow-inner"></div>
      </div>
      <div className="mock-url-bar">
        <span className="text-[12px] mr-1.5" style={{ color: "var(--text-light)" }}>🔒</span>
        <span className="text-[14px] font-bold font-mono tracking-tight flex items-center url-typing-text">
          {urlText}
          {!siteLoaded && <span className="animate-pulse inline-block w-2 h-4 bg-indigo-500 ml-1"></span>}
        </span>
      </div>
      <div className={`loading-bar ${urlText === 'webagen.dev' && !siteLoaded ? 'loading' : ''} ${siteLoaded ? 'done' : ''}`}></div>
    </div>

    <div className={`mock-site-body ${siteLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000 flex-1 relative flex flex-col`}>
      <div className="mock-nav">
        <div className="mock-logo">
          <WebAgenLogo className="w-5 h-5" shadow={false} />
          WebAgen
        </div>
        <div className="mock-nav-links">
          <span className="mock-nav-link">Services</span>
          <span className="mock-nav-link">Portfolio</span>
          <span className="mock-nav-link">Pricing</span>
        </div>
        <div className="mock-book-btn">Get Started</div>
      </div>
      
      <div className="mock-hero">
        <div className="mock-hero-left">
          <div className="mock-badge-inner">
            <div className="mock-dot-inner"></div>Delivering Top-Tier Web Apps
          </div>
          <div className="mock-h1">
            Build Fast.<br />
            <span>Scale Smart.</span>
          </div>
          <div className="mock-p">
            High-performance Next.js websites powered by custom AI agents and smart analytics. We build digital engines that convert.
          </div>
          <div className="mock-cta-row">
            <div className="mock-btn-p">Start Project →</div>
            <div className="mock-btn-s">View Portfolio</div>
          </div>
        </div>

        <div className="mock-hero-center">
          <div className="mock-code-wrapper">
            <div className="mock-code-glow"></div>
            <div className="mock-code-block">
              <div className="mock-code-header">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="code-title">engine.tsx</span>
              </div>
              <pre className="mock-code-body">
                <code>
                  <span style={{color: '#c678dd'}}>import</span> {`{ AI_Agent }`} <span style={{color: '#c678dd'}}>from</span> <span style={{color: '#98c379'}}>&apos;@webagen/ai&apos;</span>;<br/><br/>
                  <span style={{color: '#61afef'}}>export default function</span> <span style={{color: '#e5c07b'}}>BusinessScale</span>() {`{`}<br/>
                  &nbsp;&nbsp;<span style={{color: '#c678dd'}}>return</span> (<br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>&lt;WebApp</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>performance</span>=<span style={{color: '#98c379'}}>&quot;100&quot;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#d19a66'}}>delivery</span>=<span style={{color: '#98c379'}}>&quot;&lt;60_Hours&quot;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#5c6370', fontStyle: 'italic'}}>{"// Converts visitors automatically"}</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>&lt;AI_Agent</span> <span style={{color: '#d19a66'}}>status</span>={<span style={{color: '#56b6c2'}}>active</span>} <span style={{color: '#e06c75'}}>/&gt;</span><br/>
                  &nbsp;&nbsp;&nbsp;&nbsp;<span style={{color: '#e06c75'}}>&lt;/WebApp&gt;</span><br/>
                  &nbsp;&nbsp;);<br/>
                  {`}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
        
        <div className="mock-hero-right">
          <div className="mock-stat-card">
            <div className="mock-stat-label">Page Speed</div>
            <div className="mock-stat-value">100</div>
            <div className="mock-stat-change" style={{color: '#10B981'}}>↑ Lightning fast</div>
          </div>
          <div className="mock-stat-card">
            <div className="mock-stat-label">Conversion</div>
            <div className="mock-stat-value">+42%</div>
            <div className="mock-stat-change">↑ Industry average</div>
          </div>
        </div>

        <div className={`mock-chat ${chatState === 'hidden' ? 'hidden' : ''}`}>
          <div className="mock-chat-header">
            <div className="mock-chat-avatar">AI</div>
            <div>
              <div className="mock-chat-name">WebAgen Bot</div>
              <div className="mock-chat-status">● Online now</div>
            </div>
          </div>
          <div className="mock-chat-msg">
            Hi! Ready to build something amazing?
          </div>
          {chatState === 'typing' ? (
            <div className="mock-chat-bubble">
              <div className="typing-dots">
                <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
              </div>
            </div>
          ) : (
            <div className="mock-chat-bubble" style={{ boxShadow: "0 0 12px rgba(99,102,241,0.2)" }}>
              I need a Next.js site with an AI chatbot 🚀
            </div>
          )}
        </div>
      </div>

      <div className="mock-features-bar">
        <div className="mock-feat">
          <div className="mock-feat-icon" style={{ background: "rgba(99,102,241,0.08)", color: "var(--indigo)" }}>
            <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
          </div>
          <div>
            <div className="mock-feat-label">AI Chatbot</div>
            <div className="mock-feat-sub">24/7 replies</div>
          </div>
        </div>
        <div className="mock-feat">
          <div className="mock-feat-icon" style={{ background: "rgba(234,179,8,0.08)", color: "#eab308" }}>
            <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
          </div>
          <div>
            <div className="mock-feat-label">Live Analytics</div>
            <div className="mock-feat-sub">GA4 powered</div>
          </div>
        </div>
        <div className="mock-feat">
          <div className="mock-feat-icon" style={{ background: "rgba(37,211,102,0.08)", color: "#25d366" }}>
            <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div>
            <div className="mock-feat-label">WhatsApp</div>
            <div className="mock-feat-sub">One-tap contact</div>
          </div>
        </div>
        <div className="mock-feat">
          <div className="mock-feat-icon" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
            <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <div>
            <div className="mock-feat-label">SEO Ready</div>
            <div className="mock-feat-sub">Google visible</div>
          </div>
        </div>
        <div className="mock-feat" style={{ borderRight: "none" }}>
          <div className="mock-feat-icon" style={{ background: "rgba(168,85,247,0.08)", color: "#a855f7" }}>
            <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div>
            <div className="mock-feat-label">Maps Embed</div>
            <div className="mock-feat-sub">Find us easily</div>
          </div>
        </div>
      </div>
    </div>
  </div>
));
MockSiteContent.displayName = 'MockSiteContent';

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const isDark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);
  const mounted = useSyncExternalStore(
    subscribeToNothing,
    getMountedClientSnapshot,
    getMountedServerSnapshot,
  );

  // States for Laptop Hinge & Automated Demo Animation
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [demoTriggered, setDemoTriggered] = useState(false);
  const [urlText, setUrlText] = useState("");
  const [siteLoaded, setSiteLoaded] = useState(false);
  const [chatState, setChatState] = useState("hidden");
  const targetUrl = "webagen.dev";

  // State for Modals
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // State for Mobile Side Menu Drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // States for Custom AI Chatbot
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [aiMessages, setAiMessages] = useState<{ role: 'ai'|'user', text: string }[]>([
    { role: 'ai', text: "Hi! I'm the WebAgen AI assistant. I can help answer questions about our packages, timelines, or services. How can we help you scale today?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State for Full-Page Case Study View
  const [activeCaseStudy, setActiveCaseStudy] = useState<'eduvo' | 'flashcard' | 'godavari' | null>(null);

  const COMPARISON_ROWS = [
    {
      criteria: 'Delivery Speed',
      metricTag: '7 Days',
      traditional: '4 to 8 weeks of slow meetings and delays.',
      webagen: 'Live in 5–7 days with daily progress updates.'
    },
    {
      criteria: 'Clear Pricing',
      metricTag: 'No Surprises',
      traditional: 'Hidden charges for edits, plugins, and hosting.',
      webagen: 'Fixed packages. Pay 50% only after you approve.'
    },
    {
      criteria: 'Speed & Mobile Ready',
      metricTag: 'Fast Load',
      traditional: 'Heavy templates that load slowly on mobile.',
      webagen: 'Built with Next.js for instant loading on any phone.'
    },
    {
      criteria: '24/7 Lead Capture',
      metricTag: 'AI + WhatsApp',
      traditional: 'Basic contact forms that lose impatient visitors.',
      webagen: 'Built-in AI chatbot & WhatsApp replies while you sleep.'
    }
  ];

  const CASE_STUDIES = {
    eduvo: {
      id: 'eduvo' as const,
      tag: 'AI SaaS · Career & Coding Platform',
      accent: '#818CF8',
      accentBg: 'rgba(99,102,241,0.12)',
      title: 'Eduvo AI',
      liveUrl: 'https://eduvo-ai.vercel.app/',
      domainLabel: 'eduvo-ai.vercel.app',
      tagline: 'A free, Gemini-powered career guidance and skill-building platform aimed at helping students become genuinely job-ready through hands-on engineering and personalized AI tools.',
      problem: 'Graduates and aspiring developers often struggle with generic tutorials, unclear learning paths, and resumes that fail Applicant Tracking Systems (ATS)—leaving a huge gap between academic study and real-world software engineering jobs.',
      solution: 'We engineered a comprehensive Next.js and Gemini AI platform combining a live multi-file coding IDE (Eduvo Forge), personalized career roadmaps, and an ATS resume & interview analyzer (CV Matcher Pro) into one cohesive experience.',
      highlights: [
        'Eduvo Forge: Live multi-file coding environment (IDE) with real-world engineering tickets and AI-powered pull request grading',
        'AI Roadmaps: Custom, step-by-step learning paths tailored to your target job role, budget, and weekly schedule',
        'CV Matcher Pro: Analyzes resumes against specific job descriptions for ATS compatibility and delivers tailored interview prep',
        '100% free, fast, mobile-friendly Gemini AI architecture built to help students become job-ready'
      ]
    },
    flashcard: {
      id: 'flashcard' as const,
      tag: 'Micro-SaaS · Productivity',
      accent: '#EC4899',
      accentBg: 'rgba(236,72,153,0.12)',
      title: 'AI FlashCard Engine',
      liveUrl: 'https://flashcard-engine-ai.vercel.app/',
      domainLabel: 'flashcard-engine-ai.vercel.app',
      tagline: 'A simple, fast tool that turns any topic, pasted notes, or prompt into interactive study flashcards in one click.',
      problem: 'Creating good revision flashcards manually takes hours of copying, formatting, and rewriting—so most people give up before they even start revising.',
      solution: 'We designed a focused single-purpose AI utility: paste any text or enter a topic, and the engine automatically extracts key concepts into flip-ready flashcards for active recall.',
      highlights: [
        'Zero-friction interface — type a topic and get cards in under 5 seconds',
        'Interactive flip-card study mode designed for quick memory retention',
        'Instant AI card generation from raw notes or short prompts',
        'Lightweight, responsive design built for rapid mobile and desktop review'
      ]
    },
    godavari: {
      id: 'godavari' as const,
      tag: 'Client Rescue + Concept Redesign',
      accent: '#F59E0B',
      accentBg: 'rgba(245,158,11,0.12)',
      title: 'Godavari Delights',
      liveUrl: 'https://www.godavaridelights.in',
      domainLabel: 'www.godavaridelights.in',
      demoUrl: 'https://chic-cuchufli-25b94f.netlify.app',
      demoLabel: 'Preview Redesign Demo (WIP)',
      demoNote: 'Note: The redesigned storefront linked above is an early-stage demo prototype still in progress and not yet fully completed.',
      tagline: 'Rescued a live food & sweets storefront by fixing ~40 critical bugs, hardening admin security, and boosting speed—plus engineered an upcoming redesigned storefront demo.',
      problem: 'The existing live e-commerce site suffered from broken sign-up/Google login flows, product-cart count bugs, slow heavyweight caching, mobile grid issues, and exposed admin vulnerabilities.',
      solution: 'We audited and fixed the live production storefront end-to-end—resolving auth and cart errors, hardening admin credentials, optimizing load speed, configuring the AI chatbot—and built a modern replacement storefront prototype.',
      highlights: [
        'Fixed customer Sign Up, Google Authentication, and Product-Cart item count bugs',
        'Hardened admin panel security, rotated secrets, and enabled Admin image controls',
        'Reduced heavyweight caching and boosted initial load & mobile 2×2 product grid speed',
        'Built an upcoming redesigned storefront demo (work in progress) for future rollout'
      ]
    }
  };

  // Prevent background scrolling when a modal or mobile drawer is open AND disable custom cursor
  useEffect(() => {
    if (activeModal || isAiChatOpen || isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('modal-open');
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('modal-open');
    }
  }, [activeModal, isAiChatOpen, isMobileMenuOpen]);

  // Helper to navigate smoothly from mobile side menu
  const handleMobileNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (activeCaseStudy) {
      setActiveCaseStudy(null);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    }
  };

  // Ref for interactive spotlight on closing CTA monolith
  const ctaRef = useRef<HTMLElement>(null);
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!ctaRef.current) return;
    const rect = ctaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctaRef.current.style.setProperty("--cta-mouse-x", `${x}px`);
    ctaRef.current.style.setProperty("--cta-mouse-y", `${y}px`);
  };

  // Scroll to top cleanly when opening/closing full-page Case Study view
  useEffect(() => {
    if (activeCaseStudy) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeCaseStudy]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [aiMessages, isBotTyping, isAiChatOpen]);

  const formatAiMessage = (text: string) => {
    let formattedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: inherit;">$1</strong>');
    formattedText = formattedText.replace(/^\* (.*$)/gim, '• $1');
    formattedText = formattedText.replace(/\n/g, '<br/>');
    return { __html: formattedText };
  };

  const handleAiSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newUserMsg = { role: 'user' as const, text: chatInput };
    const newMessages = [...aiMessages, newUserMsg];
    
    setAiMessages(newMessages);
    setChatInput("");
    setIsBotTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      const data = await response.json();

      if (response.ok && data.reply) {
        setAiMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'ai', text: "I'm having a little trouble connecting to my brain right now. Please try reaching out via our Contact form or WhatsApp!" }]);
      }
    } catch {
      setAiMessages(prev => [...prev, { role: 'ai', text: "Network error detected. Please use the Contact Us button to reach our human team." }]);
    } finally {
      setIsBotTyping(false);
    }
  };

  // Sequence 1: Laptop opens -> wait for animation to complete -> Type URL
  useEffect(() => {
    let typeInterval: NodeJS.Timeout;
    let finishTimeout: NodeJS.Timeout;

    if (demoTriggered && !siteLoaded) {
      let i = 0;
      const typingStartTimeout = setTimeout(() => {
        typeInterval = setInterval(() => {
          setUrlText(targetUrl.substring(0, i + 1));
          i++;
          if (i >= targetUrl.length) {
            clearInterval(typeInterval);
            finishTimeout = setTimeout(() => setSiteLoaded(true), 400);
          }
        }, 70); 
      }, 1200);

      return () => {
        clearTimeout(typingStartTimeout);
        clearInterval(typeInterval);
        clearTimeout(finishTimeout);
      };
    }
  }, [demoTriggered, siteLoaded]);

  // Sequence 2: Website fades in -> trigger AI chat animation
  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    if (siteLoaded) {
      t1 = setTimeout(() => setChatState("typing"), 1200);
      t2 = setTimeout(() => setChatState("revealed"), 3200);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [siteLoaded]);

  useEffect(() => {
    const transitionTimeout = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions');
      document.body.classList.remove('no-transitions');
      document.documentElement.style.backgroundColor = '';
    }, 50);

    return () => clearTimeout(transitionTimeout);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    const docEl = document.documentElement;
    docEl.classList.add("no-transitions");
    docEl.setAttribute("data-theme", newTheme ? "dark" : "light");
    window.localStorage.setItem("theme", newTheme ? "dark" : "light");
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        docEl.classList.remove("no-transitions");
      });
    });
  };

  useEffect(() => {
    let ticking = false;
    const handleScrollProgress = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
          const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrolled = (winScroll / height) * 100;
          const progressBar = document.getElementById("scrollProgress");
          if (progressBar) progressBar.style.width = scrolled + "%";
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScrollProgress, { passive: true });

    // Highly optimized custom cursor utilizing direct CSS transforms without setTimeouts
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");

    const handleMouseMove = (e: MouseEvent) => {
      if (document.body.classList.contains('modal-open')) return;
      if (cursor && ring) {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    const interactiveEls = document.querySelectorAll(
      "a, button, .service-card, .faq-item, .p-card, .trust-card, .process-step, .port-card"
    );
    const handleMouseEnter = () => ring?.classList.add("expand");
    const handleMouseLeave = () => ring?.classList.remove("expand");

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-up").forEach((el) => observer.observe(el));

    const laptopObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLaptopOpen(true);
          setDemoTriggered(true);
          laptopObserver.unobserve(entries[0].target);
        }
      },
      { threshold: 0.3 } 
    );
    
    const laptopEl = document.getElementById("laptop-mockup");
    if (laptopEl) laptopObserver.observe(laptopEl);

    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const id = target.getAttribute("href")?.slice(1);
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((a) => {
      a.addEventListener("click", handleAnchorClick);
    });

    return () => {
      window.removeEventListener("scroll", handleScrollProgress);
      document.removeEventListener("mousemove", handleMouseMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      observer.disconnect();
      laptopObserver.disconnect();
      anchorLinks.forEach((a) => {
        a.removeEventListener("click", handleAnchorClick);
      });
    };
  }, [activeCaseStudy]);

  const customCSS = `
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
    :root{
      --indigo:#6366F1;
      --indigo-mid:#818CF8;
      --indigo-glow:rgba(99,102,241,0.12);
      --indigo-border:rgba(99,102,241,0.25);
      
      --bg:#FAFAFA;
      --bg-alt:#F4F4F0;
      --nav-bg:rgba(250,250,250,0.8);
      --text:#080808;
      --text-muted:#71717A;
      --text-light:#A1A1AA;
      --border:rgba(0,0,0,0.07);
      --card-bg:#FFFFFF;
      --card-highlight:#080808;
      --btn-bg:#080808;
      --btn-text:#FAFAFA;
      --shadow-glow:rgba(0,0,0,0.06);
      --card-shadow: 0 12px 32px rgba(0,0,0,0.06);
      
      --laptop-outer:#D1D1D6;
      --laptop-screen:#FFFFFF;
      --laptop-cam-bar:#E5E5EA;
      --laptop-base:linear-gradient(to bottom,#C8C8CE,#B0B0B8);
      --laptop-foot:#A8A8B0;
      --mock-hero:linear-gradient(135deg,#F8F8FF 0%,#FFFFFF 50%,#F0F0FF 100%);
      --mock-chat-bubble:#F4F4FF;
    }

    [data-theme="dark"]{
      --bg:#050505;
      --bg-alt:#0A0A0A;
      --nav-bg:rgba(5,5,5,0.8);
      --text:#FAFAFA;
      --text-muted:#A1A1AA;
      --text-light:#71717A;
      --border:rgba(255,255,255,0.08);
      --card-bg:#111111;
      --card-highlight:#1A1A1A;
      --btn-bg:#FAFAFA;
      --btn-text:#080808;
      --shadow-glow:rgba(255,255,255,0.05);
      --card-shadow: 0 12px 32px rgba(0,0,0,0.4);
      
      --laptop-outer:#1F1F22;
      --laptop-screen:#0A0A0A;
      --laptop-cam-bar:#18181B;
      --laptop-base:linear-gradient(to bottom,#27272A,#18181B);
      --laptop-foot:#3F3F46;
      --mock-hero:linear-gradient(135deg,#111111 0%,#080808 50%,#151515 100%);
      --mock-chat-bubble:#1F1F22;
    }

    .no-transitions * { transition: none !important; }

    /* CRITICAL MOBILE FIXES: Set strict max-width and hidden horizontal overflow on both HTML and Body to prevent zoom-out */
    html { scroll-behavior: smooth; background-color: var(--bg); max-width: 100vw; overflow-x: hidden; }
    body { font-family:'Inter',sans-serif; background:var(--bg); color:var(--text); overflow-x:hidden; cursor:none; max-width: 100vw; }
    main { background: var(--bg); }

    /* MODAL OPEN CURSOR FIX: Re-enable default cursor when a modal is open so users can interact with iframes */
    body.modal-open, body.modal-open * { cursor: auto !important; }
    body.modal-open .cursor, body.modal-open .cursor-ring { display: none !important; opacity: 0 !important; }

    .scroll-progress {
      position: fixed; top: 0; left: 0; height: 3px; background: var(--indigo);
      width: 0%; z-index: 9999; transition: width 0.1s ease-out; box-shadow: 0 0 10px var(--indigo);
    }

    /* Premium Icon Styles */
    .premium-icon {
      width: 1em;
      height: 1em;
      stroke-width: 2px;
      filter: drop-shadow(0 0 6px currentColor);
      transition: filter 0.3s ease, transform 0.3s ease;
    }
    .service-card:hover .premium-icon {
      transform: scale(1.1);
      filter: drop-shadow(0 0 12px currentColor);
    }

    /* Custom cursor */
    .cursor{position:fixed;width:10px;height:10px;background:var(--indigo);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s,background 0.2s;}
    .cursor-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(99,102,241,0.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all 0.12s ease;}
    .cursor-ring.expand{width:60px;height:60px;background:rgba(99,102,241,0.06);}

    /* NAV */
    nav{position:fixed;top:0;left:0;right:0;z-index:500;display:flex;align-items:center;justify-content:space-between;padding:0 52px;height:68px;background:var(--nav-bg);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border-bottom:1px solid var(--border);transition:background 0.3s, border-color 0.3s;}
    .nav-left{flex:1;display:flex;justify-content:flex-start;}
    .nav-center{display:flex;justify-content:center;}
    .nav-right{flex:1;display:flex;justify-content:flex-end;align-items:center;gap:24px;}
    .logo{font-family:'Inter',sans-serif;font-weight:800;font-size:22px;letter-spacing:-0.5px;color:var(--text);display:flex;align-items:center;gap:10px;text-decoration:none;transition:color 0.3s;}
    .nav-links{display:flex;gap:32px;list-style:none;align-items:center;}
    .nav-links a{font-size:14px;color:var(--text-muted);text-decoration:none;font-weight:500;letter-spacing:0.1px;transition:color 0.2s;}
    .nav-links a:hover{color:var(--text);}
    nav .nav-cta {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #1E1E24 0%, #080808 100%);
      color: #FAFAFA;
      padding: 10px 22px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 6px 20px -4px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.22);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease, border-color 0.3s ease;
      cursor: none;
    }
    [data-theme="dark"] nav .nav-cta {
      background: linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%);
      color: #080808;
      border: 1px solid #FFFFFF;
      box-shadow: 0 6px 20px -4px rgba(255, 255, 255, 0.2), inset 0 1px 1px #FFFFFF;
    }
    nav .nav-cta:hover,
    [data-theme="dark"] nav .nav-cta:hover {
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: #FFFFFF;
      border-color: rgba(165, 180, 252, 0.55);
      transform: translateY(-1px);
      box-shadow: 0 10px 26px -4px rgba(99, 102, 241, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.45);
    }
    
    .theme-toggle{background:transparent;border:none;color:var(--text-muted);cursor:none;display:flex;align-items:center;justify-content:center;transition:color 0.2s;}
    .theme-toggle:hover{color:var(--text);}

    /* MOBILE HAMBURGER & SLIDE-OUT SIDE MENU DRAWER */
    .mobile-menu-btn {
      display: none;
      width: 38px;
      height: 38px;
      border-radius: 12px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .mobile-menu-btn:active { transform: scale(0.94); }

    .mobile-drawer-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9500;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .mobile-drawer-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: min(320px, 84vw);
      background: var(--card-bg);
      border-left: 1px solid var(--border);
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.35);
      z-index: 9600;
      padding: 20px 24px 32px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transform: translateX(100%);
      transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .mobile-drawer.open {
      transform: translateX(0);
    }
    .mobile-drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--border);
    }
    .mobile-drawer-close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-alt);
      border: 1px solid var(--border);
      color: var(--text);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }
    .mobile-drawer-links {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 20px;
    }
    .mobile-drawer-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      text-align: left;
      padding: 14px 16px;
      border-radius: 14px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text);
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: -0.01em;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }
    .mobile-drawer-link:active, .mobile-drawer-link:hover {
      background: var(--indigo-glow);
      border-color: var(--indigo-border);
      color: var(--indigo);
    }
    .mobile-drawer-link span.idx {
      font-size: 11px;
      font-weight: 700;
      color: var(--indigo);
      font-family: monospace;
    }
    .mobile-drawer-footer {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    /* HERO */
    .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:160px 52px 120px;position:relative;overflow:hidden;background:var(--bg);transition:background 0.3s;}
    .hero-noise{position:absolute;inset:0;opacity:0.03;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");background-size:200px;pointer-events:none;}
    .hero-orb{position:absolute;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,var(--indigo-glow) 0%,transparent 65%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none;}
    .hero-orb-2{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%);top:20%;left:10%;pointer-events:none;animation:orbDrift 12s ease-in-out infinite alternate;}
    @keyframes orbDrift{from{transform:translate(0,0);}to{transform:translate(60px,40px);}}

    .badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(99, 102, 241, 0.04) 50%, rgba(168, 85, 247, 0.12) 100%);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(129, 140, 248, 0.35);
      border-radius: 100px;
      padding: 8px 20px;
      font-size: 11px;
      color: var(--indigo-mid);
      font-weight: 700;
      margin-bottom: 32px;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      box-shadow: 
        0 8px 28px -4px rgba(99, 102, 241, 0.25),
        inset 0 1px 1px rgba(255, 255, 255, 0.35),
        inset 0 -1px 2px rgba(99, 102, 241, 0.2);
      overflow: hidden;
      animation: riseIn 0.7s ease both;
      transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-theme="light"] .badge {
      color: #4F46E5;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(238, 242, 255, 0.92) 55%, rgba(243, 232, 255, 0.9) 100%);
      border: 1px solid rgba(99, 102, 241, 0.14);
      box-shadow: 
        0 10px 30px -6px rgba(99, 102, 241, 0.18),
        0 2px 6px -1px rgba(99, 102, 241, 0.08),
        0 0 0 1px rgba(255, 255, 255, 0.9) inset,
        0 -2px 6px rgba(99, 102, 241, 0.08) inset;
    }
    [data-theme="light"] .badge:hover {
      border-color: rgba(99, 102, 241, 0.28);
      box-shadow: 
        0 14px 36px -6px rgba(99, 102, 241, 0.26),
        0 4px 10px -2px rgba(99, 102, 241, 0.12),
        0 0 0 1.5px rgba(255, 255, 255, 1) inset,
        0 -2px 8px rgba(99, 102, 241, 0.12) inset;
    }
    [data-theme="light"] .badge::after {
      background: linear-gradient(
        90deg,
        transparent,
        rgba(99, 102, 241, 0.12),
        rgba(255, 255, 255, 0.9),
        transparent
      );
    }
    [data-theme="light"] .badge-live {
      background: #4F46E5;
      box-shadow: 0 0 10px rgba(79, 70, 229, 0.6), 0 0 0 2px rgba(79, 70, 229, 0.15);
    }
    [data-theme="light"] .badge-live::after {
      border-color: #4F46E5;
    }
    .badge:hover {
      transform: translateY(-2px) scale(1.02);
      border-color: rgba(129, 140, 248, 0.65);
      box-shadow: 
        0 12px 36px -4px rgba(99, 102, 241, 0.4),
        inset 0 1px 2px rgba(255, 255, 255, 0.5),
        inset 0 -1px 2px rgba(99, 102, 241, 0.3);
    }
    /* Glossy top-half reflection */
    .badge::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
      pointer-events: none;
    }
    /* Animated diagonal glossy sheen sweep */
    .badge::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -60%;
      width: 40%;
      height: 200%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.22),
        transparent
      );
      transform: rotate(25deg);
      animation: badgeGlossSweep 5.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
      pointer-events: none;
    }
    @keyframes badgeGlossSweep {
      0% { left: -60%; }
      30%, 100% { left: 140%; }
    }
    .badge-live {
      position: relative;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #818CF8;
      box-shadow: 0 0 10px #6366F1, 0 0 4px #FFFFFF;
      flex-shrink: 0;
    }
    .badge-live::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 1.5px solid #818CF8;
      opacity: 0;
      animation: badgePing 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }
    @keyframes badgePing {
      0% { transform: scale(0.6); opacity: 0.9; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .hero-title-group { display: flex; flex-direction: column; align-items: center; margin-bottom: 28px; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; }
    .hero-title-group:hover { transform: scale(1.02) translateY(-4px); }
    .hero-headline { font-family: 'Inter', sans-serif; font-size: clamp(42px, 6.5vw, 90px); font-weight: 600; line-height: 1.05; letter-spacing: -0.04em; text-align: center; max-width: 1000px; color: var(--text); transition: text-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s; }
    .hero-headline:nth-child(1) { animation: riseIn 0.8s 0.05s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .hero-headline:nth-child(2) { animation: riseIn 0.8s 0.10s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .hero-headline:nth-child(3) { animation: riseIn 0.8s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .hero-title-group:hover .hero-headline { text-shadow: 0 20px 40px var(--shadow-glow); }
    
    .indigo-text{color:var(--indigo);}
    .italic-text{ font-family:var(--font-instrument-serif),serif; font-style:italic; font-weight:400; letter-spacing:0; font-size:1.06em; transition: color 0.6s ease, text-shadow 0.6s ease; }
    .hero-title-group:hover .italic-text.indigo-text { color: var(--indigo-mid); text-shadow: 0 10px 40px rgba(99,102,241,0.4); }

    .hero-sub{ font-size: clamp(16px, 1.5vw, 19px); color: var(--text-muted); text-align: center; max-width: 640px; line-height: 1.6; font-weight: 400; margin-bottom: 48px; animation: riseIn 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; transition: color 0.3s; }
    .hero-ctas{display:flex;gap:14px;align-items:center;animation:riseIn 0.7s 0.28s ease both;margin-bottom:80px;}
    .btn-primary {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #1F1F26 0%, #080808 100%);
      color: #FAFAFA;
      padding: 15px 30px;
      border-radius: 100px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-family: 'Inter', sans-serif;
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow: 0 12px 30px -6px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.25);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
      cursor: none;
    }
    [data-theme="dark"] .btn-primary {
      background: linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%);
      color: #080808;
      border: 1px solid rgba(255, 255, 255, 0.85);
      box-shadow: 0 12px 30px -6px rgba(255, 255, 255, 0.16), inset 0 1px 1px #FFFFFF;
    }
    .btn-primary::after, .cta-btn-main::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -75%;
      width: 45%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
      transform: rotate(25deg);
      transition: left 0.65s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .btn-primary:hover::after, .cta-btn-main:hover::after {
      left: 135%;
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: #FFFFFF;
      border-color: rgba(165, 180, 252, 0.55);
      transform: translateY(-2px);
      box-shadow: 0 16px 38px -6px rgba(99, 102, 241, 0.5), inset 0 1px 1.5px rgba(255, 255, 255, 0.5);
    }
    .btn-secondary {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 244, 248, 0.85) 100%);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: var(--text);
      padding: 15px 28px;
      border-radius: 100px;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.95);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease;
      font-family: 'Inter', sans-serif;
      cursor: none;
    }
    [data-theme="dark"] .btn-secondary {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      color: var(--text-muted);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.16);
    }
    .btn-secondary:hover {
      color: var(--indigo);
      border-color: rgba(99, 102, 241, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px -6px rgba(99, 102, 241, 0.18), inset 0 1px 1px rgba(255, 255, 255, 1);
    }
    [data-theme="dark"] .btn-secondary:hover {
      color: #FFFFFF;
      border-color: rgba(129, 140, 248, 0.4);
      box-shadow: 0 12px 30px -6px rgba(99, 102, 241, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.28);
    }
    .btn-arrow{transition:transform 0.2s;}
    .btn-primary:hover .btn-arrow{transform:translateX(4px);}

    /* FIXED MASSIVE LAPTOP MOCKUP WITH HINGE ANIMATION */
    .laptop-wrapper{width:100%;max-width:1300px;position:relative;animation:riseIn 0.9s 0.36s ease both;}
    
    .laptop-screen-wrap {
      transform-origin: bottom center;
      transition: transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), filter 1.5s ease, opacity 1.5s ease;
      will-change: transform;
      position: relative;
      z-index: 2;
    }
    .laptop-screen-wrap.closed {
      transform: rotateX(-85deg) scale(0.95);
      filter: brightness(0.2);
      opacity: 0.5;
    }
    .laptop-screen-wrap.open {
      transform: rotateX(0deg) scale(1);
      filter: brightness(1);
      opacity: 1;
    }

    .laptop-outer {
      background: var(--laptop-outer);
      border-radius: 20px 20px 0 0;
      padding: 16px 16px 0;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.05), 0 40px 100px rgba(0,0,0,0.15);
      transition: background 0.3s;
    }
    .laptop-screen{background:var(--laptop-screen);border-radius:12px 12px 0 0;overflow:hidden;border:1px solid var(--border);transition:background 0.3s, border-color 0.3s;}
    .laptop-base{height:24px;background:var(--laptop-base);border-radius:0 0 6px 6px;box-shadow:0 6px 30px rgba(0,0,0,0.15); position: relative; z-index: 1;}
    .laptop-foot{height:8px;background:var(--laptop-foot);border-radius:0 0 10px 10px;margin:0 100px;transition:background 0.3s;}

    /* MOCKUP INNER SITE */
    .mock-site-bg{background:var(--bg);min-height:720px;display:flex;flex-direction:column;font-family:'Inter',sans-serif;transition:background 0.3s;}
    
    /* BROWSER BAR STYLES */
    .mock-browser-bar { height: 54px; background: var(--card-bg); border-bottom: 0.5px solid var(--border); display: flex; align-items: center; justify-content: center; position: relative; transition: background 0.3s, border-color 0.3s; }
    .mock-url-bar { background: var(--bg); border: 0.5px solid var(--border); border-radius: 8px; padding: 6px 20px; display: flex; align-items: center; justify-content: center; width: 40%; max-width: 340px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.02); transition: background 0.3s, border-color 0.3s; }
    
    .url-typing-text { color: var(--text) !important; transition: color 0.3s; }

    .loading-bar { position: absolute; bottom: -1px; left: 0; height: 2px; background: var(--indigo); width: 0%; transition: width 0.1s ease; opacity: 1; }
    .loading-bar.loading { width: 100%; transition: width 0.4s cubic-bezier(0.1, 0.8, 0.2, 1); }
    .loading-bar.done { opacity: 0; transition: opacity 0.3s ease 0.2s; }

    .mock-nav{height:48px;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:0.5px solid var(--border);transition: border-color 0.3s;}
    .mock-logo{font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:var(--text);letter-spacing:-0.3px;transition:color 0.3s; display:flex; align-items:center; gap:8px;}
    .mock-nav-links{display:flex;gap:20px;}
    .mock-nav-link{font-size:11px;color:var(--text-muted);font-weight:500;transition:color 0.3s;}
    .mock-book-btn{background:var(--indigo);color:#FAFAFA;padding:6px 14px;border-radius:100px;font-size:11px;font-weight:600;}

    .mock-hero{flex:1;background:var(--mock-hero);padding:44px 40px 36px;display:flex;align-items:center;justify-content:space-between;gap:32px;position:relative;overflow:hidden;transition:background 0.3s;}
    .mock-hero-left{flex:1.2;}
    .mock-badge-inner{display:inline-flex;align-items:center;gap:6px;background:var(--indigo-glow);border:0.5px solid var(--indigo-border);border-radius:100px;padding:4px 12px;font-size:10px;color:var(--indigo);font-weight:600;margin-bottom:12px;letter-spacing:0.3px;}
    .mock-dot-inner{width:5px;height:5px;border-radius:50%;background:var(--indigo);}
    .mock-h1{font-family:'Inter',sans-serif;font-size:26px;font-weight:800;color:var(--text);letter-spacing:-0.8px;line-height:1.1;margin-bottom:10px;transition:color 0.3s;}
    .mock-h1 span{color:var(--indigo);}
    .mock-p{font-size:11px;color:var(--text-muted);line-height:1.6;margin-bottom:18px;max-width:260px;transition:color 0.3s;}
    .mock-cta-row{display:flex;gap:8px;align-items:center;}
    .mock-btn-p{background:var(--btn-bg);color:var(--btn-text);padding:8px 18px;border-radius:100px;font-size:11px;font-weight:700;transition:all 0.3s;}
    .mock-btn-s{border:0.5px solid var(--border);color:var(--text-muted);padding:8px 16px;border-radius:100px;font-size:11px;font-weight:500;transition:all 0.3s;}

    /* CENTRAL CODE BLOCK */
    .mock-hero-center{flex:1.5; display:flex; justify-content:center; align-items:center; z-index: 10; perspective: 1000px;}
    .mock-code-wrapper { position: relative; width: 100%; max-width: 320px; }
    .mock-code-glow {
      position: absolute; inset: -20px;
      background: radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%);
      z-index: -1; filter: blur(20px);
    }
    .mock-code-block {
      background: #0d0d0d; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
      transform: rotateY(-10deg) rotateX(5deg);
      animation: floatCode 6s ease-in-out infinite;
    }
    @keyframes floatCode {
      0%, 100% { transform: rotateY(-10deg) rotateX(5deg) translateY(0); }
      50% { transform: rotateY(-10deg) rotateX(5deg) translateY(-10px); }
    }
    .mock-code-header {
      background: #1a1a1a; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 10px 14px;
      border-radius: 12px 12px 0 0; display: flex; align-items: center; gap: 6px;
    }
    .mock-code-header .code-title { margin-left: 8px; font-size: 11px; font-family: monospace; color: #888; }
    .mock-code-body {
      padding: 16px 20px; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 11.5px; line-height: 1.6; color: #abb2bf; text-align: left; overflow-x: hidden;
    }

    .mock-hero-right{flex:0 0 200px;display:flex;flex-direction:column;gap:8px;}
    .mock-stat-card{background:var(--card-bg);border-radius:10px;border:0.5px solid var(--border);padding:12px 14px;box-shadow:0 2px 12px rgba(0,0,0,0.05);transition:all 0.3s;}
    .mock-stat-label{font-size:9px;color:var(--text-light);font-weight:500;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;transition:color 0.3s;}
    .mock-stat-value{font-family:'Inter',sans-serif;font-size:20px;font-weight:800;color:var(--text);letter-spacing:-0.5px;transition:color 0.3s;}
    .mock-stat-change{font-size:9px;color:#22C55E;font-weight:600;margin-top:2px;}

    /* LIVE CHAT BUBBLE ANIMATION */
    .mock-chat{position:absolute;bottom:16px;right:40px;background:var(--card-bg);border-radius:12px;border:0.5px solid var(--border);padding:10px 14px;box-shadow:0 10px 30px rgba(0,0,0,0.12);min-width:180px;transition:all 0.5s cubic-bezier(0.16, 1, 0.3, 1);z-index:20;}
    .mock-chat.hidden { opacity: 0; transform: translateY(20px) scale(0.95); pointer-events: none; }
    .mock-chat-header{display:flex;align-items:center;gap:6px;margin-bottom:8px;}
    .mock-chat-avatar{width:22px;height:22px;border-radius:50%;background:var(--indigo);display:flex;align-items:center;justify-content:center;font-size:10px;color:white;font-weight:700;}
    .mock-chat-name{font-size:10px;font-weight:700;color:var(--text);transition:color 0.3s;}
    .mock-chat-status{font-size:9px;color:#22C55E;font-weight:500;}
    .mock-chat-msg{font-size:10px;color:var(--text-muted);line-height:1.5;transition:color 0.3s;}
    .mock-chat-bubble{background:var(--mock-chat-bubble);border-radius:0 8px 8px 8px;padding:6px 10px;font-size:10px;color:var(--text);margin-top:6px;max-width:160px;transition:all 0.3s; min-height: 26px;}
    
    .typing-dots { display: flex; gap: 4px; padding: 4px 2px; align-items: center; justify-content: center; height: 100%;}
    .typing-dot { width: 4px; height: 4px; background: var(--text-light); border-radius: 50%; animation: typeBounce 1.4s infinite ease-in-out both; }
    .typing-dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes typeBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

    .mock-features-bar{display:flex;gap:0;border-top:0.5px solid var(--border);transition:border-color 0.3s;}
    .mock-feat{flex:1;padding:16px 20px;border-right:0.5px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--card-bg);transition:all 0.3s;}
    .mock-feat:last-child{border-right:none;}
    .mock-feat-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
    .mock-feat-label{font-size:11px;font-weight:700;color:var(--text);letter-spacing:-0.2px;transition:color 0.3s;}
    .mock-feat-sub{font-size:10px;color:var(--text-muted);margin-top:1px;transition:color 0.3s;}

    /* SERVICES & GENERAL SECTION HEADERS */
    .services{padding:110px 52px;background:var(--bg);transition:background 0.3s;}
    .section-header-split { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 64px; gap: 32px; flex-wrap: wrap; max-width: 1160px; margin-left: auto; margin-right: auto;}
    .sh-left { flex: 1; min-width: 320px; }
    .sh-right { flex: 0 1 440px; margin-bottom: 8px; }
    .sec-eyebrow{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:var(--indigo);font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:10px;}
    .sec-eyebrow::after{content:'';flex:1;height:0.5px;background:var(--indigo-border);max-width:60px;}
    .sec-title{font-family:'Inter',sans-serif;font-size:clamp(36px,4vw,54px);font-weight:800;letter-spacing:-0.03em;line-height:1.05;color:var(--text);transition:color 0.3s;}
    .section-header-split .sec-title { margin-bottom: 0; max-width: none; }
    .sec-sub{font-size:16px;color:var(--text-muted);line-height:1.7;transition:color 0.3s;}
    .section-header-split .sec-sub { margin-bottom: 0; max-width: none; }

    .services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px; max-width: 1160px; margin: 0 auto;}
    .service-card{border:0.5px solid var(--border);border-radius:20px;padding:36px 32px;background:var(--card-bg);transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);position:relative;overflow:hidden;box-shadow: 0 12px 32px var(--card-shadow);}
    .service-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,var(--indigo-glow) 0%,transparent 60%);opacity:0;transition:opacity 0.3s;}
    .service-card:hover{border-color:var(--indigo-border);transform:translateY(-8px);box-shadow:0 24px 64px rgba(99,102,241,0.12);}
    .service-card:hover::before{opacity:1;}
    .service-card.highlight{background:var(--card-highlight);border-color:var(--border);}
    .service-card.highlight .service-title{color:#FAFAFA;}
    .service-card.highlight .service-desc{color:rgba(255,255,255,0.6);}
    .service-card.highlight .service-tag{background:rgba(99,102,241,0.25);color:var(--indigo-mid);}
    [data-theme="light"] .service-card.highlight { box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
    [data-theme="light"] .service-card.highlight:hover { box-shadow: 0 24px 64px rgba(0,0,0,0.3), 0 0 40px rgba(99,102,241,0.15); }
    .s-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:24px;background:var(--indigo-glow);color:var(--indigo);}
    .service-card.highlight .s-icon {background: rgba(255,255,255,0.05); color: var(--indigo-mid);}
    .service-tag{display:inline-block;background:var(--indigo-glow);color:var(--indigo);font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:4px 12px;border-radius:100px;margin-bottom:14px;}
    .service-title{font-family:'Inter',sans-serif;font-size:22px;font-weight:800;letter-spacing:-0.02em;margin-bottom:12px;color:var(--text);transition:color 0.3s;}
    .service-desc{font-size:14px;color:var(--text-muted);line-height:1.75;transition:color 0.3s;}
    .service-list{list-style:none;margin-top:18px;display:flex;flex-direction:column;gap:8px;}
    .service-list li{font-size:13px;color:var(--text-muted);display:flex;align-items:center;gap:8px;transition:color 0.3s;}
    .service-card.highlight .service-list li{color:rgba(255,255,255,0.5);}
    .s-check{width:18px;height:18px;border-radius:50%;background:var(--indigo-glow);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:9px;color:var(--indigo);font-weight:800;}
    .service-card.highlight .s-check{background:rgba(99,102,241,0.3);color:var(--indigo-mid);}

    /* PORTFOLIO */
    .portfolio { padding: 110px 52px; background: var(--bg-alt); transition: background 0.3s; }
    .portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1160px; margin: 0 auto; }
    .port-card { 
      background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; 
      overflow: hidden; text-decoration: none; color: inherit; display: flex; flex-direction: column;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 12px 32px var(--card-shadow);
    }
    .port-card:hover { transform: translateY(-8px); box-shadow: 0 24px 64px rgba(99,102,241,0.12); border-color: var(--indigo-border); }
    [data-theme="dark"] .port-card:hover { box-shadow: 0 24px 64px rgba(99,102,241,0.15); }
    
    .port-visual { height: 220px; background: var(--bg-alt); display: flex; flex-direction: column; border-bottom: 1px solid var(--border); transition: border-color 0.3s; position: relative; text-decoration: none; }
    .mock-browser-bar.mini { height: 32px; background: var(--card-bg); padding: 0 12px; justify-content: center; position: relative; border-bottom: 1px solid var(--border); transition: background 0.3s, border-color 0.3s; display: flex; align-items: center; z-index: 10; }
    .mock-url-bar.mini { font-size: 9px; padding: 2px 10px; width: 64%; background: var(--bg); color: var(--text-light); border-radius: 4px; display: flex; align-items: center; justify-content: center; gap: 4px; transition: background 0.3s, color 0.3s; }
    .port-card:hover .mock-url-bar.mini { color: var(--text); }
    .port-visual-body { flex: 1; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    
    .port-visual-grid { position: absolute; inset: 0; background-image: radial-gradient(var(--border) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.5; z-index: 0; }
    .port-icon-wrap { width: 72px; height: 72px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05); z-index: 2; transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
    .port-card:hover .port-icon-wrap { transform: scale(1.1) translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1); }
    .port-glow { position: absolute; width: 150px; height: 150px; border-radius: 50%; filter: blur(40px); z-index: 1; opacity: 0.6; transition: opacity 0.5s ease, transform 0.5s ease; }
    .port-card:hover .port-glow { opacity: 0.9; transform: scale(1.1); }

    .port-content { padding: 28px 24px 24px; flex: 1; display: flex; flex-direction: column; }
    .port-title { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 10px; color: var(--text); transition: color 0.3s; }
    .port-desc { font-size: 14px; color: var(--text-muted); line-height: 1.6; transition: color 0.3s; flex: 1; }

    /* Uniform Button Alignment Across All Portfolio Cards */
    .port-actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-top: auto;
      padding-top: 22px;
      border-top: 1px solid var(--border);
    }
    .port-links-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
    }
    .port-case-btn {
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: 11px 18px;
      border-radius: 100px;
      font-size: 13px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: #FFFFFF;
      border: 1px solid rgba(165, 180, 252, 0.45);
      box-shadow: 0 8px 22px -4px rgba(99, 102, 241, 0.4), inset 0 1px 1.5px rgba(255, 255, 255, 0.45);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: none;
    }
    .port-case-btn::after, .port-visit-link::after {
      content: '';
      position: absolute;
      top: -50%;
      left: -75%;
      width: 45%;
      height: 200%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.28), transparent);
      transform: rotate(25deg);
      transition: left 0.65s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }
    .port-case-btn:hover::after, .port-visit-link:hover::after {
      left: 135%;
    }
    .port-case-btn:hover {
      background: linear-gradient(135deg, #A5B4FC 0%, #6366F1 100%);
      color: #FFFFFF;
      border-color: rgba(199, 210, 254, 0.7);
      transform: translateY(-2px);
      box-shadow: 0 12px 30px -4px rgba(99, 102, 241, 0.55), inset 0 1px 1.5px rgba(255, 255, 255, 0.65);
    }
    .port-visit-link {
      position: relative;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      flex: 1;
      padding: 10px 14px;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      border: 1px solid rgba(0, 0, 0, 0.06);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(244, 244, 248, 0.85) 100%);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.95);
      white-space: nowrap;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-theme="dark"] .port-visit-link {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      color: var(--text-muted);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.16);
    }
    .port-visit-link:hover {
      color: var(--indigo);
      border-color: rgba(99, 102, 241, 0.25);
      transform: translateY(-2px);
      box-shadow: 0 10px 24px -4px rgba(99, 102, 241, 0.18), inset 0 1px 1px rgba(255, 255, 255, 1);
    }
    [data-theme="dark"] .port-visit-link:hover {
      color: #FFFFFF;
      border-color: rgba(129, 140, 248, 0.4);
      box-shadow: 0 10px 24px -4px rgba(99, 102, 241, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.28);
    }

    /* FULL-PAGE CASE STUDY VIEW */
    .case-page {
      min-height: 100vh;
      padding: 124px 52px 100px;
      background: var(--bg);
      color: var(--text);
    }
    .case-page-inner {
      max-width: 920px;
      margin: 0 auto;
    }
    .case-back-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      border-radius: 100px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      color: var(--text);
      font-size: 13.5px;
      font-weight: 600;
      margin-bottom: 36px;
      transition: all 0.25s ease;
      box-shadow: 0 4px 16px var(--card-shadow);
      cursor: none;
    }
    .case-back-btn:hover {
      border-color: var(--indigo-border);
      color: var(--indigo);
      transform: translateX(-3px);
    }
    .case-hero-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 28px;
      padding: 48px;
      box-shadow: 0 20px 60px var(--card-shadow);
      margin-bottom: 28px;
    }
    .case-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 28px;
    }
    .case-block {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 24px;
      padding: 36px;
      box-shadow: 0 12px 32px var(--card-shadow);
    }
    .case-block h3 {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      color: var(--text);
    }
    .case-block p {
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.75;
    }
    .case-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-top: 16px;
    }
    .case-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 15px;
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 768px) {
      .case-page { padding: 96px 20px 80px; }
      .case-hero-card { padding: 28px 24px; }
      .case-grid-2 { grid-template-columns: 1fr; }
      .case-block { padding: 26px 22px; }
    }

    /* PREMIUM PROCESS TIMELINE */
    .process{padding:110px 52px;background:var(--bg);transition:background 0.3s;}
    .process-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:64px;align-items:start;margin-top:64px; max-width: 1160px; margin-left: auto; margin-right: auto;}
    .process .sec-eyebrow, .process .sec-title, .process .sec-sub { max-width: 1160px; margin-left: auto; margin-right: auto; }
    
    /* Left Side Interactive Steps */
    .process-steps { position: relative; display: flex; flex-direction: column; gap: 0; padding-left: 10px;}
    .process-steps::before {
      content: ''; position: absolute; top: 40px; bottom: 40px; left: 34px; width: 2px;
      background: var(--border); z-index: 0; transition: background 0.3s;
    }
    .process-step { 
      position: relative; z-index: 1; display: flex; gap: 24px; padding: 28px 24px; 
      border-radius: 20px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
      border: 1px solid transparent; background: transparent; cursor: default; margin-left: -16px;
    }
    .process-step:hover { background: var(--card-bg); border-color: var(--border); box-shadow: 0 12px 40px var(--card-shadow); transform: translateX(8px); }
    .step-num { 
      font-family:'Inter',sans-serif; font-size:13px; font-weight:800; color:var(--indigo); 
      width:36px; height:36px; border-radius:50%; border:1px solid var(--indigo-border); 
      display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; 
      background:var(--bg-alt); transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .process-step:hover .step-num { background: var(--indigo); color: #FAFAFA; border-color: var(--indigo); box-shadow: 0 0 20px rgba(99,102,241,0.4); transform: scale(1.15); }
    .step-title { font-family:'Inter',sans-serif; font-size:18px; font-weight:800; letter-spacing:-0.02em; margin-bottom:6px; color:var(--text); transition:color 0.3s; }
    .step-desc { font-size:14px; color:var(--text-muted); line-height:1.7; transition:color 0.3s; }
    .step-duration { display:inline-block; margin-top:10px; font-size:11px; font-weight:700; color:var(--indigo); background:var(--indigo-glow); padding:4px 12px; border-radius:100px; letter-spacing:0.3px; }

    /* Right Side: The Premium Live Client Portal Dashboard */
    .process-visual { 
      background: var(--card-highlight); border: 1px solid var(--border); border-radius: 24px; 
      padding: 0; display: flex; flex-direction: column; overflow: hidden; 
      box-shadow: 0 30px 60px var(--card-shadow); position: sticky; top: 120px; transition: all 0.3s;
    }
    .cp-header { background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    .cp-dot { width: 8px; height: 8px; background: #22C55E; border-radius: 50%; box-shadow: 0 0 12px #22C55E; animation: pulseDot 2s infinite; }
    @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
    .cp-body { padding: 32px 24px; display: flex; flex-direction: column; gap: 24px; }
    
    .cp-progress-container { width: 100%; height: 6px; background: rgba(255,255,255,0.08); border-radius: 10px; overflow: hidden; position: relative; }
    .cp-progress-bar { height: 100%; background: var(--indigo); width: 0%; border-radius: 10px; animation: loadBar 8s infinite ease-in-out; position: relative; }
    .cp-progress-bar::after { content:''; position:absolute; top:0; right:0; bottom:0; left:0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: shimmer 2s infinite; }
    @keyframes loadBar { 0% { width: 0%; } 20% { width: 45%; } 50% { width: 78%; } 80% { width: 100%; } 100% { width: 100%; } }
    @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
    
    .cp-terminal { background: #050505; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 12px; display: flex; flex-direction: column; gap: 10px; position: relative; height: 170px; overflow-x: hidden; }
    .cp-terminal::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 40px; background: linear-gradient(to top, #050505, transparent); pointer-events: none; }
    
    .log-line { display: flex; gap: 12px; opacity: 0; animation: fadeLog 10s infinite; }
    .log-line span:first-child { color: var(--text-muted); font-weight: bold;}
    .log-line span:last-child { color: #A1A1AA; }
    
    .log-line:nth-child(1) { animation-delay: 0s; }
    .log-line:nth-child(2) { animation-delay: 1.5s; }
    .log-line:nth-child(3) { animation-delay: 3s; }
    .log-line:nth-child(4) { animation-delay: 4.5s; }
    .log-line:nth-child(4) span:last-child { color: var(--indigo-mid); font-weight: bold; }
    .log-line:nth-child(5) { animation-delay: 6s; }
    .log-line:nth-child(5) span:last-child { color: #22C55E; font-weight: bold; }
    
    @keyframes fadeLog {
      0% { opacity: 0; transform: translateY(10px); }
      5%, 90% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }

    /* PRICING */
    .pricing{padding:110px 52px;background:var(--bg-alt);transition:background 0.3s;}
    
    .pricing-header-wrap { 
      max-width: 1160px; 
      margin: 0 auto 54px; 
      text-align: left; 
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    
    .pricing-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;max-width:1160px;margin:0 auto;}
    .p-card{
      border:0.5px solid var(--border);
      border-radius:22px;
      padding:38px 24px;
      background:var(--card-bg);
      position:relative;
      transition:transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s;
      box-shadow: 0 12px 32px var(--card-shadow);
    }
    .p-card:hover{
      transform:translateY(-8px);
      box-shadow: 0 24px 64px rgba(0,0,0,0.08);
    }
    [data-theme="dark"] .p-card:hover {
      box-shadow: 0 24px 64px rgba(0,0,0,0.4);
    }
    
    .p-card.pop{background:var(--card-highlight);border-color:var(--indigo-border);box-shadow:0 20px 60px rgba(0,0,0,0.15);}
    .p-card.pop:hover{box-shadow:0 30px 80px rgba(99,102,241,0.2);}
    
    .p-card.enterprise { border-color: rgba(168,85,247,0.2); }
    .p-card.enterprise:hover { border-color: rgba(168,85,247,0.5); box-shadow: 0 24px 64px rgba(168,85,247,0.15); }

    .pop-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:var(--indigo);color:white;font-size:11px;font-weight:700;padding:5px 18px;border-radius:100px;letter-spacing:0.5px;white-space:nowrap;font-family:'Inter',sans-serif;}
    .p-plan{font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--indigo);margin-bottom:6px;}
    .p-price{font-family:'Inter',sans-serif;font-size:42px;font-weight:800;letter-spacing:-0.04em;color:var(--text);line-height:1;transition:color 0.3s;}
    .rescue-price{font-size:clamp(20px,2.3vw,24px);white-space:nowrap;}
    .p-card.pop .p-price{color:#FAFAFA;}
    .p-period{font-size:12px;color:var(--text-light);margin-top:4px;margin-bottom:6px;transition:color 0.3s;}
    .p-tagline{font-size:13px;color:var(--text-muted);margin-bottom:24px;padding-bottom:24px;border-bottom:0.5px solid var(--border);font-style:italic;transition:all 0.3s;}
    .p-card.pop .p-tagline{color:rgba(255,255,255,0.4);border-color:rgba(255,255,255,0.1);}
    .p-features{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:28px;}
    .p-features li{font-size:13px;color:var(--text-muted);display:flex;align-items:center;gap:9px;transition:color 0.3s;}
    .p-card.pop .p-features li{color:rgba(255,255,255,0.6);}
    .p-check{width:18px;height:18px;border-radius:50%;background:rgba(99,102,241,0.1);display:flex;align-items:center;justify-content:center;font-size:9px;color:var(--indigo);font-weight:900;flex-shrink:0;}
    .p-card.pop .p-check{background:rgba(99,102,241,0.3);color:var(--indigo-mid);}
    .p-btn {
      position: relative;
      overflow: hidden;
      width: 100%;
      padding: 14px;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      cursor: none;
      border: 1px solid rgba(0, 0, 0, 0.06);
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(244, 244, 248, 0.88) 100%);
      color: var(--text);
      box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.07), inset 0 1px 1px rgba(255, 255, 255, 0.95);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-theme="dark"] .p-btn {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      box-shadow: 0 6px 18px -4px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.14);
    }
    .p-btn:hover {
      background: linear-gradient(135deg, #1F1F26 0%, #080808 100%);
      color: #FAFAFA;
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-2px);
      box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.25);
    }
    [data-theme="dark"] .p-btn:hover {
      background: linear-gradient(135deg, #FFFFFF 0%, #E4E4E7 100%);
      color: #080808;
      border-color: #FFFFFF;
      box-shadow: 0 12px 28px -4px rgba(255, 255, 255, 0.18), inset 0 1px 1px #FFFFFF;
    }
    .p-card.pop .p-btn {
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: #FFFFFF;
      border: 1px solid rgba(165, 180, 252, 0.45);
      box-shadow: 0 10px 28px -4px rgba(99, 102, 241, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.45);
    }
    .p-card.pop .p-btn:hover {
      background: linear-gradient(135deg, #A5B4FC 0%, #6366F1 100%);
      transform: translateY(-2px);
      box-shadow: 0 14px 36px -4px rgba(99, 102, 241, 0.65), inset 0 1px 1.5px rgba(255, 255, 255, 0.6);
    }
    
    .p-btn.enterprise-btn {
      border-color: rgba(168, 85, 247, 0.22);
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(99, 102, 241, 0.04) 100%);
      color: var(--text);
    }
    .p-btn.enterprise-btn:hover {
      background: linear-gradient(135deg, #C084FC 0%, #9333EA 100%);
      color: #FFF !important;
      border-color: rgba(216, 180, 254, 0.5);
      box-shadow: 0 12px 30px -4px rgba(168, 85, 247, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.5);
    }

    /* WIDE HORIZONTAL SITE RESCUE CARD (OPTION A) */
    .rescue-card {
      max-width: 1160px;
      margin: 24px auto 0;
      border: 1px solid rgba(245, 158, 11, 0.28);
      border-radius: 22px;
      padding: 36px 40px;
      background: var(--card-bg);
      box-shadow: 0 14px 40px var(--card-shadow);
      display: grid;
      grid-template-columns: 1.15fr 1.35fr 0.85fr;
      gap: 32px;
      align-items: center;
    }
    .rescue-features {
      list-style: none;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px 16px;
    }
    .rescue-features li {
      font-size: 13px;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .rescue-check {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: rgba(245, 158, 11, 0.14);
      color: #F59E0B;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .rescue-cta-col {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      text-align: right;
      gap: 8px;
      border-left: 1px solid var(--border);
      padding-left: 28px;
    }
    .p-btn.rescue-btn {
      border-color: rgba(245, 158, 11, 0.35);
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 100%);
      color: var(--text);
    }
    .p-btn.rescue-btn:hover {
      background: linear-gradient(135deg, #FBBF24 0%, #D97706 100%);
      color: #080808 !important;
      border-color: rgba(253, 230, 138, 0.6);
      box-shadow: 0 12px 30px -4px rgba(245, 158, 11, 0.4);
    }
    .pricing-note {
      max-width: 1160px;
      margin: 28px auto 0;
      text-align: center;
      font-size: 13.5px;
      color: var(--text-muted);
    }
    @media (max-width: 960px) {
      .rescue-card {
        grid-template-columns: 1fr;
        padding: 32px 24px;
        gap: 24px;
      }
      .rescue-features {
        grid-template-columns: 1fr;
      }
      .rescue-cta-col {
        align-items: flex-start;
        text-align: left;
        border-left: none;
        border-top: 1px solid var(--border);
        padding-left: 0;
        padding-top: 20px;
      }
    }

    /* TRUST (INTERACTIVE HEAD-TO-HEAD SPEC MATRIX) */
    .trust {
      padding: 120px 52px;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }
    .trust-inner {
      max-width: 1120px;
      margin: 0 auto;
    }
    .trust-metrics-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 40px;
    }
    /* TRUST (COMPACT BENTO VERSUS CARDS) */
    .trust {
      padding: 110px 52px;
      background: var(--bg);
      position: relative;
      overflow: hidden;
    }
    .trust-inner {
      max-width: 1160px;
      margin: 0 auto;
    }
    .trust-metrics-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 36px;
    }
    .trust-metric-pill {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      box-shadow: 0 8px 24px var(--card-shadow);
      transition: transform 0.3s ease, border-color 0.3s ease;
    }
    .trust-metric-pill:hover {
      transform: translateY(-3px);
      border-color: var(--indigo-border);
    }
    .trust-metric-val {
      font-family: 'Inter', sans-serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--text);
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .trust-metric-val span.accent {
      color: var(--indigo);
    }
    .trust-metric-lbl {
      font-size: 12px;
      color: var(--text-muted);
      font-weight: 500;
      line-height: 1.4;
    }

    /* Clean Single-Line Scrollable Filter Pills */
    .matrix-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .matrix-filters {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-alt);
      padding: 5px;
      border-radius: 100px;
      border: 1px solid var(--border);
      max-width: 100%;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .matrix-filters::-webkit-scrollbar {
      display: none;
    }
    .matrix-filter-btn {
      padding: 8px 16px;
      border-radius: 100px;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--text-muted);
      background: transparent;
      border: 1px solid transparent;
      white-space: nowrap;
      flex-shrink: 0;
      transition: all 0.25s ease;
      cursor: none;
    }
    .matrix-filter-btn:hover {
      color: var(--text);
    }
    .matrix-filter-btn.active {
      background: var(--card-bg);
      color: var(--text);
      border-color: var(--border);
      box-shadow: 0 4px 12px var(--card-shadow);
    }

    /* Compact Bento Versus Cards Grid */
    .versus-bento-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }
    .versus-card {
      position: relative;
      border-radius: 22px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 22px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 12px 32px var(--card-shadow);
      overflow: hidden;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
    }
    .versus-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 20px;
      right: 20px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(129, 140, 248, 0.45), transparent);
      opacity: 0.7;
    }
    .versus-card:hover {
      transform: translateY(-4px);
      border-color: var(--indigo-border);
      box-shadow: 0 20px 48px rgba(99, 102, 241, 0.12);
    }
    .versus-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .versus-card-title {
      font-family: 'Inter', sans-serif;
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.02em;
    }
    .versus-metric-badge {
      font-size: 11px;
      font-weight: 700;
      color: var(--indigo);
      background: var(--indigo-glow);
      border: 1px solid var(--indigo-border);
      padding: 4px 11px;
      border-radius: 100px;
      white-space: nowrap;
      flex-shrink: 0;
    }

    /* Split Comparison Inside Each Compact Card */
    .versus-split {
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
    }
    .versus-side {
      border-radius: 14px;
      padding: 13px 15px;
      display: flex;
      align-items: flex-start;
      gap: 11px;
    }
    .versus-side.old {
      background: var(--bg-alt);
      border: 1px solid var(--border);
    }
    .versus-side.new {
      background: linear-gradient(135deg, #161622 0%, #0B0B10 100%);
      border: 1px solid rgba(129, 140, 248, 0.32);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }
    .versus-side-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.9px;
      margin-bottom: 2px;
      display: block;
    }
    .versus-side.old .versus-side-label {
      color: var(--text-light);
    }
    .versus-side.new .versus-side-label {
      color: #A5B4FC;
    }
    .versus-side-head {
      font-size: 13.5px;
      font-weight: 700;
      line-height: 1.35;
      margin-bottom: 3px;
    }
    .versus-side.old .versus-side-head {
      color: var(--text);
      opacity: 0.78;
    }
    .versus-side.new .versus-side-head {
      color: #FAFAFA;
    }
    .versus-side-desc {
      font-size: 12px;
      line-height: 1.45;
    }
    .versus-side.old .versus-side-desc {
      color: var(--text-muted);
    }
    .versus-side.new .versus-side-desc {
      color: rgba(255, 255, 255, 0.65);
    }

    .compare-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 800;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .x-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #EF4444;
      border: 1px solid rgba(239, 68, 68, 0.22);
    }
    .check-icon {
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: #FAFAFA;
      box-shadow: 0 0 14px rgba(99, 102, 241, 0.5);
    }

    .trust-cta-bar {
      margin-top: 22px;
      border-radius: 20px;
      padding: 20px 26px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
      box-shadow: 0 10px 30px var(--card-shadow);
    }
    .udyam-proof-card {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-top: 22px;
      padding: 20px 24px;
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--card-bg);
      box-shadow: 0 10px 30px var(--card-shadow);
    }
    .udyam-proof-icon {
      width: 42px;
      height: 42px;
      flex: 0 0 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      background: var(--indigo-glow);
      color: var(--indigo);
      font-size: 20px;
      font-weight: 800;
    }
    .udyam-proof-copy {
      flex: 1 1 260px;
    }
    .udyam-proof-title {
      margin: 0 0 4px;
      color: var(--text);
      font-size: 15px;
      font-weight: 800;
    }
    .udyam-proof-description {
      margin: 0;
      color: var(--text-muted);
      font-size: 13px;
      line-height: 1.5;
    }
    .udyam-proof-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--indigo);
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
    }
    .udyam-proof-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 900px) {
      .trust-metrics-strip {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .versus-bento-grid {
        grid-template-columns: 1fr;
        gap: 14px;
      }
    }
    @media (max-width: 600px) {
      .trust-metric-pill {
        padding: 14px 16px;
      }
      .trust-metric-val {
        font-size: 20px;
      }
      .versus-card {
        padding: 18px 16px;
        gap: 12px;
      }
      .versus-side {
        padding: 11px 12px;
      }
      .trust-cta-bar {
        padding: 18px 18px;
      }
      .trust-cta-bar .btn-primary {
        width: 100%;
        justify-content: center;
      }
      .udyam-proof-card {
        padding: 18px;
      }
      .udyam-proof-link {
        margin-left: 58px;
      }
    }

    /* FOUNDER SECTION */
    .founder { padding: 110px 52px; background: var(--bg); transition: background 0.3s; }
    .founder-container { max-width: 1160px; margin: 0 auto; display: grid; grid-template-columns: 0.8fr 1.2fr; gap: 64px; align-items: center; background: var(--card-bg); border: 0.5px solid var(--border); border-radius: 32px; padding: 64px; box-shadow: 0 24px 80px var(--card-shadow); transition: background 0.3s, border-color 0.3s; }
    .founder-image-col { position: relative; }
    .founder-image-wrap { position: relative; border-radius: 24px; overflow: hidden; aspect-ratio: 4/5; z-index: 2; border: 1px solid var(--border); background: var(--bg-alt); }
    .founder-image-wrap img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%) contrast(110%); transition: filter 0.4s; }
    .founder-image-wrap:hover img { filter: grayscale(0%) contrast(100%); }
    .founder-glow { position: absolute; inset: -20px; background: radial-gradient(circle, var(--indigo-glow) 0%, transparent 70%); z-index: 1; filter: blur(30px); }
    .founder-text-col { display: flex; flex-direction: column; align-items: flex-start; }
    .founder-desc { font-size: 16px; color: var(--text-muted); line-height: 1.8; margin-bottom: 24px; }
    .founder-stats { display: flex; gap: 24px; margin-top: 16px; flex-wrap: wrap; }
    .f-stat { background: var(--bg-alt); border: 1px solid var(--border); padding: 16px 24px; border-radius: 16px; font-size: 13px; color: var(--text-muted); display: flex; flex-direction: column; gap: 4px; transition: background 0.3s, border-color 0.3s; }
    .f-stat span { font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; transition: color 0.3s; }

    /* FAQ */
    .faq{padding:110px 52px;background:var(--bg-alt);transition:background 0.3s;}
    .faq-header-wrap { max-width: 1160px; margin: 0 auto 54px; text-align: left; display: flex; flex-direction: column; align-items: flex-start; }
    .faq-header-wrap .sec-title { margin-bottom: 0; max-width: none; }
    .faq-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;max-width:1160px;margin:0 auto;}
    .faq-item{border:0.5px solid var(--border);border-radius:20px;padding:32px 36px;cursor:default;transition:all 0.4s cubic-bezier(0.16, 1, 0.3, 1);background:var(--card-bg);box-shadow: 0 12px 32px var(--card-shadow);position: relative;}
    .faq-item:hover{border-color:var(--indigo-border);transform:translateY(-4px);box-shadow:0 24px 64px rgba(99,102,241,0.12);}
    [data-theme="dark"] .faq-item:hover {box-shadow: 0 24px 64px rgba(99,102,241,0.15);}
    .faq-q{font-family:'Inter',sans-serif;font-size:18px;font-weight:800;letter-spacing:-0.02em;margin-bottom:12px;color:var(--text);transition:color 0.3s;}
    .faq-a{font-size:15px;color:var(--text-muted);line-height:1.75;transition:color 0.3s;}

    /* BOOKING SECTION */
    .booking { padding: 110px 52px; background: var(--bg); transition: background 0.3s; }
    .booking-container { max-width: 1040px; margin: 0 auto; background: var(--card-bg); border: 0.5px solid var(--border); border-radius: 24px; padding: 40px; box-shadow: 0 24px 80px var(--card-shadow); transition: background 0.3s, border-color 0.3s; }
    .booking-iframe { width: 100%; height: 700px; border: none; border-radius: 12px; }
    [data-theme="dark"] .booking-container { box-shadow: 0 24px 80px rgba(0,0,0,0.6); }

    /* CTA FINAL (RECTANGULAR MONOLITH WITH HORIZON LASER BEAM) */
    .cta-wrapper {
      background: var(--bg);
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 20;
    }
    .cta-final {
      --cta-mouse-x: 50%;
      --cta-mouse-y: 25%;
      padding: 120px 52px 32px;
      background: var(--card-highlight);
      text-align: center;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 85vh;
      border-radius: 0;
      border-top: 1px solid rgba(129, 140, 248, 0.4);
      box-shadow: 0 -30px 100px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25);
      z-index: 20;
    }
    /* CTA FINAL (SOLID BLACK MONOLITH WITH CURVED CORNERS & INTERACTIVE HOVER DOTS) */
    .cta-wrapper {
      background: var(--bg);
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 20;
    }
    .cta-final {
      --cta-mouse-x: 50%;
      --cta-mouse-y: 25%;
      padding: 120px 52px 32px;
      background: #050505;
      text-align: center;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 85vh;
      border-radius: 56px 56px 0 0;
      border-top: none;
      box-shadow: none;
      z-index: 20;
    }
    [data-theme="light"] .cta-final {
      background: #050505;
      box-shadow: none;
    }
    .cta-dots-bg {
      position: absolute;
      inset: 0;
      opacity: 0.28;
      background-image: radial-gradient(rgba(255, 255, 255, 0.85) 1px, transparent 1px);
      background-size: 36px 36px;
      -webkit-mask-image: radial-gradient(ellipse 70% 65% at 50% 45%, #000 30%, transparent 100%);
      mask-image: radial-gradient(ellipse 70% 65% at 50% 45%, #000 30%, transparent 100%);
      pointer-events: none;
      z-index: 1;
    }
    /* Cursor-tracking interactive indigo constellation spotlight */
    .cta-spotlight-dots {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(#A5B4FC 1.5px, transparent 1.5px);
      background-size: 36px 36px;
      -webkit-mask-image: radial-gradient(280px circle at var(--cta-mouse-x) var(--cta-mouse-y), #000 0%, rgba(0,0,0,0.45) 45%, transparent 80%);
      mask-image: radial-gradient(280px circle at var(--cta-mouse-x) var(--cta-mouse-y), #000 0%, rgba(0,0,0,0.45) 45%, transparent 80%);
      opacity: 0.9;
      pointer-events: none;
      z-index: 2;
      transition: opacity 0.3s ease;
    }
    .cta-bg-glow {
      position: absolute;
      width: 820px;
      height: 820px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, transparent 60%);
      top: 55%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 2;
    }
    .cta-status-pill {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 7px 18px;
      border-radius: 100px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 100%);
      border: 1px solid rgba(165, 180, 252, 0.28);
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.25);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.4px;
      text-transform: uppercase;
      color: #C7D2FE;
      margin-bottom: 28px;
      overflow: hidden;
    }
    .cta-status-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #34D399;
      box-shadow: 0 0 10px #10B981, 0 0 4px #FFFFFF;
      animation: pulseDot 2s infinite;
    }
    
    .cta-content{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;position:relative;z-index:10;width:100%;padding-top:24px;}
    
    .cta-title{font-family:'Inter',sans-serif;font-size:clamp(40px,6vw,76px);font-weight:700;letter-spacing:-0.035em;color:#FAFAFA !important;line-height:1.08;margin-bottom:44px;position:relative;max-width:920px;z-index:10;}
    .cta-title .cta-serif-accent {
      font-family: var(--font-instrument-serif), serif;
      font-style: italic;
      font-weight: 400;
      font-size: 1.08em;
      letter-spacing: 0;
      background: linear-gradient(135deg, #FFFFFF 0%, #A5B4FC 55%, #818CF8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 6px 24px rgba(99, 102, 241, 0.35));
    }
    .cta-btns{display:flex;justify-content:center;position:relative;margin-bottom:32px;z-index:10;}
    .cta-btn-main {
      position: relative;
      overflow: hidden;
      background: linear-gradient(135deg, #818CF8 0%, #4F46E5 100%);
      color: white;
      padding: 18px 42px;
      border-radius: 100px;
      font-size: 16px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      font-family: 'Inter', sans-serif;
      border: 1px solid rgba(165, 180, 252, 0.45);
      box-shadow: 0 0 40px rgba(99, 102, 241, 0.45), inset 0 1px 1.5px rgba(255, 255, 255, 0.45);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      cursor: none;
    }
    .cta-btn-main:hover {
      background: linear-gradient(135deg, #A5B4FC 0%, #6366F1 100%);
      transform: translateY(-2px);
      box-shadow: 0 0 60px rgba(99, 102, 241, 0.65), inset 0 1px 1.5px rgba(255, 255, 255, 0.65);
    }
    .cta-proof{display:flex;align-items:center;gap:12px;position:relative;z-index:10;}
    .cta-avatars{display:flex;margin-left:10px;}
    .c-avatar{width:28px;height:28px;border-radius:50%;border:2px solid #080808;margin-left:-10px;}
    .c-avatar:nth-child(1){background:#52525B;}
    .c-avatar:nth-child(2){background:#71717A;}
    .c-avatar:nth-child(3){background:#A1A1AA;}
    .cta-proof span{font-size:13px;color:rgba(255,255,255,0.4) !important;font-weight:500;}
    
    .cta-footer{width:100%;max-width:1160px;position:relative;z-index:10;margin-top:auto;padding-top:80px;}
    .cta-footer-divider{width:100%;height:1px;background:rgba(255,255,255,0.08);margin-bottom:24px;}
    .cta-footer-bottom{display:flex;justify-content:space-between;align-items:center;font-size:13px;color:rgba(255,255,255,0.4) !important;padding-bottom:12px;}
    .cta-footer-links{display:flex;gap:32px;}
    .cta-footer-links a{color:rgba(255,255,255,0.4);text-decoration:none;transition:color 0.2s;}
    .cta-footer-links a:hover{color:white;}
    .cta-footer-links button{background:none;border:none;font-family:inherit;font-size:inherit;color:rgba(255,255,255,0.4);cursor:none;transition:color 0.2s;padding:0;outline:none;}
    .cta-footer-links button:hover{color:white;}

    /* MODAL STYLES */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: center; padding: 20px; opacity: 0; animation: fadeIn 0.3s forwards; }
    .modal-content { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; width: 100%; max-width: 640px; max-height: 85vh; overflow-y: auto; padding: 48px; position: relative; transform: translateY(20px); animation: slideUp 0.3s forwards; box-shadow: 0 24px 64px rgba(0,0,0,0.3); }
    .modal-content.contact-modal { max-width: 1000px; padding: 0; overflow: hidden; display: flex; flex-direction: column; }
    [data-theme="dark"] .modal-content { box-shadow: 0 24px 64px rgba(0,0,0,0.8); }
    .modal-close { position: absolute; top: 24px; right: 24px; background: var(--bg-alt); border: 1px solid var(--border); width: 36px; height: 36px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: var(--text); cursor: none; transition: all 0.2s; font-size: 14px; z-index: 10; }
    .modal-close:hover { background: var(--indigo); color: #FFF; border-color: var(--indigo); transform: scale(1.1); }
    .modal-header { font-family: 'Inter', sans-serif; font-size: 28px; font-weight: 800; color: var(--text); margin-bottom: 24px; letter-spacing: -0.03em; }
    .modal-body { font-size: 14px; color: var(--text-muted); line-height: 1.7; display: flex; flex-direction: column; gap: 20px; }
    .modal-body h3 { font-size: 16px; color: var(--text); margin-top: 12px; font-weight: 700; }
    .modal-body p { margin: 0; }
    
    /* CONTACT MODAL GRID */
    .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; min-height: 600px; }
    .contact-left { padding: 48px; background: var(--card-bg); display: flex; flex-direction: column; justify-content: center; border-right: 1px solid var(--border); }
    .contact-right { background: var(--bg-alt); position: relative; }
    .contact-right iframe { width: 100%; height: 100%; border: none; min-height: 600px; }
    .contact-item { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding: 16px; border-radius: 16px; border: 1px solid var(--border); transition: all 0.3s ease; text-decoration: none; background: var(--bg); }
    .contact-item:hover { border-color: var(--indigo-border); box-shadow: 0 8px 24px rgba(0,0,0,0.05); transform: translateY(-2px); }
    .contact-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--indigo-glow); color: var(--indigo); display: flex; justify-content: center; align-items: center; font-size: 20px; flex-shrink: 0; }
    .contact-info-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--text-light); margin-bottom: 4px; }
    .contact-info-value { font-size: 15px; font-weight: 600; color: var(--text); }
    
    @keyframes fadeIn { to { opacity: 1; } }
    @keyframes slideUp { to { transform: translateY(0); } }

    /* CUSTOM AI CHATBOT FAB & WINDOW */
    .ai-fab { position: fixed; bottom: 28px; right: 32px; width: 62px; height: 62px; border-radius: 18px; background: linear-gradient(135deg, #818CF8, #4338CA); display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 32px rgba(99,102,241,0.45), inset 0 1px 0 rgba(255,255,255,0.25); z-index: 600; cursor: none; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s; }
    .ai-fab:hover { transform: scale(1.06) translateY(-4px); box-shadow: 0 14px 42px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.35); }
    
    /* FIXED DESKTOP OVERLAP: Safe height calculation keeps the chatbot strictly below the 68px top navbar */
    .chat-window { position: fixed; bottom: 104px; right: 32px; width: 380px; height: min(540px, calc(100dvh - 190px)); max-height: calc(100dvh - 190px); background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; box-shadow: 0 24px 80px rgba(0,0,0,0.35); z-index: 600; display: flex; flex-direction: column; overflow: hidden; opacity: 0; transform: translateY(20px) scale(0.95); transform-origin: bottom right; pointer-events: none; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    .chat-window.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
    
    .chat-win-header { padding: 16px 20px; background: var(--bg-alt); border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
    .chat-win-title-wrap { display: flex; align-items: center; gap: 12px; }
    .chat-win-avatar { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .chat-win-title { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 800; color: var(--text); line-height: 1.2; }
    .chat-win-status { font-size: 11px; color: #22C55E; font-weight: 600; display: flex; align-items: center; gap: 5px; margin-top: 3px; }
    .chat-win-status::before { content: ''; display: block; width: 6px; height: 6px; background: #22C55E; border-radius: 50%; box-shadow: 0 0 8px #22C55E; animation: pulseDot 2s infinite; }
    
    .chat-win-body { flex: 1; min-height: 0; padding: 20px 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: var(--bg); }
    .chat-win-body::-webkit-scrollbar { width: 6px; }
    .chat-win-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
    
    .chat-msg-wrap { display: flex; flex-direction: column; max-width: 85%; }
    .chat-msg-wrap.ai { align-self: flex-start; }
    .chat-msg-wrap.user { align-self: flex-end; }
    .chat-msg { padding: 12px 16px; font-size: 13.5px; line-height: 1.6; border-radius: 16px; }
    .chat-msg-wrap.ai .chat-msg { background: var(--card-highlight); color: #FAFAFA; border-bottom-left-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .chat-msg-wrap.user .chat-msg { background: var(--indigo-glow); color: var(--text); border: 1px solid var(--indigo-border); border-bottom-right-radius: 4px; }
    
    .chat-win-footer { padding: 14px 18px; background: var(--bg-alt); border-top: 1px solid var(--border); flex-shrink: 0; }
    .chat-input-form { display: flex; gap: 8px; position: relative; }
    /* MOBILE ZOOM FIX: font-size must be 16px on iOS to prevent automatic zoom-in when tapping an input */
    .chat-input { flex: 1; background: var(--bg); border: 1px solid var(--border); border-radius: 100px; padding: 12px 18px; font-size: 16px; color: var(--text); outline: none; transition: border-color 0.2s; font-family: 'Inter', sans-serif; }
    .chat-input:focus { border-color: var(--indigo); }
    .chat-send-btn { width: 46px; height: 46px; border-radius: 50%; background: var(--indigo); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: none; transition: transform 0.2s, background 0.2s; flex-shrink: 0; }
    .chat-send-btn:hover { background: var(--indigo-mid); transform: scale(1.05); }
    .chat-send-btn:disabled { opacity: 0.5; transform: none; }

    /* SCROLL INDICATOR */
    .scroll-hint{display:flex;flex-direction:column;align-items:center;gap:6px;margin-top:56px;animation:riseIn 1s 1s ease both;}
    .scroll-line{width:1px;height:44px;background:linear-gradient(to bottom,var(--indigo),transparent);animation:scrollAnim 2s ease-in-out infinite;}
    @keyframes scrollAnim{0%,100%{opacity:0.3;transform:scaleY(1);}50%{opacity:1;transform:scaleY(1.1);}}
    .scroll-txt{font-size:9px;letter-spacing:2.5px;text-transform:uppercase;color:var(--text-light);}

    @keyframes riseIn{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}

    /* MULTI-DIRECTIONAL SCROLL REVEALS */
    .reveal { opacity: 0; transform: translateY(50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    
    .reveal-up { opacity: 0; transform: translateY(50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal-up.visible { opacity: 1; transform: translateY(0); }
    
    .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal-left.visible { opacity: 1; transform: translateX(0); }
    
    .reveal-right { opacity: 0; transform: translateX(50px); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal-right.visible { opacity: 1; transform: translateX(0); }
    
    .reveal-scale { opacity: 0; transform: scale(0.85); transition: all 0.9s cubic-bezier(0.16, 1, 0.3, 1); }
    .reveal-scale.visible { opacity: 1; transform: scale(1); }

    /* TOUCH / COARSE POINTER SAFETY: Never hide cursor on touch-enabled devices */
    @media (hover: none), (pointer: coarse) {
      .cursor, .cursor-ring { display: none !important; }
      *, body, a, button { cursor: auto !important; }
    }

    /* RESPONSIVE ADJUSTMENTS */
    @media (max-width: 1024px) {
      .services, .portfolio, .process, .pricing, .trust, .faq, .founder, .booking { padding: 80px 32px; }
      .services-grid, .portfolio-grid { grid-template-columns: repeat(2, 1fr); }
      .pricing-grid { grid-template-columns: repeat(2, 1fr); }
      .process-grid { grid-template-columns: 1fr; gap: 48px; }
      .process-visual { position: static; margin-top: 32px; }
      nav { padding: 0 32px; }
      .mock-hero { flex-wrap: wrap; }
      .mock-hero-center { flex: 1 1 100%; margin-top: 32px; order: 3; }
      .mock-hero-right { flex: 1; }
      .contact-grid { grid-template-columns: 1fr; min-height: auto; }
      .contact-left { border-right: none; border-bottom: 1px solid var(--border); padding: 32px; }
      .contact-right iframe { min-height: 500px; }
    }

    @media (max-width: 768px) {
      /* MOBILE CURSOR FIX: Disable custom cursor natively on mobile */
      .cursor, .cursor-ring { display: none !important; }
      *, body, a, button { cursor: auto !important; }

      .services, .portfolio, .process, .pricing, .trust, .faq, .founder, .booking { padding: 60px 24px; }
      .booking-container { padding: 20px; }
      .booking-iframe { height: 600px; }
      .hero { padding: 120px 24px 80px; }
      .hero-ctas { flex-direction: column; width: 100%; max-width: 320px; margin-left: auto; margin-right: auto; gap: 16px; }
      .btn-primary, .btn-secondary { width: 100%; justify-content: center; padding: 16px; }
      
      nav { padding: 0 20px; height: 60px; }
      .nav-center { display: none; }
      .nav-right { gap: 10px; }
      .mobile-menu-btn { display: flex; }
      .logo { font-size: 18px; }
      nav .nav-cta {
        padding: 8px 12px;
        font-size: 12px !important;
        white-space: nowrap;
        flex-shrink: 0;
      }
      
      .services-grid, .portfolio-grid, .pricing-grid, .faq-grid { grid-template-columns: 1fr; }
      .section-header-split { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 40px; }
      .sh-right { flex: 0 1 auto; }
      
      .mock-hero { flex-direction: column; padding: 32px 20px 160px 20px; gap: 32px; align-items: flex-start; }
      .mock-hero-left, .mock-hero-center, .mock-hero-right { flex: 1 1 100%; width: 100%; }
      .mock-hero-right { display: none; }
      .mock-chat { right: 20px; bottom: 20px; transform: scale(0.85); transform-origin: bottom right; }
      .mock-features-bar { flex-wrap: wrap; }
      .mock-feat { flex: 1 1 50%; border-bottom: 0.5px solid var(--border); border-right: 0.5px solid var(--border); }
      .mock-feat:nth-child(even) { border-right: none; }
      
      .laptop-wrapper { margin-top: 32px; }
      .laptop-outer { padding: 10px 10px 0; border-radius: 12px 12px 0 0; }
      .laptop-screen { border-radius: 6px 6px 0 0; }
      .laptop-base { height: 16px; border-radius: 0 0 4px 4px; }
      .laptop-foot { margin: 0 40px; height: 6px; }
      
      .founder-container { grid-template-columns: 1fr; padding: 32px 24px; gap: 40px; }
      .founder-image-wrap { aspect-ratio: 1/1; max-width: 320px; margin: 0 auto; }

      .cta-final { padding: 80px 24px 32px; border-radius: 32px 32px 0 0; margin-top: 40px; }
      .cta-title { font-size: 32px !important; margin-bottom: 32px; }
      .cta-footer { margin-top: 40px; padding-top: 40px; }
      .cta-footer { padding-bottom: 88px; }
      .cta-footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
      .cta-footer-links {
        width: 100%;
        justify-content: center;
        flex-wrap: wrap;
        gap: 12px 20px;
      }
      .cta-footer-links a,
      .cta-footer-links button {
        white-space: nowrap;
      }
      
      .ai-fab { bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 16px; }
      .chat-window { position: fixed; inset: 0; width: 100%; height: 100dvh; max-height: 100dvh; border-radius: 0; z-index: 10000; transform: translateY(100%); }
      .chat-window.open { transform: translateY(0); }

      /* FULL SCREEN CONTACT MODAL MOBILE FIX */
      .modal-content.contact-modal { 
         position: fixed; 
         inset: 0; 
         width: 100vw; 
         height: 100dvh; 
         max-width: 100vw; 
         max-height: 100dvh; 
         border-radius: 0; 
         border: none; 
         margin: 0; 
         display: block; 
         overflow-y: auto; 
         -webkit-overflow-scrolling: touch; 
      }
      .contact-grid { display: flex; flex-direction: column; }
      .contact-left { padding: 32px 20px; border-bottom: 1px solid var(--border); }
      .contact-right { flex: 1; min-height: 600px; width: 100%; }
      .contact-right iframe { height: 100%; width: 100%; min-height: 650px; }
      .modal-close { top: 16px; right: 16px; position: fixed; background: var(--card-highlight); color: #fff; z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
      
      .chat-input { font-size: 16px !important; }
    }

    @media (max-width: 480px) {
      .mock-nav-links { display: none; }
      .mock-code-wrapper { transform: scale(0.85); transform-origin: left center; }
      .mock-feat { flex: 1 1 100%; border-right: none; }
      .process-steps { padding-left: 16px; }
      .process-steps::before { left: 16px; top: 28px; bottom: 28px; }
      .process-step { flex-direction: column; gap: 12px; padding: 24px 16px 24px 28px; margin-left: 0; }
      .process-step .step-num { margin-left: -46px; background: var(--bg); }
      .port-visual { height: 200px; }
      .contact-left { padding: 32px 20px; }
    }
  `;

  return (
    <main itemScope itemType="https://schema.org/WebPage">
      {/* ADVANCED SEO + AEO (ANSWER ENGINE OPTIMIZATION) MULTI-ENTITY @GRAPH JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://webagen.dev/#website",
                "url": "https://webagen.dev/",
                "name": "WebAgen Studio",
                "description": "AI-Powered Web Development & Automation Studio in India delivering high-speed Next.js websites and Gemini/Claude AI chatbots in 7 days.",
                "inLanguage": "en-IN",
                "publisher": { "@id": "https://webagen.dev/#organization" }
              },
              {
                "@type": ["Organization", "ProfessionalService"],
                "@id": "https://webagen.dev/#organization",
                "name": "WebAgen Studio",
                "alternateName": "WebAgen",
                "url": "https://webagen.dev/",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://webagen.dev/profile.png"
                },
                "image": "https://webagen.dev/profile.png",
                "description": "WebAgen Studio builds high-performance Next.js websites, custom AI chatbots, GA4 analytics setups, and no-code automations for Indian businesses in 5 to 7 days.",
                "founder": { "@id": "https://webagen.dev/#founder" },
                "foundingLocation": {
                  "@type": "Place",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "IN"
                  }
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "India"
                },
                "priceRange": "₹4,999 - ₹29,999+",
                "currenciesAccepted": "INR",
                "paymentAccepted": "UPI, Bank Transfer, 50% Advance / 50% on Delivery",
                "telephone": "+91-6309847855",
                "email": "company@webagen.dev",
                "sameAs": [
                  "https://x.com/vishnusaisatwik",
                  "https://linkedin.com/company/webagen",
                  "https://www.instagram.com/webagen7/"
                ],
                "knowsAbout": [
                  "Next.js Web Development",
                  "AI Chatbot Integration",
                  "Google Gemini AI Integration",
                  "Answer Engine Optimization (AEO)",
                  "Technical SEO & Core Web Vitals",
                  "Google Analytics 4 (GA4) Setup",
                  "No-Code Workflow Automation (n8n & Make)",
                  "Website Speed & Security Rescue"
                ],
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "WebAgen Studio Packages & Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "name": "Starter Website Package",
                      "description": "3-page mobile-responsive custom website with WhatsApp button, contact form, 2 revision rounds, and domain setup in 5 days.",
                      "price": "4999",
                      "priceCurrency": "INR",
                      "availability": "https://schema.org/InStock",
                      "url": "https://webagen.dev/#pricing"
                    },
                    {
                      "@type": "Offer",
                      "name": "Growth Website Package",
                      "description": "5-page custom website with GA4 Analytics setup, Google Maps, on-page SEO basics, social links, WhatsApp, and 3 revision rounds in 7 days.",
                      "price": "7999",
                      "priceCurrency": "INR",
                      "availability": "https://schema.org/InStock",
                      "url": "https://webagen.dev/#pricing"
                    },
                    {
                      "@type": "Offer",
                      "name": "Pro AI & Automation Package",
                      "description": "Everything in Growth plus custom Gemini/Claude AI chatbot, no-code automation setup, advanced SEO + schema markup, and lead capture system in 7 days.",
                      "price": "12999",
                      "priceCurrency": "INR",
                      "availability": "https://schema.org/InStock",
                      "url": "https://webagen.dev/#pricing"
                    },
                    {
                      "@type": "Offer",
                      "name": "Site Rescue & Optimization",
                      "description": "Bug, checkout, and authentication error fixes, speed and cache optimization, mobile UI polish, and admin security hardening in 2–4 days.",
                      "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "4999",
                        "maxPrice": "29999",
                        "priceCurrency": "INR"
                      },
                      "availability": "https://schema.org/InStock",
                      "url": "https://webagen.dev/#pricing"
                    }
                  ]
                }
              },
              {
                "@type": "Person",
                "@id": "https://webagen.dev/#founder",
                "name": "Vishnu Sai Satwik",
                "jobTitle": "Founder & Lead Full-Stack Engineer",
                "worksFor": { "@id": "https://webagen.dev/#organization" },
                "image": "https://webagen.dev/profile.png",
                "sameAs": [
                  "https://x.com/vishnusaisatwik"
                ],
                "knowsAbout": ["Next.js", "React", "TypeScript", "AI Agents", "Full-Stack Engineering"]
              },
              {
                "@type": "HowTo",
                "@id": "https://webagen.dev/#process",
                "name": "How WebAgen Studio Launches a Custom AI-Powered Website in 7 Days",
                "description": "Step-by-step 7-day web development and AI integration workflow from discovery call to domain launch.",
                "totalTime": "P7D",
                "step": [
                  {
                    "@type": "HowToStep",
                    "position": 1,
                    "name": "Discovery Call (Day 1 · 15 mins)",
                    "text": "Quick 15-minute WhatsApp or video call to understand your business goals, audience, and requirements."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 2,
                    "name": "Proposal & Agreement (Day 1–2)",
                    "text": "Receive a transparent fixed-price package recommendation, approve scope, and pay 50% advance to begin immediately."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 3,
                    "name": "Design & Build (Day 2–6)",
                    "text": "Custom Next.js design, Gemini AI chatbot training, GA4 analytics, and WhatsApp/no-code integrations built with a live preview link."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 4,
                    "name": "Review & Revisions (Day 6–7)",
                    "text": "Review the staging website and request included revision rounds until every detail is approved."
                  },
                  {
                    "@type": "HowToStep",
                    "position": 5,
                    "name": "Launch & Handover (Day 7)",
                    "text": "Deploy live on your domain with a 30-minute handover walkthrough. Pay the remaining 50% only after approval."
                  }
                ]
              },
              {
                "@type": "ItemList",
                "@id": "https://webagen.dev/#portfolio",
                "name": "WebAgen Studio Selected Work & Case Studies",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Eduvo AI — Free Gemini-Powered Career & Coding Platform",
                    "url": "https://eduvo-ai.vercel.app/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "AI FlashCard Engine — Instant Study Card Generator",
                    "url": "https://flashcard-engine-ai.vercel.app/"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Godavari Delights — E-Commerce Rescue, Speed & Security Optimization",
                    "url": "https://www.godavaridelights.in"
                  }
                ]
              },
              {
                "@type": "FAQPage",
                "@id": "https://webagen.dev/#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Do I need to know coding to manage my site?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Not at all. WebAgen Studio builds websites you can update yourself with zero coding, backed by a 30-minute handover call showing how everything works."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What if I already have a website but it looks bad or has bugs?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "WebAgen Studio offers both Site Rescue & Optimization (₹4,999 – ₹29,999) to fix bugs, speed, and security, as well as full website redesigns—with 100% of your rescue fee credited if you upgrade to a redesign."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the AI chatbot work exactly?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "We train a Google Gemini or Claude AI assistant directly on your business services, pricing, hours, and FAQs so it answers customer questions and captures leads 24/7 on your website and WhatsApp."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Do you work with businesses across India?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes. WebAgen Studio works 100% remotely with businesses across India—from discovery calls and staging previews to final launch and handover."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What's included in monthly maintenance?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Monthly maintenance starts at ₹999/month (optional) and includes content updates, hosting management, security patches, and priority WhatsApp support."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why only 50% advance? What protects me?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "You pay 50% to start and the remaining 50% only after reviewing and approving your completed website. We revise until you are completely satisfied."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />

      {/* Google Analytics 4 (GA4) Base Tag */}
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-K4P27BYNK3');
        `}
      </Script>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-K4P27BYNK3"
        strategy="afterInteractive"
      />

      {/* SYNCHRONOUS THEME SCRIPT TO PREVENT FOUC (FLASH OF UNSTYLED CONTENT) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var docEl = document.documentElement;
                if (docEl) docEl.classList.add('no-transitions');
                if (document.body) document.body.classList.add('no-transitions');
                
                var theme = window.localStorage.getItem('theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                var isDark = theme === 'dark' || (!theme && prefersDark);
                
                if (isDark) {
                  docEl.setAttribute('data-theme', 'dark');
                  docEl.style.backgroundColor = '#050505'; // Hardcode dark bg to eliminate flash immediately
                } else {
                  docEl.setAttribute('data-theme', 'light');
                  docEl.style.backgroundColor = '#FAFAFA'; // Hardcode light bg
                }
              } catch (e) {}
            })();
          `,
        }}
      />
      <style dangerouslySetInnerHTML={{ __html: customCSS }} />

      {/* Progress Bar */}
      <div className="scroll-progress" id="scrollProgress"></div>

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursorRing"></div>

      {/* NAV */}
      <nav>
        <div className="nav-left">
          <a
            href="#"
            className="logo"
            onClick={(e) => {
              if (activeCaseStudy) {
                e.preventDefault();
                setActiveCaseStudy(null);
              }
            }}
          >
            <WebAgenLogo />
            WebAgen
          </a>
        </div>
        
        <div className="nav-center">
          <ul className="nav-links">
            <li>
              <a href="#services" onClick={() => setActiveCaseStudy(null)}>Services</a>
            </li>
            <li>
              <a href="#portfolio" onClick={() => setActiveCaseStudy(null)}>Portfolio</a>
            </li>
            <li>
              <a href="#process" onClick={() => setActiveCaseStudy(null)}>How It Works</a>
            </li>
            <li>
              <a href="#pricing" onClick={() => setActiveCaseStudy(null)}>Pricing</a>
            </li>
            <li>
              <a href="#faq" onClick={() => setActiveCaseStudy(null)}>FAQ</a>
            </li>
          </ul>
        </div>

        <div className="nav-right">
          <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Dark Mode">
            {!mounted ? (
                <div style={{ width: 20, height: 20 }}></div>
            ) : isDark ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
            )}
          </button>
          <button onClick={() => setActiveModal('contact')} className="nav-cta" aria-label="Open Contact Command Center">
            Contact Us
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-menu-btn"
            aria-label="Open Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE SLIDE-OUT SIDE MENU BAR */}
      <div
        className={`mobile-drawer-backdrop ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden={!isMobileMenuOpen}
      />
      <aside
        className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}
        aria-label="Mobile Navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div>
          <div className="mobile-drawer-header">
            <a
              href="#"
              className="logo"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                setActiveCaseStudy(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <WebAgenLogo className="w-7 h-7" />
              WebAgen
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-drawer-close"
              aria-label="Close Navigation Menu"
            >
              ✕
            </button>
          </div>

          <div className="mobile-drawer-links">
            <button onClick={() => handleMobileNavClick('services')} className="mobile-drawer-link">
              Services <span className="idx">01</span>
            </button>
            <button onClick={() => handleMobileNavClick('portfolio')} className="mobile-drawer-link">
              Portfolio <span className="idx">02</span>
            </button>
            <button onClick={() => handleMobileNavClick('process')} className="mobile-drawer-link">
              How It Works <span className="idx">03</span>
            </button>
            <button onClick={() => handleMobileNavClick('pricing')} className="mobile-drawer-link">
              Pricing <span className="idx">04</span>
            </button>
            <button onClick={() => handleMobileNavClick('faq')} className="mobile-drawer-link">
              FAQ <span className="idx">05</span>
            </button>
            <button onClick={() => handleMobileNavClick('book')} className="mobile-drawer-link">
              Book Discovery Call <span className="idx">06</span>
            </button>
          </div>
        </div>

        <div className="mobile-drawer-footer">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setActiveModal('contact');
            }}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
          >
            Start Your Project <span className="btn-arrow">→</span>
          </button>
          <a
            href="https://wa.me/916309847855?text=Hi%20Vishnu!%20I%27m%20interested%20in%20working%20with%20WebAgen%20Studio."
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ width: '100%', textAlign: 'center', padding: '13px' }}
          >
            WhatsApp Direct
          </a>
        </div>
      </aside>

      {activeCaseStudy ? (
        (() => {
          const study = CASE_STUDIES[activeCaseStudy];
          return (
            <section className="case-page">
              <div className="case-page-inner">
                <button
                  onClick={() => {
                    setActiveCaseStudy(null);
                    setTimeout(() => {
                      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="case-back-btn"
                >
                  ← Back to Selected Work
                </button>

                <div className="case-hero-card">
                  <div className="service-tag" style={{ background: study.accentBg, color: study.accent, marginBottom: '16px' }}>
                    {study.tag}
                  </div>
                  <h1 className="sec-title" style={{ marginBottom: '16px' }}>{study.title}</h1>
                  <p style={{ fontSize: '18px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '720px', marginBottom: '32px' }}>
                    {study.tagline}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', alignItems: 'center' }}>
                    <a
                      href={study.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary"
                    >
                      Visit Live Website ({study.domainLabel}) <span className="btn-arrow">↗</span>
                    </a>
                    {'demoUrl' in study && study.demoUrl && (
                      <a
                        href={study.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-secondary"
                      >
                        {study.demoLabel} <span className="btn-arrow">↗</span>
                      </a>
                    )}
                    <button
                      onClick={() => setActiveModal('contact')}
                      className="btn-secondary"
                    >
                      Build Something Like This
                    </button>
                  </div>
                  {'demoNote' in study && study.demoNote && (
                    <p style={{ marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      * {study.demoNote}
                    </p>
                  )}
                </div>

                <div className="case-grid-2">
                  <div className="case-block">
                    <div className="sec-eyebrow" style={{ marginBottom: '10px' }}>The Challenge</div>
                    <h3>What Needed Solving</h3>
                    <p>{study.problem}</p>
                  </div>

                  <div className="case-block">
                    <div className="sec-eyebrow" style={{ marginBottom: '10px' }}>Our Solution</div>
                    <h3>How We Engineered It</h3>
                    <p>{study.solution}</p>
                  </div>
                </div>

                <div className="case-block" style={{ marginBottom: '32px' }}>
                  <div className="sec-eyebrow" style={{ marginBottom: '10px' }}>Key Highlights</div>
                  <h3>What Makes This Project Work</h3>
                  <ul className="case-list">
                    {study.highlights.map((item, idx) => (
                      <li key={idx}>
                        <span className="s-check" style={{ marginTop: '3px' }}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Switch between case studies easily */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingTop: '12px' }}>
                  <button
                    onClick={() => {
                      setActiveCaseStudy(null);
                      setTimeout(() => {
                        document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
                      }, 50);
                    }}
                    className="case-back-btn"
                    style={{ marginBottom: 0 }}
                  >
                    ← All Projects
                  </button>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {(['eduvo', 'flashcard', 'godavari'] as const)
                      .filter((key) => key !== study.id)
                      .map((key) => (
                        <button
                          key={key}
                          onClick={() => setActiveCaseStudy(key)}
                          className="case-back-btn"
                          style={{ marginBottom: 0 }}
                        >
                          Read {CASE_STUDIES[key].title} →
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })()
      ) : (
        <>
      {/* HERO */}
      <header className="hero">
        <div className="hero-noise"></div>
        <div className="hero-orb"></div>
        <div className="hero-orb-2"></div>

        <div className="badge">
          <div className="badge-live"></div>AI-POWERED WEB STUDIO · INDIA
        </div>

        <div className="hero-title-group">
          <h1 className="hero-headline">We Don&apos;t Just Build</h1>
          <h1 className="hero-headline">Websites.</h1>
          <h1 className="hero-headline">
            We Build <span className="italic-text indigo-text">Ones That Think.</span>
          </h1>
        </div>

        <p className="hero-sub">
          From stunning designs to AI chatbots and smart analytics - we<br/>build
          your complete digital presence, fast.
        </p>

        <div className="hero-ctas">
          <button onClick={() => setActiveModal('contact')} className="btn-primary" aria-label="Get Your Website in 7 Days">
            Get Your Website in 7 Days <span className="btn-arrow" aria-hidden="true">→</span>
          </button>
          <a href="#services" className="btn-secondary">
            See What We Build
          </a>
        </div>

        {/* MASSIVE FIXED LAPTOP MOCKUP WITH HINGE ANIMATION */}
        <div id="laptop-mockup" className="laptop-wrapper" style={{ perspective: "1200px" }} aria-hidden="true">
          <div className={`laptop-screen-wrap ${laptopOpen ? 'open' : 'closed'}`}>
            <div className="laptop-outer">
              <div className="laptop-screen" style={{ position: "relative" }}>
                {/* Simulated Screen Glow */}
                <div className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-1000 ${laptopOpen && !siteLoaded ? 'opacity-5' : 'opacity-0'}`}></div>
                
                {/* LIVE DEMO: Browser typing and revealing site */}
                <MockSiteContent chatState={chatState} siteLoaded={siteLoaded} urlText={urlText} />
              </div>
            </div>
          </div>
          
          <div className="laptop-base"></div>
          <div className="laptop-foot"></div>
        </div>

        <div className="scroll-hint" aria-hidden="true">
          <div className="scroll-line"></div>
          <div className="scroll-txt">Scroll</div>
        </div>
      </header>

      {/* SERVICES */}
      <section className="services" id="services">
        <div className="section-header-split reveal-up">
          <div className="sh-left">
            <div className="sec-eyebrow">What We Build</div>
            <h2 className="sec-title">Every service your<br/>business needs online.</h2>
          </div>
          <div className="sh-right">
            <div className="sec-sub">
              We don&apos;t just make websites look good. We make them work harder than
              your best salesperson.
            </div>
          </div>
        </div>

        <div className="services-grid">
          <article className="service-card reveal-up" style={{ transitionDelay: '0s' }}>
            <div className="s-icon" aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div className="service-tag">Core</div>
            <h3 className="service-title">Professional Website</h3>
            <div className="service-desc">
              A fast, mobile-first, fully custom website that represents your
              business with credibility and clarity.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>3 to 7 pages, fully custom
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Mobile & tablet responsive
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Contact form + Google Maps
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>WhatsApp floating button
              </li>
            </ul>
          </article>
          <article className="service-card highlight reveal-scale" style={{ transitionDelay: '0.1s' }}>
            <div className="s-icon" style={{ background: "rgba(99,102,241,0.2)" }} aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
            </div>
            <div className="service-tag">AI-Powered</div>
            <h3 className="service-title">AI Chatbot Integration</h3>
            <div className="service-desc">
              A smart chatbot that handles customer questions, books appointments,
              and captures leads while you sleep.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Powered by Google Gemini AI
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Trained on your business info
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>WhatsApp + website integration
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Lead capture + auto-reply
              </li>
            </ul>
          </article>
          <article className="service-card reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div className="s-icon" aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div className="service-tag">Analytics</div>
            <h3 className="service-title">GA4 + Smart Analytics</h3>
            <div className="service-desc">
              Know exactly who visits your site, what they click, and where they
              leave. Data that drives decisions.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Google Analytics 4 setup
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Conversion tracking
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Monthly insights report
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Heatmap integration
              </li>
            </ul>
          </article>
          <article className="service-card highlight reveal-up" style={{ transitionDelay: '0s' }}>
            <div className="s-icon" aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div className="service-tag">Visibility</div>
            <h3 className="service-title">SEO & Google Presence</h3>
            <div className="service-desc">
              Get found on Google when customers search for exactly what you
              offer — locally and beyond.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>On-page SEO optimisation
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Google My Business setup
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Meta tags & schema markup
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Speed & Core Web Vitals
              </li>
            </ul>
          </article>
          <article className="service-card reveal-up" style={{ transitionDelay: '0.1s' }}>
            <div className="s-icon" aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div className="service-tag">Automation</div>
            <h3 className="service-title">No-Code Automation</h3>
            <div className="service-desc">
              Connect your website to WhatsApp, email, Google Sheets, and CRMs —
              automatically. Zero manual work.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Form → WhatsApp alerts
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Lead → Google Sheets auto-log
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Appointment confirmations
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Built with n8n or Make
              </li>
            </ul>
          </article>
          <article className="service-card highlight reveal-up" style={{ transitionDelay: '0.2s' }}>
            <div className="s-icon" aria-hidden="true">
              <svg className="premium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div className="service-tag">Ongoing</div>
            <h3 className="service-title">Maintenance & Support</h3>
            <div className="service-desc">
              We keep your site updated, secure, and running perfectly — every
              single month.
            </div>
            <ul className="service-list">
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Monthly content updates
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Hosting & domain management
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Bug fixes & security patches
              </li>
              <li>
                <span className="s-check" aria-hidden="true">✓</span>Priority WhatsApp support
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className="portfolio" id="portfolio">
        <div className="section-header-split reveal-up">
          <div className="sh-left">
            <div className="sec-eyebrow">Selected Work</div>
            <h2 className="sec-title">We don&apos;t just talk.<br/>We ship.</h2>
          </div>
          <div className="sh-right">
            <div className="sec-sub">
              A look at the AI-powered SaaS platforms, client rescues, and custom web apps we&apos;ve engineered from the ground up.
            </div>
          </div>
        </div>

        <div className="portfolio-grid">
          {/* Project 1: Eduvo AI */}
          <div className="port-card reveal-up" style={{ transitionDelay: '0s' }}>
            <a href={CASE_STUDIES.eduvo.liveUrl} target="_blank" rel="noopener noreferrer" className="port-visual" aria-label="Open Eduvo AI live website">
              <div className="mock-browser-bar mini">
                <div className="flex gap-1.5 absolute left-3">
                  <div className="w-2 h-2 rounded-full bg-rose-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400/90"></div>
                </div>
                <div className="mock-url-bar mini">eduvo-ai.vercel.app ↗</div>
              </div>
              <div className="port-visual-body">
                <div className="port-visual-grid"></div>
                <div className="port-glow" style={{ background: 'rgba(99,102,241,0.3)' }}></div>
                <div className="port-icon-wrap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#818CF8'}}>
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
              </div>
            </a>
            <div className="port-content">
              <div className="service-tag" style={{ alignSelf: 'flex-start' }}>AI SaaS · Career & Coding</div>
              <h3 className="port-title">Eduvo AI</h3>
              <p className="port-desc">A free, Gemini-powered career & coding platform featuring Eduvo Forge IDE, AI Roadmaps, and CV Matcher Pro.</p>
              <div className="port-actions">
                <button onClick={() => setActiveCaseStudy('eduvo')} className="port-case-btn">
                  View Case Study →
                </button>
                <div className="port-links-row">
                  <a href={CASE_STUDIES.eduvo.liveUrl} target="_blank" rel="noopener noreferrer" className="port-visit-link">
                    Live Site ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project 2: AI FlashCard Engine */}
          <div className="port-card reveal-scale" style={{ transitionDelay: '0.1s' }}>
            <a href="https://flashcard-engine-ai.vercel.app/" target="_blank" rel="noreferrer" className="port-visual" aria-label="Open AI FlashCard Engine live website">
              <div className="mock-browser-bar mini">
                <div className="flex gap-1.5 absolute left-3">
                  <div className="w-2 h-2 rounded-full bg-rose-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400/90"></div>
                </div>
                <div className="mock-url-bar mini">flashcard-engine-ai.vercel.app ↗</div>
              </div>
              <div className="port-visual-body">
                <div className="port-visual-grid"></div>
                <div className="port-glow" style={{ background: 'rgba(236,72,153,0.3)' }}></div>
                <div className="port-icon-wrap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#F472B6'}}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                  </svg>
                </div>
              </div>
            </a>
            <div className="port-content">
              <div className="service-tag" style={{background: 'rgba(236,72,153,0.1)', color: '#EC4899', alignSelf: 'flex-start'}}>Micro-SaaS</div>
              <h3 className="port-title">AI FlashCard Engine</h3>
              <p className="port-desc">A high-conversion utility that instantly turns any prompt into interactive study cards.</p>
              <div className="port-actions">
                <button onClick={() => setActiveCaseStudy('flashcard')} className="port-case-btn">
                  View Case Study →
                </button>
                <div className="port-links-row">
                  <a href="https://flashcard-engine-ai.vercel.app/" target="_blank" rel="noreferrer" className="port-visit-link">
                    Live Site ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project 3: Godavari Delights */}
          <div className="port-card reveal-up" style={{ transitionDelay: '0.2s' }}>
            <a href="https://www.godavaridelights.in" target="_blank" rel="noreferrer" className="port-visual" aria-label="Open Godavari Delights live website">
              <div className="mock-browser-bar mini">
                <div className="flex gap-1.5 absolute left-3">
                  <div className="w-2 h-2 rounded-full bg-rose-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-amber-400/90"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400/90"></div>
                </div>
                <div className="mock-url-bar mini">www.godavaridelights.in ↗</div>
              </div>
              <div className="port-visual-body">
                <div className="port-visual-grid"></div>
                <div className="port-glow" style={{ background: 'rgba(245,158,11,0.28)' }}></div>
                <div className="port-icon-wrap">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{color: '#FBBF24'}}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
              </div>
            </a>
            <div className="port-content">
              <div className="service-tag" style={{background: 'rgba(245,158,11,0.12)', color: '#F59E0B', alignSelf: 'flex-start'}}>Client Rescue + Concept</div>
              <h3 className="port-title">Godavari Delights</h3>
              <p className="port-desc">Fixed critical site bugs, boosted loading speed & added security—plus designed an upcoming replacement storefront demo (work in progress).</p>
              <div className="port-actions">
                <button onClick={() => setActiveCaseStudy('godavari')} className="port-case-btn">
                  View Case Study →
                </button>
                <div className="port-links-row">
                  <a href="https://www.godavaridelights.in" target="_blank" rel="noreferrer" className="port-visit-link">
                    Live Site ↗
                  </a>
                  <a href="https://chic-cuchufli-25b94f.netlify.app" target="_blank" rel="noreferrer" className="port-visit-link" title="Upcoming Redesign Demo (Not Fully Completed)">
                    Demo (WIP) ↗
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM PROCESS TIMELINE */}
      <section className="process" id="process">
        <div className="sec-eyebrow reveal-up">How It Works</div>
        <h2 className="sec-title reveal-up">From zero to live in 7 days. Seriously.</h2>
        <div className="sec-sub reveal-up">
          No back-and-forth chaos. No endless revisions. A clear process that
          delivers every time.
        </div>

        <div className="process-grid">
          
          {/* Left Interactive Timeline Steps */}
          <div className="process-steps">
            <div className="process-step reveal-left" style={{ transitionDelay: '0s' }}>
              <div className="step-num">01</div>
              <div>
                <h3 className="step-title">Discovery Call</h3>
                <div className="step-desc">
                  We hop on a quick 15-minute WhatsApp or video call. You tell us
                  about your business, your goals, your audience. We ask 10 smart
                  questions and take notes.
                </div>
                <div className="step-duration">Day 1 · 15 mins</div>
              </div>
            </div>
            <div className="process-step reveal-left" style={{ transitionDelay: '0.1s' }}>
              <div className="step-num">02</div>
              <div>
                <h3 className="step-title">Proposal & Agreement</h3>
                <div className="step-desc">
                  We send you a clear package recommendation with exact pricing.
                  You approve, pay 50% advance, and we start immediately. No
                  surprises.
                </div>
                <div className="step-duration">Day 1–2 · Same day</div>
              </div>
            </div>
            <div className="process-step reveal-left" style={{ transitionDelay: '0.2s' }}>
              <div className="step-num">03</div>
              <div>
                <h3 className="step-title">Design & Build</h3>
                <div className="step-desc">
                  We design and build your complete website — custom design, AI
                  features, analytics, and all integrations. You receive a
                  preview link to review.
                </div>
                <div className="step-duration">
                  Day 2–6 · We handle everything
                </div>
              </div>
            </div>
            <div className="process-step reveal-left" style={{ transitionDelay: '0.3s' }}>
              <div className="step-num">04</div>
              <div>
                <h3 className="step-title">Review & Revisions</h3>
                <div className="step-desc">
                  You review the site and request up to 2 rounds of changes. We
                  refine until you love it. No questions asked.
                </div>
                <div className="step-duration">
                  Day 6–7 · 2 revisions included
                </div>
              </div>
            </div>
            <div className="process-step reveal-left" style={{ transitionDelay: '0.4s' }}>
              <div className="step-num">05</div>
              <div>
                <h3 className="step-title">Launch & Handover</h3>
                <div className="step-desc">
                  Your site goes live on your domain. We do a 30-minute handover
                  call showing you everything. Pay the remaining 50% only after
                  you&apos;re happy.
                </div>
                <div className="step-duration">Day 7 · You&apos;re live 🚀</div>
              </div>
            </div>
          </div>

          {/* Right Side: The Premium Live Client Portal Dashboard */}
          <div className="process-visual reveal-right" aria-hidden="true">
            <div className="cp-header">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs">✦</div>
                <span className="text-sm font-bold text-white tracking-wide">Client Portal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="cp-dot"></div>
                <span className="text-xs text-emerald-400 font-medium">Live Sync</span>
              </div>
            </div>

            <div className="cp-body">
              <div className="flex justify-between items-end mb-2">
                <div>
                   <div className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Current Phase</div>
                   <div className="text-lg text-white font-bold">AI & Integrations Built</div>
                </div>
                <div className="text-3xl font-black text-indigo-400">78%</div>
              </div>
              
              <div className="cp-progress-container">
                <div className="cp-progress-bar"></div>
              </div>

              <div className="cp-terminal mt-6">
                 <div className="log-line"><span>[sys]</span> <span>Initializing Next.js environment...</span></div>
                 <div className="log-line"><span>[sys]</span> <span>Compiling custom UI components...</span></div>
                 <div className="log-line"><span>[ai]</span> <span>Training LLM on client_data.json...</span></div>
                 <div className="log-line"><span>[ai]</span> <span>Success: 142 behavior vectors mapped.</span></div>
                 <div className="log-line"><span>[net]</span> <span>Deploying to Vercel edge network... 🚀</span></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING */}
      <section className="pricing" id="pricing">
        <div className="pricing-header-wrap reveal-up">
          <div className="sec-eyebrow">Pricing</div>
          <h2 className="sec-title">
            Honest pricing.<br />No hidden charges.
          </h2>
          <div className="sec-sub" style={{ marginTop: '16px' }}>
            What you see is exactly what you pay. Pick a package and let&apos;s start.
          </div>
        </div>

        <div className="pricing-grid">
          <article className="p-card reveal-up" style={{ transitionDelay: '0s' }}>
            <div className="p-plan">Starter</div>
            <div className="p-price">₹4,999</div>
            <div className="p-period">One-time · 5-day delivery</div>
            <div className="p-tagline">
              Perfect for clinics, shops & coaches just getting online.
              <div style={{ marginTop: '8px', fontSize: '11px', fontWeight: 600, color: 'var(--indigo)' }}>* 5-day clock starts after content received</div>
            </div>
            <ul className="p-features">
              <li>
                <span className="p-check" aria-hidden="true">✓</span>3-page website
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Mobile responsive design
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>WhatsApp button
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Contact form
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>2 revision rounds
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Domain setup help
              </li>
            </ul>
            <button onClick={() => setActiveModal('contact')} className="p-btn" aria-label="Get Started with Starter Plan">Get Started</button>
          </article>

          <article className="p-card pop reveal-scale" style={{ transitionDelay: '0.15s' }}>
            <div className="pop-badge">Most Popular</div>
            <div className="p-plan">Growth</div>
            <div className="p-price">₹7,999</div>
            <div className="p-period">One-time · 7-day delivery</div>
            <div className="p-tagline">
              The complete digital presence for serious businesses.
            </div>
            <ul className="p-features">
              <li>
                <span className="p-check" aria-hidden="true">✓</span>5-page website
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>GA4 Analytics setup
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Google Maps + SEO basics
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Social media links
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>WhatsApp + contact form
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>3 revision rounds
              </li>
            </ul>
            <button onClick={() => setActiveModal('contact')} className="p-btn" aria-label="Get Started with Growth Plan">Get Started</button>
          </article>

          <article className="p-card reveal-up" style={{ transitionDelay: '0.3s' }}>
            <div className="p-plan">Pro</div>
            <div className="p-price">₹12,999</div>
            <div className="p-period">One-time · 7-day delivery</div>
            <div className="p-tagline">
              AI-powered, fully automated, built to convert.
            </div>
            <ul className="p-features">
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Everything in Growth
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>AI Chatbot (Gemini/Claude)
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>No-code automation setup
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Advanced SEO + schema
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Lead capture system
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>3 rounds + 1 post-launch revision
              </li>
              <li>
                <span className="p-check" aria-hidden="true">✓</span>Priority support during build
              </li>
            </ul>
            <button onClick={() => setActiveModal('contact')} className="p-btn" aria-label="Get Started with Pro Plan">Get Started</button>
          </article>

          <article className="p-card enterprise reveal-up" style={{ transitionDelay: '0.45s' }}>
            <div className="p-plan" style={{ color: '#A855F7' }}>Enterprise AI</div>
            <div className="p-price" style={{ fontSize: '32px' }}>Let&apos;s Talk</div>
            <div className="p-period">Custom scoping & timeline</div>
            <div className="p-tagline">
              Fully autonomous agents, custom LLM training, and complex workflows.
            </div>
            <ul className="p-features">
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Custom LLM (OpenAI/Claude)
              </li>
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Autonomous AI Agents
              </li>
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Secure API Key Management
              </li>
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Private Data Training (RAG)
              </li>
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Complex Automations
              </li>
              <li>
                <span className="p-check" aria-hidden="true" style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)' }}>✓</span>Dedicated SLA Support
              </li>
            </ul>
            <button onClick={() => setActiveModal('contact')} className="p-btn enterprise-btn" aria-label="Discuss Enterprise Project">Discuss Project</button>
          </article>
        </div>

        {/* EXISTING WEBSITE RESCUE & OPTIMIZATION WIDE CARD (OPTION A) */}
        <article className="rescue-card reveal-up" style={{ transitionDelay: '0.2s' }}>
          <div>
            <div className="p-plan" style={{ color: '#F59E0B' }}>Already Have a Website?</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: '24px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text)', marginBottom: '8px' }}>
              Site Rescue & Optimization
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Don&apos;t want a full rebuild yet? We fix bugs, speed up slow pages, harden security, and upgrade your existing site&apos;s UX.
            </p>
          </div>

          <ul className="rescue-features">
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>Bug, cart & auth error fixes
            </li>
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>Speed & cache optimization
            </li>
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>Mobile layout & UI polish
            </li>
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>Admin & security hardening
            </li>
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>AI chatbot / WhatsApp setup
            </li>
            <li>
              <span className="rescue-check" aria-hidden="true">✓</span>2–4 day fast turnaround
            </li>
          </ul>

          <div className="rescue-cta-col">
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#F59E0B', marginBottom: '4px' }}>
                Depends on Site & Scope
              </div>
              <div className="p-price rescue-price">₹4,999 – ₹29,999</div>
              <div className="p-period" style={{ marginBottom: 0 }}>100% credited if you upgrade to a redesign</div>
            </div>
            <button onClick={() => setActiveModal('contact')} className="p-btn rescue-btn" style={{ maxWidth: '240px', marginTop: '6px' }} aria-label="Discuss Existing Website Fixes">
              Discuss Your Site →
            </button>
          </div>
        </article>

        <div className="pricing-note reveal-up">
          50% advance to start · 50% only after you review & approve · Zero hidden charges
        </div>
      </section>

      {/* TRUST (SIMPLE & EASY TO UNDERSTAND COMPARISON CARDS) */}
      <section className="trust" id="trust">
        <div className="trust-inner">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', marginBottom: '44px' }}>
            <div className="sec-eyebrow reveal-up" style={{ justifyContent: 'center' }}>Why WebAgen</div>
            <h2 className="sec-title reveal-up" style={{ maxWidth: 'none' }}>
              Built different. Priced for India.
            </h2>
            <div className="sec-sub reveal-up" style={{ margin: '14px auto 0', maxWidth: '540px' }}>
              Why business owners choose WebAgen over slow, expensive agencies.
            </div>
          </div>

          <div className="versus-bento-grid reveal-scale">
            {COMPARISON_ROWS.map((row) => (
              <article key={row.criteria} className="versus-card">
                <div className="versus-card-top">
                  <h3 className="versus-card-title">{row.criteria}</h3>
                  <span className="versus-metric-badge">{row.metricTag}</span>
                </div>

                <div className="versus-split">
                  <div className="versus-side old">
                    <span className="compare-icon x-icon" aria-hidden="true">✕</span>
                    <div>
                      <span className="versus-side-label">Other Agencies</span>
                      <div className="versus-side-head" style={{ fontWeight: 500, marginBottom: 0 }}>{row.traditional}</div>
                    </div>
                  </div>

                  <div className="versus-side new">
                    <span className="compare-icon check-icon" aria-hidden="true">✓</span>
                    <div>
                      <span className="versus-side-label">WebAgen Studio</span>
                      <div className="versus-side-head" style={{ marginBottom: 0 }}>{row.webagen}</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="udyam-proof-card reveal-up">
            <div className="udyam-proof-icon" aria-hidden="true">✓</div>
            <div className="udyam-proof-copy">
              <h3 className="udyam-proof-title">Udyam Registered</h3>
              <p className="udyam-proof-description">
                Our Udyam Registration Certificate is available for verification.
              </p>
            </div>
            <a
              className="udyam-proof-link"
              href="/udyam-registration-certificate.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Udyam Registration Certificate PDF"
            >
              View certificate <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="trust-cta-bar reveal-up">
            <div style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 500 }}>
              <strong style={{ color: 'var(--text)' }}>100% Code Ownership. Zero lock-in.</strong> Ready to launch in 7 days?
            </div>
            <button
              onClick={() => setActiveModal('contact')}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '14px' }}
            >
              Start Your Build <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOUNDER SECTION */}
      <section className="founder" id="founder">
        <div className="founder-container reveal-up">
          <div className="founder-image-col">
            <div className="founder-image-wrap">
              <Image
                src="/profile.png"
                alt="Vishnu Sai Satwik - Founder & Lead Engineer"
                width={1120}
                height={928}
              />
              <div className="founder-glow"></div>
            </div>
          </div>
          <div className="founder-text-col">
            <div className="sec-eyebrow">The Founder</div>
            <h2 className="sec-title" style={{ marginBottom: '24px' }}>Hi, I&apos;m Vishnu.</h2>
            <p className="founder-desc">
              I&apos;m a software engineer and the architect behind platforms like Eduvo AI and FlashCard Engine. I started WebAgen Studio because I saw too many businesses settling for slow, outdated websites that did nothing for their growth.
            </p>
            <p className="founder-desc">
              When you partner with us, you work directly with me and a dedicated team of developers. We combine modern frameworks like Next.js with custom AI integrations to build digital engines that actively capture leads and scale your revenue.
            </p>
            <div className="founder-stats">
              <div className="f-stat"><span>Lead</span> Full-Stack Engineer</div>
              <div className="f-stat"><span>3</span> SaaS Platforms Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq" aria-labelledby="faq-heading">
        <div className="faq-header-wrap reveal-up">
          <div className="sec-eyebrow">FAQ</div>
          <h2 className="sec-title" id="faq-heading">Questions we get asked a lot.</h2>
        </div>

        <div className="faq-grid">
          <article className="faq-item reveal-up" style={{ transitionDelay: '0s' }}>
            <h3 className="faq-q">
              Do I need to know coding to manage my site?
            </h3>
            <div className="faq-a">
              Not at all. We build sites that you can update yourself with zero
              coding. We also provide a 30-minute handover call so you know exactly
              how everything works.
            </div>
          </article>
          <article className="faq-item reveal-up" style={{ transitionDelay: '0.1s' }}>
            <h3 className="faq-q">
              What if I already have a website but it looks bad or has bugs?
            </h3>
            <div className="faq-a">
              We offer both Site Rescue & Optimization and full redesigns. Share
              your existing site with us on WhatsApp and we&apos;ll tell you what&apos;s
              fixable and what&apos;s better rebuilt from scratch.
            </div>
          </article>
          <article className="faq-item reveal-up" style={{ transitionDelay: '0s' }}>
            <h3 className="faq-q">How does the AI chatbot work exactly?</h3>
            <div className="faq-a">
              We train it on your business — your services, pricing, hours, FAQs.
              It then answers customer questions automatically on your website and
              WhatsApp, 24/7.
            </div>
          </article>
          <article className="faq-item reveal-up" style={{ transitionDelay: '0.1s' }}>
            <h3 className="faq-q">
              Do you work with businesses across India?
            </h3>
            <div className="faq-a">
              Absolutely. We work 100% remotely with clients across India.
              Everything — calls, delivery, payment — happens online. Location is
              no barrier.
            </div>
          </article>
          <article className="faq-item reveal-up" style={{ transitionDelay: '0s' }}>
            <h3 className="faq-q">What&apos;s included in monthly maintenance?</h3>
            <div className="faq-a">
              Content updates, hosting management, security patches, and WhatsApp
              support for any issues. Starting at ₹999/month — optional but
              recommended.
            </div>
          </article>
          <article className="faq-item reveal-up" style={{ transitionDelay: '0.1s' }}>
            <h3 className="faq-q">
              Why only 50% advance? What protects me?
            </h3>
            <div className="faq-a">
              You only pay the remaining 50% after you&apos;ve reviewed, approved, and
              are happy with the site. If you&apos;re not satisfied, we revise until you
              are. Your money is safe.
            </div>
          </article>
        </div>
      </section>

      {/* BOOK A CALL */}
      <section className="booking" id="book">
        <div className="faq-header-wrap reveal-up" style={{ textAlign: 'center', alignItems: 'center' }}>
          <div className="sec-eyebrow" style={{ justifyContent: 'center' }}>Let&apos;s Talk</div>
          <h2 className="sec-title" style={{ maxWidth: 'none' }}>Book Your Free Discovery Call.</h2>
          <div className="sec-sub" style={{ margin: '16px auto 0', maxWidth: '600px' }}>
            Find a time that works for you. No pressure, just a transparent conversation about scaling your business.
          </div>
        </div>
        <div className="booking-container reveal-scale">
          <iframe 
            src={`https://cal.com/vishnu-sai-satwik-um4ebc/30min?theme=${isDark ? 'dark' : 'light'}`} 
            className="booking-iframe"
            title="Schedule a Discovery Call"
            loading="lazy"
          ></iframe>
        </div>
      </section>

      {/* CTA FINAL & FOOTER */}
      <div className="cta-wrapper">
        <footer ref={ctaRef} onMouseMove={handleCtaMouseMove} className="cta-final">
          <div className="cta-dots-bg" aria-hidden="true"></div>
          <div className="cta-spotlight-dots" aria-hidden="true"></div>
          <div className="cta-bg-glow" aria-hidden="true"></div>

          <div className="cta-content">
            <h2 className="cta-title reveal-scale">
              Experience the web like <span className="cta-serif-accent">never<br />before</span> with WebAgen.
            </h2>

            <div
              className="cta-btns reveal-up"
              style={{ transitionDelay: "0.1s" }}
            >
              <a href="#book" className="cta-btn-main" aria-label="Book Discovery Call">
                Book Discovery Call
              </a>
            </div>

            <div
              className="cta-proof reveal-up"
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="cta-avatars" aria-hidden="true">
                <div className="c-avatar"></div>
                <div className="c-avatar"></div>
                <div className="c-avatar"></div>
              </div>
              <span>Join 50+ scaling businesses</span>
            </div>
          </div>

          {/* PROPER FOOTER */}
          <div className="cta-footer reveal-up" style={{ transitionDelay: "0.3s" }}>
            <div className="cta-footer-divider" aria-hidden="true"></div>
            <div className="cta-footer-bottom">
              <div style={{ fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: '8px' }}>
                <WebAgenLogo className="w-5 h-5" shadow={false} />
                © {new Date().getFullYear()} WebAgen Studio
              </div>
              <div className="cta-footer-links">
                <button onClick={() => setActiveModal('privacy')} aria-label="View Privacy Policy">Privacy Policy</button>
                <button onClick={() => setActiveModal('terms')} aria-label="View Terms and Conditions">Terms & Conditions</button>
                <a href="https://x.com/vishnusaisatwik" target="_blank" rel="noreferrer" aria-label="Visit our Twitter profile">Twitter</a>
                <a href="https://linkedin.com/company/webagen" target="_blank" rel="noreferrer" aria-label="Visit our LinkedIn profile">LinkedIn</a>
                <a href="https://www.instagram.com/webagen7/" target="_blank" rel="noreferrer" aria-label="Visit our Instagram profile">Instagram</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
        </>
      )}

      {/* CUSTOM MULTILINGUAL AI CHATBOT UI */}
      <div className={`chat-window ${isAiChatOpen ? 'open' : ''}`}>
        <div className="chat-win-header">
          <div className="chat-win-title-wrap">
            <div className="chat-win-avatar">
              <WebAgenLogo className="w-10 h-10" shadow={false} />
            </div>
            <div>
              <div className="chat-win-title">WebAgen AI</div>
              <div className="chat-win-status">Online & Ready to Scale</div>
            </div>
          </div>
          <button onClick={() => setIsAiChatOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'none' }} aria-label="Close AI Chat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        
        <div className="chat-win-body">
          {aiMessages.map((msg, idx) => (
            <div key={idx} className={`chat-msg-wrap ${msg.role}`}>
              <div className="chat-msg" dangerouslySetInnerHTML={formatAiMessage(msg.text)} />
            </div>
          ))}
          {isBotTyping && (
            <div className="chat-msg-wrap ai">
              <div className="chat-msg">
                <div className="typing-dots" style={{ padding: '0 8px' }}>
                  <div className="typing-dot"></div><div className="typing-dot"></div><div className="typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-win-footer">
          <form className="chat-input-form" onSubmit={handleAiSubmit}>
            <input 
              type="text" 
              className="chat-input" 
              placeholder="Ask anything..." 
              value={chatInput} 
              onChange={(e) => setChatInput(e.target.value)} 
              disabled={isBotTyping}
            />
            <button type="submit" className="chat-send-btn" disabled={!chatInput.trim() || isBotTyping}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>

      <div className="wa-fab" onClick={() => setIsAiChatOpen(!isAiChatOpen)}>
        <div className="ai-fab" aria-label="Open AI Chat Assistant">
          <WebAgenLogo className="w-full h-full" shadow={false} />
        </div>
      </div>

      {/* LEGAL & CONTACT MODALS */}
      {activeModal && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className={`modal-content ${activeModal === 'contact' ? 'contact-modal' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModal(null)} aria-label="Close modal">✕</button>
            
            {activeModal === 'contact' && (
              <div className="contact-grid">
                <div className="contact-left">
                  <div className="sec-eyebrow" style={{ justifyContent: 'flex-start' }}>Command Center</div>
                  <h2 className="modal-header" style={{ fontSize: '32px', marginBottom: '40px' }}>Let&apos;s Scale Your Business.</h2>
                  
                  <div className="modal-body" style={{ gap: '16px' }}>
                    <a href="mailto:company@webagen.dev" className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      </div>
                      <div>
                        <div className="contact-info-title">Email Us</div>
                        <div className="contact-info-value">company@webagen.dev</div>
                      </div>
                    </a>

                    <a href="tel:+916309847855" className="contact-item">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      </div>
                      <div>
                        <div className="contact-info-title">Call Directly</div>
                        <div className="contact-info-value">+91 63098 47855</div>
                      </div>
                    </a>

                    <a href="https://wa.me/916309847855?text=Hi%20Vishnu!%20I%27m%20interested%20in%20working%20with%20WebAgen%20Studio." target="_blank" rel="noreferrer" className="contact-item">
                      <div className="contact-icon" style={{ background: 'rgba(37,211,102,0.1)', color: '#25D366' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      </div>
                      <div>
                        <div className="contact-info-title">WhatsApp Priority</div>
                        <div className="contact-info-value">Message us directly</div>
                      </div>
                    </a>
                  </div>
                </div>
                <div className="contact-right">
                  <iframe 
                    src={`https://cal.com/vishnu-sai-satwik-um4ebc/30min?theme=${isDark ? 'dark' : 'light'}`} 
                    title="Schedule a Discovery Call"
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            )}

            {activeModal === 'privacy' && (
              <>
                <h2 className="modal-header">Privacy Policy</h2>
                <div className="modal-body">
                  <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  <p>At WebAgen Studio, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.</p>
                  
                  <h3>1. Information We Collect</h3>
                  <p>We may collect personal information such as your name, email address, phone number, and business details when you voluntarily provide them to us through forms or communication channels (e.g., WhatsApp, Discovery Calls).</p>
                  
                  <h3>2. How We Use Your Information</h3>
                  <p>The information we collect is used to communicate with you, provide our web development and AI integration services, process payments, and improve your overall experience. We do not sell your data to third parties.</p>
                  
                  <h3>3. AI and Third-Party Tools</h3>
                  <p>Our custom AI solutions may process data provided by you or your users. We strictly configure these tools (including APIs from OpenAI, Anthropic, Google, etc.) to ensure your data is handled securely and not used to train public models without your explicit consent.</p>
                  
                  <h3>4. Analytics</h3>
                  <p>We use Google Analytics 4 (GA4) to track aggregated website traffic and usage patterns. This helps us improve our site&apos;s UX. You can opt out of GA4 tracking using standard browser extensions.</p>
                  
                  <h3>5. Contact Us</h3>
                  <p>If you have any questions about this Privacy Policy, please contact us directly via our provided communication channels.</p>
                </div>
              </>
            )}

            {activeModal === 'terms' && (
              <>
                <h2 className="modal-header">Terms & Conditions</h2>
                <div className="modal-body">
                  <p>Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                  <p>Welcome to WebAgen Studio. By engaging our services, you agree to comply with and be bound by the following terms and conditions.</p>
                  
                  <h3>1. Services & Deliverables</h3>
                  <p>WebAgen Studio provides custom web development, AI integration, and digital automation services. The specific scope of work, timelines, and deliverables will be outlined in your customized project proposal.</p>
                  
                  <h3>2. Payment Terms</h3>
                  <p>We require a strict 50% non-refundable advance payment to commence any project. The remaining 50% is due upon project completion and your approval, prior to the final launch and handover of the domain/codebase.</p>
                  
                  <h3>3. Timelines & Revisions</h3>
                  <p>Our standard &quot;7-day delivery&quot; applies to defined project scopes (e.g., Starter and Growth packages). Revisions are limited to the number specified in your package. Additional changes outside the original scope will be billed separately.</p>
                  
                  <h3>4. Hosting & Maintenance</h3>
                  <p>Domain registration and hosting costs are billed separately unless otherwise stated. Our optional monthly maintenance packages cover content updates, security patches, and bug fixes.</p>
                  
                  <h3>5. Intellectual Property</h3>
                  <p>Upon final payment, full ownership of the custom website codebase and associated intellectual property is transferred to the client. WebAgen Studio retains the right to showcase the completed project in our portfolio.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}