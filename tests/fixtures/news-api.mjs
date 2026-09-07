// Isolated Supabase-compatible fixture. This process never connects to the real database.
import { createServer } from 'node:http';
const port = 4312;
const origin = `http://127.0.0.1:${port}`;
const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
let records = [];
const files = new Map();
let failUpload = false;
let failSave = false;
function reset() {
  records = Array.from({ length: 26 }, (_, i) => ({ id: `00000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`, type: i === 0 ? 'notice_pinned' : ['notice', 'media', 'training', 'academic', 'youtube'][i % 5], title: `기존 소식 ${String(i + 1).padStart(2, '0')}`, content: `기존 본문 ${i + 1}\n줄바꿈이 유지됩니다.`, image_urls: [], video_url: i % 5 === 4 ? 'https://youtu.be/abcdefghijk' : null, source_name: null, source_url: null, created_at: new Date(Date.UTC(2026, 8, 1, 0, i)).toISOString() }));
  files.clear(); failUpload = false; failSave = false;
}
reset();
createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS');
  res.setHeader('Access-Control-Expose-Headers', 'Content-Range');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  const url = new URL(req.url, origin);
  const send = (value, status = 200, headers = {}) => { res.writeHead(status, { 'Content-Type': 'application/json', ...headers }); res.end(req.method === 'HEAD' ? undefined : JSON.stringify(value)); };
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);
  let body = {}; try { body = JSON.parse(buffer.toString()); } catch { /* Multipart upload. */ }
  if (url.pathname === '/health') return send({ ok: true });
  if (url.pathname === '/__test/reset') { reset(); return send({ ok: true }); }
  if (url.pathname === '/__test/state') return send({ records, files: [...files.keys()] });
  if (url.pathname === '/__test/fail-upload') { failUpload = true; return send({ ok: true }); }
  if (url.pathname === '/__test/fail-save') { failSave = true; return send({ ok: true }); }
  if (url.pathname.startsWith('/storage/v1/object/upload/sign/')) {
    const path = decodeURIComponent(url.pathname.split('/reviews/')[1]);
    if (req.method === 'POST') return send({ url: `/object/upload/sign/reviews/${path}?token=test-upload-token` });
    if (failUpload) { failUpload = false; return send({ error: 'Test upload failure' }, 500); }
    files.set(path, { size: buffer.length, content_type: buffer.toString('latin1').match(/Content-Type: (image\/[^\r\n]+)/i)?.[1] || 'image/png' });
    return send({ Key: `reviews/${path}` });
  }
  if (url.pathname.startsWith('/storage/v1/object/info/reviews/')) {
    const path = decodeURIComponent(url.pathname.split('/reviews/')[1]);
    return files.has(path) ? send({ id: path, name: path, bucket_id: 'reviews', ...files.get(path) }) : send({ error: 'Not found' }, 404);
  }
  if (url.pathname.startsWith('/storage/v1/object/public/reviews/')) {
    const path = decodeURIComponent(url.pathname.split('/reviews/')[1]);
    if (!files.has(path)) return send({ error: 'Not found' }, 404);
    res.writeHead(200, { 'Content-Type': 'image/png' }); res.end(image); return;
  }
  if (url.pathname === '/storage/v1/object/reviews' && req.method === 'DELETE') { for (const path of body.prefixes || []) files.delete(path); return send([]); }
  if (url.pathname === '/rest/v1/hospital_news') {
    const select = url.searchParams.get('select') || '*';
    const selected = (row) => select === '*' ? row : Object.fromEntries(select.split(',').filter((key) => key in row).map((key) => [key, row[key]]));
    const matches = (row) => [...url.searchParams.entries()].every(([key, val]) => {
      if (['select', 'order', 'limit', 'offset'].includes(key)) return true;
      if (val.startsWith('eq.')) return String(row[key]) === val.slice(3);
      if (val.startsWith('in.(')) return val.slice(4, -1).split(',').includes(String(row[key]));
      return true;
    });
    let matching = records.filter(matches);
    if (req.method === 'POST' || req.method === 'PATCH') {
      if (failSave) { failSave = false; return send({ code: 'XX000', message: 'Test save failure' }, 500); }
      if (req.method === 'POST') {
        if (records.some((row) => row.id === body.id)) return send({ code: '23505', message: 'duplicate' }, 409);
        const row = { ...body, created_at: new Date().toISOString() }; records.push(row); matching = [row];
      } else { for (const row of matching) Object.assign(row, body); }
    } else if (req.method === 'DELETE') records = records.filter((row) => !matches(row));
    const order = url.searchParams.get('order') || '';
    matching.sort((a, b) => {
      for (const entry of order.split(',')) {
        const [key, dir] = entry.split('.');
        const delta = String(a[key]).localeCompare(String(b[key]));
        if (delta) return dir === 'desc' ? -delta : delta;
      }
      return 0;
    });
    const count = matching.length;
    const offset = Number(url.searchParams.get('offset') || 0);
    const limit = Number(url.searchParams.get('limit') || 1000);
    const result = matching.slice(offset, offset + limit).map(selected);
    const single = (req.headers.accept || '').includes('vnd.pgrst.object');
    return send(single ? result[0] || null : result, 200, { 'Content-Range': `${offset}-${offset + result.length - 1}/${count}` });
  }
  if (url.pathname.startsWith('/rest/v1/')) return send([], 200, { 'Content-Range': '0-0/0' });
  return send({ error: 'No fixture' }, 404);
}).listen(port, '127.0.0.1', () => process.stdout.write(`News fixture ready on ${port}\n`));
