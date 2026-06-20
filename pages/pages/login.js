import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <>
      <Head><title>Sign In — GuruDraft</title></Head>
      <div className="auth-page">
        <div className="auth-card">
          <div style={{textAlign:'center',marginBottom:'1.5rem'}}>
            <Link href="/" style={{fontFamily:'Georgia, serif',fontSize:'1.6rem',color:'var(--gold)'}}>
              GURU<span style={{color:'var(--white)'}}>DRAFT</span>
            </Link>
          </div>
          <h1>Welcome back</h1>
          <p>Sign in to access your picks and community.</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-gold" style={{width:'100%',marginTop:'0.5rem'}} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-switch">
            Don't have an account?{' '}
            <Link href="/#pricing">Join GuruDraft</Link>
          </div>
        </div>
      </div>
    </>
  );
}
