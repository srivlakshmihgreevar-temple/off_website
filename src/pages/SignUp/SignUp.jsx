import { useState, useEffect, useRef, useCallback } from 'react';
import './SignUp.css';
import { usePageTitle } from '../../hooks/usePageTitle';
import { auth } from '../../firebaseConfig.js';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import {useSSEAvailability} from '../../hooks/useSSEAvailability';

// ─────────────────────────────────────────────
// useDebounce
// ─────────────────────────────────────────────

function useDebounce(value, delay = 600) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─────────────────────────────────────────────
// SSE Hook — real-time availability check
// Used for both email (step 1) and username (step 2)
// Endpoint is passed in so the hook is reusable
// ─────────────────────────────────────────────



// ─────────────────────────────────────────────
// AvailabilityStatus — shared indicator UI
// ─────────────────────────────────────────────

function AvailabilityStatus({ status, value, minLength = 3, takenText, availableText }) {
  if (value.trim().length < minLength) return null;

  const config = {
    idle:      { symbol: '',   text: '',             color: 'transparent' },
    checking:  { symbol: '⟳',  text: 'Checking…',    color: '#C9A227'     },
    available: { symbol: '✓',  text: availableText,  color: '#4CAF50'     },
    taken:     { symbol: '✕',  text: takenText,      color: '#E84040'     },
    error:     { symbol: '!',  text: 'Could not verify', color: '#FF9800' },
  };

  const { symbol, text, color } = config[status];

  return (
    <span className="username-status" style={{ color }}>
      <span>{symbol}</span>
      <span>{text}</span>
    </span>
  );
}

// ─────────────────────────────────────────────
// PasswordStrength
// ─────────────────────────────────────────────

function PasswordStrength({ password }) {
  const requirements = [
    [password.length >= 8,                                         'Minimum 8 characters'         ],
    [/[A-Z]/.test(password),                                      'At least one uppercase letter' ],
    [/[a-z]/.test(password),                                      'At least one lowercase letter' ],
    [/[0-9]/.test(password),                                      'At least one digit'            ],
    [/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),     'At least one special character'],
  ];

  const metCount = requirements.filter(([met]) => met).length;

  const color =
    metCount <= 2 ? '#e74c3c' :
    metCount <= 3 ? '#f39c12' :
    metCount <= 4 ? '#3498db' :
                    '#27ae60';

  const label =
    metCount <= 2 ? 'Weak' :
    metCount <= 3 ? 'Fair' :
    metCount <= 4 ? 'Good' :
                    'Strong';

  return (
    <div className="password-strength-container">
      <div className="strength-bar-wrapper">
        <div className="strength-bar">
          <div
            className="strength-fill"
            style={{ width: `${(metCount / 5) * 100}%`, backgroundColor: color }}
          />
        </div>
        <span className="strength-label" style={{ color }}>{label}</span>
      </div>
      <div className="requirements-list">
        {requirements.map(([met, text]) => (
          <div key={text} className={`requirement ${met ? 'met' : ''}`}>
            <span className="requirement-icon">{met ? '✓' : '○'}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const INITIAL_FORM = {
  name:            '',
  phoneNumber:     '',
  email:           '',
  username:        '',
  password:        '',
  confirmPassword: '',
};

const SLHT_EMAIL_RE = /^[a-zA-Z0-9._%+-]+@slht\.com$/;

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function SignUp() {
  usePageTitle('Sign Up | Sri Lakshmi Hayagriva Perumal Temple');

  const [step, setStep]                               = useState(1);
  const [formData, setFormData]                       = useState(INITIAL_FORM);
  const [errors, setErrors]                           = useState({});
  const [isLoading, setIsLoading]                     = useState(false);
  const [successMessage, setSuccessMessage]           = useState('');
  const [showPassword, setShowPassword]               = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const API_SERVER = 'http://localhost:3000';
  // Step 1 — SSE checks whether the @slht.com email doc already exists
  const debouncedEmail = useDebounce(formData.email, 600);
  const {
    status: emailStatus,
    setStatus: setEmailStatus,
    closeStream: closeEmailStream,
  } = useSSEAvailability(
    // Only feed the hook when it looks like a valid @slht.com address
    SLHT_EMAIL_RE.test(formData.email) ? debouncedEmail : '',
    '/stream/email',
    6  // min length — shortest possible @slht.com addr is "a@slht.com" (10 chars)
       // but we start after the hook's own trim; pass a low number and let regex gate it
  );

  // Step 2 — SSE checks username availability in real time
  const debouncedUsername = useDebounce(formData.username, 600);
  const {
    status: usernameStatus,
    setStatus: setUsernameStatus,
    closeStream: closeUsernameStream,
  } = useSSEAvailability(debouncedUsername, '/stream/username', 3);

  // ── Derived password state ────────────────────

  const passwordRequirements = {
    minLength:      formData.password.length >= 8,
    hasUpperCase:   /[A-Z]/.test(formData.password),
    hasLowerCase:   /[a-z]/.test(formData.password),
    hasDigit:       /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password),
  };
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  // ── Handlers ─────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset SSE status immediately on keystroke so stale ✓/✕ never lingers
    if (name === 'email')    setEmailStatus('idle');
    if (name === 'username') setUsernameStatus('idle');

    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const e = {};
    if (!formData.name.trim())
      e.name = 'Name is required';
    if (!formData.phoneNumber.trim())
      e.phoneNumber = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, '')))
      e.phoneNumber = 'Please enter a valid 10-digit phone number';
    if (!formData.email.trim())
      e.email = 'Email is required';
    else if (!SLHT_EMAIL_RE.test(formData.email))
      e.email = 'Only @slht.com email addresses are allowed';
    else if (emailStatus === 'taken')
      e.email = 'This email is already registered';
    else if (emailStatus !== 'available')
      e.email = 'Please wait for email verification to complete';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!formData.username.trim())
      e.username = 'Username is required';
    else if (formData.username.length < 3)
      e.username = 'Username must be at least 3 characters';
    else if (usernameStatus === 'taken')
      e.username = 'Username already taken';
    else if (usernameStatus !== 'available')
      e.username = 'Please wait for username check to complete';
    if (!isPasswordValid)
      e.password = 'Password does not meet all requirements';
    if (formData.password !== formData.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (validateStep1()) {
      closeEmailStream(); // Email confirmed — stop listening
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    if (usernameStatus !== 'available') return;

    closeUsernameStream(); // Username being claimed — stop listening

    setIsLoading(true);
    setSuccessMessage('');

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // After createUserWithEmailAndPassword OR signInWithPopup — same call either way
        const token = await user.getIdToken();

        await fetch(`${API_SERVER}/signup`, {
        method:  'POST',
        headers: {
            'Content-Type':  'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            displayName: formData.name,
            phoneNumber: formData.phoneNumber,
            username:    formData.username,   // Google sign-in can pass displayName here
        }),
        });


      setSuccessMessage('Account created successfully! Redirecting…');
      setFormData(INITIAL_FORM);
      setTimeout(() => { window.location.href = '/dashboard'; }, 2000);

    } catch (error) {
      const map = {
        'auth/email-already-in-use': 'This email is already registered. Please log in.',
        'auth/invalid-email':        'Invalid email address.',
        'auth/weak-password':        'Password is too weak.',
      };
      setErrors({ submit: map[error.code] ?? 'Sign up failed. Please try again.' });
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    setIsLoading(true);
    try {
      const { user } = await signInWithPopup(auth, provider);

      const idToken = await user.getIdToken();

      const response = await fetch(`${API_SERVER}/signup`, {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName ?? '',
          phoneNumber: user.phoneNumber ?? '',
          // Google has no username — derive one from displayName, same as server does
          username: (user.displayName).toLowerCase().replace(/\s+/g, ''),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ submit: data.error ?? 'Sign up failed. Please try again.' });
        return;
      }

      window.location.href = '/dashboard';

    } catch (error) {
      setErrors({ submit: 'Google Sign-In failed. Please try again.' });
      console.error('Google sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ────────────────────────────────────

  return (
    <div className="signup-page">
      <div className="signup-left-accent" aria-hidden="true" />

      <div className="signup-container">

        {/* Left decorative panel */}
        <div className="signup-left" aria-hidden="true">
          <div className="temple-photo-placeholder">
            <div className="placeholder-content">
              <h2>ஸ்ரீ ஹயக்ரீவர்</h2>
              <p>Sri Lakshmi Hayagreeva Perumal Temple<br />Chivada</p>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="signup-right">
          <div className="signup-form-wrapper">

            {/* Header */}
            <div className="signup-header">
              <p className="signup-eyebrow">{step === 1 ? 'Step 1 of 2' : 'Step 2 of 2'}</p>
              <h1 className="signup-title">
                {step === 1 ? 'Create Account' : 'Set Credentials'}
              </h1>
              <div className="signup-rule" />
              <p className="signup-subtitle">
                {step === 1
                  ? 'Enter your personal details to begin'
                  : 'Choose a username and secure password'}
              </p>
              <div className="step-indicator">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
                <div className="step-line" />
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
              </div>
            </div>

            {/* Banners */}
            {errors.submit  && <div className="error-banner">{errors.submit}</div>}
            {successMessage && <div className="success-banner">{successMessage}</div>}

            {/* ── STEP 1: Personal Info ── */}
            {step === 1 && (
              <div className="signup-form">

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    autoComplete="name"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                    autoComplete="tel"
                  />
                  {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Choose an Email Address (@slht.com)*</label>
                  <div className="username-input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="yourname@slht.com"
                      className={`form-input
                        ${errors.email ? 'error' : ''}
                        ${emailStatus === 'available' ? 'success' : ''}
                      `}
                      autoComplete="email"
                    />
                    <AvailabilityStatus
                      status={emailStatus}
                      value={formData.email}
                      minLength={6}
                      availableText="Email is available"
                      takenText="Email already registered"
                    />
                  </div>
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <button
                  type="button"
                  className="submit-button"
                  onClick={handleContinue}
                  disabled={isLoading}
                >
                  Continue →
                </button>

                <div className="divider"><span>or</span></div>

                <button
                  type="button"
                  className="google-signin-button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width="18"
                    height="18"
                    className='google-icon'
                  />
                  Continue with Google
                </button>

                <div className="signup-footer">
                  <p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
                </div>

              </div>
            )}

            {/* ── STEP 2: Credentials ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="signup-form">

                {/* Username */}
                <div className="form-group">
                  <label htmlFor="username" className="form-label">Username *</label>
                  <div className="username-input-wrapper">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a unique username"
                      className={`form-input
                        ${errors.username ? 'error' : ''}
                        ${usernameStatus === 'available' ? 'success' : ''}
                      `}
                      autoComplete="username"
                    />
                    <AvailabilityStatus
                      status={usernameStatus}
                      value={debouncedUsername}
                      minLength={3}
                      availableText="Username is available"
                      takenText="Username already taken"
                    />
                  </div>
                  {errors.username && <span className="error-text">{errors.username}</span>}
                </div>

                {/* Password */}
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className={`form-input ${errors.password ? 'error' : ''}`}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(p => !p)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {formData.password && <PasswordStrength password={formData.password} />}
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className={`form-input
                        ${errors.confirmPassword ? 'error' : ''}
                        ${formData.confirmPassword && formData.password === formData.confirmPassword ? 'success' : ''}
                      `}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(p => !p)}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-text">{errors.confirmPassword}</span>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <span className="success-text">✓ Passwords match</span>
                  )}
                </div>

                {/* Actions */}
                <div className="step2-actions">
                  <button type="button" className="back-button" onClick={handleBack}>
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || usernameStatus !== 'available'}
                    className="submit-button step2-submit"
                  >
                    {isLoading ? 'Creating Account…' : 'Create Account'}
                  </button>
                </div>

                <div className="divider"><span>or</span></div>

                <button
                  type="button"
                  className="google-signin-button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    width="18"
                    height="18"
                  />
                  Continue with Google
                </button>

                <div className="signup-footer">
                  <p>Already have an account? <a href="/login" className="login-link">Sign In</a></p>
                </div>

              </form>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}