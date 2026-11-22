// Supabase REST helper (no dependencies). Uses the SERVER-side secret key, never sent to the browser.
// Works with both key styles: new "sb_secret_..." keys (apikey header only) and legacy service_role JWTs.
const URL_ = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
exports.configured = () => !!(URL_ && KEY);
exports.req = async (path, opts = {}) => {
  const auth = KEY && KEY.startsWith('eyJ') ? { Authorization: 'Bearer ' + KEY } : {};
  const r = await fetch(URL_ + '/rest/v1/' + path, {
    ...opts,
    headers: { apikey: KEY, 'Content-Type': 'application/json', ...auth, ...(opts.headers || {}) }
  });
  if (!r.ok) throw new Error('supabase ' + r.status);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
};
