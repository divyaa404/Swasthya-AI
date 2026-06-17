// src/pages/Profile.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import '../styles/profile.css';

interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  gender: string;
  languages: string;
}

interface ProfessionalDetails {
  specialization: string;
  qualification: string;
  registrationNumber: string;
  yearsOfExperience: string;
  aboutMe: string;
}

interface Availability {
  consultationFee: string;
  timings: string;
}

const Profile: React.FC = () => {
  const { user, profile, isAuthenticated, loading, updateProfile } = useAuth();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    fullName: user?.fullName || '',
    dateOfBirth: user?.dateOfBirth || '',
    email: user?.email || '',
    phone: user?.phoneNumber || '',
    gender: user?.gender || '',
    languages: user?.languages || '',
  });

  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetails>({
    specialization: user?.specialization || '',
    qualification: user?.qualification || '',
    registrationNumber: user?.registrationNumber || '',
    yearsOfExperience: user?.yearsOfExperience || '',
    aboutMe: user?.aboutMe || '',
  });

  const [availability, setAvailability] = useState<Availability>({
    consultationFee: user?.consultationFee || '',
    timings: user?.timings || '',
  });

  useEffect(() => {
    if (user) {
      setPersonalInfo(prev => ({
        ...prev,
        fullName: user.fullName || prev.fullName,
        email: user.email || prev.email,
        phone: user.phoneNumber || prev.phone,
        dateOfBirth: user.dateOfBirth || prev.dateOfBirth,
        gender: user.gender || prev.gender,
        languages: user.languages || prev.languages,
      }));
      
      setProfessionalDetails(prev => ({
        ...prev,
        specialization: user.specialization || prev.specialization,
        registrationNumber: user.registrationNumber || prev.registrationNumber,
        qualification: user.qualification || prev.qualification,
        yearsOfExperience: user.yearsOfExperience || prev.yearsOfExperience,
        aboutMe: user.aboutMe || prev.aboutMe,
      }));
      
      setAvailability(prev => ({
        ...prev,
        consultationFee: user.consultationFee || prev.consultationFee,
        timings: user.timings || prev.timings,
      }));
    }
  }, [user]);

  const toggleEdit = (section: string) => {
    if (editingSection === section) {
      saveUserData();
    } else {
      setEditingSection(section);
      if (section === 'about' && aboutRef.current) {
        setTimeout(() => {
          aboutRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest'
          });
        }, 100);
      }
    }
  };

  const saveUserData = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const updateData: any = {
        full_name: personalInfo.fullName,
        date_of_birth: personalInfo.dateOfBirth || null,
        email: personalInfo.email,
        phone_number: personalInfo.phone,
        gender: personalInfo.gender || null,
        languages: personalInfo.languages || null,
        specialization: professionalDetails.specialization || null,
        qualification: professionalDetails.qualification || null,
        registration_number: professionalDetails.registrationNumber || null,
        years_of_experience: professionalDetails.yearsOfExperience || null,
        about_me: professionalDetails.aboutMe || null,
        consultation_fee: availability.consultationFee || null,
        timings: availability.timings || null,
      };

      await updateProfile(updateData);
      setSaveMessage({ type: 'success', text: 'Profile saved successfully!' });
      setEditingSection(null);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setSaveMessage({ type: 'error', text: error.message || 'Failed to save profile' });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  useEffect(() => {
    if (editingSection === 'about' && aboutRef.current) {
      const scrollY = window.scrollY;
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollY);
      });
    }
  }, [editingSection]);

  if (loading) {
    return (
      <div className="profile-wrapper">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-wrapper">
        <div className="profile-not-logged-in">
          <h2>Please Log In</h2>
          <p>You need to be logged in to view your profile.</p>
          <button className="profile-login-btn" onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-header-bar">
        <div className="profile-title-section">
          <h1 className="profile-name">{personalInfo.fullName || 'User'}</h1>
          <span className="profile-specialization">
            {professionalDetails.specialization || 'Not Specified'}
          </span>
          {user.role && (
            <span className={`profile-role-badge ${user.role}`}>
              {user.role === 'doctor' ? '👨‍⚕️ Doctor' : '👤 Patient'}
            </span>
          )}
        </div>
      </div>

      {saveMessage && (
        <div className={`profile-save-message ${saveMessage.type}`}>
          {saveMessage.text}
        </div>
      )}

      <div className="profile-body">
        <div className="profile-two-column">
          <div className="profile-left-column">
            <div className="profile-card">
              <div className="profile-card-header">
                <h2 className="profile-card-title">Personal Information</h2>
                <button 
                  className={`profile-section-edit-btn ${editingSection === 'personal' ? 'save-mode' : ''}`}
                  onClick={() => toggleEdit('personal')}
                  disabled={saving}
                >
                  {editingSection === 'personal' ? (saving ? 'Saving...' : 'Save Changes') : 'Edit'}
                </button>
              </div>
              <div className="profile-info-list">
                <div className="profile-info-row">
                  <div className="profile-info-label">Full Name</div>
                  {editingSection === 'personal' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={personalInfo.fullName} 
                      onChange={(e) => setPersonalInfo({...personalInfo, fullName: e.target.value})} 
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="profile-info-value">{personalInfo.fullName || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Date of Birth</div>
                  {editingSection === 'personal' ? (
                    <input 
                      type="date" 
                      className="profile-info-input"
                      value={personalInfo.dateOfBirth} 
                      onChange={(e) => setPersonalInfo({...personalInfo, dateOfBirth: e.target.value})} 
                    />
                  ) : (
                    <div className="profile-info-value">{personalInfo.dateOfBirth || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Email Address</div>
                  {editingSection === 'personal' ? (
                    <input 
                      type="email" 
                      className="profile-info-input"
                      value={personalInfo.email} 
                      onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})} 
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="profile-info-value">{personalInfo.email || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Phone Number</div>
                  {editingSection === 'personal' ? (
                    <input 
                      type="tel" 
                      className="profile-info-input"
                      value={personalInfo.phone} 
                      onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})} 
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="profile-info-value">{personalInfo.phone || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Gender</div>
                  {editingSection === 'personal' ? (
                    <select 
                      className="profile-info-input"
                      value={personalInfo.gender} 
                      onChange={(e) => setPersonalInfo({...personalInfo, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <div className="profile-info-value">{personalInfo.gender || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Languages Known</div>
                  {editingSection === 'personal' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={personalInfo.languages} 
                      onChange={(e) => setPersonalInfo({...personalInfo, languages: e.target.value})} 
                      placeholder="e.g., English, Spanish"
                    />
                  ) : (
                    <div className="profile-info-value">{personalInfo.languages || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-card" ref={aboutRef}>
              <div className="profile-card-header">
                <h2 className="profile-card-title">About Me</h2>
                <button 
                  className={`profile-section-edit-btn ${editingSection === 'about' ? 'save-mode' : ''}`}
                  onClick={() => toggleEdit('about')}
                  disabled={saving}
                >
                  {editingSection === 'about' ? (saving ? 'Saving...' : 'Save Changes') : 'Edit'}
                </button>
              </div>
              <div className="profile-about-container">
                {editingSection === 'about' ? (
                  <textarea 
                    className="profile-about-textarea"
                    value={professionalDetails.aboutMe} 
                    onChange={(e) => setProfessionalDetails({...professionalDetails, aboutMe: e.target.value})} 
                    rows={6}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="profile-about-text">{professionalDetails.aboutMe || 'No about me information provided.'}</div>
                )}
              </div>
            </div>
          </div>

          <div className="profile-right-column">
            <div className="profile-card">
              <div className="profile-card-header">
                <h2 className="profile-card-title">Professional Details</h2>
                <button 
                  className={`profile-section-edit-btn ${editingSection === 'professional' ? 'save-mode' : ''}`}
                  onClick={() => toggleEdit('professional')}
                  disabled={saving}
                >
                  {editingSection === 'professional' ? (saving ? 'Saving...' : 'Save Changes') : 'Edit'}
                </button>
              </div>
              <div className="profile-info-list">
                <div className="profile-info-row">
                  <div className="profile-info-label">Specialization</div>
                  {editingSection === 'professional' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={professionalDetails.specialization} 
                      onChange={(e) => setProfessionalDetails({...professionalDetails, specialization: e.target.value})} 
                      placeholder="Enter your specialization"
                    />
                  ) : (
                    <div className="profile-info-value">{professionalDetails.specialization || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Qualification</div>
                  {editingSection === 'professional' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={professionalDetails.qualification} 
                      onChange={(e) => setProfessionalDetails({...professionalDetails, qualification: e.target.value})} 
                      placeholder="Enter your qualifications"
                    />
                  ) : (
                    <div className="profile-info-value">{professionalDetails.qualification || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Registration Number</div>
                  {editingSection === 'professional' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={professionalDetails.registrationNumber} 
                      onChange={(e) => setProfessionalDetails({...professionalDetails, registrationNumber: e.target.value})} 
                      placeholder="Enter registration number"
                    />
                  ) : (
                    <div className="profile-info-value">{professionalDetails.registrationNumber || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Years of Experience</div>
                  {editingSection === 'professional' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={professionalDetails.yearsOfExperience} 
                      onChange={(e) => setProfessionalDetails({...professionalDetails, yearsOfExperience: e.target.value})} 
                      placeholder="e.g., 5+ Years"
                    />
                  ) : (
                    <div className="profile-info-value">{professionalDetails.yearsOfExperience || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-card">
              <div className="profile-card-header">
                <h2 className="profile-card-title">Availability</h2>
                <button 
                  className={`profile-section-edit-btn ${editingSection === 'availability' ? 'save-mode' : ''}`}
                  onClick={() => toggleEdit('availability')}
                  disabled={saving}
                >
                  {editingSection === 'availability' ? (saving ? 'Saving...' : 'Save Changes') : 'Edit'}
                </button>
              </div>
              <div className="profile-info-list">
                <div className="profile-info-row">
                  <div className="profile-info-label">Consultation Fee</div>
                  {editingSection === 'availability' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={availability.consultationFee} 
                      onChange={(e) => setAvailability({...availability, consultationFee: e.target.value})} 
                      placeholder="e.g., $100"
                    />
                  ) : (
                    <div className="profile-info-value">{availability.consultationFee || 'Not provided'}</div>
                  )}
                </div>
                <div className="profile-info-row">
                  <div className="profile-info-label">Available Timings</div>
                  {editingSection === 'availability' ? (
                    <input 
                      type="text" 
                      className="profile-info-input"
                      value={availability.timings} 
                      onChange={(e) => setAvailability({...availability, timings: e.target.value})} 
                      placeholder="e.g., 10:00 AM - 08:00 PM"
                    />
                  ) : (
                    <div className="profile-info-value">{availability.timings || 'Not provided'}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;