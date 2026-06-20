// app/components/profile/HealthGraphCard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, G, Path, Text as SvgText, Defs, RadialGradient, Stop } from 'react-native-svg';

// MODERN 60FPS GESTURE IMPORTS
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

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
  bg: '#0F0F13',
  card: '#181822',
  border: '#2C2C3A',
  primary: '#1A1A1A',
  text: { primary: '#F8FAFC', secondary: '#94A3B8', light: '#475569' },
  nodes: {
    patient: '#38BDF8',
    category: '#64748B',
    disease: '#F43F5E',
    symptoms: '#F97316',
    medications: '#10B981',
    lifestyle: '#EAB308',
    habits: '#F59E0B',
    allergies: '#EC4899',
    surgeries: '#14B8A6',
    familyHistory: '#8B5CF6',
    labReports: '#A855F7',
    vitals: '#06B6D4',
    mentalHealth: '#6366F1',
    nutrition: '#84CC16',
    sleep: '#3B82F6',
    exercise: '#22C55E',
    doctorVisits: '#0EA5E9',
  },
};

// --- THE FULL DATASET ---
const GRAPH_DATA = {
  nodes: [
    { id: 'Indresh', label: 'Indresh', type: 'patient', radius: 36 },
    // Categories
    { id: 'cat_symptoms', label: 'Symptoms', type: 'category', radius: 20 },
    { id: 'cat_diseases', label: 'Diseases', type: 'category', radius: 20 },
    { id: 'cat_medications', label: 'Medications', type: 'category', radius: 20 },
    { id: 'cat_lifestyle', label: 'Lifestyle', type: 'category', radius: 20 },
    { id: 'cat_habits', label: 'Habits', type: 'category', radius: 20 },
    { id: 'cat_allergies', label: 'Allergies', type: 'category', radius: 20 },
    { id: 'cat_labs', label: 'Lab Reports', type: 'category', radius: 20 },
    { id: 'cat_vitals', label: 'Vitals', type: 'category', radius: 20 },
    { id: 'cat_sleep', label: 'Sleep', type: 'category', radius: 20 },
    { id: 'cat_exercise', label: 'Exercise', type: 'category', radius: 20 },
    // Sub-nodes - with proper labels
    { id: 'sym_fever', label: 'Fever', type: 'symptoms', radius: 12 },
    { id: 'sym_headache', label: 'Headache', type: 'symptoms', radius: 12 },
    { id: 'sym_fatigue', label: 'Fatigue', type: 'symptoms', radius: 12 },
    { id: 'sym_dizziness', label: 'Dizziness', type: 'symptoms', radius: 12 },
    { id: 'dis_t2d', label: 'Type 2 Diabetes', type: 'disease', radius: 12 },
    { id: 'dis_htn', label: 'Hypertension', type: 'disease', radius: 12 },
    { id: 'dis_obesity', label: 'Obesity', type: 'disease', radius: 12 },
    { id: 'dis_predia', label: 'Prediabetes', type: 'disease', radius: 12 },
    { id: 'med_metformin', label: 'Metformin', type: 'medications', radius: 12 },
    { id: 'med_lisinopril', label: 'Lisinopril', type: 'medications', radius: 12 },
    { id: 'med_vitd', label: 'Vitamin D', type: 'medications', radius: 12 },
    { id: 'life_sedentary', label: 'Sedentary', type: 'lifestyle', radius: 12 },
    { id: 'life_water', label: 'Low Water', type: 'lifestyle', radius: 12 },
    { id: 'hab_late', label: 'Late Sleeping', type: 'habits', radius: 12 },
    { id: 'hab_screen', label: 'Excess Screen', type: 'habits', radius: 12 },
    { id: 'alg_dust', label: 'Dust', type: 'allergies', radius: 12 },
    { id: 'alg_pollen', label: 'Pollen', type: 'allergies', radius: 12 },
    { id: 'lab_hba1c', label: 'HbA1c', type: 'labReports', radius: 12 },
    { id: 'lab_chol', label: 'Cholesterol', type: 'labReports', radius: 12 },
    { id: 'lab_vitd', label: 'Vitamin D', type: 'labReports', radius: 12 },
    { id: 'vit_bp', label: 'Blood Pressure', type: 'vitals', radius: 12 },
    { id: 'vit_bmi', label: 'BMI', type: 'vitals', radius: 12 },
    { id: 'slp_6hr', label: '6 Hours Sleep', type: 'sleep', radius: 12 },
    { id: 'slp_quality', label: 'Poor Quality', type: 'sleep', radius: 12 },
    { id: 'exc_walking', label: 'Walking', type: 'exercise', radius: 12 },
  ],
  edges: [
    // Hierarchy
    { source: 'Indresh', target: 'cat_symptoms', weight: 3 },
    { source: 'Indresh', target: 'cat_diseases', weight: 3 },
    { source: 'Indresh', target: 'cat_medications', weight: 3 },
    { source: 'Indresh', target: 'cat_lifestyle', weight: 3 },
    { source: 'Indresh', target: 'cat_habits', weight: 3 },
    { source: 'Indresh', target: 'cat_allergies', weight: 3 },
    { source: 'Indresh', target: 'cat_labs', weight: 3 },
    { source: 'Indresh', target: 'cat_vitals', weight: 3 },
    { source: 'Indresh', target: 'cat_sleep', weight: 3 },
    { source: 'Indresh', target: 'cat_exercise', weight: 3 },
    { source: 'cat_symptoms', target: 'sym_fever' }, { source: 'cat_symptoms', target: 'sym_headache' }, { source: 'cat_symptoms', target: 'sym_fatigue' }, { source: 'cat_symptoms', target: 'sym_dizziness' },
    { source: 'cat_diseases', target: 'dis_t2d' }, { source: 'cat_diseases', target: 'dis_htn' }, { source: 'cat_diseases', target: 'dis_obesity' }, { source: 'cat_diseases', target: 'dis_predia' },
    { source: 'cat_medications', target: 'med_metformin' }, { source: 'cat_medications', target: 'med_lisinopril' }, { source: 'cat_medications', target: 'med_vitd' },
    { source: 'cat_lifestyle', target: 'life_sedentary' }, { source: 'cat_lifestyle', target: 'life_water' },
    { source: 'cat_habits', target: 'hab_late' }, { source: 'cat_habits', target: 'hab_screen' },
    { source: 'cat_allergies', target: 'alg_dust' }, { source: 'cat_allergies', target: 'alg_pollen' },
    { source: 'cat_labs', target: 'lab_hba1c' }, { source: 'cat_labs', target: 'lab_chol' }, { source: 'cat_labs', target: 'lab_vitd' },
    { source: 'cat_vitals', target: 'vit_bp' }, { source: 'cat_vitals', target: 'vit_bmi' },
    { source: 'cat_sleep', target: 'slp_6hr' }, { source: 'cat_sleep', target: 'slp_quality' },
    { source: 'cat_exercise', target: 'exc_walking' },
    
    // Cross-links
    { source: 'dis_t2d', target: 'med_metformin', type: 'cross' },
    { source: 'dis_t2d', target: 'lab_hba1c', type: 'cross' },
    { source: 'dis_htn', target: 'vit_bp', type: 'cross' },
    { source: 'life_sedentary', target: 'dis_obesity', type: 'cross' },
    { source: 'dis_obesity', target: 'vit_bmi', type: 'cross' },
    { source: 'hab_late', target: 'sym_fatigue', type: 'cross' },
    { source: 'slp_6hr', target: 'sym_fatigue', type: 'cross' },
    { source: 'lab_vitd', target: 'sym_fatigue', type: 'cross' },
  ],
};

const getSafeId = (nodeObjOrStr: any) => typeof nodeObjOrStr === 'string' ? nodeObjOrStr : nodeObjOrStr.id;

// --- D3 OBSIDIAN PHYSICS ENGINE ---
const useForceSimulation = (data: any, width: number, height: number) => {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    requestAnimationFrame(() => {
      const simNodes = data.nodes.map((d: any) => ({ ...d }));
      const simEdges = data.edges.map((d: any) => ({ ...d }));

      const root = simNodes.find((n: any) => n.id === 'Indresh');
      if (root) {
        root.fx = width / 2;
        root.fy = height / 2;
      }

      const simulation = forceSimulation(simNodes)
        .force('link', forceLink(simEdges)
          .id((d: any) => d.id)
          .distance((link: any) => link.weight === 3 ? 180 : (link.type === 'cross' ? 280 : 70))
          .strength((link: any) => link.type === 'cross' ? 0.05 : 0.7)
        )
        .force('charge', forceManyBody().strength(-300))
        .force('center', forceCenter(width / 2, height / 2))
        .force('collide', forceCollide().radius((d: any) => d.radius + 15).iterations(2))
        .force('radial', forceRadial(200, width / 2, height / 2).strength((d: any) => d.type === 'category' ? 0.8 : 0))
        .alphaDecay(0.05)
        .velocityDecay(0.4); 
        
      let frameId: number | null = null;
      let tickCount = 0;
      const maxTicks = 100;

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
      }, 3500);

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

// --- MODERN GESTURE GRAPH VIEW ---
const GraphView = ({ data, onNodeSelect }: { data: any, onNodeSelect: (node: any) => void }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [graphReady, setGraphReady] = useState(false);
  
  const canvasSize = Math.max(SCREEN_WIDTH * 3, 1400);
  const { nodes, edges, isLoading } = useForceSimulation(data, canvasSize, canvasSize);

  const scale = useSharedValue(0.7);
  const savedScale = useSharedValue(0.7);
  const translateX = useSharedValue(-(canvasSize - SCREEN_WIDTH) / 2);
  const translateY = useSharedValue(-(canvasSize - SCREEN_HEIGHT) / 2);
  const savedTranslateX = useSharedValue(-(canvasSize - SCREEN_WIDTH) / 2);
  const savedTranslateY = useSharedValue(-(canvasSize - SCREEN_HEIGHT) / 2);

  useEffect(() => {
    if (!isLoading && nodes.length > 0) setGraphReady(true);
  }, [isLoading, nodes]);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.max(0.3, Math.min(savedScale.value * e.scale, 3.0));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .minDistance(15)
    .onUpdate((e) => {
      translateX.value = savedTranslateX.value + e.translationX;
      translateY.value = savedTranslateY.value + e.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

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

  const getNodeColor = (type: string) => COLORS.nodes[type as keyof typeof COLORS.nodes] || COLORS.nodes.category;

  if (isLoading || !graphReady) {
    return (
      <View style={[styles.graphContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.nodes.patient} />
        <Text style={styles.loadingText}>Building Health Network...</Text>
        <Text style={styles.loadingSubText}>Rendering spatial layout</Text>
      </View>
    );
  }

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={styles.graphContainer}>
        <Animated.View style={animatedStyle}>
          <Svg width={canvasSize} height={canvasSize}>
            
            <Defs>
              {Object.entries(COLORS.nodes).map(([key, color]) => (
                <RadialGradient key={`glow-${key}`} id={`glow-${key}`} cx="50%" cy="50%" r="50%">
                  <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={color} stopOpacity="0" />
                </RadialGradient>
              ))}
            </Defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              if (!edge.source.x || !edge.target.x) return null;
              
              const sourceId = getSafeId(edge.source);
              const targetId = getSafeId(edge.target);
              const isCrossLink = edge.type === 'cross';
              const isActive = selectedId && (sourceId === selectedId || targetId === selectedId);
              
              const opacity = !selectedId ? (isCrossLink ? 0.2 : 0.6) : (isActive ? 0.9 : 0.05);
              
              const d = isCrossLink 
                ? `M ${edge.source.x} ${edge.source.y} Q ${(edge.source.x + edge.target.x)/2 + 60} ${(edge.source.y + edge.target.y)/2 - 60} ${edge.target.x} ${edge.target.y}`
                : `M ${edge.source.x} ${edge.source.y} L ${edge.target.x} ${edge.target.y}`;

              return (
                <Path
                  key={`edge-${i}`}
                  d={d}
                  stroke={isActive ? '#FFFFFF' : (isCrossLink ? COLORS.text.light : COLORS.border)}
                  strokeWidth={isActive ? 2 : (isCrossLink ? 1 : 2)}
                  strokeDasharray={isCrossLink ? "4,6" : "none"}
                  fill="none"
                  opacity={opacity}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              if (!node.x) return null;
              
              const color = getNodeColor(node.type);
              const isSelected = selectedId === node.id;
              const opacity = isHighlighted(node.id) ? 1 : 0.15;
              const isRoot = node.type === 'patient';
              const isCategory = node.type === 'category';
              
              // ALWAYS show labels for ALL nodes (fix for sub-nodes)
              const showLabel = true;
              const textOpacity = isRoot || isSelected ? 1 : (isCategory ? 0.9 : 0.7);
              const textWeight = isRoot || isSelected ? '700' : (isCategory ? '600' : '500');
              const fontSize = isRoot ? 16 : (isCategory ? 12 : 10);
              const labelColor = isSelected || isRoot ? '#FFFFFF' : COLORS.text.secondary;
              
              return (
                <G key={`node-${node.id}`} onPress={() => handleNodePress(node)}>
                  {/* Outer Glow */}
                  <Circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={node.radius * 2.5} 
                    fill={`url(#glow-${Object.keys(COLORS.nodes).find(k => COLORS.nodes[k as keyof typeof COLORS.nodes] === color)})`} 
                    opacity={opacity * 0.8} 
                  />
                  
                  {/* Solid Inner Node */}
                  <Circle 
                    cx={node.x} 
                    cy={node.y} 
                    r={node.radius} 
                    fill={COLORS.card} 
                    stroke={color} 
                    strokeWidth={isSelected ? 3 : 1.5} 
                    opacity={opacity}
                  />
                  
                  {/* Faint tint inside */}
                  <Circle cx={node.x} cy={node.y} r={node.radius - 2} fill={color} opacity={opacity * 0.2} />

                  {/* Initial for Root */}
                  {isRoot && (
                    <SvgText 
                      x={node.x} 
                      y={node.y + (node.radius * 0.35)} 
                      textAnchor="middle" 
                      fontSize={node.radius * 0.9} 
                      fontWeight="800" 
                      fill={color} 
                      opacity={opacity}
                    >
                      {node.label.charAt(0)}
                    </SvgText>
                  )}

                  {/* Category Icon */}
                  {isCategory && (
                    <SvgText 
                      x={node.x} 
                      y={node.y + (node.radius * 0.35)} 
                      textAnchor="middle" 
                      fontSize={node.radius * 0.7} 
                      fontWeight="700" 
                      fill={color} 
                      opacity={opacity}
                    >
                      {node.label.charAt(0)}
                    </SvgText>
                  )}

                  {/* Floating Name Label - NOW SHOWN FOR ALL NODES */}
                  <SvgText
                    x={node.x}
                    y={node.y + node.radius + (isRoot ? 20 : (isCategory ? 18 : 16))}
                    textAnchor="middle"
                    fontSize={fontSize}
                    fontWeight={textWeight}
                    fill={labelColor}
                    opacity={opacity * textOpacity}
                    letterSpacing="0.2"
                  >
                    {node.label}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </Animated.View>
      </View>
    </GestureDetector>
  );
};

// --- MAIN COMPONENT ---
export const HealthGraphCard = ({ autoOpen = false }: { autoOpen?: boolean }) => {
  const [showModal, setShowModal] = useState(autoOpen);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (autoOpen) {
      setShowModal(true);
    }
  }, [autoOpen]);

  const totalNodes = GRAPH_DATA.nodes.length;
  const totalRelationships = GRAPH_DATA.edges.length;

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setShowModal(true)} activeOpacity={0.9}>
        <LinearGradient colors={['#181822', '#0F0F13']} style={styles.cardGradient}>
          <View style={styles.cardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="git-network" size={20} color={COLORS.nodes.patient} />
            </View>
            <Text style={styles.cardTitle}>Health Graph</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalNodes} nodes</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <Text style={styles.statText}>
              <Text style={{color: '#FFF'}}>{totalRelationships}</Text> relationships tracked
            </Text>
            <Ionicons name="pulse" size={16} color={COLORS.nodes.disease} />
          </View>

          {/* AI Insight Summary Block - Same as Family Card */}
          <View style={styles.aiInsightBox}>
            <View style={styles.aiInsightHeader}>
              <MaterialCommunityIcons name="robot-outline" size={16} color={COLORS.nodes.patient} />
              <Text style={styles.aiInsightTitle}>AI Insight</Text>
              <View style={{flex: 1}} />
              <View style={styles.confidenceBadge}>
                <Text style={styles.confidenceText}>92% Match</Text>
              </View>
            </View>
            <Text style={styles.aiInsightText}>
              Strong correlation between <Text style={{color: '#FFF', fontWeight: '600'}}>sedentary lifestyle</Text> and <Text style={{color: '#FFF', fontWeight: '600'}}>obesity</Text>. 
              Regular walking and vitamin D supplementation recommended.
            </Text>
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
            <Text style={styles.modalTitle}>Indresh's Network</Text>
            <View style={{width: 60}} /> 
          </View>
          
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.bg, overflow: 'hidden' }}>
            <GraphView data={GRAPH_DATA} onNodeSelect={setSelectedNode} />
            
            {/* Top Confidence Banner */}
            <View style={styles.modalTopBanner}>
              <MaterialCommunityIcons name="shield-check" size={18} color={'#10B981'} />
              <Text style={styles.bannerText}>AI Confidence Score: <Text style={{color: '#FFF'}}>92%</Text></Text>
            </View>

            {/* Obsidian-Style Info Panel */}
            {selectedNode && (
              <View style={styles.detailsPanel}>
                <View style={styles.panelHeader}>
                  <View style={[styles.detailsDot, { backgroundColor: COLORS.nodes[selectedNode.type as keyof typeof COLORS.nodes] || COLORS.nodes.category }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.detailsTitle}>{selectedNode.label}</Text>
                    <Text style={styles.detailsType}>{selectedNode.type.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedNode(null)}>
                    <Ionicons name="close-circle" size={26} color={COLORS.text.secondary} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            
            <View style={styles.hintBadge}>
              <Text style={styles.hintText}>Pinch to zoom • Drag to pan</Text>
            </View>
          </GestureHandlerRootView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: { 
    marginHorizontal: 16, 
    marginTop: 16, 
    borderRadius: 16, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: COLORS.border 
  },
  cardGradient: { padding: 20 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(56, 189, 248, 0.1)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: '#FFF', flex: 1 },
  badge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  badgeText: { color: COLORS.text.secondary, fontSize: 11, fontWeight: '600' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statText: { color: COLORS.text.secondary, fontSize: 13, fontWeight: '500' },
  
  // AI Insight Box - Same as Family Card
  aiInsightBox: { 
    backgroundColor: 'rgba(56, 189, 248, 0.08)', 
    padding: 16, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: 'rgba(56, 189, 248, 0.2)' 
  },
  aiInsightHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  aiInsightTitle: { color: COLORS.nodes.patient, fontSize: 13, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase' },
  confidenceBadge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(16, 185, 129, 0.2)' },
  confidenceText: { color: '#10B981', fontSize: 10, fontWeight: '700' },
  aiInsightText: { color: COLORS.text.secondary, fontSize: 13, lineHeight: 20 },
  
  graphContainer: { flex: 1, backgroundColor: COLORS.bg },
  loadingContainer: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 20 },
  loadingSubText: { color: COLORS.text.secondary, fontSize: 13, marginTop: 8 },
  modal: { flex: 1, backgroundColor: COLORS.bg },
  modalHeader: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, zIndex: 10 },
  modalBack: { flexDirection: 'row', alignItems: 'center', gap: 6, width: 80 },
  modalBackText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  modalTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  modalTopBanner: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: 'rgba(17,17,17,0.8)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border },
  bannerText: { color: COLORS.text.secondary, fontSize: 12, fontWeight: '600' },
  detailsPanel: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'rgba(17,17,17,0.95)', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  panelHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  detailsDot: { width: 14, height: 14, borderRadius: 7, marginTop: 4, shadowColor: '#FFF', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 8 },
  detailsTitle: { fontSize: 20, fontWeight: '700', color: '#FFF', marginBottom: 2 },
  detailsType: { fontSize: 12, color: COLORS.text.secondary, letterSpacing: 1, fontWeight: '600' },
  hintBadge: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  hintText: { color: COLORS.text.secondary, fontSize: 12, fontWeight: '600' }
});

export default HealthGraphCard;