import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#10B981', // green for scanning
  background: 'rgba(17, 24, 39, 0.95)', // dark layout backdrop
  text: {
    primary: '#FFFFFF',
    secondary: '#9CA3AF',
  },
};

interface DocumentScannerOverlayProps {
  visible: boolean;
  fileName: string;
  onComplete: () => void;
}

export const DocumentScannerOverlay: React.FC<DocumentScannerOverlayProps> = ({
  visible,
  fileName,
  onComplete,
}) => {
  const [statusText, setStatusText] = useState('Initializing upload...');
  const [progress, setProgress] = useState(0);
  
  const laserAnim = useRef(new Animated.Value(0)).current;

  // Run scanning animation loops
  useEffect(() => {
    if (visible) {
      // Loop laser line vertical translation
      Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress & Status transitions simulation
      let currentProgress = 0;
      const progressInterval = setInterval(() => {
        currentProgress += 5;
        if (currentProgress > 100) currentProgress = 100;
        setProgress(currentProgress);

        // Update status text based on progress
        if (currentProgress < 30) {
          setStatusText(`Uploading ${fileName || 'document'}... (${currentProgress}%)`);
        } else if (currentProgress >= 30 && currentProgress < 55) {
          setStatusText('Performing OCR scan on text blocks...');
        } else if (currentProgress >= 55 && currentProgress < 75) {
          setStatusText('Verifying digital signature & seal authenticity...');
        } else if (currentProgress >= 75 && currentProgress < 95) {
          setStatusText('Analyzing income bracket parameters...');
        } else {
          setStatusText('Verification complete! Saving status...');
        }

        if (currentProgress === 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            onComplete();
          }, 800); // Small delay for visual satisfaction
        }
      }, 150);

      return () => {
        clearInterval(progressInterval);
      };
    } else {
      setProgress(0);
      setStatusText('Initializing upload...');
      laserAnim.setValue(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, fileName]);

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120], // height of the document sheet icon
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>AI Document Scanner</Text>
          
          {/* Document Sheet Scanning Box */}
          <View style={styles.documentFrame}>
            <Ionicons name="document-text" size={84} color="#374151" />
            
            {/* Horizontal Laser Line */}
            <Animated.View style={[styles.laserLine, { transform: [{ translateY }] }]} />
          </View>

          {/* Progress bar container */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.subtext}>Please keep this screen open while we verify details.</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    padding: 24,
  },
  header: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  documentFrame: {
    width: 140,
    height: 140,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#4B5563',
    marginBottom: 32,
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    height: 4,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
    height: 20, // fixed height to prevent text wrap layout jumps
  },
  subtext: {
    fontSize: 12,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default DocumentScannerOverlay;
