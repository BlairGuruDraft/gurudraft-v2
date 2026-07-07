import { useState, useEffect } from 'react';
import Head from 'next/head';

const SPORTS = ['football', 'baseball', 'basketball', 'hockey', 'golf'];
const SPORT_LABELS = {
  football: '🏈 Football',
  baseball: '⚾ Baseball',
  basketball: '🏀 Basketball',
  hockey: '🏒 Hockey',
  golf: '⛳ Golf',
};

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [picks, setPicks] = useState(null);
  const [activeSport, setActiveSport] = useState('football');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/picks');
    const data = await res.json();
    if (data && !data.error) {
      setPicks(data);
      setAuthenticated(true);
    }
    setLoading(false);
  }

  function updatePick(sport, index, field, value) {
    const updated = { ...picks };
    updated[sport] = [...updated[sport]];
    updated[sport][index] = { ...updated[sport][index], [field]: value };
    setPicks(updated);
  }

  function addPick(sport) {
    const updated = { ...picks };
    const newId = String(Date.now());
    updated[sport] = [...updated[sport], { id: newId, name: '', detail: '', grade: 'A' }];
    setPicks(updated);
  }

  function removePick(sport, index) {
    const updated = { ...picks };
    updated[sport] = updated[sport].filter((_, i) => i !== index);
    setPicks(updated);
  }

  async function savePicks() {
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/picks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey, picks }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Picks saved successfully!');
      } else {
        setMessage('Error: ' + (data.error || 'Failed to save'));
      }
    } catch (e) {
      setMessage('Error: ' + e.message);
    }
    setSaving(false);
  }

  if (!authenticated) {
    return (
      <>
        <Head><title>Admin - GuruDraft</title></Head>
        <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111d33'}}>
          <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'12px',padding:'2.5rem',width:'100%',maxWidth:'400px'}}>
            <h1 style={{fontFamily:'Georgia,serif',color:'#C9A84C',marginBottom:'0.5rem',fontSize:'1.75rem'}}>Admin Login</h1>
            <p style={{color:'#adb5bd',marginBottom:'2rem'}}>GuruDraft Picks Manager</p>
            <form onSubmit={handleLogin}>
              <div style={{marginBottom:'1.25rem'}}>
                <label style={{display:'block',fontSize:'0.85rem',color:'#adb5bd',marginBottom:'0.4rem'}}>Admin Password</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.75rem 1rem',color:'#fff',fontSize:'0.95rem',outline:'none',fontFamily:'sans-serif'}}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{width:'100%',background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.85rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer'}}
              >
                {loading ? 'Loading...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head><title>Picks Admin - GuruDraft</title></Head>
      <div style={{minHeight:'100vh',background:'#111d33',padding:'2rem'}}>
        <div style={{maxWidth:'900px',margin:'0 auto'}}>

          {/* Header */}
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem'}}>
            <div>
              <h1 style={{fontFamily:'Georgia,serif',color:'#C9A84C',fontSize:'2rem',margin:0}}>GuruDraft Admin</h1>
              <p style={{color:'#adb5bd',margin:'0.25rem 0 0'}}>Update weekly picks for all 5 sports</p>
            </div>
            <button
              onClick={savePicks}
              disabled={saving}
              style={{background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.75rem 2rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer'}}
            >
              {saving ? 'Saving...' : 'Save All Picks'}
            </button>
          </div>

          {/* Success/Error message */}
          {message && (
            <div style={{background:message.includes('Error')?'rgba(255,100,100,0.1)':'rgba(201,168,76,0.1)',border:`1px solid ${message.includes('Error')?'#ff6b6b':'#C9A84C'}`,borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem',color:message.includes('Error')?'#ff6b6b':'#C9A84C'}}>
              {message}
            </div>
          )}

          {/* Sport tabs */}
          <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
            {SPORTS.map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                style={{background:activeSport===sport?'#C9A84C':'rgba(255,255,255,0.05)',color:activeSport===sport?'#111d33':'#adb5bd',border:`1px solid ${activeSport===sport?'#C9A84C':'rgba(255,255,255,0.1)'}`,borderRadius:'100px',padding:'0.5rem 1.25rem',cursor:'pointer',fontWeight:activeSport===sport?700:400,fontSize:'0.9rem',fontFamily:'sans-serif'}}
              >
                {SPORT_LABELS[sport]}
              </button>
            ))}
          </div>

          {/* Picks editor */}
          {picks && (
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'1.5rem'}}>
              <h2 style={{color:'#fff',fontSize:'1.1rem',marginBottom:'1.5rem'}}>{SPORT_LABELS[activeSport]} — Weekly Picks</h2>

              {picks[activeSport].map((pick, index) => (
                <div key={pick.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 100px 40px',gap:'0.75rem',marginBottom:'0.75rem',alignItems:'center'}}>
                  <input
                    value={pick.name}
                    onChange={(e) => updatePick(activeSport, index, 'name', e.target.value)}
                    placeholder="Player name"
                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.85rem',color:'#fff',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}}
                  />
                  <input
                    value={pick.detail}
                    onChange={(e) => updatePick(activeSport, index, 'detail', e.target.value)}
                    placeholder="Detail (e.g. WR1 vs NE · PPR)"
                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.85rem',color:'#fff',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}}
                  />
                  <select
                    value={pick.grade}
                    onChange={(e) => updatePick(activeSport, index, 'grade', e.target.value)}
                    style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.85rem',color:'#C9A84C',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}}
                  >
                    {['A+','A','A-','B+','B','B-','C+','C'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <button
                    onClick={() => removePick(activeSport, index)}
                    style={{background:'rgba(255,100,100,0.1)',border:'1px solid rgba(255,100,100,0.3)',borderRadius:'6px',color:'#ff6b6b',cursor:'pointer',padding:'0.65rem',fontSize:'1rem',fontFamily:'sans-serif'}}
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                onClick={() => addPick(activeSport)}
                style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'6px',color:'#C9A84C',padding:'0.65rem 1.25rem',cursor:'pointer',fontSize:'0.9rem',marginTop:'0.5rem',fontFamily:'sans-serif'}}
              >
                + Add Pick
              </button>
            </div>
          )}

          {/* Save button bottom */}
          <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <p style={{color:'#6c757d',fontSize:'0.85rem'}}>Changes are saved to all members instantly when you click Save.</p>
            <button
              onClick={savePicks}
              disabled={saving}
              style={{background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.75rem 2rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer'}}
            >
              {saving ? 'Saving...' : 'Save All Picks'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
