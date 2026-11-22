const db = require('./_db');
const ID = /^[a-z0-9]{8,32}$/;
module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!db.configured()) return res.status(503).json({ error: 'database not set up' });
  const id = (req.query && req.query.id) || '';
  if (!ID.test(id)) return res.status(400).json({ error: 'bad id' });
  try {
    const rows = await db.req('attempts?device_id=eq.' + id + '&select=quiz_set,taken_at,score,total,wrong&order=taken_at.asc&limit=500');
    res.status(200).json({ attempts: (rows || []).map(r => ({ s: r.quiz_set, d: r.taken_at, sc: r.score, t: r.total, w: r.wrong })) });
  } catch (e) { res.status(500).json({ error: 'read failed' }); }
};
