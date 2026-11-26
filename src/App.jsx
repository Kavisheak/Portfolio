import React, { useEffect, useState, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import './App.css';
import kavisheakCutout from './assets/kavisheak_about_cutout.png';
import AboutScene from './components/AboutScene';
import DriveScrollCanvas from './components/DriveScrollCanvas';
import ProjectsSection from './components/ProjectsSection';


const MOBILE_QUERY = '(max-width: 900px)';
const TOTAL_DRIVE_FRAMES = 144;
const clamp01 = (v) => Math.max(0, Math.min(1, v));
const smoothstep = (edge0, edge1, x) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

/**
 * Smooth frame mapping across the 620vh #home stage:
 * - 0.00..0.20: frames 0..64 (hoodie intro -> car arrives)
 * - 0.20..0.33: frames 64..78 (car-appearing About Me window, paired with continuous zoom)
 * - 0.33..0.52: frames 78..143 (driving -> green digital glitch ending)
 */
const getDriveFrameIndex = (progress) => {
  if (progress <= 0.20) {
    return Math.round((progress / 0.20) * 64);
  }
  if (progress <= 0.33) {
    const t = (progress - 0.20) / (0.33 - 0.20);
    return Math.round(64 + t * (78 - 64));
  }
  const t = clamp01((progress - 0.33) / (0.52 - 0.33));
  return Math.min(TOTAL_DRIVE_FRAMES - 1, Math.round(78 + t * (TOTAL_DRIVE_FRAMES - 1 - 78)));
};

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef(null);
  const homeStageRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Track mobile breakpoint so the mobile hero art is used instead of the landscape video
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => {
      setIsMobile(e.matches);
      if (!e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock scrolling while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = '';
    if (!lenisRef.current) return;
    if (menuOpen) lenisRef.current.stop();
    else lenisRef.current.start();
  }, [menuOpen]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    const updateTargets = (scrollY) => {
      const vh = window.innerHeight || 1;
      const stageEl = homeStageRef.current;
      const stageScrollable = stageEl ? Math.max(1, stageEl.offsetHeight - vh) : vh;
      const prog = clamp01(scrollY / stageScrollable);
      targetProgressRef.current = prog;

      const aboutEl = document.getElementById('about');
      const aboutTop = aboutEl ? aboutEl.getBoundingClientRect().top : Infinity;
      const inCarAbout = prog >= 0.19 && prog <= 0.34;
      const inProjects = prog >= 0.46 && aboutTop > vh * 0.5;
      const current = inProjects
        ? 'projects'
        : inCarAbout
        ? 'about'
        : aboutTop > vh * 0.5
        ? 'home'
        : aboutTop > -vh * 0.5
        ? 'about'
        : 'contact';
      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    lenis.on('scroll', (e) => {
      updateTargets(e.scroll);
    });

    let rafId = 0;
    function raf(time) {
      lenis.raf(time);

      // Smoothly interpolate progress for silky frame-by-frame scrubbing
      const target = targetProgressRef.current;
      const curr = currentProgressRef.current;
      const next = Math.abs(target - curr) < 0.0005 ? target : curr + (target - curr) * 0.16;
      if (next !== curr) {
        currentProgressRef.current = next;
        setScrollProgress(next);
      }

      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMenuOpen(false);
    if (lenisRef.current) {
      lenisRef.current.start();
      if (targetId === '#about' && homeStageRef.current) {
        const vh = window.innerHeight || 1;
        const stageScrollable = Math.max(1, homeStageRef.current.offsetHeight - vh);
        lenisRef.current.scrollTo(stageScrollable * 0.265, { duration: 1.5 });
        return;
      }
      if (targetId === '#projects' && homeStageRef.current) {
        const vh = window.innerHeight || 1;
        const stageScrollable = Math.max(1, homeStageRef.current.offsetHeight - vh);
        lenisRef.current.scrollTo(stageScrollable * 0.58, { duration: 1.5 });
        return;
      }
      const targetEl = document.querySelector(targetId) || document.querySelector('#about');
      if (targetEl) {
        lenisRef.current.scrollTo(targetEl, { duration: 1.5 });
      }
    }
  };

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'about', label: 'ABOUT' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'skills', label: 'SKILLS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const frameIndex = getDriveFrameIndex(scrollProgress);
  const initialContentOpacity = 1 - smoothstep(0.02, 0.09, scrollProgress);
  const aboutCarOpacity =
    smoothstep(0.18, 0.23, scrollProgress) * (1 - smoothstep(0.30, 0.35, scrollProgress));
  const carMotionScale =
    1 + 0.045 * smoothstep(0.18, 0.34, scrollProgress) * (1 - smoothstep(0.34, 0.42, scrollProgress));
  const projectsOpacity = smoothstep(0.45, 0.55, scrollProgress);
  const projectsLoopProgress = clamp01((scrollProgress - 0.55) / 0.39);
  const driveOpacity = 1 - smoothstep(0.46, 0.56, scrollProgress);
  const glitchIntensity = Math.sin(clamp01((scrollProgress - 0.44) / 0.14) * Math.PI);
  const scrollCueOpacity =
    initialContentOpacity > 0.01
      ? initialContentOpacity
      : aboutCarOpacity > 0.01
      ? aboutCarOpacity
      : 0;

  return (
    <div className="app-wrapper">
      {/* Global Fixed Navbar */}
      <header className="custom-navbar">
        <div className="nav-left">
          <span className="cursive-logo">Kv</span>
          <div className="v-divider"></div>
          <div className="logo-text">
            <span className="name">KAVISHEAK</span>
            <span className="sub">PORTFOLIO</span>
          </div>
        </div>
        
        <nav className="nav-center">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              className={activeSection === link.id ? 'active' : ''}
              onClick={(e) => handleNavClick(e, `#${link.id}`)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        
        <div className="nav-right">
          <div className="dots-icon">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <button
          type="button"
          id="mobile-menu-toggle"
          className={`mobile-hamburger ${menuOpen ? 'open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>

      {/* Mobile full-screen menu */}
      <nav className={`mobile-menu ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        {navLinks.map((link, i) => (
          <a
            key={link.id}
            id={`mobile-nav-${link.id}`}
            href={`#${link.id}`}
            className={activeSection === link.id ? 'active' : ''}
            style={{ transitionDelay: menuOpen ? `${0.1 + i * 0.07}s` : '0s' }}
            onClick={(e) => handleNavClick(e, `#${link.id}`)}
          >
            <span className="mobile-menu-index">0{i + 1}</span>
            {link.label}
          </a>
        ))}
      </nav>

      {/* Hero Scroll Stage (#home starts at frame 0 and transitions smoothly into hero) */}
      <div id="home" ref={homeStageRef} className="home-scroll-stage">
        <section className="hero-section full-bleed">
          {driveOpacity > 0.005 && (
            <DriveScrollCanvas
              frameIndex={frameIndex}
              opacity={driveOpacity}
              glitchIntensity={glitchIntensity}
              motionScale={carMotionScale}
            />
          )}

          {projectsOpacity > 0.01 && (
            <ProjectsSection
              opacity={projectsOpacity}
              glitchIntensity={glitchIntensity}
              loopProgress={projectsLoopProgress}
              onJumpToProject={(idx) => {
                if (!lenisRef.current || !homeStageRef.current) return;
                const vh = window.innerHeight || 1;
                const stageScrollable = Math.max(1, homeStageRef.current.offsetHeight - vh);
                const targetProg = 0.56 + (idx / 3) * 0.38;
                lenisRef.current.scrollTo(stageScrollable * targetProg, { duration: 1.1 });
              }}
            />
          )}

          {initialContentOpacity > 0.01 && (
            <div
              className="initial-hero-content"
              style={{
                opacity: initialContentOpacity,
                transform: `translateY(${((1 - initialContentOpacity) * -18).toFixed(1)}px)`,
              }}
            >
              <div className="initial-greeting-pill">
                <span className="initial-greeting-dot" />
                <span>Hello, I&apos;m</span>
              </div>

              <h1 className="initial-hero-title">
                <span className="initial-title-sub-wrap">
                  <span className="initial-title-name">Kavisheak</span>
                  <span className="initial-title-laser" aria-hidden="true" />
                </span>
              </h1>

              <p className="initial-hero-role">Software Engineer · Drone &amp; AI Systems Researcher</p>

              <p className="initial-hero-bio">
                Passionate about emerging technology, aerial drone mapping, computer vision, and building scalable, high-impact software solutions from concept to production.
              </p>

              <div className="initial-tech-pills" aria-label="Core specialties">
                <span className="initial-tech-pill">Full-Stack Engineering</span>
                <span className="initial-tech-pill">Drone Mapping &amp; GIS</span>
                <span className="initial-tech-pill">Image Processing &amp; AI</span>
                <span className="initial-tech-pill">Cloud &amp; Automation</span>
              </div>

              <div className="initial-hero-actions">
                <a
                  href="#projects"
                  className="initial-btn-primary"
                  onClick={(e) => handleNavClick(e, '#projects')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  <span>View My Projects</span>
                  <span className="initial-btn-chevron" aria-hidden="true">&rsaquo;</span>
                </a>

                <a
                  href="#about"
                  className="initial-btn-secondary"
                  onClick={(e) => handleNavClick(e, '#about')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download CV</span>
                </a>
              </div>

              <div className="initial-hero-socials">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="initial-social-btn" aria-label="GitHub">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="17" height="17">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="initial-social-btn" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
                  </svg>
                </a>
                <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="initial-social-btn" aria-label="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="17" height="17">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3 7 12 13 21 7" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {aboutCarOpacity > 0.01 && (
            <div
              className="about-car-stage"
              style={{ opacity: aboutCarOpacity }}
            >
              <div
                className="about-car-left"
                style={{
                  transform: `translateY(${((1 - aboutCarOpacity) * 18).toFixed(1)}px)`,
                }}
              >
                <div className="initial-greeting-pill">
                  <span className="initial-greeting-dot" />
                  <span>About Me</span>
                </div>

                <h2 className="initial-hero-title about-car-title">
                  <span className="initial-title-name">Hi, I&apos;m</span>
                  <span className="initial-title-sub-wrap">
                    <span className="initial-title-sub">Kavisheak</span>
                    <span className="initial-title-laser" aria-hidden="true" />
                  </span>
                </h2>

                <p className="initial-hero-role">Software Engineer &amp; Researcher</p>

                <span className="about-mobile-accent-line" aria-hidden="true" />

                <p className="about-car-bio">
                  I&apos;m a passionate software engineer and researcher, with a strong
                  interest in drone mapping, image processing and innovative technology.
                  I love turning ideas into impactful solutions and constantly exploring
                  new possibilities in the tech world.
                </p>

                <p className="about-mobile-bio">
                  I&apos;m a passionate software engineer, turning ideas into impactful solutions.
                </p>

                <a
                  href="#projects"
                  className="about-mobile-explore-btn"
                  onClick={(e) => handleNavClick(e, '#projects')}
                >
                  <span>Explore My Work</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>

                <div className="about-car-cards">
                  <div className="about-car-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="12" rx="2" />
                      <path d="M2 20h20" />
                      <polyline points="9 8 7 10 9 12" />
                      <polyline points="15 8 17 10 15 12" />
                    </svg>
                    <span>Software<br />Development</span>
                  </div>
                  <div className="about-car-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24" aria-hidden="true">
                      <path d="M5 7l4 3m6 0l4-3M5 17l4-3m6 0l4 3" />
                      <rect x="9" y="9" width="6" height="6" rx="1.5" />
                      <circle cx="4" cy="6" r="2" />
                      <circle cx="20" cy="6" r="2" />
                      <circle cx="4" cy="18" r="2" />
                      <circle cx="20" cy="18" r="2" />
                    </svg>
                    <span>Drone Mapping<br />&amp; GIS</span>
                  </div>
                  <div className="about-car-card">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="24" height="24" aria-hidden="true">
                      <path d="M4 20h16" />
                      <rect x="6" y="12" width="3" height="5" />
                      <rect x="11" y="9" width="3" height="8" />
                      <rect x="16" y="6" width="3" height="11" />
                      <polyline points="5 10 10 6 14 8 19 3" />
                    </svg>
                    <span>Data Analysis<br />&amp; Research</span>
                  </div>
                </div>

                <div className="initial-hero-actions">
                  <a
                    href="#about-wrapper"
                    className="initial-btn-primary"
                    onClick={(e) => handleNavClick(e, '#about-wrapper')}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" aria-hidden="true">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span>Download CV</span>
                  </a>

                  <a
                    href="#about-wrapper"
                    className="initial-btn-secondary"
                    onClick={(e) => handleNavClick(e, '#about-wrapper')}
                  >
                    <span className="initial-btn-chevron" aria-hidden="true">&lsaquo;</span>
                    <span>Contact Me</span>
                  </a>
                </div>

                <div className="initial-hero-socials">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="initial-social-btn" aria-label="GitHub">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="17" height="17">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="initial-social-btn" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M6.94 8.5H3.56V19.5H6.94V8.5ZM5.25 3.5C4.14 3.5 3.25 4.39 3.25 5.5C3.25 6.6 4.14 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.39 6.35 3.5 5.25 3.5ZM20.44 13.02C20.44 9.88 18.76 8.22 16.16 8.22C14.37 8.22 13.48 9.2 13.02 9.93V8.5H9.65C9.7 9.48 9.65 19.5 9.65 19.5H13.02V13.36C13.02 13.02 13.05 12.69 13.15 12.45C13.42 11.78 14.03 11.09 15.07 11.09C16.41 11.09 17.06 12.11 17.06 13.6V19.5H20.44V13.02Z" />
                    </svg>
                  </a>
                  <a href="#about-wrapper" onClick={(e) => handleNavClick(e, '#about-wrapper')} className="initial-social-btn" aria-label="Email">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="17" height="17">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <polyline points="3 7 12 13 21 7" />
                    </svg>
                  </a>
                </div>
              </div>

              <div
                className="about-car-right"
                style={{
                  transform: `translateY(${((1 - aboutCarOpacity) * 24).toFixed(1)}px)`,
                }}
              >
                <div className="about-car-geo about-car-geo--1" aria-hidden="true" />
                <div className="about-car-geo about-car-geo--2" aria-hidden="true" />
                <img
                  src={kavisheakCutout}
                  alt="Kavisheak — Software Engineer & Researcher"
                  className="about-car-portrait"
                />
              </div>

              <div className="about-mobile-pillars" aria-label="Core roles">
                <div className="about-mobile-pillar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                    <line x1="14" y1="4" x2="10" y2="20" />
                  </svg>
                  <span>Developer</span>
                </div>
                <div className="about-mobile-pillar-div" aria-hidden="true" />
                <div className="about-mobile-pillar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="22" height="22" aria-hidden="true">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-4.04Z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-4.04Z" />
                  </svg>
                  <span>Researcher</span>
                </div>
                <div className="about-mobile-pillar-div" aria-hidden="true" />
                <div className="about-mobile-pillar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden="true">
                    <path d="M4 20h16" />
                    <rect x="6" y="12" width="3" height="5" fill="currentColor" />
                    <rect x="11" y="9" width="3" height="8" fill="currentColor" />
                    <rect x="16" y="6" width="3" height="11" fill="currentColor" />
                  </svg>
                  <span>Innovator</span>
                </div>
              </div>
            </div>
          )}

          {scrollCueOpacity > 0.01 && (
            <div className="drive-scroll-cue" style={{ opacity: scrollCueOpacity }} aria-hidden="true">
              <div className="drive-scroll-cue-row">
                <span className="drive-cue-line drive-cue-line--left" />
                <div className="mouse-icon drive-mouse-icon">
                  <div className="mouse-wheel"></div>
                </div>
                <span className="drive-cue-line drive-cue-line--right" />
              </div>
              <span>SCROLL TO EXPLORE</span>
            </div>
          )}
        
        {/* Identical Overlay UI */}
        <div className="hero-overlay-ui">
          <div className="desktop-hero-ui">
            {/* Floating Text Elements */}
            <div className="welcome-text">
              <span className="h-line-green"></span> WELCOME TO MY WORLD
            </div>

            <div className="bottom-left-content">
              <div className="engineer-text">
                <span className="v-line-green"></span> SOFTWARE ENGINEER
              </div>
              <div className="social-links">
                <a href="#" className="social-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                </a>
                <a href="#" className="social-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a href="#" className="social-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M4 4l16 16m0-16L4 20"></path></svg>
                </a>
                <a href="#" className="social-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
              </div>
            </div>

            <div className="bottom-right-content">
              <div className="signature-area">
                <span className="cursive-signature">Kavisheak</span>
                <div className="signature-underline"></div>
              </div>
              <div className="scroll-indicator">
                <div className="mouse-icon">
                  <div className="mouse-wheel"></div>
                </div>
                <span>SCROLL DOWN</span>
                <span className="h-line-white"></span>
              </div>
            </div>

            {/* Right Pagination */}
            <div className="vertical-pagination">
              <div className="p-dot active"></div>
              <div className="p-dot"></div>
              <div className="p-dot"></div>
              <div className="p-dot"></div>
              <div className="p-line"></div>
            </div>
          </div>
        </div>
        </section>
      </div>

      {/* About Cinematic Section */}
      <div id="about-wrapper" style={{ position: 'relative', zIndex: 2 }}>
        <AboutScene />
      </div>

    </div>
  );
}

export default App;
