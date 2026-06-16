// src/pages/SignUp.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles/auth.css';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shake, setShake] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    medicalRegNumber: "",
    specialization: ""
  });

  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "General Physician",
    "Dentist",
    "Orthopedic Surgeon",
    "Pediatrician",
    "Psychiatrist",
    "Radiologist",
    "Surgeon",
    "Ophthalmologist",
    "ENT Specialist",
    "Gynecologist",
    "Neurologist",
    "Oncologist",
    "Urologist",
    "Anesthesiologist",
    "Pathologist",
    "Emergency Medicine",
    "Family Medicine",
    "Internal Medicine"
  ];

  const steps = [
    { number: 1, label: "Account" },
    { number: 2, label: "Verification" },
    { number: 3, label: "Review" }
  ];

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.medicalRegNumber.trim()) {
      newErrors.medicalRegNumber = "Medical registration number is required";
    }
    
    if (!formData.specialization) {
      newErrors.specialization = "Please select a specialization";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;
    
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }
    
    if (!isValid) {
      triggerShake();
      return;
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <div className="field">
              <label>Full Name <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.fullName ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Dr. First Name + Last Name"
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({...formData, fullName: e.target.value});
                    if (errors.fullName) setErrors({...errors, fullName: ""});
                  }}
                />
              </div>
              {errors.fullName && <p className="error-msg visible">{errors.fullName}</p>}
            </div>

            <div className="field">
              <label>Mobile Number <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.mobileNumber ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <input
                  type="tel"
                  placeholder="For OTP verification and communication"
                  value={formData.mobileNumber}
                  onChange={(e) => {
                    setFormData({...formData, mobileNumber: e.target.value.replace(/\D/g, '')});
                    if (errors.mobileNumber) setErrors({...errors, mobileNumber: ""});
                  }}
                  maxLength={10}
                />
              </div>
              {errors.mobileNumber && <p className="error-msg visible">{errors.mobileNumber}</p>}
            </div>

            <div className="field">
              <label>Password <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.password ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Secure login credential"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({...formData, password: e.target.value});
                    if (errors.password) setErrors({...errors, password: ""});
                  }}
                />
              </div>
              {errors.password && <p className="error-msg visible">{errors.password}</p>}
            </div>

            <div className="field">
              <label>Confirm Password <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.confirmPassword ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({...formData, confirmPassword: e.target.value});
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ""});
                  }}
                />
              </div>
              {errors.confirmPassword && <p className="error-msg visible">{errors.confirmPassword}</p>}
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="field">
              <label>Medical Registration Number <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.medicalRegNumber ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Mandatory to verify licensed doctor"
                  value={formData.medicalRegNumber}
                  onChange={(e) => {
                    setFormData({...formData, medicalRegNumber: e.target.value});
                    if (errors.medicalRegNumber) setErrors({...errors, medicalRegNumber: ""});
                  }}
                />
              </div>
              {errors.medicalRegNumber && <p className="error-msg visible">{errors.medicalRegNumber}</p>}
            </div>

            <div className="field">
              <label>Specialization <span className="required-star">*</span></label>
              <div className={`input-wrap ${errors.specialization ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </span>
                <select
                  value={formData.specialization}
                  onChange={(e) => {
                    setFormData({...formData, specialization: e.target.value});
                    if (errors.specialization) setErrors({...errors, specialization: ""});
                  }}
                  className="specialization-select"
                >
                  <option value="">Select your specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              {errors.specialization && <p className="error-msg visible">{errors.specialization}</p>}
            </div>
          </>
        );
      case 3:
        return (
          <div className="review-container">
            <div className="review-item">
              <span className="review-label">Full Name</span>
              <span className="review-value">{formData.fullName || "Not provided"}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Mobile Number</span>
              <span className="review-value">{formData.mobileNumber || "Not provided"}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Medical Registration</span>
              <span className="review-value">{formData.medicalRegNumber || "Not provided"}</span>
            </div>
            <div className="review-item">
              <span className="review-label">Specialization</span>
              <span className="review-value">{formData.specialization || "Not provided"}</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card signup-card">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="content-box">
            <div className="logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            
            <h1 className="brand-title">Swasthya</h1>
            <p className="brand-tagline">AI</p>
            
            <div className="divider-line"></div>
            
            <p className="description" style={{ fontSize: '14px', opacity: 0.85 }}>
              AI powered healthcare platform connecting doctors with patients for better care.
            </p>
          </div>
          
          <div className="wave-shape" />
          <div className="floating-shapes">
            <span className="floating-dot floating-dot-1" />
            <span className="floating-dot floating-dot-2" />
            <span className="floating-dot floating-dot-3" />
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="form-header">
            <h1>Create Account</h1>
            <p>Join the future of healthcare</p>
          </div>

          {/* Horizontal Stepper */}
          <div className="stepper-container">
            {steps.map((step, index) => (
              <div key={step.number} className="stepper-wrapper">
                <div className={`stepper-step ${
                  currentStep === step.number ? 'active' : 
                  currentStep > step.number ? 'completed' : ''
                }`}>
                  <span className="step-number">{step.number}</span>
                  <span>{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`stepper-line ${
                    currentStep > step.number ? 'active' : ''
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className={`form-container ${shake ? "shake" : ""}`}>
            {renderStepContent()}

            <div className="button-row">
              {currentStep > 1 && (
                <button className="btn-back" onClick={handleBack} disabled={loading}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5" />
                    <path d="M12 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              )}
              
              <div className="button-spacer"></div>
              
              {currentStep < 3 ? (
                <button className="btn-login" onClick={handleNext} disabled={loading}>
                  <span className="btn-text">Next →</span>
                </button>
              ) : (
                <button className="btn-login" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="btn-spinner" />
                      <span className="btn-text">Creating…</span>
                    </>
                  ) : (
                    <span className="btn-text">Create Account</span>
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="signup-row">
            Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;