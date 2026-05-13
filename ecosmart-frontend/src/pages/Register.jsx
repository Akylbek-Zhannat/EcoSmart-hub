import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiPost } from '../api/api';

export default function Register() {
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiPost('/auth/register', {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      // Auto-login after successful registration
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
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

        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Start saving energy and money today</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={set('name')}
              placeholder="Zhanibek Akylbek" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" value={form.email} onChange={set('email')}
              placeholder="you@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" value={form.password} onChange={set('password')}
              placeholder="••••••••" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" type="password" value={form.confirm} onChange={set('confirm')}
              placeholder="••••••••" required />
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
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <div className="auth-link">
          Already have an account?{' '}
          <a onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>Sign in</a>
        </div>
      </div>
    </div>
  );
}
