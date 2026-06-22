import Head from 'next/head';
import Link from 'next/link';
import Navbar from './Navbar';

async function handleCheckout(plan) {
    try {
      const priceId =
        plan === 'annual'
          ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
          : process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;

      console.log('Price ID:', priceId);
      console.log('Plan:', plan);

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, plan }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Error: ' + err.message);
    }
  }
      body: JSON.stringify({ priceId, plan }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  return (
    <>
      <Head>
        <title>GuruDraft - Draft Smarter. Win Bigger.</title>
        <meta name="description" content="The ultimate fantasy sports platform. All 5 sports, guru-level advice, community-driven." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <section className="hero">
        <div>
          <span className="hero-eyebrow">Fantasy Sports Platform</span>
          <h1>Draft Smarter.<br /><span className="gold">Win Bigger.</span></h1>
          <p className="hero-sub">Guru-level picks, rankings, and strategy across all 5 major sports. Built for winners. Backed by community.</p>
          <div className="hero-cta">
            <button className="btn btn-gold btn-large" onClick={() => handleCheckout('annual')}>Start Winning - $97/yr</button>
            <Link href="#features" className="btn btn-outline btn-large">See How It Works</Link>
          </div>
          <div className="hero-sports">
            {[{icon:'🏈',label:'Football'},{icon:'⚾',label:'Baseball'},{icon:'🏀',label:'Basketball'},{icon:'🏒',label:'Hockey'},{icon:'⛳',label:'Golf'}].map((s) => (
              <div key={s.label} className="sport-pill"><span className="icon">{s.icon}</span><span>{s.label}</span></div>
            ))}
          </div>
        </div>
      </section>
      <hr className="divider" />
      <div id="sports">
        <div className="section section-center">
          <p className="section-eyebrow">All 5 Sports Covered</p>
          <h2>One Membership. Every Season.</h2>
          <p className="section-sub">From August football drafts to Masters weekend - GuruDraft has you covered year-round.</p>
          <div className="sports-grid">
            {[
              {emoji:'🏈',name:'Football',desc:'Draft boards, lineup optimizer, weekly rankings and waiver wire'},
              {emoji:'⚾',name:'Baseball',desc:'Pitcher and hitter analysis, streaming targets, trade advice'},
              {emoji:'🏀',name:'Basketball',desc:'Nightly DFS picks, season-long strategy, rest-day alerts'},
              {emoji:'🏒',name:'Hockey',desc:'Goalie starts, power-play unit tracking, hot-streak alerts'},
              {emoji:'⛳',name:'Golf',desc:'DraftKings and FanDuel lineup builder, course matchup breakdowns'},
            ].map((s) => (
              <div key={s.name} className="sport-card">
                <div className="sport-emoji">{s.emoji}</div>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="divider" />
      <div id="features">
        <div className="section section-center">
          <p className="section-eyebrow">Why GuruDraft</p>
          <h2>Built for Serious Players</h2>
          <p className="section-sub">Not just data dumps. Actual advice, from a community that knows the game.</p>
          <div className="features-grid">
            {[
              {icon:'🧙',title:'Guru Picks',desc:'Weekly curated picks and start/sit decisions across every sport - no guesswork.'},
              {icon:'👥',title:'Community Hub',desc:'Connect with thousands of members. Share lineups, debate picks, get real answers.'},
              {icon:'📊',title:'Deep Analysis',desc:'Matchup breakdowns, trend reports, and injury impact analysis.'},
              {icon:'⚡',title:'Real-Time Alerts',desc:'Injury updates, lineup changes, and waiver wire targets instantly.'},
              {icon:'🏆',title:'All Formats',desc:'Season-long, daily fantasy, best ball, dynasty - all covered.'},
              {icon:'📱',title:'Any Device',desc:'Desktop or mobile - your picks are always a tap away.'},
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <hr className="divider" />
      <div id="pricing">
        <div className="section section-center">
          <p className="section-eyebrow">Pricing</p>
          <h2>Simple. Straightforward. Worth It.</h2>
          <p className="section-sub">One price. All 5 sports. No hidden fees.</p>
          <div className="pricing-wrapper">
            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <div className="pricing-name">Annual Membership</div>
              <div className="pricing-price"><sup>$</sup>97</div>
              <div className="pricing-period">per year - cancel anytime</div>
              <ul className="pricing-features">
                {['All 5 sports covered','Weekly Guru picks and rankings','Community hub access','Real-time alerts','All formats supported','New features included'].map((f) => (
                  <li key={f}><span className="check">✓</span> {f}</li>
                ))}
              </ul>
              <button className="btn btn-gold" style={{width:'100%'}} onClick={() => handleCheckout('annual')}>Get Started</button>
            </div>
          </div>
          <p style={{marginTop:'1.5rem',color:'var(--gray-600)',fontSize:'0.85rem'}}>Secured by Stripe. Cancel anytime. Email us at support@gurudraft.com</p>
        </div>
      </div>
      <hr className="divider" />
      <footer className="footer">
        <div className="footer-logo">GURUDRAFT</div>
        <p style={{marginBottom:'1rem'}}>Draft Smarter. Win Bigger.</p>
        <div style={{display:'flex',gap:'2rem',justifyContent:'center',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <Link href="/privacy" style={{color:'var(--gray-600)'}}>Privacy Policy</Link>
          <Link href="/terms" style={{color:'var(--gray-600)'}}>Terms of Service</Link>
          <a href="mailto:support@gurudraft.com" style={{color:'var(--gray-600)'}}>Support</a>
        </div>
        <p>2026 GuruDraft. All rights reserved.</p>
      </footer>
    </>
  );
}
