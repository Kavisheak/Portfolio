import React, { useEffect, useRef } from 'react';

const TOTAL_FRAMES = 144;

const getFrameSrc = (index) => {
  const num = String(index + 1).padStart(4, '0');
  return `${import.meta.env.BASE_URL}frames/drive/frame_${num}.webp`;
};

/**
 * Returns the horizontal subject center (0..1) for a given frame index
 * so the man (early frames) and BMW headlights (frames 65..79) stay centered on mobile.
 */
function getSubjectFocusX(idx) {
  if (idx <= 40) return 0.495;
  if (idx <= 64) {
    const t = (idx - 40) / (64 - 40);
    return 0.495 + t * (0.55 - 0.495);
  }
  if (idx <= 79) return 0.55;
  const t = Math.min(1, (idx - 79) / (TOTAL_FRAMES - 1 - 79));
  return 0.55 - t * (0.55 - 0.5);
}

/**
 * Draws an image onto a canvas, using full-bleed cover on desktop
 * and subject-centered cinema framing on portrait mobile screens.
 */
function drawImageCover(ctx, img, width, height, frameIdx) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = width / height;
  let drawW, drawH, offsetX, offsetY;

  if (canvasRatio > imgRatio) {
    drawW = width;
    drawH = width / imgRatio;
    offsetX = 0;
    offsetY = (height - drawH) * 0.5;
  } else if (canvasRatio < 0.85) {
    // Portrait mobile: fit 66% of viewport height so the man & car aren't over-cropped,
    // and center directly on the subject's horizontal position.
    drawH = Math.max(height * 0.66, width / imgRatio);
    drawW = drawH * imgRatio;
    const focusX = getSubjectFocusX(frameIdx);
    const rawX = width * 0.5 - drawW * focusX;
    offsetX = Math.max(width - drawW, Math.min(0, rawX));
    offsetY = (height - drawH) * 0.48;
  } else {
    drawH = height;
    drawW = height * imgRatio;
    offsetX = (width - drawW) * 0.5;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

/**
 * Scroll-scrubbed canvas rendering the 144 extracted WebP frames
 * of the driving intro sequence.
 */
function DriveScrollCanvas({ frameIndex, opacity, glitchIntensity, motionScale = 1 }) {
  const canvasRef = useRef(null);
  const imagesRef = useRef(new Array(TOTAL_FRAMES).fill(null));
  const lastDrawnRef = useRef(-1);
  const targetIndexRef = useRef(frameIndex);
  targetIndexRef.current = frameIndex;

  const drawFrame = (idx) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Pick requested frame if loaded, otherwise nearest loaded frame
    let img = imagesRef.current[idx];
    if (!img || !img.complete || !img.naturalWidth) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = imagesRef.current[idx - offset];
        if (prev && prev.complete && prev.naturalWidth) {
          img = prev;
          break;
        }
        const next = imagesRef.current[idx + offset];
        if (next && next.complete && next.naturalWidth) {
          img = next;
          break;
        }
      }
    }

    if (img && img.complete && img.naturalWidth) {
      drawImageCover(ctx, img, canvas.width, canvas.height, idx);
      lastDrawnRef.current = idx;
    }
  };

  // Preload frame 0 immediately, then coarse pass, then remaining frames
  useEffect(() => {
    let cancelled = false;

    const loadFrame = (i) => {
      if (imagesRef.current[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        if (cancelled) return;
        if (typeof img.decode === 'function') {
          img.decode().catch(() => {});
        }
        if (i === targetIndexRef.current || lastDrawnRef.current === -1) {
          drawFrame(targetIndexRef.current);
        }
      };
      img.src = getFrameSrc(i);
      imagesRef.current[i] = img;
    };

    // 1. Frame 0 & final frames immediately
    loadFrame(0);
    loadFrame(TOTAL_FRAMES - 1);

    // 2. Coarse stride every 4th frame for instant scrubbing
    for (let i = 0; i < TOTAL_FRAMES; i += 4) {
      loadFrame(i);
    }

    // 3. Remaining frames
    const timer = window.setTimeout(() => {
      if (cancelled) return;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        loadFrame(i);
      }
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  // Resize canvas cleanly to match its container (100dvh on mobile) * DPR
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      const cssW = parent?.clientWidth || window.innerWidth;
      const cssH = parent?.clientHeight || window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(cssW * dpr));
      const h = Math.max(1, Math.floor(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        lastDrawnRef.current = -1;
        drawFrame(targetIndexRef.current);
      }
    };

    handleResize();
    let ro;
    if (typeof ResizeObserver !== 'undefined' && canvas.parentElement) {
      ro = new ResizeObserver(handleResize);
      ro.observe(canvas.parentElement);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Redraw when frameIndex updates
  useEffect(() => {
    if (frameIndex !== lastDrawnRef.current) {
      drawFrame(frameIndex);
    }
  }, [frameIndex]);

  const glitchShift = glitchIntensity > 0.05 ? Math.sin(frameIndex * 1.9) * glitchIntensity * 10 : 0;
  const transformParts = [];
  if (motionScale !== 1) transformParts.push(`scale(${motionScale.toFixed(4)})`);
  if (glitchShift) transformParts.push(`translateX(${glitchShift.toFixed(1)}px)`);

  return (
    <div
      className="drive-canvas-layer"
      style={{
        opacity,
        transform: transformParts.length ? transformParts.join(' ') : undefined,
        filter:
          glitchIntensity > 0.05
            ? `brightness(${(1 + glitchIntensity * 0.35).toFixed(2)}) contrast(${(1 + glitchIntensity * 0.2).toFixed(2)})`
            : undefined,
      }}
      aria-hidden={opacity <= 0.01}
    >
      <canvas ref={canvasRef} className="drive-scroll-canvas" />
      <div
        className="drive-glitch-scanlines"
        style={{ opacity: Math.min(0.85, glitchIntensity * 0.95) }}
      />
    </div>
  );
}

export default DriveScrollCanvas;

