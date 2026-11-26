import React, { useEffect, useRef, useState } from 'react';
import './AboutScene.css';
import devSeated from '../assets/dev_seated_transparent.png';
import neonSign from '../assets/neon_sign.png';
import postThumb1 from '../assets/post_thumb1.png';
import postThumb2 from '../assets/post_thumb2.png';
import postThumb3 from '../assets/post_thumb3.png';
import projectAiVision from '../assets/project_ai_vision.png';
import projectEascca from '../assets/project_eascca.png';
import projectMobile from '../assets/project_mobile.png';
import avatarProfile from '../assets/avatar_profile.png';
import floatHeart1 from '../assets/float_heart1_trans.png';
import floatIg from '../assets/float_ig_trans.png';

/* ─── Story Highlights ─── */
const HIGHLIGHTS = [
  {
    id: 'projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Services',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /><line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    id: 'results',
    label: 'Results',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <rect x="3" y="12" width="4" height="9" /><rect x="10" y="8" width="4" height="13" /><rect x="17" y="4" width="4" height="17" />
      </svg>
    ),
  },
  {
    id: 'stack',
    label: 'Stack',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
        <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
        <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="15" x2="23" y2="15" />
        <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="15" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    id: 'reviews',
    label: 'Reviews',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

/* ─── 6 Post Grid Thumbnails ─── */
const THUMBNAILS = [
  {
    id: 'thumb1',
    img: postThumb1,
    alt: 'From Ideas to Powerful Solutions',
    type: 'carousel',
    likes: '248',
    comments: '18',
  },
  {
    id: 'thumb2',
    img: postThumb2,
    alt: 'Smart Systems Better Business',
    type: 'reel',
    likes: '512',
    comments: '34',
  },
  {
    id: 'thumb3',
    img: postThumb3,
    alt: 'Automate Scale Succeed',
    type: 'carousel',
    likes: '389',
    comments: '27',
  },
  {
    id: 'thumb4',
    img: projectAiVision,
    alt: 'AI Vision & Automation Engine',
    type: 'reel',
    likes: '420',
    comments: '31',
  },
  {
    id: 'thumb5',
    img: projectEascca,
    alt: 'Enterprise Cloud System & SaaS',
    type: 'carousel',
    likes: '315',
    comments: '22',
  },
  {
    id: 'thumb6',
    img: projectMobile,
    alt: 'Cross-Platform Mobile App Suite',
    type: 'reel',
    likes: '640',
    comments: '49',
  },
];

export default function AboutScene() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let animId;
    const check = () => {
      if (!sectionRef.current) { animId = requestAnimationFrame(check); return; }
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        setVisible(true);
        return;
      }
      animId = requestAnimationFrame(check);
    };
    animId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className={`about-scene ${visible ? 'about-visible' : ''}`}
    >
      {/* ── Atmospheric background ── */}
      <div className="about-bg-atmosphere">
        <div className="atm-glow atm-glow-1" />
        <div className="atm-glow atm-glow-2" />
        <div className="atm-glow atm-glow-3" />
        <div className="about-wood-floor" />
      </div>

      {/* ── Main composition ── */}
      <div className="about-composition">

        {/* ═══════════════════════════════
            Instagram Panel (left/background)
            — wrapped in a perspective stage
        ═══════════════════════════════ */}
        <div className="ig-panel-stage">
          <div className="ig-panel">
            {/* Glass reflection highlight */}
            <div className="ig-panel-gloss" />
            {/* Physical edge thickness strip (right side) */}
            <div className="ig-panel-edge" />

            {/* Top Nav */}
            <div className="ig-topbar">
              <div className="ig-topbar-left">
                <span className="ig-username">kavisheak</span>
                <svg viewBox="0 0 24 24" width="13" height="13" className="ig-verified">
                  <circle cx="12" cy="12" r="10" fill="#3897f0" />
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" className="ig-caret">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              <div className="ig-topbar-icons">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19" aria-label="Create post">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19" aria-label="Activity">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19" aria-label="Menu">
                  <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
            </div>

            <div className="ig-divider" />

            {/* Profile row */}
            <div className="ig-profile-row">
              <div className="ig-avatar-area">
                <div className="ig-story-ring">
                  <div className="ig-avatar">
                    <img src={avatarProfile} alt="Kavisheak" className="ig-avatar-img" />
                  </div>
                </div>
                <div className="ig-plus-badge">+</div>
              </div>
              <div className="ig-stats-row">
                <div className="ig-stat-item">
                  <span className="ig-stat-number">18</span>
                  <span className="ig-stat-text">Posts</span>
                </div>
                <div className="ig-stat-item">
                  <span className="ig-stat-number">2.4K</span>
                  <span className="ig-stat-text">Followers</span>
                </div>
                <div className="ig-stat-item">
                  <span className="ig-stat-number">420</span>
                  <span className="ig-stat-text">Following</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="ig-bio-section">
              <div className="ig-bio-name-row">
                <span className="ig-bio-name">Kavisheak</span>
                <svg viewBox="0 0 24 24" width="14" height="14" className="ig-verified">
                  <circle cx="12" cy="12" r="10" fill="#3897f0" />
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="ig-bio-category">Software Developer &amp; System Architect</p>
              <div className="ig-bio-lines">
                <p>🚀 Full-Stack Developer | React &amp; Laravel &amp; Node</p>
                <p>💻 High-Performance Web Apps &amp; SaaS Solutions</p>
                <p>📊 Helping businesses automate &amp; scale with tech</p>
                <p>✉️ DM &quot;BUILD&quot; or click Contact for projects</p>
              </div>
              <a href="#" className="ig-bio-url">🔗 kavisheak.dev</a>
            </div>

            {/* Professional Dashboard */}
            <div className="ig-pro-dashboard">
              <div className="ig-pro-left">
                <span className="ig-pro-title">Professional dashboard</span>
                <span className="ig-pro-stat">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" width="12" height="12">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  </svg>
                  1.2K accounts reached in the last 30 days.
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="ig-action-row">
              <button className="ig-btn">Edit profile</button>
              <button className="ig-btn">Share profile</button>
              <button className="ig-btn ig-btn-contact">Contact</button>
              <button className="ig-btn ig-btn-dropdown" aria-label="More actions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="13" height="13">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            </div>

            {/* Highlights */}
            <div className="ig-highlights-row">
              {HIGHLIGHTS.map((h) => (
                <div key={h.id} className="ig-hl-item">
                  <div className="ig-hl-circle">{h.icon}</div>
                  <span className="ig-hl-label">{h.label}</span>
                </div>
              ))}
            </div>

            {/* Content tabs */}
            <div className="ig-tabs-row">
              <button className="ig-tab active" aria-label="Grid">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button className="ig-tab" aria-label="Reels">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
              <button className="ig-tab" aria-label="Tagged">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            </div>

            {/* Post thumbnails (6 items, 2 rows of 3) */}
            <div className="ig-posts-grid">
              {THUMBNAILS.map((t) => (
                <div key={t.id} className="ig-post-thumb">
                  <img src={t.img} alt={t.alt} className="ig-post-img" />
                  {/* Badge for Reel or Carousel */}
                  <div className="ig-post-type-badge">
                    {t.type === 'reel' ? (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                        <polygon points="6 4 20 12 6 20 6 4" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
                        <rect x="7" y="3" width="14" height="14" rx="2" />
                        <path d="M3 7v12a2 2 0 0 0 2 2h12" />
                      </svg>
                    )}
                  </div>
                  {/* Hover overlay showing likes & comments */}
                  <div className="ig-post-hover-overlay">
                    <span className="ig-post-stat">
                      <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {t.likes}
                    </span>
                    <span className="ig-post-stat">
                      <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {t.comments}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="ig-bottom-nav">
              <button className="ig-nav-item active" aria-label="Home">
                <svg viewBox="0 0 24 24" fill="currentColor" width="19" height="19">
                  <path d="M12 2.1L1 12h3v9h6v-6h4v6h6v-9h3L12 2.1z"/>
                </svg>
              </button>
              <button className="ig-nav-item" aria-label="Search">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="19" height="19">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
              <button className="ig-nav-item" aria-label="Create">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="19" height="19">
                  <rect x="3" y="3" width="18" height="18" rx="5"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </button>
              <button className="ig-nav-item" aria-label="Reels">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="19" height="19">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </button>
              <button className="ig-nav-item ig-nav-profile active-profile" aria-label="Profile">
                <div className="ig-nav-avatar">
                  <img src={avatarProfile} alt="Profile" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════
            Floating notification badges
        ═══════════════════════════════ */}
        {/* Heart badge – top right area */}
        <div className="float-badge float-heart-1">
          <img src={floatHeart1} alt="Like notification" className="float-badge-img" />
        </div>

        {/* Instagram floating icon */}
        <div className="float-badge float-ig-icon">
          <img src={floatIg} alt="Instagram 3D" className="float-badge-img" />
        </div>

        {/* Small heart badge – left side */}
        <div className="float-badge float-heart-2">
          <svg viewBox="0 0 24 24" fill="white" width="14" height="14">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </div>

        {/* ═══════════════════════════════
            Neon sign (behind character)
        ═══════════════════════════════ */}
        <div className="neon-sign-area">
          <img src={neonSign} alt="Kavisheak neon sign" className="neon-sign-img" />
        </div>

        {/* ═══════════════════════════════
            3D Developer character (overlapping panel)
        ═══════════════════════════════ */}
        <div className="dev-character-area">
          <img src={devSeated} alt="Kavisheak — software engineer" className="dev-character-img" />
        </div>

      </div>
    </section>
  );
}
