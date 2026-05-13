import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { devicesData } from '../data/mockData';
import { apiGet, apiPut } from '../api/api';
import { Wifi, WifiOff } from 'lucide-react';

// Normalize a backend Device object so field names match what the JSX expects.
// Backend returns powerWatts; JSX uses device.power.
// Backend has no bgColor; derive it by appending hex alpha to color.
const normalize = d => ({
  ...d,
  power:   d.powerWatts ?? d.power ?? 0,
  bgColor: d.bgColor || (d.color ? d.color + '1e' : 'rgba(255,255,255,0.08)'),
});

export default function Devices() {
  const [devices, setDevices] = useState(devicesData.map(normalize));
  const [filter,  setFilter]  = useState('all');

  useEffect(() => {
    apiGet('/devices')
      .then(data => setDevices(data.map(normalize)))
      .catch(() => {});
  }, []);

  const toggle = async (id) => {
    try {
      const res = await apiPut(`/devices/${id}/toggle`);
      setDevices(prev => prev.map(d => {
        if (d.id !== id) return d;
        // When turning ON, restore baseWatts as the displayed wattage
        const newPower = res.status ? (d.baseWatts || d.power || 0) : 0;
        return { ...d, status: res.status, power: newPower };
      }));
    } catch {
      // Optimistic fallback on network error
      setDevices(prev => prev.map(d =>
        d.id === id ? { ...d, status: !d.status } : d
      ));
    }
  };

  const filtered = filter === 'on'  ? devices.filter(d => d.status)
    : filter === 'off' ? devices.filter(d => !d.status)
    : devices;

  const onCount  = devices.filter(d => d.status).length;
  const offCount = devices.filter(d => !d.status).length;
  const totalW   = devices.filter(d => d.status).reduce((s, d) => s + (d.power || 0), 0);

  return (
    <Layout title="Smart Devices">
      {/* Summary strip */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Online',        value: onCount,        color: 'var(--primary)',     bg: 'var(--primary-dim)' },
          { label: 'Offline',       value: offCount,       color: 'var(--text-muted)',  bg: 'var(--border)' },
          { label: 'Current Load',  value: `${totalW} W`,  color: 'var(--warning)',     bg: 'var(--warning-dim)' },
          { label: 'Devices Total', value: devices.length, color: 'var(--accent)',      bg: 'var(--accent-dim)' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{
            flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: 14
          }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color, fontWeight: 700, fontSize: 15 }}>{typeof value === 'number' ? value : '⚡'}</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: 'Space Grotesk' }}>{value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'on', 'off'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s',
              background: filter === f ? 'var(--primary-dim)' : 'var(--bg-card)',
              color: filter === f ? 'var(--primary)' : 'var(--text-secondary)',
              borderColor: filter === f ? 'rgba(74,222,128,0.3)' : 'var(--border)',
            }}>
            {f === 'all' ? 'All devices' : f === 'on' ? '🟢 Online' : '⚪ Offline'}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center' }}>
          {filtered.length} device{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Device grid */}
      <div className="device-grid">
        {filtered.map(device => (
          <div key={device.id} className={`device-card ${device.status ? 'on' : ''}`}>
            <div className="device-header">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div className="device-icon-wrap" style={{ background: device.bgColor }}>
                  <span style={{ color: device.color }}>{device.emoji}</span>
                </div>
                <div>
                  <div className="device-name">{device.name}</div>
                  <div className="device-location">📍 {device.room}</div>
                  <div style={{ marginTop: 5 }}>
                    {device.status
                      ? <span className="badge badge-green"><Wifi size={9} /> Online</span>
                      : <span className="badge badge-gray"><WifiOff size={9} /> Offline</span>}
                  </div>
                </div>
              </div>

              <button
                className={`toggle-track ${device.status ? 'on' : ''}`}
                onClick={() => toggle(device.id)}
                title={device.status ? 'Turn off' : 'Turn on'}
              />
            </div>

            <div className="device-stats">
              <div>
                <div className="device-stat-label">Power now</div>
                <div className="device-stat-value" style={{ color: device.status ? device.color : 'var(--text-muted)' }}>
                  {device.status ? `${device.power} W` : '— W'}
                </div>
              </div>
              <div>
                <div className="device-stat-label">Monthly kWh</div>
                <div className="device-stat-value">{device.monthlyKwh}</div>
              </div>
              <div>
                <div className="device-stat-label">Monthly cost</div>
                <div className="device-stat-value">₸{device.monthlyCost.toLocaleString()}</div>
              </div>
              <div>
                <div className="device-stat-label">Share</div>
                <div className="device-stat-value">
                  {Math.round((device.monthlyKwh / 312.4) * 100)}%
                </div>
              </div>
            </div>

            {/* mini progress */}
            <div style={{ marginTop: 12 }}>
              <div className="progress-bar">
                <div className="progress-fill" style={{
                  width: `${Math.round((device.monthlyKwh / 312.4) * 100)}%`,
                  background: device.status
                    ? `linear-gradient(90deg, ${device.color}, ${device.color}99)`
                    : 'var(--border-light)'
                }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
