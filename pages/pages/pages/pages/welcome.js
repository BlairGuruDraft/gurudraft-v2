import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Welcome() {
  const router = useRouter();
  const { plan } = router.query;
  const isLifetime = plan === 'lifetime';

  return (
    <>
      <Head><title>Welcome to GuruDraft!</title></Head>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',padding:'2rem',textAlign:'center',background:'radial-gradient(ellipse at top, var(--navy-light) 0%, var(--navy-dark) 70%)'}}>
        <div style={{maxWidth:'540px'}}>
          <div style={{fontSize:'4rem',marginBottom:'1rem'}}>🏆</div>
          <h1 style={{fontFamily:'Georgia, serif',fontSize:'clamp(2rem, 5vw, 3rem)',color:'var(--gold)',marginBottom:'1rem'}}>
            Welcome to GuruDraft!
          </h1>
          <p style={{color:'var(--gray-400)',fontSize:'1.1rem',marginBottom:'0.5rem'}}>
            {isLifetime
              ? "You're in — for life. Best decision you've made this season."
              : "You're officially a GuruDraft member. Let's get to work."}
          </p>
          {isLifetime && (
            <div style={{background:'rgba(201,168,76,0.1)',border:'1px solid var(--gold)',borderRadius:'8px',padding:'1rem',margin:'1.5rem 0',color:'var(--gold)',fontSize:'0.95rem'}}>
              🎉 Lifetime Access Confirmed — You never pay again.
            </div>
          )}
          <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap',marginTop:'2rem'}}>
            <Link href="/dashboard" className="btn btn-gold btn-large">Go to My Dashboard</Link>
            <Link href="/community" className="btn btn-outline btn-large">Join the Community</Link>
          </div>
        </div>
      </div>
    </>
  );
}
