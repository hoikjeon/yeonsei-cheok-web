// Isolated HTTP fixture; never contacts the production database.
import { createServer } from 'node:http';
import seed from '../../src/lib/nonCoveredSeed.json';
import type { FeeSnapshot, FeeHistory } from '../../src/lib/nonCovered';
let snapshot: FeeSnapshot = { version: 1, content: structuredClone(seed) };
let history: FeeHistory[] = [];
let failSave = false;
createServer(async (req, res) => {
  const url = new URL(req.url!, 'http://127.0.0.1:4323');
  const chunks = []; for await (const chunk of req) chunks.push(chunk);
  const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {};
  const send = (data: unknown, status = 200) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(data)); };
  if (url.pathname === '/health') return send({ ok: true });
  if (url.pathname === '/__test/reset') { snapshot = { version: 1, content: structuredClone(seed) }; history = []; failSave = false; return send({ ok: true }); }
  if (url.pathname === '/__test/state') return send({ snapshot, history });
  if (url.pathname === '/__test/fail') { failSave = true; return send({ ok: true }); }
  if (url.pathname === '/rest/v1/non_covered_catalog') return send((req.headers.accept || '').includes('vnd.pgrst.object') ? snapshot : [snapshot]);
  if (url.pathname === '/rest/v1/non_covered_history') {
    const max = Number((url.searchParams.get('version') || 'lte.9999999').split('.')[1]);
    const offset = Number(url.searchParams.get('offset') || 0), limit = Number(url.searchParams.get('limit') || 1000);
    return send(history.filter(h => h.version <= max).slice(offset, offset + limit));
  }
  if (url.pathname === '/rest/v1/rpc/save_non_covered_catalog') {
    if (failSave) { failSave = false; return send({ code: 'XX000', message: 'Simulated failure' }, 500); }
    if (body.p_version !== snapshot.version) return send({ code: 'P0001', message: 'CATALOG_CONFLICT' }, 409);
    snapshot = { version: snapshot.version + 1, content: body.p_content };
    history.unshift({ id: snapshot.version, version: snapshot.version, action: body.p_action, label: body.p_label, before_value: body.p_before, after_value: body.p_after, created_at: new Date().toISOString() });
    return send(snapshot.version);
  }
  if (url.pathname.startsWith('/rest/v1/')) return send([]);
  return send({ error: 'not found' }, 404);
}).listen(4323, '127.0.0.1', () => console.log('Non-covered fixture ready on 4323'));
