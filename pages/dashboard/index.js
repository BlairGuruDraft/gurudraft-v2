
  import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../Navbar';

const sports = [
  { key: 'football', label: '🏈 Football' },
  { key: 'baseball', label: '⚾ Baseball' },
  { key: 'basketball', label: '🏀 Basketball' },
  { key: 'hockey', label: '🏒 Hockey' },
  { key: 'golf', label: '⛳ Golf' },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [picks, setPicks] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    async function loadPicks() {
      try {
        const res = await fetch('/api/picks');
        const data = await res.json();
        setPicks(data);
      } catch (e) {
        console.error('Failed to load picks:', e);
      }
      setLoading(false);
    }
    loadPicks();
  }, []);

  if (status === 'loading' || loading) {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111d33'}}>
        <p style={{color:'#adb5bd'}}>Loading your picks...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <Head><title>Dashboard - GuruDraft</title></Head>
      <Navbar />
      <div className="dashboard-layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label">Menu</div>
            <Link href="/dashboard" className="sidebar-link active">🏠 Dashboard</Link>
            <Link href="/community" className="sidebar-link">👥 Community</Link>
            <Link href="/dashboard#picks" className="sidebar-link">🎯 This Week's Picks</Link>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Sports</div>
            {sports.map((s) => (
              <Link key={s.key} href={'/dashboard#' + s.key} className="sidebar-link">{s.label}</Link>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Account</div>
            <button className="sidebar-link" onClick={() => signOut({ callbackUrl: '/' })} style={{background:'none',border:'none',width:'100%',textAlign:'left',cursor:'pointer'}}>
              🚪 Sign Out
            </button>
          </div>
        </aside>
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>Welcome back, {session.user?.name || 'Guru'} 👋</h1>
            <p>Here are this week's top picks across all 5 sports.</p>
          </div>
          <div className="card-grid">
            <div className="stat-card">
              <div className="label">Sports Covered</div>
              <div className="value">5</div>
            </div>
            <div className="stat-card">
              <div className="label">This Week's Picks</div>
              <div className="value">{picks ? Object.values(picks).reduce((a, b) => a + b.length, 0) : '...'}</div>
            </div>
            <div className="stat-card">
              <div className="label">Membership</div>
              <div className="value" style={{fontSize:'1.25rem'}}>Active ✓</div>
            </div>
          </div>
          <div id="picks">
            {picks && sports.map((sport) => (
              <div key={sport.key} className="picks-section" id={sport.key}>
                <h2>{sport.label} — Top Picks</h2>
                {picks[sport.key] && picks[sport.key].length > 0 ? (
                  picks[sport.key].map((pick) => (
                    <div key={pick.id} className="pick-item">
                      <div>
                        <div className="pick-name">{pick.name}</div>
                        <div className="pick-detail">{pick.detail}</div>
                      </div>
                      <div className="pick-grade">{pick.grade}</div>
                    </div>
                  ))
                ) : (
                  <p style={{color:'#6c757d',padding:'1rem 0'}}>Picks coming soon — check back shortly!</p>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
} 
