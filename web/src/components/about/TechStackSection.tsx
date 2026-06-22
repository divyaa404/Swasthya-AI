// src/components/about/TechStackSection.tsx
import React from 'react';
import { Layout, Server, BrainCircuit, Cpu } from 'lucide-react';
import Card from '../ui/Card';

interface TechItem {
  name: string;
  role: string;
  details: string;
}

interface TechCategory {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  items: TechItem[];
}

const TECH_CATEGORIES: TechCategory[] = [
  {
    title: '1. Frontend & Mobile Clients',
    description: 'Interactive UI layers engineered for high usability, speed, and real-time medical visualization.',
    icon: <Layout size={20} />,
    color: '#0474FC',
    items: [
      { name: 'React + Vite', role: 'Doctor Console', details: 'Powers the high-frequency physician panel and graph portal.' },
      { name: 'React Native + Expo', role: 'Patient App', details: 'Enables quick client-side voice reporting and reminders.' },
      { name: 'Three.js / Fiber', role: '3D Heatmaps', details: 'Renders localized anatomical symptom markers on the body.' }
    ]
  },
  {
    title: '2. Backend & Graph Database',
    description: 'High-performance API gateways and interconnected clinical data storage structures.',
    icon: <Server size={20} />,
    color: '#8B5CF6',
    items: [
      { name: 'FastAPI', role: 'Asynchronous APIs', details: 'Python-based endpoints routing multi-agent pipeline tasks.' },
      { name: 'Neo4j AuraDB', role: 'Health Memory', details: 'Stores patient symptoms, vitals, habits, and genetic trees.' },
      { name: 'Supabase (Postgres)', role: 'Core storage', details: 'Handles relational tables, auth security, and scan records.' }
    ]
  },
  {
    title: '3. Machine Learning Predictor',
    description: 'Dedicated symptom-risk estimation model providing auditable, repeatable clinical scores.',
    icon: <BrainCircuit size={20} />,
    color: '#10B981',
    items: [
      { name: 'Random Forest', role: 'Risk Classifier', details: 'Trained on type, duration, severity, and family flags.' },
      { name: 'scikit-learn', role: 'Model Engine', details: 'Chosen for explaining non-linear features without overfitting.' },
      { name: 'Feature Importance', role: 'Explainable AI', details: 'Outputs top driving factors to the Explanation Agent.' }
    ]
  },
  {
    title: '4. AI Agents & Orchestration',
    description: 'A mesh of 11 cooperative agents managing task isolation and natural interface rendering.',
    icon: <Cpu size={20} />,
    color: '#EC4899',
    items: [
      { name: 'Groq + LLaMA-3', role: 'Core Reasoning', details: 'Super-fast inference engine for onboarding and doctor Q&A.' },
      { name: 'Sarvam AI Speech', role: 'Local Languages', details: 'Translates natural audio check-ins in Hindi and Marathi.' },
      { name: 'Render Workflows', role: 'Orchestrator', details: 'Manages asynchronous agent pipelines and background routing.' }
    ]
  }
];

export const TechStackSection: React.FC = () => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px 24px', boxSizing: 'border-box', width: '100%' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0', textAlign: 'center' }}>
        Swasthya AI Platform Tech Stack
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
        Our architecture combines traditional machine learning classifiers with modern graph databases and natural speech pipelines.
      </p>

      {/* Grid containing exactly 4 items placed in 1 row */}
      <div 
        className="tech-stack-row"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {TECH_CATEGORIES.map((category, idx) => (
          <Card 
            key={idx} 
            hoverable
            style={{ 
              padding: '24px', 
              backgroundColor: 'var(--surface)', 
              border: `1.5px solid var(--border)`,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: '100%',
              borderRadius: '16px',
              position: 'relative'
            }}
          >
            {/* Header Icon Block */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  backgroundColor: `${category.color}15`, 
                  color: category.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {category.icon}
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-primary)', margin: 0, lineHeight: 1.2 }}>
                {category.title}
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
              {category.description}
            </p>

            <div style={{ borderBottom: '1px solid var(--border)', width: '100%' }} />

            {/* List of Technologies */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {category.items.map((tech, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {tech.name}
                    </span>
                    <span 
                      style={{ 
                        fontSize: '8px', 
                        fontWeight: 800, 
                        color: category.color, 
                        backgroundColor: `${category.color}10`, 
                        padding: '1px 5px', 
                        borderRadius: '3px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.2px'
                      }}
                    >
                      {tech.role}
                    </span>
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.3 }}>
                    {tech.details}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <style>{`
        /* Responsive scroll view for mobile screen layouts to maintain 1 row constraints */
        @media (max-width: 1024px) {
          .tech-stack-row {
            grid-template-columns: repeat(4, 280px) !important;
            overflow-x: auto !important;
            padding-bottom: 16px !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .tech-stack-row > div {
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </div>
  );
};

export default TechStackSection;
