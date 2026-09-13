import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, Smartphone, Mail, CheckSquare } from 'lucide-react';

export default function Login({ onNavigate, onLogin }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    setErrorMsg('');

    if (tab === 'register') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (!identifier.trim()) {
        setErrorMsg('Please enter your email address.');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
      if (!agreedTerms) {
        setErrorMsg('Please agree to terms and conditions.');
        return;
      }
    } else {
      if (!identifier.trim()) {
        setErrorMsg('Please enter your email or mobile number.');
        return;
      }
    }

    if (onLogin) {
      onLogin(identifier.trim(), fullName.trim());
    }
    onNavigate('dashboard');
  };

  return (
    <div className="screen-container login-screen">
      <div className="screen-scroll-body auth-body">
        {/* Dynamic Header */}
        <div className="auth-header">
          <h2 className="auth-title">
            {tab === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="auth-subtitle">
            {tab === 'login'
              ? 'Verify your account to continue'
              : 'Register as Legal Metrology Inspector'}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setTab('login');
              setErrorMsg('');
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setTab('register');
              setErrorMsg('');
            }}
          >
            Register
          </button>
        </div>

        {/* Error notice if any */}
        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: '0.8rem',
              marginBottom: 12
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Register-only: Full Name */}
          {tab === 'register' && (
            <div className="input-group">
              <div className="input-field-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="input-control"
                  placeholder="Full Name (Inspector Name)"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email / Identifier */}
          <div className="input-group">
            <div className="input-field-wrap">
              {tab === 'register' ? (
                <Mail size={18} className="input-icon" />
              ) : (
                <User size={18} className="input-icon" />
              )}
              <input
                type="text"
                className="input-control"
                placeholder={tab === 'register' ? 'Email Address' : 'Email / Mobile Number'}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <div className="input-field-wrap">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-control"
                placeholder={tab === 'register' ? 'Create Password' : 'Password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Register-only: Confirm Password */}
          {tab === 'register' && (
            <div className="input-group">
              <div className="input-field-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          {/* Meta row: Login vs Register */}
          {tab === 'login' ? (
            <div className="auth-meta-row">
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="text-link-btn"
                onClick={() => alert('Password reset link sent to registered email.')}
              >
                Forgot Password?
              </button>
            </div>
          ) : (
            <div className="auth-meta-row" style={{ marginTop: 4 }}>
              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                />
                <span style={{ fontSize: '0.8rem' }}>I agree to Legal Metrology compliance terms</span>
              </label>
            </div>
          )}

          <button type="submit" className="btn-primary full-width" style={{ marginTop: 10 }}>
            {tab === 'login' ? 'Login' : 'Create Account & Continue'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-auth-stack">
          <button
            type="button"
            className="btn-social"
            onClick={() => handleSubmit()}
          >
            <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            className="btn-social"
            onClick={() => handleSubmit()}
          >
            <Smartphone size={18} className="text-secondary" />
            <span>Continue with OTP</span>
          </button>
        </div>

        <div className="auth-footer-note">
          {tab === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-accent"
                onClick={() => {
                  setTab('register');
                  setErrorMsg('');
                }}
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="link-accent"
                onClick={() => {
                  setTab('login');
                  setErrorMsg('');
                }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
