import Head from 'next/head';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Navbar from '../../components/Navbar';

const PICKS = {
  football: [
    { name: 'Tyreek Hill', detail: 'WR1 vs NE PPR', grade: 'A+' },
    { name: 'Bijan Robinson', detail: 'RB1 vs CAR Start', grade: 'A' },
    { name: 'Nico Collins', detail: 'WR2 sleeper DFS value', grade: 'A-' },
  ],
  baseball: [
    { name: 'Paul Skenes', detail: 'SP vs CIN Stream', grade: 'A+' },
    { name: 'Bobby Witt Jr.', detail: 'SS1 Hot streak', grade: 'A' },
    { name: 'Corbin Carroll', detail: 'OF Bounce-back spot', grade: 'B+' },
  ],
  basketball: [
    { name: 'Shai Gilgeous-Alexander', detail: 'PG1 Full go', grade: 'A+' },
    { name: 'Chet Holmgren', detail: 'C Blocks upside', grade: 'A' },
    { name: 'Desmond Bane', detail: 'SG 3PT upside', grade: 'B+' },
  ],
  hockey: [
    { name: 'Nathan MacKinnon', detail: 'C PP1 Must start', grade: 'A+' },
    { name: 'Andrei Vasilevskiy', detail: 'G Home start', grade: 'A' },
    { name: 'Nikita Kucherov', detail: 'RW Hot line', grade: 'A' },
  ],
  golf: [
    { name: 'Scottie Scheffler', detail: 'World Number 1 Course fit A+', grade: 'A+' },
    { name: 'Collin Morikawa', detail: 'Ball striker Value play', grade: 'A-' },
    { name: 'Tom Kim', detail: 'Bermuda specialist DFS GPP', grade: 'B+' },
  ],
};

const sports = [
  { key: 'football', label: 'Football' },
  { key: 'baseball', label: 'Baseball' },
  { key: 'basketball', label: 'Basketball' },
  { key: 'hockey', label: 'Hockey' },
  { key: 'golf', label: 'Golf' },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'var(--gray-400)'}}>Loading...</p>
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
            <Link href="/dashboard" className="sidebar-link active">Dashboard</Link>
            <Link href="/community" className="sidebar-link">Community</Link>
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Sports</div>
            {sports.map((s) => (
              <Link key={s.key} href={'/dashboard#' + s.key} className="sidebar-link">{s.label}</Link>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="sidebar-label">Account</div>
            <button className="sidebar-link" onClick={() => signOut({ callbackUrl: '/' })} style={{background:'none',border:'none',width:'100%',textAlign:'left',cursor:'pointer'}}>Sign Out</button>
          </div>
        </aside>
        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1>Welcome back, {session.user && session.user.name ? session.user.name : 'Guru'}</h1>
            <p>Here are this week's top picks across all 5 sports.</p>
          </div>
          <div className="card-grid">
            <div className="stat-card">
              <div className="label">Sports Covered</div>
              <div className="value">5</div>
            </div>
            <div className="stat-card">
              <div className="label">This Week Picks</div>
              <div className="value">15</div>
            </div>
            <div className="stat-card">
              <div className="label">Membership</div>
              <div className="value" style={{fontSize:'1.25rem'}}>Active</div>
            </div>
          </div>
          <div id="picks">
            {sports.map((sport) => (
              <div key={sport.key} className="picks-section" id={sport.key}>
                <h2>{sport.label} - Top Picks</h2>
                {PICKS[sport.key].map((pick) => (
                  <div key={pick.name} className="pick-item">
                    <div>
                      <div className="pick-name">{pick.name}</div>
                      <div className="pick-detail">{pick.detail}</div>
                    </div>
                    <div className="pick-grade">{pick.grade}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
   
