import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { monthlyEnergy, deviceConsumption, weeklyEnergy, dailyEnergy, peakHours } from '../data/mockData';
import { apiGet } from '../api/api';

const COLORS = ['#60a5fa', '#f87171', '#a78bfa', '#4ade80', '#fbbf24', '#fb923c', '#6b7280'];

const CT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="tooltip-value" style={{ color: p.color }}>
          {p.name}: {p.value} {p.name.includes('cost') || p.name.includes('₸') ? '₸' : 'kWh'}
        </div>
      ))}
    </div>
  );
};

const PieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, pct, name }) => {
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (pct < 8) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {pct}%
    </text>
  );
};

const peakColor = { high: 'var(--danger)', medium: 'var(--warning)', low: 'var(--primary)' };
const peakBg   = { high: 'var(--danger-dim)', medium: 'var(--warning-dim)', low: 'var(--primary-dim)' };

export default function Analytics() {
  const [period,     setPeriod]     = useState('monthly');
  const [monthly,    setMonthly]    = useState(monthlyEnergy);
  const [daily,      setDaily]      = useState(dailyEnergy);
  const [weekly,     setWeekly]     = useState(weeklyEnergy);
  const [breakdown,  setBreakdown]  = useState(deviceConsumption);
  const [peaks,      setPeaks]      = useState(peakHours);

  useEffect(() => {
    apiGet('/energy/analytics').then(data => {
      if (data.monthly?.length)         setMonthly(data.monthly);
      if (data.dailyEnergy?.length)     setDaily(data.dailyEnergy);
      if (data.weeklyEnergy?.length)    setWeekly(data.weeklyEnergy);
      if (data.deviceBreakdown?.length) setBreakdown(data.deviceBreakdown);
      if (data.peakHours?.length)       setPeaks(data.peakHours);
    }).catch(() => {});
  }, []);

  const chartData = period === 'daily' ? daily
    : period === 'weekly' ? weekly
    : monthly;

  const xKey = period === 'daily' ? 'hour' : period === 'weekly' ? 'day' : 'month';

  return (
    <Layout title="Energy Analytics">
      {/* Period selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['daily', 'weekly', 'monthly'].map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            padding: '7px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', border: '1px solid var(--border)', transition: 'all 0.15s',
            background: period === p ? 'var(--primary-dim)' : 'var(--bg-card)',
            color: period === p ? 'var(--primary)' : 'var(--text-secondary)',
            borderColor: period === p ? 'rgba(74,222,128,0.3)' : 'var(--border)',
          }}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Main consumption chart */}
      <div className="card section-gap">
        <div className="card-header">
          <div>
            <div className="card-title">Energy Consumption — {period.charAt(0).toUpperCase() + period.slice(1)} View</div>
            <div className="card-subtitle">kWh{period === 'monthly' ? ' + estimated cost' : ''}</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: -15 }}>
            <defs>
              <linearGradient id="gKwh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,47,69,0.8)" vertical={false} />
            <XAxis dataKey={xKey} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CT />} />
            <Area type="monotone" dataKey="kwh" stroke="#4ade80" strokeWidth={2.5} fill="url(#gKwh)" name="kWh" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two charts row */}
      <div className="grid-2 section-gap">
        {/* Device pie */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Consumption by Device</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={breakdown} dataKey="kwh" nameKey="name"
                  cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                  labelLine={false} label={PieLabel}>
                  {breakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} kWh`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7, justifyContent: 'center' }}>
              {breakdown.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {d.name}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Month comparison */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Month-over-Month Trend</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthly} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,47,69,0.8)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v, n) => [`${v} kWh`, n]} />
              <Bar dataKey="kwh" radius={[4,4,0,0]} fill="#60a5fa" label={false}>
                {monthly.map((e, i) => (
                  <Cell key={i} fill={e.partial ? '#4ade80' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#60a5fa' }} />
              Previous months
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--primary)' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#4ade80' }} />
              Current (partial)
            </div>
          </div>
        </div>
      </div>

      {/* Peak hours + table */}
      <div className="grid-12">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Consumption Table</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Monthly kWh</th>
                  <th>Share</th>
                  <th>Cost ₸</th>
                </tr>
              </thead>
              <tbody>
                {breakdown.map(d => (
                  <tr key={d.name}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{d.name}</td>
                    <td>{d.kwh}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ width: 60, height: 4 }}>
                          <div className="progress-fill"
                            style={{ width: `${d.pct}%`, background: 'var(--accent)' }} />
                        </div>
                        <span>{d.pct}%</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                      ₸{Math.round(d.kwh * 22.5).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Tariff Peak Hours</div>
            <div className="card-subtitle">Almaty electricity tariffs</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {peaks.map(p => (
              <div key={p.hour} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 14px', borderRadius: 'var(--radius-sm)',
                background: peakBg[p.level], border: `1px solid ${peakColor[p.level]}33`
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Space Grotesk' }}>{p.hour}</span>
                <span className={`badge badge-${p.level === 'high' ? 'red' : p.level === 'medium' ? 'yellow' : 'green'}`}>
                  {p.level === 'high' ? '🔴 Peak' : p.level === 'medium' ? '🟡 Mid' : '🟢 Off-peak'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
