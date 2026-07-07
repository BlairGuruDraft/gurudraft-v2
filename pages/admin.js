import { useState } from 'react';
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
  const [bulkText, setBulkText] = useState('');
  const [activeTab, setActiveTab] = useState('edit');

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

  function parseBulkText() {
    const lines = bulkText.trim().split('\n').filter(line => line.trim());
    const newPicks = {
      football: [],
      baseball: [],
      basketball: [],
      hockey: [],
      golf: [],
    };

    let parseErrors = [];

    lines.forEach((line, i) => {
      if (i === 0 && (line.toLowerCase().includes('sport') || line.toLowerCase().includes('name'))) return;

      const parts = line.includes('\t')
        ? line.split('\t').map(p => p.trim())
        : line.split('|').map(p => p.trim());

      if (parts.length < 3) {
        parseErrors.push(`Line ${i + 1}: not enough columns`);
        return;
      }

      const sport = parts[0].toLowerCase().trim();
      const name = parts[1]?.trim();
      const detail = parts[2]?.trim();
      const grade = parts[3]?.trim() || 'A';

      if (!SPORTS.includes(sport)) {
        parseErrors.push(`Line ${i + 1}: unknown sport "${parts[0]}"`);
        return;
      }

      if (!name) {
        parseErrors.push(`Line ${i + 1}: missing player name`);
        return;
      }

      newPicks[sport].push({
        id: String(Date.now()) + Math.random(),
        name,
        detail: detail || '',
        grade: grade || 'A',
      });
    });

    if (parseErrors.length > 0) {
      setMessage('Warning: Some rows skipped — ' + parseErrors.join(', '));
    }

    const merged = { ...picks };
    SPORTS.forEach(sport => {
      if (newPicks[sport].length > 0) {
        merged[sport] = newPicks[sport];
      }
    });

    setPicks(merged);
    setActiveTab('edit');
    setMessage('Imported! Review below then click Save All Picks.');
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
        setMessage('Picks saved! Members can see them now.');
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
                style={{width:'100%',background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.85rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer',fontFamily:'sans-serif'}}
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
        <div style={{maxWidth:'960px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'2rem',flexWrap:'wrap',gap:'1rem'}}>
            <div>
              <h1 style={{fontFamily:'Georgia,serif',color:'#C9A84C',fontSize:'2rem',margin:0}}>GuruDraft Admin</h1>
              <p style={{color:'#adb5bd',margin:'0.25rem 0 0'}}>Update weekly picks for all 5 sports</p>
            </div>
            <button onClick={savePicks} disabled={saving} style={{background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.75rem 2rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer',fontFamily:'sans-serif'}}>
              {saving ? 'Saving...' : 'Save All Picks'}
            </button>
          </div>

          {message && (
            <div style={{background:message.includes('Error')?'rgba(255,100,100,0.1)':'rgba(201,168,76,0.1)',border:`1px solid ${message.includes('Error')?'#ff6b6b':'#C9A84C'}`,borderRadius:'8px',padding:'1rem',marginBottom:'1.5rem',color:message.includes('Error')?'#ff6b6b':'#C9A84C',fontSize:'0.9rem'}}>
              {message}
            </div>
          )}

          <div style={{display:'flex',gap:'0.5rem',marginBottom:'1.5rem'}}>
            <button onClick={() => setActiveTab('bulk')} style={{background:activeTab==='bulk'?'#C9A84C':'rgba(255,255,255,0.05)',color:activeTab==='bulk'?'#111d33':'#adb5bd',border:`1px solid ${activeTab==='bulk'?'#C9A84C':'rgba(255,255,255,0.1)'}`,borderRadius:'6px',padding:'0.6rem 1.25rem',cursor:'pointer',fontWeight:activeTab==='bulk'?700:400,fontSize:'0.9rem',fontFamily:'sans-serif'}}>
              Bulk Import from Sheet
            </button>
            <button onClick={() => setActiveTab('edit')} style={{background:activeTab==='edit'?'#C9A84C':'rgba(255,255,255,0.05)',color:activeTab==='edit'?'#111d33':'#adb5bd',border:`1px solid ${activeTab==='edit'?'#C9A84C':'rgba(255,255,255,0.1)'}`,borderRadius:'6px',padding:'0.6rem 1.25rem',cursor:'pointer',fontWeight:activeTab==='edit'?700:400,fontSize:'0.9rem',fontFamily:'sans-serif'}}>
              Edit Picks Manually
            </button>
          </div>

          {activeTab === 'bulk' && (
            <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'1.5rem'}}>
              <h2 style={{color:'#fff',fontSize:'1.1rem',marginBottom:'0.5rem'}}>Paste from Google Sheets</h2>
              <p style={{color:'#adb5bd',fontSize:'0.88rem',marginBottom:'1.25rem',lineHeight:1.6}}>
                Copy your picks from the GuruDraft Google Sheet and paste below.<br/>
                4 columns: <strong style={{color:'#C9A84C'}}>Sport | Player Name | Detail | Grade</strong><br/>
                Example: <code style={{color:'#C9A84C'}}>football | Patrick Mahomes | QB1 Must start | A+</code>
              </p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder="Paste your Google Sheets data here..."
                rows={16}
                style={{width:'100%',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.85rem',color:'#fff',fontSize:'0.88rem',outline:'none',fontFamily:'monospace',resize:'vertical',lineHeight:1.6}}
              />
              <div style={{display:'flex',gap:'1rem',marginTop:'1rem'}}>
                <button onClick={parseBulkText} disabled={!bulkText.trim()} style={{background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.75rem 1.75rem',fontWeight:'700',fontSize:'0.95rem',cursor:'pointer',fontFamily:'sans-serif'}}>
                  Import Picks
                </button>
                <button onClick={() => setBulkText('')} style={{background:'rgba(255,255,255,0.05)',color:'#adb5bd',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'4px',padding:'0.75rem 1.25rem',fontSize:'0.9rem',cursor:'pointer',fontFamily:'sans-serif'}}>
                  Clear
                </button>
              </div>
            </div>
          )}

          {activeTab === 'edit' && picks && (
            <div>
              <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
                {SPORTS.map((sport) => (
                  <button key={sport} onClick={() => setActiveSport(sport)} style={{background:activeSport===sport?'#C9A84C':'rgba(255,255,255,0.05)',color:activeSport===sport?'#111d33':'#adb5bd',border:`1px solid ${activeSport===sport?'#C9A84C':'rgba(255,255,255,0.1)'}`,borderRadius:'100px',padding:'0.5rem 1.25rem',cursor:'pointer',fontWeight:activeSport===sport?700:400,fontSize:'0.9rem',fontFamily:'sans-serif'}}>
                    {SPORT_LABELS[sport]} ({picks[sport]?.length || 0})
                  </button>
                ))}
              </div>
              <div style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'8px',padding:'1.5rem'}}>
                <h2 style={{color:'#fff',fontSize:'1.1rem',marginBottom:'1.25rem'}}>{SPORT_LABELS[activeSport]} — Weekly Picks</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 110px 40px',gap:'0.75rem',marginBottom:'0.5rem',padding:'0 0.25rem'}}>
                  <span style={{color:'#6c757d',fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Player Name</span>
                  <span style={{color:'#6c757d',fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Detail</span>
                  <span style={{color:'#6c757d',fontSize:'0.78rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>Grade</span>
                  <span></span>
                </div>
                {picks[activeSport].map((pick, index) => (
                  <div key={pick.id} style={{display:'grid',gridTemplateColumns:'1fr 1fr 110px 40px',gap:'0.75rem',marginBottom:'0.65rem',alignItems:'center'}}>
                    <input value={pick.name} onChange={(e) => updatePick(activeSport, index, 'name', e.target.value)} placeholder="Player name" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.85rem',color:'#fff',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}} />
                    <input value={pick.detail} onChange={(e) => updatePick(activeSport, index, 'detail', e.target.value)} placeholder="e.g. WR1 vs NE PPR" style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.85rem',color:'#fff',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}} />
                    <select value={pick.grade} onChange={(e) => updatePick(activeSport, index, 'grade', e.target.value)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'6px',padding:'0.65rem 0.5rem',color:'#C9A84C',fontSize:'0.9rem',outline:'none',fontFamily:'sans-serif'}}>
                      {['A+','A','A-','B+','B','B-','C+','C','D'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <button onClick={() => removePick(activeSport, index)} style={{background:'rgba(255,100,100,0.1)',border:'1px solid rgba(255,100,100,0.3)',borderRadius:'6px',color:'#ff6b6b',cursor:'pointer',padding:'0.65rem',fontSize:'1rem',fontFamily:'sans-serif'}}>✕</button>
                  </div>
                ))}
                <button onClick={() => addPick(activeSport)} style={{background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.3)',borderRadius:'6px',color:'#C9A84C',padding:'0.65rem 1.25rem',cursor:'pointer',fontSize:'0.9rem',marginTop:'0.5rem',fontFamily:'sans-serif'}}>
                  + Add Pick
                </button>
              </div>
            </div>
          )}

          <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'}}>
            <p style={{color:'#6c757d',fontSize:'0.85rem'}}>Members see updates instantly after saving.</p>
            <button onClick={savePicks} disabled={saving} style={{background:'#C9A84C',color:'#111d33',border:'none',borderRadius:'4px',padding:'0.75rem 2rem',fontWeight:'700',fontSize:'1rem',cursor:'pointer',fontFamily:'sans-serif'}}>
              {saving ? 'Saving...' : 'Save All Picks'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
