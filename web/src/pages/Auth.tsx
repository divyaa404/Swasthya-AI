// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import '../styles/auth.css';

const Auth: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!loginData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(loginData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (!loginData.password) {
      newErrors.password = "Password is required";
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!validateLogin()) {
      triggerShake();
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(loginData.phoneNumber, loginData.password);
    } catch (err) {
      setError("Invalid phone number or password. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  return (
    <div className="auth-wrapper">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="auth-card">
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
            
            <h2 className="hero-text">Welcome to the Future of Healthcare</h2>
            
            <p className="description">
              Streamline your practice with AI-powered patient management and online consultations.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div>
                  <strong>Smart Patient Management</strong>
                  <p>Track consultations & follow-ups effortlessly</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div>
                  <strong>AI-Powered Insights</strong>
                  <p>Make smarter clinical decisions</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="check-icon">✓</div>
                <div>
                  <strong>Secure & Reliable</strong>
                  <p>Enterprise-grade security for your practice</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="wave-shape" />
          <div className="floating-shapes">
            <span className="floating-dot floating-dot-1" />
            <span className="floating-dot floating-dot-2" />
            <span className="floating-dot floating-dot-3" />
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="right-panel">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Login to your doctor account</p>
          </div>

          <div className={`form-container ${shake ? "shake" : ""}`}>
            <div className="field">
              <label>Phone Number</label>
              <div className={`input-wrap ${errors.phoneNumber ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                </span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  value={loginData.phoneNumber}
                  onChange={(e) => { 
                    setLoginData({ ...loginData, phoneNumber: e.target.value.replace(/\D/g, '') });
                    setError("");
                    if (errors.phoneNumber) {
                      setErrors({ ...errors, phoneNumber: "" });
                    }
                  }}
                  maxLength={10}
                  disabled={loading}
                />
              </div>
              {errors.phoneNumber && <p className="error-msg visible">{errors.phoneNumber}</p>}
            </div>

            <div className="field">
              <label>Password</label>
              <div className={`input-wrap ${errors.password ? 'error' : ''}`}>
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => { 
                    setLoginData({ ...loginData, password: e.target.value }); 
                    setError("");
                    if (errors.password) {
                      setErrors({ ...errors, password: "" });
                    }
                  }}
                  disabled={loading}
                />
                <button 
                  className="eye-toggle" 
                  onClick={() => setShowPassword(!showPassword)} 
                  type="button"
                  disabled={loading}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="error-msg visible">{errors.password}</p>}
              {error && <p className="error-msg visible">{error}</p>}
            </div>

            <div className="extras-row">
              <label className="remember-label" onClick={() => !loading && setRemember(!remember)}>
                <input type="checkbox" readOnly checked={remember} disabled={loading} />
                <span className={`custom-check${remember ? " checked" : ""}`}>
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                Remember me
              </label>
              <button className="forgot-link" disabled={loading}>Forgot Password?</button>
            </div>

            <button
              className="btn-login"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  <span className="btn-text">Signing in…</span>
                </>
              ) : (
                <span className="btn-text">Continue</span>
              )}
            </button>
          </div>

          <p className="signup-row">
            Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;