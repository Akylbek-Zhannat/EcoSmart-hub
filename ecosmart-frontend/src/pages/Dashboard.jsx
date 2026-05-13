import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  dashboardStats, dailyEnergy, weeklyEnergy, recommendationsData
} from '../data/mockData';
import { apiGet } from '../api/api';
import { Zap, TrendingDown, DollarSign, Cpu, Leaf } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}:00</div>
      <div className="tooltip-value">{payload[0]?.value} kWh</div>
      {payload[1] && <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>
        Last month: {payload[1].value} kWh
      </div>}
    </div>
  );
};

const WeeklyTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="tooltip-label">{label}</div>
      <div className="tooltip-value">{payload[0]?.value} kWh — ₸{payload[0]?.payload?.cost?.toLocaleString()}</div>
    </div>
  );
};

export default function Dashboard() {
  const [stats,   setStats]   = useState(dashboardStats);
  const [daily,   setDaily]   = useState(dailyEnergy);
  const [weekly,  setWeekly]  = useState(weeklyEnergy);
  const [topRecs, setTopRecs] = useState(
    recommendationsData.filter(r => r.status === 'pending').slice(0, 3)
  );

  useEffect(() => {
    apiGet('/dashboard').then(data => {
      setStats({
        currentKwh:      data.currentKwh,
        monthlyCost:     data.monthlyCost,
        predictedSaving: data.predictedSaving,
        activeDevices:   data.activeDevices,
        budgetUsed:      data.budgetUsed,
        budgetTotal:     data.budgetTotal,
      });
      if (data.dailyEnergy?.length)  setDaily(data.dailyEnergy);
      if (data.weeklyEnergy?.length) setWeekly(data.weeklyEnergy);
    }).catch(() => {});

    apiGet('/recommendations').then(data => {
      const pending = data.filter(r => r.status === 'pending').slice(0, 3);
      if (pending.length > 0) setTopRecs(pending);
    }).catch(() => {});
  }, []);

  const { currentKwh, monthlyCost, predictedSaving, activeDevices, budgetUsed, budgetTotal } = stats;
  const budgetPct = Math.round((budgetUsed / budgetTotal) * 100);

  return (
    <Layout title="Dashboard">
      {/* Stat cards */}
      <div className="stat-grid">
        <div className="stat-card green">
          <div className="stat-icon green"><Zap size={20} /></div>
          <div className="stat-value">{currentKwh}</div>
          <div className="stat-label">kWh consumed this month</div>
          <div className="stat-delta up">↓ 18% vs last month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon blue"><DollarSign size={20} /></div>
          <div className="stat-value">₸{monthlyCost.toLocaleString()}</div>
          <div className="stat-label">Estimated monthly cost</div>
          <div className="stat-delta up">↓ ₸4 011 saved</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon yellow"><TrendingDown size={20} /></div>
          <div className="stat-value">₸{predictedSaving.toLocaleString()}</div>
          <div className="stat-label">Predicted additional saving</div>
          <div className="stat-delta neutral">if AI tips applied</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon green"><Cpu size={20} /></div>
          <div className="stat-value">{activeDevices}</div>
          <div className="stat-label">Active smart devices</div>
          <div className="stat-delta neutral">of 8 total</div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid-21 section-gap">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Today's Energy Profile</div>
              <div className="card-subtitle">kWh per hour vs last month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={daily} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4ade80" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,47,69,0.8)" vertical={false} />
              <XAxis dataKey="hour" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}h`} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="kwh" stroke="#4ade80" strokeWidth={2} fill="url(#grad1)" name="Today" />
              <Area type="monotone" dataKey="prev" stroke="#334155" strokeWidth={1.5} fill="none" strokeDasharray="4 4" name="Last month" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Weekly Overview</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weekly} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,47,69,0.8)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<WeeklyTooltip />} />
              <Bar dataKey="kwh" fill="#60a5fa" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid-12">
        {/* Budget */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Monthly Budget Status</div>
              <div className="card-subtitle">₸{budgetUsed.toLocaleString()} of ₸{budgetTotal.toLocaleString()} used</div>
            </div>
            <span className="badge badge-green">{budgetPct}% used</span>
          </div>
          <div className="progress-bar" style={{ height: 10, marginBottom: 16 }}>
            <div className="progress-fill"
              style={{ width: `${budgetPct}%`, background: 'linear-gradient(90deg, #4ade80, #22c55e)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
            <span>Spent</span>
            <span style={{ color: 'var(--primary)', fontWeight: 600 }}>₸{(budgetTotal - budgetUsed).toLocaleString()} remaining</span>
          </div>

          <div style={{
            marginTop: 20, padding: '14px 16px',
            background: 'var(--primary-dim)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(74,222,128,0.2)',
            display: 'flex', alignItems: 'center', gap: 10
          }}>
            <Leaf size={18} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>142 kg CO₂ saved</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs same period last year</div>
            </div>
          </div>
        </div>

        {/* Top recommendations */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">AI Recommendations</div>
            <span className="badge badge-yellow">{topRecs.length} pending</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {topRecs.map(rec => (
              <div key={rec.id} style={{
                display: 'flex', gap: 12, padding: '12px 14px',
                background: 'var(--bg-base)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
              }}>
                <span style={{ fontSize: 20 }}>{rec.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{rec.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    Save up to <span style={{ color: 'var(--primary)', fontWeight: 700 }}>₸{rec.saving.toLocaleString()}</span>
                  </div>
                </div>
                <span className={`badge badge-${rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'yellow' : 'blue'}`}>
                  {rec.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
