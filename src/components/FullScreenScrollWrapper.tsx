import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FullPage3DCanvas from './FullPage3DCanvas';

gsap.registerPlugin(ScrollTrigger);

export default function FullScreenScrollWrapper({ children }: { children: React.ReactNode }) {
  const contentContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!contentContainerRef.current) return;

    const ctx = gsap.context(() => {
      // Find all existing headings, paragraphs, and cards inside your page
      const textElements = contentContainerRef.current!.querySelectorAll(
        'h1, h2, h3, p, button, .card, form, input, select'
      );

      textElements.forEach((el) => {
        // Dynamic jumping physics on scroll down & up
        gsap.fromTo(
          el,
          {
            y: 40,
            opacity: 0.7,
            rotateX: 12,
            transformPerspective: 800,
          },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'top 20%',
              toggleActions: 'play reverse play reverse', // Reverses when scrolling back up
            },
          }
        );
      });
    }, contentContainerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div id="full-page-scroll-root" className="relative w-full min-h-screen text-slate-100 overflow-x-hidden">
      {/* 1. Full-Page Fixed 3D Canvas (Zero clicks blocked) */}
      <FullPage3DCanvas />

      {/* 2. Your Existing Webpage (All existing text jumps dynamically, forms & buttons 100% clickable) */}
      <div ref={contentContainerRef} className="relative z-10 w-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}
