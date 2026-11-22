// Supabase REST helper (no dependencies). Uses the SERVER-side service key, never sent to the browser.
const URL_ = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
exports.configured = () => !!(URL_ && KEY);
exports.req = async (path, opts = {}) => {
  const r = await fetch(URL_ + '/rest/v1/' + path, {
    ...opts,
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', ...(opts.headers || {}) }
  });
  if (!r.ok) throw new Error('supabase ' + r.status);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
};
