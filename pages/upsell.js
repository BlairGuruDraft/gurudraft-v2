import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Upsell() {
  const router = useRouter();

  async function handleLifetime() {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID, plan: 'lifetime' }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      <Head><title>One Special Offer - GuruDraft</title></Head>
      <div className="upsell-page">
        <div className="upsell-card">
          <span className="upsell-tag">One-Time Offer - New Members Only</span>
          <h1>Lock In <span className="gold">Lifetime Access</span> Before You Head In</h1>
          <p style={{color:'var(--gray-400)',fontSize:'1.1rem',margin:'1rem 0'}}>
            You just joined for a year. But here is something we only offer once to brand-new members.
          </p>
          <div className="upsell-price-box">
            <div className="amount">$180</div>
            <div className="label">One-time payment. Never pay again. Ever.</div>
          </div>
          <ul className="upsell-features">
            {['All 5 sports for life','Every feature we ever build included','Community access permanent','No renewal reminders or price increases ever','Lock in today price while it exists'].map((f) => (
              <li key={f}><span className="check">✓</span> {f}</li>
            ))}
          </ul>
          <p style={{color:'var(--gold)',fontSize:'0.9rem',marginBottom:'1.5rem',fontWeight:600}}>
            This offer disappears when you leave this page.
          </p>
          <button className="btn btn-gold btn-large" style={{width:'100%',marginBottom:'0.75rem'}} onClick={handleLifetime}>
            Yes - Lock In Lifetime Access for $180
          </button>
          <button className="upsell-decline" onClick={() => router.push('/welcome?plan=annual')}>
            No thanks, I will stick with my annual plan
          </button>
        </div>
      </div>
    </>
  );
}
