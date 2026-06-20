import Head from 'next/head';
import { useState } from 'react';
import Navbar from './Navbar';

const SAMPLE_POSTS = [
  { id:1, author:'TravisK', initials:'TK', time:'2h ago', sport:'🏈 Football', title:'Anyone starting Jaylen Waddle this week?', body:"He's been inconsistent but the matchup vs the Jets secondary looks great. Thinking of starting him over Diontae.", likes:14, replies:8 },
  { id:2, author:'GuruDraftHQ', initials:'GD', time:'4h ago', sport:'⛳ Golf', title:"This week's DFS Golf value picks are live", body:"Tom Kim at $7,200 is the play of the week. Course history is strong and he's been making cuts consistently. Pair with Scheffler in the upper tier.", likes:31, replies:12 },
  { id:3, author:'PickEmPete', initials:'PP', time:'6h ago', sport:'⚾ Baseball', title:'Streaming SP suggestions for the week?', body:'Need 2 streamers for a 12-team league. Looking at Paul Skenes vs CIN and maybe Garrett Crochet at home. Thoughts?', likes:9, replies:15 },
  { id:4, author:'IceQueenMN', initials:'IQ', time:'1d ago', sport:'🏒 Hockey', title:'Vasilevskiy or Hellebuyck in the playoffs?', body:"Both are studs but I can only roster one. Vasy has the easier schedule this week but Hellebuyck's team is hotter.", likes:22, replies:19 },
  { id:5, author:'DraftDayDave', initials:'DD', time:'1d ago', sport:'🏀 Basketball', title:'SGA is locked and loaded', body:"If you don't have Shai Gilgeous-Alexander in every league you're in, fix that immediately.", likes:47, replies:23 },
];

export default function Community() {
  const [liked, setLiked] = useState({});

  function toggleLike(id) {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      <Head><title>Community - GuruDraft</title></Head>
      <Navbar />
      <div style={{paddingTop:'80px',minHeight:'100vh'}}>
        <div className="section">
          <div className="community-layout">
            <div className="dashboard-header">
              <h1 style={{fontFamily:'Georgia, serif',fontSize:'1.75rem',color:'var(--white)'}}>Community Hub</h1>
              <p style={{color:'var(--gray-400)',marginTop:'0.25rem'}}>Talk picks, share lineups, get answers from thousands of Guru members.</p>
            </div>
            <div style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',marginBottom:'1.5rem'}}>
              {['All','Football','Baseball','Basketball','Hockey','Golf'].map((s) => (
                <button key={s} style={{background:s==='All'?'var(--gold)':'rgba(255,255,255,0.05)',border:'1px solid',borderColor:s==='All'?'var(--gold)':'rgba(255,255,255,0.1)',color:s==='All'?'var(--navy-dark)':'var(--gray-400)',padding:'0.4rem 0.9rem',borderRadius:'100px',fontSize:'0.82rem',cursor:'pointer',fontFamily:'var(--font-body)',fontWeight:s==='All'?700:400}}>
                  {s}
                </button>
              ))}
            </div>
            {SAMPLE_POSTS.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-meta">
                  <div className="post-avatar">{post.initials}</div>
                  <div>
                    <div className="post-author">{post.author}</div>
                    <div className="post-time">{post.time}</div>
                  </div>
                  <span className="post-sport">{post.sport}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <div className="post-actions">
                  <button className="post-action-btn" onClick={() => toggleLike(post.id)}>
                    {liked[post.id] ? 'liked' : 'like'} {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  <button className="post-action-btn">replies {post.replies}</button>
                  <button className="post-action-btn">Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
