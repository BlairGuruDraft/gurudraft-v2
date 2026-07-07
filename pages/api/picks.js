import { put, get } from '@vercel/blob';

const PICKS_KEY = 'gurudraft-picks.json';

const DEFAULT_PICKS = {
  football: [
    { id: '1', name: 'Tyreek Hill', detail: 'WR1 vs NE · PPR', grade: 'A+' },
    { id: '2', name: 'Bijan Robinson', detail: 'RB1 vs CAR · Start', grade: 'A' },
    { id: '3', name: 'Nico Collins', detail: 'WR2 sleeper · DFS value', grade: 'A-' },
  ],
  baseball: [
    { id: '1', name: 'Paul Skenes', detail: 'SP vs CIN · Stream', grade: 'A+' },
    { id: '2', name: 'Bobby Witt Jr.', detail: 'SS1 · Hot streak', grade: 'A' },
    { id: '3', name: 'Corbin Carroll', detail: 'OF · Bounce-back spot', grade: 'B+' },
  ],
  basketball: [
    { id: '1', name: 'Shai Gilgeous-Alexander', detail: 'PG1 · Full go', grade: 'A+' },
    { id: '2', name: 'Chet Holmgren', detail: 'C · Blocks upside', grade: 'A' },
    { id: '3', name: 'Desmond Bane', detail: 'SG · 3PT upside', grade: 'B+' },
  ],
  hockey: [
    { id: '1', name: 'Nathan MacKinnon', detail: 'C · PP1 · Must start', grade: 'A+' },
    { id: '2', name: 'Andrei Vasilevskiy', detail: 'G · Home start', grade: 'A' },
    { id: '3', name: 'Nikita Kucherov', detail: 'RW · Hot line', grade: 'A' },
  ],
  golf: [
    { id: '1', name: 'Scottie Scheffler', detail: 'World #1 · Course fit A+', grade: 'A+' },
    { id: '2', name: 'Collin Morikawa', detail: 'Ball striker · Value play', grade: 'A-' },
    { id: '3', name: 'Tom Kim', detail: 'Bermuda specialist · DFS GPP', grade: 'B+' },
  ],
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await fetch(`https://${process.env.BLOB_STORE_ID}.public.blob.vercel-storage.com/${PICKS_KEY}`);
      if (response.ok) {
        const picks = await response.json();
        return res.status(200).json(picks);
      }
    } catch (e) {
      console.log('No picks file yet, returning defaults');
    }
    return res.status(200).json(DEFAULT_PICKS);
  }

  if (req.method === 'POST') {
    const { adminKey, picks } = req.body;

    if (adminKey !== process.env.ADMIN_SECRET) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      await put(PICKS_KEY, JSON.stringify(picks), {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('Blob error:', e);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
