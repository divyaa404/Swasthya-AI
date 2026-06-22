// src/components/about/AgentShowcase.tsx
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Terminal, Activity } from 'lucide-react';
import Card from '../ui/Card';

interface AgentItem {
  num: string;
  name: string;
  role: string;
}

const AGENTS: AgentItem[] = [
  { num: "01", name: "Onboarding Agent", role: "Extracts chronic conditions, allergies, and family history, writing the initial nodes." },
  { num: "02", name: "Check-In Agent", role: "Constructs 2–3 adaptive daily questions from patient graph histories, logging outcomes." },
  { num: "03", name: "Sarvam Chat Agent", role: "Voice layer providing Marathi, Hindi, and English STT/TTS speech processing." },
  { num: "04", name: "Escalation Agent", role: "Triggers emergency checks on critical danger combinations using deterministic thresholds." },
  { num: "05", name: "Family Genetics Agent", role: "Traverses family branches using Cypher to identify inherited risk propagation paths." },
  { num: "06", name: "Medical Scan Agent", role: "Verifies medical documents and income certificates for government insurance eligibility." },
  { num: "07", name: "Medicine Reminder Agent", role: "Schedules dose alerts and checks drug-drug conflict warnings using OpenFDA." },
  { num: "08", name: "Smartwatch Risk Agent", role: "Ingests heart rate, SpO2, and BP anomalies from wearables directly into graphs." },
  { num: "09", name: "Doctor Q&A Agent", role: "Answers doctor queries grounded in Neo4j logs, or queues patient prompts." },
  { num: "10", name: "Appointment Automation Agent", role: "Coordinates schedule matches, auto-assigning physicians based on logs." },
  { num: "11", name: "Daily Workflow Orchestrator", role: "Orchestrates multi-stage background pipelines with event retry support." }
];

interface SimStep {
  agentNum: string;
  log: string;
}

interface Simulation {
  id: string;
  name: string;
  icon: string;
  steps: SimStep[];
}

const SIMULATIONS: Simulation[] = [
  {
    id: 'onboarding',
    name: '1. Onboarding Flow',
    icon: '👤',
    steps: [
      { agentNum: '11', log: '[Orchestrator] Initiating onboarding flow webhook event.' },
      { agentNum: '03', log: '[Sarvam Chat] Hindi voice input captured: "मेरा नाम इन्द्रेश है, 20 वर्ष का हूँ..."' },
      { agentNum: '03', log: '[Sarvam Chat] Transcribed payload: "Name: Indresh, Age: 20, Gender: Male."' },
      { agentNum: '01', log: '[Onboarding Agent] Analyzing conversation. Extracted Patient profile details.' },
      { agentNum: '11', log: '[Orchestrator] Executing Cypher merge: MERGE (u:User {name: "Indresh", age: 20})' },
      { agentNum: '11', log: '[Success] Onboarding complete! Initial graph nodes saved.' }
    ]
  },
  {
    id: 'checkin',
    name: '2. Check-In Assessment',
    icon: '📋',
    steps: [
      { agentNum: '11', log: '[Orchestrator] Starting scheduled daily check-in sequence.' },
      { agentNum: '08', log: '[Smartwatch Agent] Ingesting wearable logs: SpO2=95%, HeartRate=72bpm.' },
      { agentNum: '02', log: '[Check-In Agent] Running graph traversal... Found active family risk: Monish is positive.' },
      { agentNum: '02', log: '[Check-In Agent] Generated adaptive question: "Monish has COVID. Do you have dry cough or fever?"' },
      { agentNum: '11', log: '[Success] Patient check-in response successfully logged to graph.' }
    ]
  },
  {
    id: 'escalation',
    name: '3. Risk Scan & Escalation',
    icon: '🚨',
    steps: [
      { agentNum: '11', log: '[Orchestrator] Scan event triggered: Active symptoms updated.' },
      { agentNum: '05', log: '[Family Genetics Agent] Querying family history: MATCH (u)-[:RELATED_TO]->(f)-[:HAS_DISEASE]->(d)' },
      { agentNum: '05', log: '[Family Genetics Agent] Found exposure vector: Child Monish has active COVID-19.' },
      { agentNum: '04', log: '[Escalation Agent] Match rule check: Fever + Cough + SpO2 (95%) + Exposure = High COVID-19 Risk.' },
      { agentNum: '11', log: '[Success] Patient profile flagged as Elevated Risk. Pulsing dashboard alert.' }
    ]
  },
  {
    id: 'appointment',
    name: '4. Pulmonology Scheduler',
    icon: '🗓️',
    steps: [
      { agentNum: '11', log: '[Orchestrator] Referral received from Escalation Agent.' },
      { agentNum: '10', log: '[Appointment Agent] Scanning Pulmonology calendars for Dr. Sharma...' },
      { agentNum: '10', log: '[Appointment Agent] Slot matched: Pulmonologist Dr. Sharma (Tomorrow 10:00 AM).' },
      { agentNum: '11', log: '[Success] Relationship saved: (u)-[:APPOINTED_WITH]->(Doctor Dr. Sharma).' }
    ]
  }
];

export const AgentShowcase: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  
  // Simulator State
  const [activeSim, setActiveSim] = useState<string | null>(null);
  const [activeAgentNum, setActiveAgentNum] = useState<string | null>(null);
  const [streamedLogs, setStreamedLogs] = useState<string[]>([]);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const consoleRef = useRef<HTMLDivElement | null>(null);
  const simTimeoutRef = useRef<any>(null);

  // Auto-scroll logs terminal internally
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [streamedLogs]);

  // Clean up timeouts
  useEffect(() => {
    return () => {
      if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);
    };
  }, []);

  const scrollToAgent = (agentNum: string) => {
    const index = AGENTS.findIndex(a => a.num === agentNum);
    if (index !== -1 && containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const cardWidth = 280;
      const gap = 20;
      const cardLeft = index * (cardWidth + gap);
      const scrollLeft = cardLeft + cardWidth / 2 - containerWidth / 2;
      
      containerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const runSimulation = (simId: string) => {
    const sim = SIMULATIONS.find(s => s.id === simId);
    if (!sim) return;

    if (simTimeoutRef.current) clearTimeout(simTimeoutRef.current);

    setActiveSim(simId);
    setStreamedLogs([]);
    setActiveAgentNum(null);

    let currentStep = 0;

    const executeNextStep = () => {
      if (currentStep < sim.steps.length) {
        const step = sim.steps[currentStep];
        
        setActiveAgentNum(step.agentNum);
        scrollToAgent(step.agentNum);
        setStreamedLogs(prev => [...prev, step.log]);
        
        currentStep++;
        simTimeoutRef.current = setTimeout(executeNextStep, 1600); // 1.6s per agent execution
      } else {
        setActiveAgentNum(null);
        setActiveSim(null);
      }
    };

    executeNextStep();
  };

  return (
    <div className="agent-showcase-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 60px 24px', width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 12px 0', textAlign: 'center' }}>
        The 11-Agent Mesh
      </h2>
      <p style={{ fontSize: '16px', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', maxWidth: '700px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
        Instead of a single brittle chatbot, Swasthya AI coordinates 11 dedicated agents. Scroll horizontally to inspect active agents.
      </p>

      {/* Horizontally scrollable container */}
      <div 
        ref={containerRef}
        className="agent-scroll-container"
        style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          overflowX: 'auto', 
          gap: '20px', 
          padding: '12px 4px 28px 4px',
          scrollBehavior: 'smooth',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {AGENTS.map((a, idx) => {
          const isCurrentActiveAgent = activeAgentNum === a.num;
          const isSelected = selectedAgent === idx;

          return (
            <div 
              key={idx} 
              className="agent-card-wrapper"
              style={{ 
                flex: '0 0 280px',
                boxSizing: 'border-box'
              }}
            >
              <Card
                hoverable
                onClick={() => setSelectedAgent(selectedAgent === idx ? null : idx)}
                style={{
                  padding: '24px',
                  // Highlight card fully in blue background when performing
                  backgroundColor: isCurrentActiveAgent ? '#0066FF' : 'var(--surface)',
                  border: isCurrentActiveAgent 
                    ? '1.5px solid #0066FF' 
                    : (isSelected ? '1.5px solid var(--accent)' : '1px solid var(--border)'),
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  height: '100%',
                  color: isCurrentActiveAgent ? '#FFFFFF' : 'var(--text-primary)',
                  boxShadow: (isSelected || isCurrentActiveAgent) ? '0 10px 25px rgba(0, 102, 255, 0.25)' : 'var(--shadow)',
                  transform: (isSelected || isCurrentActiveAgent) ? 'translateY(-6px)' : 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '24px', 
                    fontWeight: 900, 
                    color: isCurrentActiveAgent ? '#FFFFFF' : 'var(--accent-light)', 
                    backgroundImage: isCurrentActiveAgent ? 'none' : 'linear-gradient(135deg, var(--accent) 0%, transparent 100%)', 
                    WebkitBackgroundClip: isCurrentActiveAgent ? 'unset' : 'text', 
                    WebkitTextFillColor: isCurrentActiveAgent ? '#FFFFFF' : 'transparent' 
                  }}>
                    {a.num}
                  </span>
                  <span 
                    style={{ 
                      fontSize: '9px', 
                      fontWeight: 800, 
                      padding: '2px 8px', 
                      borderRadius: '6px', 
                      backgroundColor: isCurrentActiveAgent ? 'rgba(255, 255, 255, 0.2)' : 'var(--accent-light)', 
                      color: isCurrentActiveAgent ? '#FFFFFF' : 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {isCurrentActiveAgent ? 'Performing' : 'Agentic Node'}
                  </span>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: isCurrentActiveAgent ? '#FFFFFF' : 'var(--text-primary)', margin: 0 }}>
                  {a.name}
                </h3>
                <p style={{ fontSize: '13px', color: isCurrentActiveAgent ? 'rgba(255,255,255,0.85)' : 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {a.role}
                </p>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Simulator Widget */}
      <Card 
        style={{ 
          marginTop: '40px', 
          padding: '28px', 
          backgroundColor: 'var(--surface)', 
          border: '1.5px solid var(--border)', 
          borderRadius: '20px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Orchestrator Sandbox
            </span>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 0 0' }}>
              Live Multi-Agent Workflow Simulator
            </h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Activity size={16} style={{ color: '#10B981', animation: activeSim ? 'ping 1.5s infinite' : 'none' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {activeSim ? 'Streaming Agent Output...' : 'Select a workflow below'}
            </span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px' }} className="simulator-grid">
          {/* Left Column: Workflow triggers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 8px 0' }}>
              Trigger one of the core multi-agent background workflows to see which specialized agents wake up, coordinate tasks, and log data.
            </p>
            
            {SIMULATIONS.map((sim) => {
              const isActive = activeSim === sim.id;
              return (
                <button
                  key={sim.id}
                  type="button"
                  onClick={() => runSimulation(sim.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    border: isActive ? '1.5px solid var(--accent)' : '1.5px solid var(--border)',
                    backgroundColor: isActive ? 'var(--accent-light)' : 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                  className="sim-trigger-btn"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '16px' }}>{sim.icon}</span>
                    <span>{sim.name}</span>
                  </div>
                  <Play size={12} fill="currentColor" style={{ opacity: isActive ? 1 : 0.5 }} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Simulated Agent Logs */}
          <div 
            style={{ 
              backgroundColor: '#0A0A0C', 
              border: '1.5px solid var(--border)', 
              borderRadius: '16px',
              padding: '20px 24px',
              fontFamily: 'Courier New, monospace',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '260px',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            {/* Terminal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #27272a', paddingBottom: '10px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={14} style={{ color: '#38bdf8' }} />
                <span style={{ color: '#e4e4e7', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Render Workflow Logs
                </span>
              </div>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#fbbf24' }} />
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
            </div>

            {/* Logs Body */}
            <div ref={consoleRef} style={{ flex: 1, overflowY: 'auto', maxHeight: '180px', display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '10px' }}>
              <AnimatePresence>
                {streamedLogs.length === 0 ? (
                  <span style={{ color: '#52525b', fontSize: '11px', fontStyle: 'italic' }}>
                    // Click a workflow pipeline to stream active execution logs.
                  </span>
                ) : (
                  streamedLogs.map((log, idx) => {
                    const isSuccess = log.includes('[Success]');
                    const isAlert = log.includes('[Escalation') || log.includes('Warning') || log.includes('Risk');
                    let color = '#a1a1aa';
                    if (isSuccess) color = '#10b981';
                    else if (isAlert) color = '#f87171';
                    else if (log.includes('[Orchestrator]')) color = '#38bdf8';

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ color: color, fontSize: '11px', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}
                      >
                        {log}
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>

      <style>{`
        .agent-scroll-container {
          scrollbar-width: thin;
          scrollbar-color: var(--accent) transparent;
          -webkit-overflow-scrolling: touch;
        }
        
        .agent-scroll-container::-webkit-scrollbar {
          height: 6px;
        }
        
        .agent-scroll-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .agent-scroll-container::-webkit-scrollbar-thumb {
          background-color: var(--accent);
          border-radius: 99px;
          opacity: 0.3;
        }
        
        [data-theme="dark"] .agent-scroll-container::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .sim-trigger-btn:hover {
          border-color: var(--accent) !important;
          background-color: var(--bg-secondary) !important;
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .agent-showcase-container {
            padding: 0 16px 40px 16px !important;
          }
          .agent-scroll-container {
            width: 100% !important;
            max-width: 100% !important;
          }
          .agent-card-wrapper {
            flex: 0 0 250px !important;
          }
          .simulator-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AgentShowcase;
