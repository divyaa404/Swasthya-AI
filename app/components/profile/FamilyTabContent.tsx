// app/components/profile/FamilySimilarityGraph.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, G, Path, Text as SvgText, Rect } from 'react-native-svg';

import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
  forceRadial,
} from 'd3-force';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const COLORS = {
  bg: '#000000',
  card: '#111111',
  border: '#222222',
  primary: '#1A1A1A',
  text: { primary: '#E2E8F0', secondary: '#94A3B8', light: '#475569' },
  nodes: {
    patient: '#38BDF8',
    family: '#8B5CF6',
    symptom: '#F59E0B',
    condition: '#EF4444',
    covid: '#EC4899',
    vaccine: '#10B981',
  },
  risk: {
    low: '#10B981',
    moderate: '#F59E0B',
    high: '#EF4444',
  },
};

// --- NEO4J EMULATED DATASET WITH COVID SYMPTOMS ---
const GRAPH_DATA = {
  nodes: [
    // People Nodes
    { id: 'indresh', label: 'Indresh', type: 'Person', role: 'Self', radius: 36, color: COLORS.nodes.patient, data: { age: 20, phone: '+91 9324474812', risk: 'Moderate' } },
    { id: 'divya', label: 'Divya', type: 'Person', role: 'Girlfriend', radius: 28, color: COLORS.nodes.family, data: { age: 20, phone: '+91 7559302315', risk: 'Low' } },
    { id: 'monish', label: 'Monish', type: 'Person', role: 'Grandfather', radius: 28, color: COLORS.nodes.family, data: { age: 65, phone: '+91 9372962545', risk: 'Low' } },
    { id: 'ankita', label: 'Ankita', type: 'Person', role: 'Child', radius: 28, color: COLORS.nodes.family, data: { age: 10, phone: '+91 9970206614', risk: 'Low' } },
    
    // Medical Nodes - Existing
    { id: 'symp_anxiety', label: 'Anxiety', type: 'Symptom', radius: 18, color: COLORS.nodes.symptom, data: { severity: 'Moderate', connected: ['Indresh', 'Divya'] } },
    { id: 'symp_migraine', label: 'Migraine', type: 'Symptom', radius: 18, color: COLORS.nodes.symptom, data: { severity: 'High', connected: ['Indresh'] } },
    { id: 'symp_fatigue', label: 'Fatigue', type: 'Symptom', radius: 18, color: COLORS.nodes.symptom, data: { severity: 'Mild', connected: ['Monish'] } },
    { id: 'cond_hyper', label: 'Hypertension', type: 'Condition', radius: 18, color: COLORS.nodes.condition, data: { severity: 'Chronic', connected: ['Monish'] } },
    
    // COVID Related Symptoms & Conditions
    { id: 'covid_fever', label: 'Fever', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Moderate', connected: ['Indresh', 'Divya', 'Monish'] } },
    { id: 'covid_cough', label: 'Dry Cough', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Moderate', connected: ['Indresh', 'Monish'] } },
    { id: 'covid_taste', label: 'Loss of Taste', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Mild', connected: ['Divya'] } },
    { id: 'covid_smell', label: 'Loss of Smell', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Mild', connected: ['Divya'] } },
    { id: 'covid_breath', label: 'Shortness of Breath', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Severe', connected: ['Monish'] } },
    { id: 'covid_pneumonia', label: 'Pneumonia', type: 'Covid', radius: 16, color: COLORS.nodes.covid, data: { severity: 'Severe', connected: ['Monish'] } },
    
    // Vaccine Nodes
    { id: 'vaccine_covaxin', label: 'Covaxin', type: 'Vaccine', radius: 14, color: COLORS.nodes.vaccine, data: { dose: '2 doses', connected: ['Indresh', 'Divya'] } },
    { id: 'vaccine_covishield', label: 'Covishield', type: 'Vaccine', radius: 14, color: COLORS.nodes.vaccine, data: { dose: '2 doses + Booster', connected: ['Monish'] } },
  ],
  edges: [
    // Relationships (Central Gravity)
    { source: 'indresh', target: 'divya', label: 'PARTNER', weight: 3 },
    { source: 'indresh', target: 'monish', label: 'GRANDFATHER', weight: 3 },
    { source: 'indresh', target: 'ankita', label: 'CHILD', weight: 3 },
    
    // Existing Medical Links
    { source: 'indresh', target: 'symp_anxiety', label: 'REPORTS', type: 'cross' },
    { source: 'indresh', target: 'symp_migraine', label: 'REPORTS', type: 'cross' },
    { source: 'divya', target: 'symp_anxiety', label: 'REPORTS', type: 'cross' },
    { source: 'monish', target: 'symp_fatigue', label: 'REPORTS', type: 'cross' },
    { source: 'monish', target: 'cond_hyper', label: 'DIAGNOSED', type: 'cross' },
    
    // COVID Symptom Links - Showing Family Similarity
    { source: 'indresh', target: 'covid_fever', label: 'HAS', type: 'cross' },
    { source: 'indresh', target: 'covid_cough', label: 'HAS', type: 'cross' },
    { source: 'divya', target: 'covid_fever', label: 'HAS', type: 'cross' },
    { source: 'divya', target: 'covid_taste', label: 'HAS', type: 'cross' },
    { source: 'divya', target: 'covid_smell', label: 'HAS', type: 'cross' },
    { source: 'monish', target: 'covid_fever', label: 'HAS', type: 'cross' },
    { source: 'monish', target: 'covid_cough', label: 'HAS', type: 'cross' },
    { source: 'monish', target: 'covid_breath', label: 'HAS', type: 'cross' },
    { source: 'monish', target: 'covid_pneumonia', label: 'HAS', type: 'cross' },
    
    // COVID Symptom Similarity Links (showing connection between symptoms)
    { source: 'covid_fever', target: 'covid_cough', label: 'RELATED', type: 'cross' },
    { source: 'covid_fever', target: 'covid_taste', label: 'RELATED', type: 'cross' },
    { source: 'covid_taste', target: 'covid_smell', label: 'RELATED', type: 'cross' },
    { source: 'covid_breath', target: 'covid_pneumonia', label: 'COMPLICATION', type: 'cross' },
    
    // Vaccine Links
    { source: 'indresh', target: 'vaccine_covaxin', label: 'VACCINATED', type: 'cross' },
    { source: 'divya', target: 'vaccine_covaxin', label: 'VACCINATED', type: 'cross' },
    { source: 'monish', target: 'vaccine_covishield', label: 'VACCINATED', type: 'cross' },
    
    // Vaccine to COVID Protection Link
    { source: 'vaccine_covaxin', target: 'covid_fever', label: 'PROTECTS', type: 'cross' },
    { source: 'vaccine_covishield', target: 'covid_pneumonia', label: 'PROTECTS', type: 'cross' },
  ],
};

const getSafeId = (nodeObjOrStr: any) => typeof nodeObjOrStr === 'string' ? nodeObjOrStr : nodeObjOrStr.id;

// --- D3 ENGINE WITH PERFORMANCE COOLING ---
const useForceSimulation = (data: any, width: number, height: number) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    
    requestAnimationFrame(() => {
      const simNodes = data.nodes.map((d: any) => ({ ...d }));
      const simEdges = data.edges.map((d: any) => ({ ...d }));

      const root = simNodes.find((n: any) => n.id === 'indresh');
      if (root) {
        root.fx = width / 2;
        root.fy = height / 2;
      }

      const simulation = forceSimulation(simNodes)
        .force('link', forceLink(simEdges)
          .id((d: any) => d.id)
          .distance((link: any) => link.weight === 3 ? 140 : (link.type === 'cross' ? 200 : 80))
          .strength((link: any) => link.type === 'cross' ? 0.05 : 0.8)
        )
        .force('charge', forceManyBody().strength(-200))
        .force('center', forceCenter(width / 2, height / 2))
        .force('collide', forceCollide().radius((d: any) => d.radius + 15).iterations(2))
        .force('radial', forceRadial(150, width / 2, height / 2).strength((d: any) => d.type === 'Person' && d.id !== 'indresh' ? 0.8 : 0))
        .alphaDecay(0.06)
        .velocityDecay(0.4); 
        
      let frameId: number | null = null;
      let tickCount = 0;
      const maxTicks = 80;

      simulation.on('tick', () => {
        tickCount++;
        if (!frameId && tickCount <= maxTicks) {
          frameId = requestAnimationFrame(() => {
            setNodes([...simNodes]);
            setEdges([...simEdges]);
            frameId = null;
            
            if (tickCount >= maxTicks) {
              setIsLoading(false);
            }
          });
        }
      });

      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
        setNodes([...simNodes]);
        setEdges([...simEdges]);
      }, 3000);

      simulation.alpha(1).restart();
      
      return () => {
        simulation.stop();
        if (frameId) cancelAnimationFrame(frameId);
        clearTimeout(timeoutId);
      };
    });
  }, [data, width, height]);

  return { nodes, edges, isLoading };
};

// --- ENHANCED PAN & ZOOM GRAPH VIEW ---
const GraphView = ({ data, onNodeSelect }: { data: any, onNodeSelect: (node: any) => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [graphReady, setGraphReady] = useState(false);
  
  const canvasSize = Math.max(SCREEN_WIDTH * 2, 1100);
  const { nodes, edges, isLoading } = useForceSimulation(data, canvasSize, canvasSize);

  // Animation Values
  const pan = useRef(new Animated.ValueXY({ 
    x: -(canvasSize - SCREEN_WIDTH) / 2, 
    y: -(canvasSize - SCREEN_HEIGHT) / 2 
  })).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  
  const currentScale = useRef(0.85);
  const initialTouchDistance = useRef<number | null>(null);

  useEffect(() => {
    const listener = scale.addListener(({ value }) => { currentScale.current = value; });
    return () => scale.removeListener(listener);
  }, []);

  useEffect(() => {
    if (!isLoading && nodes.length > 0) setGraphReady(true);
  }, [isLoading, nodes]);

  const getDistance = (touches: any) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    return Math.sqrt(Math.pow(touch2.pageX - touch1.pageX, 2) + Math.pow(touch2.pageY - touch1.pageY, 2));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 5 || Math.abs(gesture.dy) > 5 || gesture.numberActiveTouches === 2;
      },
      onPanResponderGrant: (evt) => { 
        pan.extractOffset(); 
        if (evt.nativeEvent.touches.length === 2) {
          initialTouchDistance.current = getDistance(evt.nativeEvent.touches);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        if (touches.length === 2) {
          if (initialTouchDistance.current) {
            const currentDistance = getDistance(touches);
            if (currentDistance > 0) {
              const scaleFactor = currentDistance / initialTouchDistance.current;
              const newScale = Math.max(0.3, Math.min(currentScale.current * scaleFactor, 3.0));
              scale.setValue(newScale);
            }
          }
        } else if (touches.length === 1 && !initialTouchDistance.current) {
          pan.setValue({ x: gestureState.dx, y: gestureState.dy });
        }
      },
      onPanResponderRelease: () => { 
        pan.flattenOffset(); 
        initialTouchDistance.current = null;
      },
      onPanResponderTerminate: () => {
        initialTouchDistance.current = null;
      }
    })
  ).current;

  const handleNodePress = (node: any) => {
    const newSelected = selectedId === node.id ? null : node.id;
    setSelectedId(newSelected);
    onNodeSelect(newSelected ? node : null);
  };

  const isHighlighted = (nodeId: string) => {
    if (!selectedId) return true;
    if (nodeId === selectedId) return true;
    return edges.some(e => 
      (getSafeId(e.source) === selectedId && getSafeId(e.target) === nodeId) || 
      (getSafeId(e.target) === selectedId && getSafeId(e.source) === nodeId)
    );
  };

  if (isLoading || !graphReady) {
    return (
      <View style={[styles.graphContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.nodes.family} />
        <Text style={styles.loadingText}>Rendering family network...</Text>
        <Text style={styles.loadingSubText}>Mapping genetic and symptom vectors</Text>
      </View>
    );
  }

  return (
    <View style={styles.graphContainer} {...panResponder.panHandlers}>
      <Animated.View style={{ transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: scale }] }}>
        <Svg width={canvasSize} height={canvasSize}>
          
          {/* Edges */}
          {edges.map((edge, i) => {
            if (!edge.source.x || !edge.target.x) return null;
            
            const sourceId = getSafeId(edge.source);
            const targetId = getSafeId(edge.target);
            const isCrossLink = edge.type === 'cross';
            const isActive = selectedId && (sourceId === selectedId || targetId === selectedId);
            const opacity = !selectedId ? (isCrossLink ? 0.2 : 0.5) : (isActive ? 0.9 : 0.05);
            
            const midX = (edge.source.x + edge.target.x) / 2;
            const midY = (edge.source.y + edge.target.y) / 2;
            
            const d = isCrossLink 
              ? `M ${edge.source.x} ${edge.source.y} Q ${midX + 40} ${midY - 40} ${edge.target.x} ${edge.target.y}`
              : `M ${edge.source.x} ${edge.source.y} L ${edge.target.x} ${edge.target.y}`;

            return (
              <G key={`edge-${i}`}>
                <Path
                  d={d}
                  stroke={isActive ? '#FFFFFF' : (isCrossLink ? '#475569' : '#333333')}
                  strokeWidth={isActive ? 2 : (isCrossLink ? 1.5 : 2)}
                  strokeDasharray={isCrossLink ? "6,6" : "none"}
                  fill="none"
                  opacity={opacity}
                />
                
                {/* Edge Labels (Neo4j Style) */}
                {isActive && (
                  <G transform={`translate(${midX}, ${midY})`}>
                    <Rect x="-40" y="-10" width="80" height="20" rx="10" fill={COLORS.primary} opacity={0.8} />
                    <SvgText textAnchor="middle" y="3" fontSize="8" fontWeight="700" fill="#FFF" letterSpacing="0.5">
                      {edge.label}
                    </SvgText>
                  </G>
                )}
              </G>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            if (!node.x) return null;
            
            const isSelected = selectedId === node.id;
            const opacity = isHighlighted(node.id) ? 1 : 0.15;
            const isPerson = node.type === 'Person';
            const isRoot = node.id === 'indresh';
            const isCovid = node.type === 'Covid';
            const isVaccine = node.type === 'Vaccine';
            
            // Different node styles based on type
            let nodeFill = COLORS.card;
            let showInitial = false;
            let initialFontSize = 0;
            let labelColor = COLORS.text.secondary;
            
            if (isPerson) {
              nodeFill = isSelected ? node.color : node.color;
              showInitial = true;
              initialFontSize = node.radius * 0.6;
              labelColor = isSelected || isRoot ? '#FFFFFF' : COLORS.text.secondary;
            } else if (isCovid) {
              nodeFill = isSelected ? node.color : 'transparent';
              nodeFill = isSelected ? node.color : COLORS.card;
              labelColor = isSelected ? '#FFFFFF' : COLORS.text.secondary;
            } else if (isVaccine) {
              nodeFill = isSelected ? node.color : COLORS.card;
              labelColor = isSelected ? '#FFFFFF' : COLORS.text.secondary;
            } else {
              nodeFill = isSelected ? node.color : COLORS.card;
              labelColor = isSelected || isRoot ? '#FFFFFF' : COLORS.text.secondary;
            }

            return (
              <G key={`node-${node.id}`} onPress={() => handleNodePress(node)}>
                <Circle 
                  cx={node.x} 
                  cy={node.y} 
                  r={node.radius} 
                  fill={nodeFill} 
                  stroke={node.color} 
                  strokeWidth={isSelected ? 3 : (isPerson ? 1.5 : 2)} 
                  opacity={opacity}
                />
                
                {/* Initial inside nodes */}
                {isPerson && (
                  <SvgText x={node.x} y={node.y + 6} textAnchor="middle" fontSize={initialFontSize} fontWeight="800" fill="#FFF" opacity={opacity}>
                    {node.label.charAt(0)}
                  </SvgText>
                )}
                
                {isCovid && (
                  <SvgText x={node.x} y={node.y + 5} textAnchor="middle" fontSize={12} fontWeight="800" fill={node.color} opacity={opacity}>
                    🦠
                  </SvgText>
                )}
                
                {isVaccine && (
                  <SvgText x={node.x} y={node.y + 5} textAnchor="middle" fontSize={12} fontWeight="800" fill={node.color} opacity={opacity}>
                    💉
                  </SvgText>
                )}

                <SvgText
                  x={node.x}
                  y={node.y + node.radius + 14}
                  textAnchor="middle"
                  fontSize={isPerson ? 14 : 11}
                  fontWeight={isRoot || isSelected ? '700' : '500'}
                  fill={labelColor}
                  opacity={opacity}
                >
                  {node.label}
                </SvgText>
                
                {isPerson && (
                  <SvgText x={node.x} y={node.y + node.radius + 28} textAnchor="middle" fontSize="10" fill={COLORS.text.light} opacity={opacity}>
                    {node.role}
                  </SvgText>
                )}
                
                {isCovid && (
                  <SvgText x={node.x} y={node.y + node.radius + 26} textAnchor="middle" fontSize="9" fill={COLORS.text.light} opacity={opacity * 0.7}>
                    COVID
                  </SvgText>
                )}
                
                {isVaccine && (
                  <SvgText x={node.x} y={node.y + node.radius + 26} textAnchor="middle" fontSize="9" fill={COLORS.text.light} opacity={opacity * 0.7}>
                    Vaccine
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      </Animated.View>
    </View>
  );
};

// --- MAIN COMPONENT ---
export const FamilySimilarityGraph = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const totalNodes = GRAPH_DATA.nodes.length;
  const totalRelationships = GRAPH_DATA.edges.length;

  // Render specific details based on Node Type
  const renderNodeDetails = () => {
    if (!selectedNode) return null;

    if (selectedNode.type === 'Person') {
      const riskColor = COLORS.risk[selectedNode.data.risk.toLowerCase() as keyof typeof COLORS.risk] || COLORS.risk.low;
      return (
        <View style={styles.detailsBody}>
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{selectedNode.data.age} yrs</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Contact</Text>
              <Text style={styles.infoValue}>{selectedNode.data.phone}</Text>
            </View>
          </View>
          <View style={styles.riskContainer}>
            <Text style={styles.riskLabel}>AI Health Risk Assessment</Text>
            <View style={[styles.riskBadge, { backgroundColor: `${riskColor}20` }]}>
              <View style={[styles.riskDot, { backgroundColor: riskColor }]} />
              <Text style={[styles.riskText, { color: riskColor }]}>{selectedNode.data.risk} Risk</Text>
            </View>
          </View>
        </View>
      );
    }

    if (selectedNode.type === 'Covid') {
      return (
        <View style={styles.detailsBody}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.infoLabel}>Severity Level</Text>
            <Text style={[styles.infoValue, { color: selectedNode.color }]}>
              {selectedNode.data.severity}
            </Text>
          </View>
          <Text style={styles.infoLabel}>Observed In</Text>
          <View style={styles.tagContainer}>
            {selectedNode.data.connected.map((name: string, i: number) => (
              <View key={i} style={styles.personTag}>
                <Text style={styles.personTagText}>{name}</Text>
              </View>
            ))}
          </View>
          <View style={styles.covidWarning}>
            <Ionicons name="warning" size={16} color="#EC4899" />
            <Text style={styles.covidWarningText}>COVID-19 Related Symptom</Text>
          </View>
        </View>
      );
    }

    if (selectedNode.type === 'Vaccine') {
      return (
        <View style={styles.detailsBody}>
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.infoLabel}>Doses</Text>
            <Text style={[styles.infoValue, { color: selectedNode.color }]}>
              {selectedNode.data.dose}
            </Text>
          </View>
          <Text style={styles.infoLabel}>Vaccinated Family Members</Text>
          <View style={styles.tagContainer}>
            {selectedNode.data.connected.map((name: string, i: number) => (
              <View key={i} style={styles.personTag}>
                <Text style={styles.personTagText}>{name}</Text>
              </View>
            ))}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.detailsBody}>
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.infoLabel}>Severity Level</Text>
          <Text style={[styles.infoValue, { color: selectedNode.color }]}>
            {selectedNode.data.severity}
          </Text>
        </View>
        <Text style={styles.infoLabel}>Observed In</Text>
        <View style={styles.tagContainer}>
          {selectedNode.data.connected.map((name: string, i: number) => (
            <View key={i} style={styles.personTag}>
              <Text style={styles.personTagText}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowModal(true)} activeOpacity={0.9}>
        <LinearGradient colors={['#111111', '#080808']} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="people" size={20} color={COLORS.nodes.family} />
            </View>
            <Text style={styles.cardTitle}>Family Similarity Graph</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>{totalNodes} nodes</Text></View>
          </View>
          
          <View style={styles.statsRow}>
            <Text style={styles.statText}><Text style={{color: '#FFF'}}>{totalRelationships}</Text> relationships mapped</Text>
            <Ionicons name="git-merge" size={16} color={COLORS.nodes.patient} />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showModal} animationType="fade" transparent={false}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalBack}>
              <Ionicons name="close" size={24} color="#FFF" />
              <Text style={styles.modalBackText}>Close</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Family Network</Text>
            <View style={{width: 60}} /> 
          </View>
          
          <View style={{ flex: 1, backgroundColor: COLORS.bg, overflow: 'hidden' }}>
            <GraphView data={GRAPH_DATA} onNodeSelect={setSelectedNode} />
            
            {selectedNode && (
              <View style={styles.detailsPanel}>
                <View style={styles.panelHeader}>
                  <View style={[styles.detailsDot, { backgroundColor: selectedNode.color }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailsTitle}>{selectedNode.label}</Text>
                    <Text style={styles.detailsType}>{selectedNode.type.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedNode(null)}>
                    <Ionicons name="close-circle" size={24} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>
                
                {renderNodeDetails()}
              </View>
            )}
            
            <View style={styles.hintBadge}>
              <Text style={styles.hintText}>Tap nodes to view family links</Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 16, marginTop: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  cardGradient: { padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(139, 92, 246, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#FFF', flex: 1 },
  badge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  badgeText: { color: COLORS.text.secondary, fontSize: 11, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12 },
  statText: { color: COLORS.text.secondary, fontSize: 13, fontWeight: '500' },
  graphContainer: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { 
    flex: 1, 
    backgroundColor: COLORS.bg, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  loadingSubText: {
    color: COLORS.text.secondary,
    fontSize: 13,
    marginTop: 8,
  },
  modal: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { backgroundColor: COLORS.bg, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  modalBack: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 80 },
  modalBackText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  detailsPanel: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'rgba(17,17,17,0.95)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border, elevation: 10 },
  panelHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16 },
  detailsDot: { width: 16, height: 16, borderRadius: 8, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8, marginTop: 4 },
  detailsTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  detailsType: { fontSize: 12, color: COLORS.text.secondary, letterSpacing: 1, fontWeight: '600' },
  detailsBody: { paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  infoRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  infoBox: { flex: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', color: COLORS.text.secondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  riskContainer: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  riskLabel: { fontSize: 13, fontWeight: '600', color: COLORS.text.secondary },
  riskBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  riskDot: { width: 6, height: 6, borderRadius: 3 },
  riskText: { fontSize: 12, fontWeight: '700' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  personTag: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  personTagText: { fontSize: 13, fontWeight: '600', color: '#FFF' },
  covidWarning: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(236, 72, 153, 0.2)' },
  covidWarningText: { color: '#EC4899', fontSize: 12, fontWeight: '600' },
  hintBadge: { position: 'absolute', top: 20, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  hintText: { color: COLORS.text.secondary, fontSize: 12, fontWeight: '600' }
});

export default FamilySimilarityGraph;