import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        GURU<span>DRAFT</span>
      </Link>
      <ul className="navbar-links">
        <li><Link href="/#sports">Sports</Link></li>
        <li><Link href="/#features">Features</Link></li>
        <li><Link href="/#pricing">Pricing</Link></li>
        <li><Link href="/community">Community</Link></li>
        {session ? (
          <>
            <li><Link href="/dashboard">Dashboard</Link></li>
            <li>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn btn-outline" style={{padding:'0.5rem 1.25rem',fontSize:'0.85rem'}}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link href="/login">Sign In</Link></li>
            <li>
              <Link href="/#pricing" className="btn btn-gold" style={{padding:'0.5rem 1.25rem',fontSize:'0.85rem'}}>
                Join Now
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
