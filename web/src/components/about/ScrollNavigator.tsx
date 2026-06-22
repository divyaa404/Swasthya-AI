// src/components/about/ScrollNavigator.tsx
import React, { useState, useEffect } from 'react';

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'about-hero', label: 'Hero Section' },
  { id: 'bodymap-section', label: '3D Body Model' },
  { id: 'patient-graph-section', label: 'Patient Graph' },
  { id: 'family-graph-section', label: 'Family Warning' },
  { id: 'modules-section', label: 'Clinical Modules' },
  { id: 'agents-section', label: '11-Agent Mesh' },
  { id: 'techstack-section', label: 'Tech Stack' },
  { id: 'faq-section', label: 'FAQs' }
];

export const ScrollNavigator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('about-hero');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const docEl = document.documentElement;
      const body = document.body;
      
      const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0;
      const scrollHeight = docEl.scrollHeight || body.scrollHeight || 0;
      const clientHeight = window.innerHeight || docEl.clientHeight || 0;
      
      const totalHeight = scrollHeight - clientHeight;
      if (totalHeight > 0) {
        setScrollProgress(scrollTop / totalHeight);
      } else {
        setScrollProgress(0);
      }

      // Check which section is in viewport
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the top of the section is in the top 45% of the screen
          if (rect.top <= window.innerHeight * 0.45) {
            currentSection = section.id;
          }
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    
    // Run once on mount and also set a slight delay to ensure layout is complete
    handleScroll();
    const timeoutId = setTimeout(handleScroll, 200);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        right: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        zIndex: 100,
        pointerEvents: 'none'
      }}
      className="scroll-navigator-fixed"
    >
      {/* Scroll timeline connecting line */}
      <div 
        style={{
          position: 'absolute',
          top: '12px',
          bottom: '12px',
          right: '4px',
          width: '2px',
          backgroundColor: 'var(--border)',
          zIndex: 0
        }}
      >
        {/* Filled blue color line */}
        <div 
          style={{
            width: '100%',
            height: `${scrollProgress * 100}%`,
            backgroundColor: '#0066FF',
            boxShadow: '0 0 8px #0066FF',
            transition: 'height 0.1s ease-out'
          }}
        />
      </div>

      {/* Nodes / Dots */}
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '320px',
          position: 'relative',
          zIndex: 1,
          pointerEvents: 'auto'
        }}
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          // Node is reached/filled if it's the active one or before it in the list
          const sectionIndex = SECTIONS.findIndex(s => s.id === activeSection);
          const isFilled = idx <= sectionIndex;

          return (
            <div 
              key={sec.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                position: 'relative',
                cursor: 'pointer',
                width: '180px' // hover area width
              }}
              onClick={() => handleScrollTo(sec.id)}
              className="scroll-nav-node-wrapper"
            >
              {/* Tooltip Label */}
              <span 
                className="scroll-nav-label"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  marginRight: '12px',
                  backgroundColor: isActive ? '#0066FF' : 'var(--surface)',
                  border: isActive ? '1px solid #0066FF' : '1px solid var(--border)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateX(0)' : 'translateX(8px)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: 'none',
                  boxShadow: isActive ? '0 4px 12px rgba(0, 102, 255, 0.25)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {sec.label}
              </span>

              {/* Node Dot Circle */}
              <div 
                style={{
                  width: isActive ? '14px' : '10px',
                  height: isActive ? '14px' : '10px',
                  borderRadius: '50%',
                  backgroundColor: isFilled ? '#0066FF' : 'var(--surface)',
                  border: isFilled ? '2px solid #0066FF' : '2px solid var(--border)',
                  boxShadow: isActive ? '0 0 10px #0066FF' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  marginRight: isActive ? '-2px' : '0px',
                  flexShrink: 0
                }}
              />
            </div>
          );
        })}
      </div>

      <style>{`
        .scroll-nav-node-wrapper:hover .scroll-nav-label {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        @media (max-width: 1024px) {
          .scroll-navigator-fixed {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ScrollNavigator;
