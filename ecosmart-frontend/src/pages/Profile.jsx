import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { mockUser } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { apiGet, apiPut } from '../api/api';
import { Save, Bell, Shield, Zap, User } from 'lucide-react';

export default function Profile() {
  const { user: authUser } = useAuth();
  const [user,  setUser]  = useState(mockUser);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const userId = authUser?.id;
    if (!userId) return;
    apiGet(`/profile/${userId}`)
      .then(data => {
        setUser({
          ...data,
          // avatar is not returned by the profile endpoint; derive from name
          avatar: data.name ? data.name.slice(0, 2).toUpperCase() : '??',
          // ensure notifications object always exists
          notifications: data.notifications || mockUser.notifications,
        });
      })
      .catch(() => {});
  }, [authUser?.id]);

  const set = k => e => setUser(u => ({ ...u, [k]: e.target.value }));
  const setNotif = k => setUser(u => ({
    ...u, notifications: { ...u.notifications, [k]: !u.notifications[k] }
  }));

  const handleSave = async () => {
    const userId = authUser?.id;
    if (userId) {
      try {
        await apiPut(`/profile/${userId}`, {
          name:      user.name,
          email:     user.email,
          apartment: user.apartment,
          budget:    Number(user.budget),
          tariff:    Number(user.tariff),
          currency:  user.currency,
        });
      } catch {}
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const Toggle = ({ on, onClick }) => (
    <button className={`toggle-track ${on ? 'on' : ''}`} onClick={onClick} type="button" />
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="card section-gap">
      <div className="card-header" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: 'var(--primary-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={16} color="var(--primary)" />
          </div>
          <div className="card-title">{title}</div>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <Layout title="Profile & Settings">
      <div style={{ maxWidth: 700 }}>
        {/* Profile */}
        <Section title="Profile Information" icon={User}>
          <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), #818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 700, color: 'white', flexShrink: 0
            }}>{user.avatar}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, fontFamily: 'Space Grotesk' }}>{user.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{user.email}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>📍 {user.apartment}</div>
            </div>
          </div>

          <div className="grid-2">
            {[
              { label: 'Full Name',      key: 'name',  type: 'text'  },
              { label: 'Email Address',  key: 'email', type: 'email' },
            ].map(f => (
              <div className="form-group" key={f.key}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} value={user[f.key] || ''} onChange={set(f.key)} />
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Home Address</label>
            <input className="form-input" value={user.apartment || ''} onChange={set('apartment')} />
          </div>
        </Section>

        {/* Energy settings */}
        <Section title="Energy & Billing Settings" icon={Zap}>
          <div className="settings-row">
            <div>
              <div className="settings-label">Monthly Budget</div>
              <div className="settings-desc">Maximum electricity spend per month</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input className="form-input" type="number" value={user.budget || ''}
                onChange={set('budget')}
                style={{ width: 120, textAlign: 'right' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>₸</span>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Tariff Rate</div>
              <div className="settings-desc">Price per kWh in your zone</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input className="form-input" type="number" step="0.1" value={user.tariff || ''}
                onChange={set('tariff')}
                style={{ width: 120, textAlign: 'right' }} />
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>₸/kWh</span>
            </div>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Currency</div>
              <div className="settings-desc">Display currency in dashboard</div>
            </div>
            <select className="form-input" style={{ width: 120 }}
              value={user.currency || '₸'} onChange={set('currency')}>
              <option value="₸">₸ KZT</option>
              <option value="$">$ USD</option>
              <option value="€">€ EUR</option>
            </select>
          </div>
        </Section>

        {/* Notifications */}
        <Section title="Notifications" icon={Bell}>
          {[
            { key: 'email',   label: 'Email alerts',       desc: 'Budget overruns and anomalies' },
            { key: 'push',    label: 'Push notifications', desc: 'Real-time device status changes' },
            { key: 'weekly',  label: 'Weekly digest',      desc: 'Summary of week consumption' },
            { key: 'monthly', label: 'Monthly report',     desc: 'Auto-generated PDF report' },
          ].map(n => (
            <div className="settings-row" key={n.key}>
              <div>
                <div className="settings-label">{n.label}</div>
                <div className="settings-desc">{n.desc}</div>
              </div>
              <Toggle on={user.notifications?.[n.key]} onClick={() => setNotif(n.key)} />
            </div>
          ))}
        </Section>

        {/* Security */}
        <Section title="Security" icon={Shield}>
          <div className="settings-row">
            <div>
              <div className="settings-label">Two-factor authentication</div>
              <div className="settings-desc">Add an extra layer of security to your account</div>
            </div>
            <span className="badge badge-gray">Not configured</span>
          </div>
          <div className="settings-row">
            <div>
              <div className="settings-label">Active sessions</div>
              <div className="settings-desc">Devices currently logged in</div>
            </div>
            <span className="badge badge-green">1 active</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <button className="btn btn-ghost">Change Password</button>
          </div>
        </Section>

        {/* Save */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          {saved && (
            <div style={{
              padding: '9px 16px', background: 'var(--primary-dim)',
              border: '1px solid rgba(74,222,128,0.3)', borderRadius: 'var(--radius-sm)',
              fontSize: 13, color: 'var(--primary)', fontWeight: 600
            }}>✓ Settings saved!</div>
          )}
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={14} /> Save Changes
          </button>
        </div>
      </div>
    </Layout>
  );
}
