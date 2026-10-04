import React, { useEffect, useRef } from 'react';
import FullHeight3DCanvas from './FullHeight3DCanvas';

export default function FullHeightScrollWrapper({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return;

    // Target major headings, cards, and sections inside your website
    const targetElements = containerRef.current.querySelectorAll(
      'h1, h2, h3, .glass-card, .card'
    );

    // If device doesn't support IntersectionObserver or is in reduced motion, skip
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.transform = 'translate3d(0, 0, 0) scale(1)';
            el.style.opacity = '1';
          } else {
            const isAbove = entry.boundingClientRect.top < 0;
            // Subtle spring offset without clipping text
            el.style.transform = isAbove
              ? 'translate3d(0, -12px, 0) scale(0.99)'
              : 'translate3d(0, 20px, 0) scale(0.98)';
            el.style.opacity = '0.75';
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    targetElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out';
      htmlEl.style.willChange = 'transform, opacity';
      observer.observe(htmlEl);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#030712] text-slate-100 overflow-x-hidden">
      {/* 1. Full-Height 3D Engine (Fixed background, zero click obstruction) */}
      <FullHeight3DCanvas />

      {/* 2. Webpage content (100% functional, touch-friendly, forms & buttons intact) */}
      <div ref={containerRef} className="relative z-10 w-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
