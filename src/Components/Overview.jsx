import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import s from '../styles/Overview.module.css';

const Overview = () => {
  const observerRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(s.visible);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observerRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const addRef = (el) => {
    if (el && !observerRefs.current.includes(el)) {
      observerRefs.current.push(el);
    }
  };

  const features = [
    {
      icon: '⚡',
      color: 'rgba(124, 58, 237, 0.12)',
      title: 'Real-Time Messaging',
      desc: 'Instant message delivery powered by Socket.IO WebSockets. No refreshing, no delays — just seamless conversations.',
    },
    {
      icon: '👥',
      color: 'rgba(6, 182, 212, 0.12)',
      title: 'Group Chats',
      desc: 'Create groups, invite members, and collaborate. Group admins can manage and delete groups with full control.',
    },
    {
      icon: '🔒',
      color: 'rgba(139, 92, 246, 0.12)',
      title: 'Secure Authentication',
      desc: 'Password hashing with bcrypt, OTP-based email verification, and secure token-based password reset flow.',
    },
    {
      icon: '🟢',
      color: 'rgba(34, 197, 94, 0.12)',
      title: 'Online Presence',
      desc: 'See who\'s currently active with real-time presence indicators. Know when your contacts are available.',
    },
    {
      icon: '🖼️',
      color: 'rgba(251, 146, 60, 0.12)',
      title: 'Cloud Media Storage',
      desc: 'Profile images stored securely via Cloudinary. Upload, update, and manage your avatar effortlessly.',
    },
    {
      icon: '📱',
      color: 'rgba(236, 72, 153, 0.12)',
      title: 'Responsive Design',
      desc: 'Fully responsive across all devices. Whether on desktop or mobile, the experience remains fluid and intuitive.',
    },
  ];

  const techStack = [
    { icon: '⚛️', name: 'React 18', role: 'Frontend' },
    { icon: '⚡', name: 'Vite', role: 'Bundler' },
    { icon: '🎨', name: 'Tailwind CSS', role: 'Styling' },
    { icon: '🟢', name: 'Node.js', role: 'Runtime' },
    { icon: '🚂', name: 'Express.js', role: 'Backend' },
    { icon: '🍃', name: 'MongoDB', role: 'Database' },
    { icon: '🔌', name: 'Socket.IO', role: 'Real-time' },
    { icon: '☁️', name: 'Cloudinary', role: 'Media CDN' },
    { icon: '📧', name: 'Nodemailer', role: 'Email' },
    { icon: '🔐', name: 'bcrypt', role: 'Security' },
  ];

  const stats = [
    { number: '10+', label: 'Technologies' },
    { number: '18', label: 'API Endpoints' },
    { number: '7', label: 'Socket Events' },
    { number: '∞', label: 'Messages Sent' },
  ];

  return (
    <div className={s.overviewPage}>
      {/* Background Effects */}
      <div className={s.ambientBg} />
      <div className={s.noiseOverlay} />
      <div className={s.gridLines} />

      <div className={s.content}>
        {/* Navigation */}
        <nav className={s.nav}>
          <Link to="/" className={s.navLogo}>
            <div className={s.navLogoIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className={s.navLogoText}>ChatSphere</span>
          </Link>
          <ul className={s.navLinks}>
            <li><a href="#features" className={s.navLink}>Features</a></li>
            <li><a href="#tech" className={s.navLink}>Tech Stack</a></li>
            <li><a href="#architecture" className={s.navLink}>Architecture</a></li>
          </ul>
          <a
            href="https://github.com/Sourabh7singh/MernChatApp"
            target="_blank"
            rel="noopener noreferrer"
            className={s.navCta}
          >
            ★ GitHub
          </a>
        </nav>

        {/* Hero */}
        <section className={s.hero}>
          <div className={s.heroBadge}>
            <span className={s.badgeDot} />
            Full-Stack MERN Application
          </div>
          <h1 className={s.heroTitle}>
            <span className={s.heroTitleGradient}>ChatSphere</span>
          </h1>
          <p className={s.heroSubtitle}>
            A feature-rich, real-time chat platform built from scratch with the MERN stack.
            One-on-one messaging, group conversations, and seamless user experiences — all powered by WebSockets.
          </p>
          <div className={s.heroActions}>
            <Link to="/login" className={s.btnPrimary}>
              Launch App
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
            <a
              href="https://github.com/Sourabh7singh/MernChatApp"
              target="_blank"
              rel="noopener noreferrer"
              className={s.btnSecondary}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View Source
            </a>
          </div>
          <div className={s.heroScroll}>
            Scroll to explore
            <div className={s.scrollLine} />
          </div>
        </section>

        {/* Features */}
        <section id="features" className={s.section}>
          <div ref={addRef} className={s.fadeIn}>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Features
            </div>
            <h2 className={s.sectionTitle}>Everything you need to chat</h2>
            <p className={s.sectionSubtitle}>
              Built with care and attention to detail, ChatSphere delivers a complete messaging experience.
            </p>
          </div>
          <div className={s.featuresGrid}>
            {features.map((f, i) => (
              <div
                key={i}
                ref={addRef}
                className={`${s.featureCard} ${s.fadeIn}`}
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className={s.featureIconWrap} style={{ background: f.color }}>
                  {f.icon}
                </div>
                <h3 className={s.featureTitle}>{f.title}</h3>
                <p className={s.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className={s.divider} />

        {/* Tech Stack */}
        <section id="tech" className={s.section}>
          <div ref={addRef} className={s.fadeIn}>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Tech Stack
            </div>
            <h2 className={s.sectionTitle}>Built with modern technologies</h2>
            <p className={s.sectionSubtitle}>
              A carefully chosen stack that prioritizes performance, developer experience, and real-time capabilities.
            </p>
          </div>
          <div className={s.techGrid}>
            {techStack.map((tech, i) => (
              <div
                key={i}
                ref={addRef}
                className={`${s.techCard} ${s.fadeIn}`}
                style={{ transitionDelay: `${i * 0.05}s` }}
              >
                <span className={s.techIcon}>{tech.icon}</span>
                <div className={s.techName}>{tech.name}</div>
                <div className={s.techRole}>{tech.role}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={s.divider} />

        {/* Architecture */}
        <section id="architecture" className={s.section}>
          <div ref={addRef} className={s.fadeIn}>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              Architecture
            </div>
            <h2 className={s.sectionTitle}>How it all connects</h2>
            <p className={s.sectionSubtitle}>
              A real-time event-driven architecture with REST APIs for data persistence and WebSockets for instant communication.
            </p>
          </div>
          <div ref={addRef} className={`${s.archContainer} ${s.fadeIn}`}>
            <div className={s.archFlow}>
              <div className={s.archNode}>
                <span className={s.archNodeIcon}>🖥️</span>
                <span className={s.archNodeLabel}>React Frontend</span>
                <span className={s.archNodeSub}>Vite + Tailwind</span>
              </div>
              <span className={s.archArrow}>⟷</span>
              <div className={s.archNode}>
                <span className={s.archNodeIcon}>🔌</span>
                <span className={s.archNodeLabel}>Socket.IO</span>
                <span className={s.archNodeSub}>WebSocket Layer</span>
              </div>
              <span className={s.archArrow}>⟷</span>
              <div className={s.archNode}>
                <span className={s.archNodeIcon}>🚂</span>
                <span className={s.archNodeLabel}>Express Server</span>
                <span className={s.archNodeSub}>REST API</span>
              </div>
              <span className={s.archArrow}>⟷</span>
              <div className={s.archNode}>
                <span className={s.archNodeIcon}>🍃</span>
                <span className={s.archNodeLabel}>MongoDB</span>
                <span className={s.archNodeSub}>Mongoose ODM</span>
              </div>
              <span className={s.archArrow}>⟷</span>
              <div className={s.archNode}>
                <span className={s.archNodeIcon}>☁️</span>
                <span className={s.archNodeLabel}>Cloudinary</span>
                <span className={s.archNodeSub}>Media Storage</span>
              </div>
            </div>
          </div>
        </section>

        <div className={s.divider} />

        {/* Stats */}
        <section className={s.section}>
          <div ref={addRef} className={s.fadeIn}>
            <div className={s.sectionLabel}>
              <span className={s.sectionLabelDot} />
              By the Numbers
            </div>
            <h2 className={s.sectionTitle}>Project at a glance</h2>
          </div>
          <div className={s.statsGrid}>
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={addRef}
                className={`${s.statCard} ${s.fadeIn}`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className={s.statNumber}>{stat.number}</div>
                <div className={s.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={s.divider} />

        {/* Footer / Signature */}
        <footer className={s.footer}>
          <div ref={addRef} className={`${s.signatureWrapper} ${s.fadeIn}`}>
            <div className={s.signatureIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className={s.signatureLabel}>Crafted & Engineered by</div>
            <div className={s.signatureName}>Saurabh Singh</div>
            <div className={s.signatureTitle}>Full-Stack Developer</div>
            <div className={s.signatureLinks}>
              <a
                href="https://github.com/Sourabh7singh"
                target="_blank"
                rel="noopener noreferrer"
                className={s.signatureLink}
                title="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="mailto:souravhsingh2002@gmail.com"
                className={s.signatureLink}
                title="Email"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/saurabh-singh-6458451b2/"
                target="_blank"
                rel="noopener noreferrer"
                className={s.signatureLink}
                title="LinkedIn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <p className={s.footerNote}>
            Built with <span className={s.footerHeart}>♥</span> using React, Node.js, and a lot of caffeine ☕
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Overview;
