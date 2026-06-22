import Head from 'next/head';
import Link from 'next/link';
import Navbar from './Navbar';

export default function Home() {
  async function handleCheckout(plan) {
    const priceId =
      plan === 'annual'
        ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID;

    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
              {icon:'📊',title:'Deep Analysis',desc:'Matchup breakdowns, trend reports, and injury impact analysis delivered fresh.'},
              {icon:'⚡',title:'Real-Time Alerts',desc:'Injury updates, lineup changes, and waiver wire targets pushed to you instantly.'},
              {icon:'🏆',title:'All Formats',desc:'Season-long, daily fantasy, best ball, dynasty - we cover every format you play.'},
              {icon:'📱',title:'Any
