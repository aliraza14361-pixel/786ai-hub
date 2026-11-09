'use client';
import { useState, useEffect } from 'react';

const ADMIN_PIN = '112255';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tools, setTools] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const savedState = localStorage.getItem('786ai_admin_session');
      if (savedState === 'active') {
        setAuthed(true);
      }
    } catch (err) {
      console.error('Session read failed', err);
    }

    fetch('/api/tools')
      .then((res) => res.json())
      .then((data) => setTools(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Failed to load tools', err));
  }, []);

  const unlockAdmin = (event) => {
    event.preventDefault();

    if (pin === ADMIN_PIN) {
      try {
        localStorage.setItem('786ai_admin_session', 'active');
      } catch (err) {
        console.error('Session save failed', err);
      }
      setAuthed(true);
      setError('');
      return;
    }

    setError('Invalid PIN. Please use the current admin code 112255.');
  };

  const logout = () => {
    try {
      localStorage.removeItem('786ai_admin_session');
    } catch (err) {
      console.error('Session clear failed', err);
    }
    setAuthed(false);
    setPin('');
    setError('');
  };

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={unlockAdmin} style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '360px', border: '1px solid #1f2937', boxShadow: '0 12px 35px rgba(0,0,0,0.35)' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '20px', textAlign: 'center', color: '#38bdf8' }}>786ai Admin Login</h2>
          <p style={{ margin: '0 0 18px', color: '#9ca3af', fontSize: '13px', textAlign: 'center' }}>Use the admin access PIN to continue.</p>
          <input type="password" placeholder="Enter Admin PIN" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '10px 12px', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '8px', color: '#fff', marginBottom: '12px', boxSizing: 'border-box' }} />
          {error && <p style={{ color: '#fca5a5', fontSize: '12px', marginBottom: '12px', minHeight: '18px' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Unlock Admin</button>
        </form>
      </main>
    );
  }

  const stats = [
    { label: 'Affiliate Clicks', value: '18.4K' },
    { label: 'Qualified Leads', value: '2.6K' },
    { label: 'Revenue', value: '$24.8K' },
    { label: 'Conversion', value: '7.3%' },
  ];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '22px', color: '#38bdf8', margin: 0 }}>786ai Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <a href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}>← Back to Site</a>
            <button onClick={logout} style={{ backgroundColor: '#1f2937', color: '#fff', border: '1px solid #374151', borderRadius: '999px', padding: '8px 12px', cursor: 'pointer' }}>Logout</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {stats.map((item) => (
            <div key={item.label} style={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '18px 16px' }}>
              <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '8px' }}>{item.label}</div>
              <div style={{ color: '#f8fafc', fontSize: '26px', fontWeight: '800' }}>{item.value}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manage Live Directory Tools ({tools.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tools.map((t) => (
            <div key={t.id || t.name} style={{ backgroundColor: '#111827', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>{t.name}</strong>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{t.category || 'General'} • {t.pricing || 'N/A'}</span>
              </div>
              <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '700' }}>Active</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

