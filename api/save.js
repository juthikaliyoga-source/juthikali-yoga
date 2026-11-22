const db = require('./_db');
const ID = /^[a-z0-9]{8,32}$/;
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!db.configured()) return res.status(503).json({ error: 'database not set up' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || !ID.test(b.id || '') || !b.a) return res.status(400).json({ error: 'bad request' });
  const a = b.a;
  const ok = Number.isInteger(a.s) && a.s >= 1 && a.s <= 3 && typeof a.d === 'string' && !isNaN(Date.parse(a.d)) &&
    Number.isInteger(a.sc) && Number.isInteger(a.t) && a.t > 0 && a.t <= 200 && a.sc >= 0 && a.sc <= a.t &&
    Array.isArray(a.w) && a.w.length <= 200 && a.w.every(Number.isInteger);
  if (!ok) return res.status(400).json({ error: 'bad attempt' });
  try {
    // unique(device_id, taken_at) + ignore-duplicates makes retries from the phone safe
    await db.req('attempts?on_conflict=device_id,taken_at', {
      method: 'POST',
      headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
      body: JSON.stringify({ device_id: b.id, quiz_set: a.s, taken_at: new Date(a.d).toISOString(), score: a.sc, total: a.t, wrong: a.w })
    });
    res.status(200).json({ ok: true });
  } catch (e) { res.status(500).json({ error: 'save failed' }); }
};
