import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Terms() {
  return (
    <>
      <Head><title>Terms of Service — GuruDraft</title></Head>
      <Navbar />
      <div style={{maxWidth:'760px',margin:'0 auto',padding:'100px 2rem 4rem'}}>
        <h1 style={{fontFamily:'Georgia, serif',color:'var(--gold)',marginBottom:'0.5rem'}}>Terms of Service</h1>
        <p style={{color:'var(--gray-400)',marginBottom:'2rem',fontSize:'0.9rem'}}>Last updated: June 2026</p>
        {[
          {title:'Acceptance of Terms',body:'By accessing or using GuruDraft, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.'},
          {title:'Membership & Payments',body:'GuruDraft offers annual memberships at $97/year and lifetime access at a one-time fee of $180. Payments are processed securely through Stripe. Annual memberships renew automatically unless cancelled.'},
          {title:'Cancellation Policy',body:'Annual members may cancel at any time. Cancellations take effect at the end of the current billing period. Lifetime memberships are non-refundable.'},
          {title:'Content & Community',body:'GuruDraft provides fantasy sports advice for entertainment purposes. Past performance does not guarantee future results. Community members must engage respectfully and follow our community guidelines.'},
          {title:'Limitation of Liability',body:'GuruDraft is not responsible for any financial losses resulting from the use of our picks or advice. All content is for informational and entertainment purposes only.'},
          {title:'Contact',body:'For questions about these terms, contact us at support@gurudraft.com.'},
        ].map((s) => (
          <div key={s.title} style={{marginBottom:'2rem'}}>
            <h2 style={{color:'var(--white)',fontSize:'1.2rem',marginBottom:'0.5rem'}}>{s.title}</h2>
            <p style={{color:'var(--gray-400)',lineHeight:1.7}}>{s.body}</p>
          </div>
        ))}
        <Link href="/" style={{color:'var(--gold)'}}>← Back to GuruDraft</Link>
      </div>
    </>
  );
}
