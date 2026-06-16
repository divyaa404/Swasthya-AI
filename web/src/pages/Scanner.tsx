import React, { useState, useRef, useEffect } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

interface PatientData {
  id: string;
  name: string;
  doctorName: string;
  yearsOfPractice: number;
  certifications: string;
  clinicalHistory: string;
  medications: string;
  currentConditions: string;
  recentLabResults: string;
  location: string;
  lastVisit?: string;
  nextAppointment?: string;
  age?: number;
  gender?: string;
  bloodType?: string;
}

const MOCK_PATIENT_DB: Record<string, PatientData> = {
  "112345671": {
    id: "112345671", name: "John Doe", doctorName: "Dr. Jane Doe",
    yearsOfPractice: 2, certifications: "Board Certified in Family Medicine",
    location: "New York, NY",
    clinicalHistory: "Hypertension diagnosed 2022, seasonal allergies. Non-smoker. Regular exercise.",
    medications: "Lisinopril 10mg daily, Loratadine 10mg PRN",
    currentConditions: "Essential hypertension, well-controlled. Allergic rhinitis.",
    recentLabResults: "BP: 125/82. LDL: 110, HDL: 45. Creatinine: 0.9.",
    lastVisit: "2026-06-01", nextAppointment: "2026-07-01",
    age: 45, gender: "Male", bloodType: "O+"
  },
  "987654322": {
    id: "987654322", name: "Sarah Johnson", doctorName: "Dr. Jane Doe",
    yearsOfPractice: 2, certifications: "Board Certified in Family Medicine",
    location: "Brooklyn, NY",
    clinicalHistory: "Type 2 Diabetes since 2020. Annual eye exams up to date.",
    medications: "Metformin 500mg BID, Atorvastatin 20mg daily",
    currentConditions: "T2DM, Hyperlipidemia",
    recentLabResults: "HbA1c: 6.8%, LDL: 95, HDL: 52, Triglycerides: 140",
    lastVisit: "2026-05-15", nextAppointment: "2026-06-30",
    age: 52, gender: "Female", bloodType: "A+"
  },
  "556677883": {
    id: "556677883", name: "Robert Chen", doctorName: "Dr. Jane Doe",
    yearsOfPractice: 2, certifications: "Board Certified in Family Medicine",
    location: "Queens, NY",
    clinicalHistory: "Asthma diagnosed childhood. GERD. Appendectomy 2015.",
    medications: "Albuterol HFA PRN, Omeprazole 20mg daily",
    currentConditions: "Mild persistent asthma, GERD",
    recentLabResults: "PFTs: FEV1 92% predicted. Chest X-ray clear.",
    lastVisit: "2026-05-20", nextAppointment: "2026-07-15",
    age: 34, gender: "Male", bloodType: "B-"
  }
};

// QR Code Upload Component (Modal)
const QRUploadModal: React.FC<{ onScanSuccess: (result: string) => void; onClose: () => void }> = ({ onScanSuccess, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [decoding, setDecoding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrCodeReaderRef = useRef<Html5Qrcode | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDecodeQR = async () => {
    if (!selectedFile || decoding) return;
    
    setDecoding(true);
    
    try {
      let readerElement = document.getElementById("qr-image-reader");
      if (!readerElement) {
        const div = document.createElement("div");
        div.id = "qr-image-reader";
        div.style.display = "none";
        document.body.appendChild(div);
        readerElement = div;
      }
      
      qrCodeReaderRef.current = new Html5Qrcode("qr-image-reader");
      const result = await qrCodeReaderRef.current.scanFile(selectedFile, true);
      
      if (result && result.trim()) {
        onScanSuccess(result);
        onClose();
      } else {
        alert("No QR code found in the image. Please try another image.");
      }
    } catch (error) {
      console.error("Error decoding QR:", error);
      alert("Could not decode QR code from image. Please make sure the image contains a clear QR code.");
    } finally {
      setDecoding(false);
      if (qrCodeReaderRef.current) {
        try {
          await qrCodeReaderRef.current.clear();
        } catch (e) {
          console.error("Error clearing QR reader:", e);
        }
        qrCodeReaderRef.current = null;
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file (PNG, JPG, JPEG)");
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content" style={{ maxWidth: '500px' }}>
        <div className="modal-header">
          <h3>Upload QR Code Image</h3>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        <div className="modal-body" style={{ padding: '24px' }}>
          {!preview ? (
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: '#f8fafc'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.backgroundColor = '#eff6ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                aria-label="Upload QR code image"
                title="Upload QR code image"
              />
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📤</div>
              <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: '#0f172a' }}>
                Click or drag to upload
              </p>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Support PNG, JPG, JPEG files
              </p>
            </div>
          ) : (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={preview} alt="QR Preview" style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }} />
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={handleDecodeQR} 
                  disabled={decoding}
                  style={{ 
                    flex: 1,
                    background: decoding ? '#94a3b8' : 'linear-gradient(135deg, #2563eb, #1e40af)',
                    cursor: decoding ? 'not-allowed' : 'pointer',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600
                  }}
                >
                  {decoding ? '⏳ Decoding...' : '🔍 Decode QR Code'}
                </button>
                <button 
                  onClick={resetUpload}
                  style={{ 
                    flex: 1,
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    color: '#1e293b'
                  }}
                >
                  📷 Choose Another
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <p>Upload a clear image of the QR code for best results</p>
        </div>
      </div>
    </div>
  );
};

const Scanner: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Initialize scanner when cameraActive is true
  useEffect(() => {
    if (cameraActive && !scannerRef.current) {
      const timer = setTimeout(() => {
        const scannerElement = document.getElementById("qr-reader");
        if (scannerElement && !scannerRef.current) {
          try {
            const scanner = new Html5QrcodeScanner(
              "qr-reader",
              {
                fps: 10,
                qrbox: { width: 280, height: 280 },
                aspectRatio: 1.0,
                showTorchButtonIfSupported: true,
                showZoomSliderIfSupported: true,
                defaultZoomValueIfSupported: 2,
              },
              false
            );
            
            scannerRef.current = scanner;
            
            scanner.render(
              (decodedText) => {
                if (decodedText && decodedText.trim() && !isScanning) {
                  handleScan(decodedText);
                }
              },
              (errorMessage) => {
                console.debug("Scanning...", errorMessage);
              }
            );
          } catch (error) {
            console.error("Error initializing scanner:", error);
            alert("Failed to initialize camera. Please check camera permissions.");
            setCameraActive(false);
          }
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [cameraActive]);

  // Cleanup scanner when camera is deactivated
  useEffect(() => {
    if (!cameraActive && scannerRef.current) {
      try {
        scannerRef.current.clear();
      } catch (e) {
        console.error("Error clearing scanner:", e);
      }
      scannerRef.current = null;
    }
  }, [cameraActive]);

  const handleScan = async (result: string) => {
    if (isScanning) return;
    setIsScanning(true);
    setLoading(true);
    setError(null);
    
    let patientId = result.trim();
    if (patientId.includes(':')) {
      patientId = patientId.split(':').pop() || patientId;
    }
    if (patientId.includes('/')) {
      patientId = patientId.split('/').pop() || patientId;
    }
    
    console.log("Extracted Patient ID:", patientId);
    
    setTimeout(() => {
      const data = MOCK_PATIENT_DB[patientId];
      if (data) {
        setPatient(data);
        setError(null);
        // Stop camera after successful scan
        setCameraActive(false);
      } else {
        setError(`Patient with ID "${patientId}" not found in database`);
        setPatient(null);
      }
      setLoading(false);
      setIsScanning(false);
    }, 500);
  };

  const handleUploadSuccess = (result: string) => {
    handleScan(result);
    setShowUpload(false);
  };

  const startCamera = () => {
    setCameraActive(true);
    setError(null);
  };

  const stopCamera = () => {
    setCameraActive(false);
  };

  return (
    <div style={{
      padding: '24px',
      minHeight: 'calc(100vh - 80px)',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
      borderRadius: '16px',
    }}>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .modal-content {
          background: white;
          border-radius: 24px;
          max-width: 550px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalIn 0.2s ease;
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .modal-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #64748b;
          transition: all 0.2s;
          padding: 0 8px;
          line-height: 1;
        }
        .close-btn:hover {
          color: #0f172a;
          transform: scale(1.1);
        }
        .modal-footer {
          padding: 14px;
          text-align: center;
          background: #eff6ff;
          font-size: 13px;
          color: #2563eb;
          font-weight: 500;
          border-top: 1px solid #e2e8f0;
        }
        #qr-reader {
          padding: 20px;
        }
        #qr-reader video {
          border-radius: 16px;
          width: 100% !important;
        }
        #qr-reader__scan_region {
          min-height: 400px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Left Card - QR Scanner Options */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Scan Patient QR
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {cameraActive ? 'Camera is active - position QR code in frame' : 'Scan QR code for instant medical records'}
            </p>
          </div>
          <div style={{ padding: '32px 28px', textAlign: 'center' }}>
            {!cameraActive ? (
              <>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={startCamera} style={{
                    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 32px',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>📷 Start Camera</button>
                  <button onClick={() => setShowUpload(true)} style={{
                    background: 'transparent',
                    border: '2px solid #2563eb',
                    color: '#2563eb',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}>📤 Upload QR Code</button>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 24 }}>Position QR code clearly in front of camera or upload image</p>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 16 }}>
                  Test QR IDs: 112345671, 987654322, 556677883
                </p>
              </>
            ) : (
              <div>
                <div id="qr-reader" style={{ width: '100%', minHeight: '400px' }}></div>
                <button onClick={stopCamera} style={{
                  marginTop: '20px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>⏹️ Stop Camera</button>
                {loading && (
                  <div style={{ marginTop: '20px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      border: '3px solid #e2e8f0',
                      borderTop: '3px solid #2563eb',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                      margin: '0 auto 10px',
                    }}></div>
                    <p style={{ color: '#64748b' }}>Processing...</p>
                  </div>
                )}
              </div>
            )}
            
            {error && !cameraActive && (
              <div style={{
                marginTop: '20px',
                background: '#fef2f2',
                color: '#dc2626',
                padding: '14px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid #fecaca',
              }}>⚠️ {error}</div>
            )}
          </div>
        </div>

        {/* Right Card - Medical Record */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
            borderBottom: '1px solid #e2e8f0',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
              Medical Record
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Complete patient health information
            </p>
          </div>
          
          {patient ? (
            <div style={{ padding: '32px 28px', maxHeight: '600px', overflowY: 'auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 56, marginBottom: 10 }}>👤</div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a' }}>{patient.name}</h3>
                <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Patient ID: {patient.id}</p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
                marginBottom: '24px',
              }}>
                <div style={{ background: '#eff6ff', padding: '14px', textAlign: 'center', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Age</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{patient.age || 'N/A'} years</div>
                </div>
                <div style={{ background: '#eff6ff', padding: '14px', textAlign: 'center', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Gender</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{patient.gender || 'N/A'}</div>
                </div>
                <div style={{ background: '#eff6ff', padding: '14px', textAlign: 'center', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Blood Type</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{patient.bloodType || 'N/A'}</div>
                </div>
                <div style={{ background: '#eff6ff', padding: '14px', textAlign: 'center', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Location</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{patient.location}</div>
                </div>
              </div>

              {(patient.lastVisit || patient.nextAppointment) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
                  {patient.lastVisit && (
                    <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Last Visit</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{patient.lastVisit}</div>
                    </div>
                  )}
                  {patient.nextAppointment && (
                    <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Next Appointment</div>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>{patient.nextAppointment}</div>
                    </div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📋 Clinical History
                </div>
                <div style={{ fontSize: '14px', color: '#475569', background: '#f8fafc', padding: '14px', borderRadius: '12px', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                  {patient.clinicalHistory}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💊 Current Medications
                </div>
                <div style={{ fontSize: '14px', color: '#475569', background: '#f8fafc', padding: '14px', borderRadius: '12px', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                  {patient.medications}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🏥 Current Conditions
                </div>
                <div style={{ fontSize: '14px', color: '#475569', background: '#f8fafc', padding: '14px', borderRadius: '12px', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                  {patient.currentConditions}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🔬 Recent Lab Results
                </div>
                <div style={{ fontSize: '14px', color: '#475569', background: '#f8fafc', padding: '14px', borderRadius: '12px', lineHeight: '1.6', border: '1px solid #e2e8f0' }}>
                  {patient.recentLabResults}
                </div>
              </div>

              <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe', marginTop: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, marginBottom: '6px' }}>Primary Care Provider</div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{patient.doctorName}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{patient.yearsOfPractice} years of experience</div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700 }}>{patient.certifications}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginTop: '28px' }}>
                <button style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #2563eb, #1e40af)',
                  color: 'white',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}>📄 View Full History</button>
                <button style={{
                  flex: 1,
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                }}>🖨️ Print Record</button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 28px' }}>
              <div style={{ fontSize: '72px', marginBottom: '20px', opacity: 0.4 }}>🏥</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '10px' }}>No Record Loaded</h3>
              <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '300px', margin: '0 auto', lineHeight: '1.5' }}>
                Scan a QR code using camera or upload an image to view medical records
              </p>
            </div>
          )}
        </div>
      </div>

      {/* QR Upload Modal - only opens when clicking Upload button */}
      {showUpload && <QRUploadModal onScanSuccess={handleUploadSuccess} onClose={() => setShowUpload(false)} />}
    </div>
  );
};

export default Scanner;