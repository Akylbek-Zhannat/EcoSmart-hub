import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { recommendationsData } from '../data/mockData';
import { apiGet, apiPut } from '../api/api';
import { CheckCircle, XCircle, TrendingDown } from 'lucide-react';

export default function Recommendations() {
  const [recs,   setRecs]   = useState(recommendationsData);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    apiGet('/recommendations')
      .then(data => { if (data?.length) setRecs(data); })
      .catch(() => {});
  }, []);

  const update = async (id, status) => {
    // Optimistic update first so the UI responds immediately
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await apiPut(`/recommendations/${id}/status`, { status });
    } catch {
      // Revert on failure
      setRecs(prev => prev.map(r => r.id === id ? { ...r, status: r.status } : r));
    }
  };

  const filtered = filter === 'all'      ? recs
    : filter === 'pending'  ? recs.filter(r => r.status === 'pending')
    : filter === 'accepted' ? recs.filter(r => r.status === 'accepted')
    : recs.filter(r => r.status === 'ignored');

  const totalPotential = recs
    .filter(r => r.status !== 'ignored')
    .reduce((s, r) => s + r.saving, 0);

  const acceptedSaving = recs
    .filter(r => r.status === 'accepted')
    .reduce((s, r) => s + r.saving, 0);

  return (
    <Layout title="AI Recommendations">
      {/* Saving summary */}
      <div className="grid-3 section-gap">
        {[
          { label: 'Potential monthly saving', value: `₸${totalPotential.toLocaleString()}`, color: 'var(--primary)', bg: 'var(--primary-dim)', icon: '💰' },
          { label: 'Accepted savings',         value: `₸${acceptedSaving.toLocaleString()}`, color: 'var(--accent)', bg: 'var(--accent-dim)', icon: '✅' },
          { label: 'Pending recommendations',  value: recs.filter(r => r.status === 'pending').length, color: 'var(--warning)', bg: 'var(--warning-dim)', icon: '⏳' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px',
            display: 'flex', gap: 14, alignItems: 'center'
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: s.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'accepted', 'ignored'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s',
            background: filter === f ? 'var(--primary-dim)' : 'var(--bg-card)',
            color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: filter === f ? 'rgba(74,222,128,0.3)' : 'var(--border)',
          }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} recommendation{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map(rec => (
          <div key={rec.id} className={`rec-card ${rec.status !== 'pending' ? rec.status : ''}`}
            style={{
              borderColor: rec.status === 'accepted' ? 'rgba(74,222,128,0.3)'
                : rec.status === 'ignored' ? 'var(--border)' : 'var(--border)',
            }}>
            <div style={{ display: 'flex', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: 'var(--bg-base)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24
              }}>{rec.emoji}</div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div className="rec-title">{rec.title}</div>
                  <span className={`badge priority-${rec.priority}`}>{rec.priority}</span>
                  {rec.status !== 'pending' && (
                    <span className={`badge ${rec.status === 'accepted' ? 'badge-green' : 'badge-gray'}`}>
                      {rec.status}
                    </span>
                  )}
                </div>
                <div className="rec-desc">{rec.desc}</div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                  <div className="rec-saving">
                    <TrendingDown size={14} />
                    Save up to <strong style={{ marginLeft: 3 }}>₸{rec.saving.toLocaleString()}</strong> / month
                  </div>

                  {rec.status === 'pending' && (
                    <div className="rec-actions">
                      <button className="btn btn-primary btn-sm"
                        onClick={() => update(rec.id, 'accepted')}>
                        <CheckCircle size={13} /> Accept
                      </button>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => update(rec.id, 'ignored')}>
                        <XCircle size={13} /> Ignore
                      </button>
                    </div>
                  )}

                  {rec.status !== 'pending' && (
                    <button className="btn btn-ghost btn-sm"
                      onClick={() => update(rec.id, 'pending')}>
                      Undo
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
