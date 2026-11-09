'use client';
import { useState, useEffect } from 'react';

export default function Admin() {
  const [pin, setPin] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // Fetch directly from home database list
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => setTools(data))
      .catch(err => console.error(err));
  }, []);

  if (!authed) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <form onSubmit={(e) => { e.preventDefault(); if (pin === '786') setAuthed(true); else alert('Invalid PIN'); }} style={{ backgroundColor: '#111827', padding: '30px', borderRadius: '12px', width: '300px', border: '1px solid #1f2937' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '20px', textAlign: 'center', color: '#38bdf8' }}>786ai Admin Login</h2>
          <input type="password" placeholder="Enter Admin PIN" value={pin} onChange={(e) => setPin(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: '#090d16', border: '1px solid #374151', borderRadius: '6px', color: '#fff', marginBottom: '14px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', backgroundColor: '#0284c7', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', fontWeight: '700', cursor: 'pointer' }}>Unlock Dashboard</button>
        </form>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '22px', color: '#38bdf8', margin: 0 }}>786ai Admin Dashboard</h1>
          <a href="/" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '13px' }}>← Back to Site</a>
        </div>
        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Manage Live Directory Tools ({tools.length})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {tools.map(t => (
            <div key={t.id} style={{ backgroundColor: '#111827', padding: '12px 16px', borderRadius: '8px', border: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block', fontSize: '15px' }}>{t.name}</strong>
                <span style={{ fontSize: '12px', color: '#9ca3af' }}>{t.category} • {t.pricing}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
