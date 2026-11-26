import React from 'react';
import './ProjectsSection.css';
import projectAiVision from '../assets/project_ai_vision.png';
import projectEascca from '../assets/project_eascca.png';
import projectMobile from '../assets/project_mobile.png';
import projectsCenterMan from '../assets/projects_center_man.png';

const PROJECTS = [
  {
    id: 'ai-study',
    title: 'AI Study Assistant',
    subtitle: 'Smart Learning Companion',
    img: projectAiVision,
    kind: 'image',
  },
  {
    id: 'secure-vault',
    title: 'SecureVault',
    subtitle: 'Password Manager with Encryption',
    kind: 'vault',
  },
  {
    id: 'quarry-analytics',
    title: 'Quarry Analytics',
    subtitle: 'Drone-Based Analysis',
    img: projectEascca,
    kind: 'image',
  },
  {
    id: 'hotel-360',
    title: 'Hotel360',
    subtitle: 'Virtual Tour & Booking System',
    img: projectMobile,
    kind: 'image',
  },
];

function ProjectsSection({ opacity, glitchIntensity, loopProgress = 0, onJumpToProject }) {
  const count = PROJECTS.length;
  const activeFloat = Math.max(0, Math.min(count - 1, loopProgress * (count - 1)));
  const activeIndex = Math.round(activeFloat);

  const jitter =
    glitchIntensity > 0.05 ? Math.sin(glitchIntensity * 18) * glitchIntensity * 6 : 0;

  return (
    <div
      id="projects"
      className="projects-reveal-layer"
      style={{
        opacity,
        pointerEvents: opacity > 0.35 ? 'auto' : 'none',
        transform: `translate3d(${jitter.toFixed(1)}px, 0, 0)`,
        filter:
          glitchIntensity > 0.05
            ? `brightness(${(1 + glitchIntensity * 0.28).toFixed(2)}) drop-shadow(${(jitter * 0.8).toFixed(1)}px 0 0 rgba(57, 255, 20, 0.45))`
            : undefined,
      }}
      aria-hidden={opacity <= 0.01}
    >
      {/* Atmospheric Cyber Backdrop: Digital Globe + City Glow */}
      <div className="projects-backdrop" aria-hidden="true">
        <svg className="projects-globe-svg" viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="170" stroke="rgba(57, 255, 20, 0.35)" strokeWidth="1.2" />
          <ellipse cx="200" cy="200" rx="170" ry="62" stroke="rgba(57, 255, 20, 0.28)" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="170" ry="120" stroke="rgba(57, 255, 20, 0.22)" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="68" ry="170" stroke="rgba(57, 255, 20, 0.28)" strokeWidth="1" />
          <ellipse cx="200" cy="200" rx="125" ry="170" stroke="rgba(57, 255, 20, 0.22)" strokeWidth="1" />
          <line x1="30" y1="200" x2="370" y2="200" stroke="rgba(57, 255, 20, 0.3)" strokeWidth="1" />
          <line x1="200" y1="30" x2="200" y2="370" stroke="rgba(57, 255, 20, 0.3)" strokeWidth="1" />
        </svg>
        <div className="projects-backdrop-vignette" />
      </div>

      {/* Top-Left Header */}
      <div className="projects-top-header">
        <span className="projects-eyebrow">// MY WORKS</span>
        <h2 className="projects-hero-title">
          <span className="projects-title-white">Innovative</span>
          <span className="projects-title-green">Projects</span>
        </h2>
        <p className="projects-hero-desc">
          A collection of projects that showcase my
          <br />
          skills, creativity and passion for technology.
        </p>

        <button
          type="button"
          className="projects-explore-btn"
          onClick={() => onJumpToProject?.((activeIndex + 1) % count)}
        >
          <span className="projects-explore-circle">
            <svg viewBox="0 0 24 24" fill="currentColor" width="11" height="11" aria-hidden="true">
              <polygon points="7 4 20 12 7 20 7 4" />
            </svg>
          </span>
          <span>Explore My Work</span>
        </button>
      </div>

      {/* 3D Orbital Loop Stage */}
      <div className="projects-orbit-stage">
        <div className="projects-orbit-ring" aria-hidden="true" />
        <div className="projects-center-man-wrap" aria-hidden="true">
          <img
            src={projectsCenterMan}
            alt=""
            className="projects-center-man"
          />
        </div>

        {PROJECTS.map((project, idx) => {
          const raw = idx - activeFloat;
          const rel = ((((raw % count) + count + count / 2) % count) - count / 2);
          const theta = rel * (Math.PI / 2);

          const xFactor = Math.sin(theta);
          const depth = (Math.cos(theta) + 1) / 2; // 1 = front center, 0 = back
          const yOffset = (1 - Math.cos(theta)) * -48;
          const scale = 0.68 + 0.36 * depth;
          const cardOpacity = 0.42 + 0.58 * depth;
          const zIndex = Math.round(10 + Math.cos(theta) * 10);
          const isFocused = Math.abs(rel) < 0.42;

          return (
            <button
              key={project.id}
              type="button"
              onClick={() => onJumpToProject?.(idx)}
              className={`orbit-project-card ${isFocused ? 'orbit-project-card--active' : ''}`}
              style={{
                zIndex,
                opacity: cardOpacity,
                transform: `translate(-50%, -50%) translate3d(calc(${xFactor.toFixed(3)} * min(29vw, 370px)), ${yOffset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
              }}
            >
              <div className="orbit-card-media">
                {project.kind === 'vault' ? (
                  <div className="orbit-vault-visual" aria-hidden="true">
                    <div className="orbit-vault-grid" />
                    <svg viewBox="0 0 64 64" fill="none" className="orbit-vault-shield">
                      <path
                        d="M32 6L10 15v16c0 14.5 9.4 25.4 22 29 12.6-3.6 22-14.5 22-29V15L32 6z"
                        stroke="#39ff14"
                        strokeWidth="2.4"
                        fill="rgba(57, 255, 20, 0.1)"
                      />
                      <rect x="24" y="29" width="16" height="13" rx="2.5" fill="#39ff14" />
                      <path d="M27 29v-4a5 5 0 0 1 10 0v4" stroke="#39ff14" strokeWidth="2.4" />
                    </svg>
                  </div>
                ) : (
                  <img src={project.img} alt={project.title} className="orbit-card-img" />
                )}
              </div>

              <div className="orbit-card-footer">
                <div className="orbit-card-text">
                  <h3 className="orbit-card-title">{project.title}</h3>
                  <p className="orbit-card-sub">{project.subtitle}</p>
                </div>
                <span className="orbit-card-arrow" aria-hidden="true">&#8599;</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Stats & Brand Footer */}
      <div className="projects-bottom-bar">
        <div className="projects-stats-group">
          <div className="projects-stat-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="20" height="20" aria-hidden="true">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
              <line x1="14" y1="4" x2="10" y2="20" />
            </svg>
            <div>
              <strong>10+</strong>
              <span>Projects Completed</span>
            </div>
          </div>

          <div className="projects-stat-divider" />

          <div className="projects-stat-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="20" height="20" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div>
              <strong>15+</strong>
              <span>Technologies Explored</span>
            </div>
          </div>

          <div className="projects-stat-divider" />

          <div className="projects-stat-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" width="20" height="20" aria-hidden="true">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
              <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            </svg>
            <div>
              <strong>&infin;</strong>
              <span>Ideas in Progress</span>
            </div>
          </div>
        </div>

        <div className="projects-brand-badge">
          <span className="projects-brand-z">Z</span>
          <div className="projects-brand-words">
            <span>ZYPHION</span>
            <small>NETWORK</small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectsSection;
