import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail]     = useState('demo@ecosmart.kz');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, var(--primary), #22c55e)',
              borderRadius: 12, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22
            }}>⚡</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18 }}>
              EcoSmart Hub
            </span>
          </div>
        </div>

        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your smart home dashboard</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{
              marginBottom: 12, padding: '10px 14px',
              background: 'var(--danger-dim)',
              border: '1px solid rgba(248,113,113,0.3)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13, color: 'var(--danger)'
            }}>{error}</div>
          )}

          <button className="form-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-link">
          No account?{' '}
          <a onClick={() => navigate('/register')} style={{ cursor: 'pointer' }}>
            Create one
          </a>
        </div>

        <div style={{
          marginTop: 24, padding: '12px 16px',
          background: 'var(--primary-dim)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid rgba(74,222,128,0.2)',
          fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center'
        }}>
          🔑 Demo credentials pre-filled — just click <strong style={{ color: 'var(--primary)' }}>Sign In</strong>
        </div>
      </div>
    </div>
  );
}
