import React, { useState } from 'react';
import './Auth.css';

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = isLogin 
      ? 'http://127.0.0.1:5000/api/auth/login'
      : 'http://127.0.0.1:5000/api/auth/register';
    
    const body = isLogin 
      ? { email, password, role } 
      : { name, email, password, role };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      if (isLogin) {
        localStorage.setItem('token', data.access_token);
        onLogin(data.user);
      } else {
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="brand-panel">
        <div className="brand-grid"></div>
        <div className="brand-glow"></div>

        <div className="brand-top">
          <div className="brand-logo">
            <div className="logo-icon">⬡</div>
            <div className="logo-text">
              <span className="logo-name">CivicLens</span>
              <span className="logo-sub">Intelligence Platform</span>
            </div>
          </div>

          <div className="brand-headline">Smart Governance<br />Starts Here</div>
          <div className="brand-tagline">
            Real-time civic intelligence for municipal authorities. Analyze
            complaints, track issues, and make data-driven decisions across your
            city.
          </div>

          <div className="brand-pills">
            <div className="pill"><div className="pill-dot" style={{background: '#2563eb'}}></div>Complaint Analytics</div>
            <div className="pill"><div className="pill-dot" style={{background: '#10b981'}}></div>Live Map View</div>
            <div className="pill"><div className="pill-dot" style={{background: '#f59e0b'}}></div>Priority Alerts</div>
            <div className="pill"><div className="pill-dot" style={{background: '#8b5cf6'}}></div>AI Insights</div>
          </div>
        </div>

        <div className="brand-bottom">
          <div className="brand-stat-row">
            <div className="brand-stat"><div className="stat-val">4 Zones</div><div className="stat-lbl">Delhi Regions</div></div>
            <div className="brand-stat"><div className="stat-val">15+</div><div className="stat-lbl">Issue Types</div></div>
            <div className="brand-stat"><div className="stat-val">Live</div><div className="stat-lbl">Real-time Data</div></div>
          </div>
          <div className="brand-footer">
            © 2024 CivicLens — Delhi Municipal Corporation
          </div>
        </div>
      </div>

      <div className="form-panel">
        <div className="form-card">
          <div className="mobile-header">
            <div className="logo-icon" style={{width: 36, height: 36, fontSize: 17}}>⬡</div>
            <div>
              <div style={{fontWeight: 800, fontSize: 16, color: 'var(--navy)'}}>CivicLens</div>
              <div style={{fontSize: 11, color: 'var(--hint)', letterSpacing: 0.5, textTransform: 'uppercase'}}>Intelligence Platform</div>
            </div>
          </div>

          <div className="view active">
            <div className="form-header">
              <div className="form-title">{isLogin ? "Welcome back" : "Create account"}</div>
              <div className="form-sub">{isLogin ? "Sign in to your account" : "Register as a civic officer or user"}</div>
            </div>

            {error && <div className="alert error show">{error}</div>}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <div className="input-wrap">
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              )}

              <div className="field">
                <label className="field-label">Email Address</label>
                <div className="input-wrap">
                  <input 
                    type="email" 
                    placeholder="user@example.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">Password</label>
                <div className="input-wrap">
                  <input 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <div className="field">
                <label className="field-label">{isLogin ? "Login As" : "Register As"}</label>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    type="button" 
                    className={`role-btn ${role === 'user' ? 'active' : ''}`}
                    onClick={() => setRole('user')}
                  >
                    User
                  </button>
                  <button 
                    type="button" 
                    className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                    onClick={() => setRole('admin')}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="row-between">
                  <label className="checkbox-wrap">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <button type="button" className="link-btn">Forgot password?</button>
                </div>
              )}

              <button type="submit" className={`btn-primary ${loading ? 'loading' : ''}`} disabled={loading}>
                <span className="btn-text">{isLogin ? "Sign In →" : "Register →"}</span>
                <div className="btn-spinner"></div>
              </button>
            </form>

            <div className="divider">
              <div className="divider-line"></div>
              <span className="divider-text">OR</span>
              <div className="divider-line"></div>
            </div>

            <div className="toggle-row">
              {isLogin ? "New to CivicLens?" : "Already have an account?"}
              <button 
                type="button"
                className="link-btn" 
                style={{marginLeft: 5}}
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
              >
                {isLogin ? "Create an account" : "Sign in instead"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
