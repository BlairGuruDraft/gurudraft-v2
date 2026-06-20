import Head from 'next/head';
import Link from 'next/link';
import Navbar from './Navbar';

export default function Privacy() {
  return (
    <>
      <Head><title>Privacy Policy - GuruDraft</title></Head>
      <Navbar />
      <div style={{maxWidth:'760px',margin:'0 auto',padding:'100px 2rem 4rem'}}>
        <h1 style={{fontFamily:'Georgia, serif',color:'var(--gold)',marginBottom:'0.5rem'}}>Privacy Policy</h1>
        <p style={{color:'var(--gray-400)',marginBottom:'2rem',fontSize:'0.9rem'}}>Last updated: June 2026</p>
        {[
          {title:'Information We Collect',body:'We collect information you provide when creating an account, including your name and email address. We also collect payment information through Stripe, though we never store your full card details.'},
          {title:'How We Use Your Information',body:'We use your information to provide GuruDraft services, process payments, send picks and updates, and respond to inquiries.'},
          {title:'Sharing Your Information',body:'We do not sell your personal information. We share data with Stripe for payment processing only.'},
          {title:'Data Security',body:'We implement industry-standard security measures. All payment processing is handled by Stripe and is PCI-compliant.'},
          {title:'Contact Us',body:'Questions? Email us at support@gurudraft.com.'},
        ].map((s) => (
          <div key={s.title} style={{marginBottom:'2rem'}}>
            <h2 style={{color:'var(--white)',fontSize:'1.2rem',marginBottom:'0.5rem'}}>{s.title}</h2>
            <p style={{color:'var(--gray-400)',lineHeight:1.7}}>{s.body}</p>
          </div>
        ))}
        <Link href="/" style={{color:'var(--gold)'}}>Back to GuruDraft</Link>
      </div>
    </>
  );
}
