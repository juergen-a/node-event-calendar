import { getNewEvents } from '../api/get-new-events.js';
import { getStaticAdmin } from '../api/get-static-admin.js';
import { getStaticClient } from '../api/get-static-client.js';
import { postNewEvents } from '../api/post-new-events.js';

export function router(req, res) {
  if (req.method === 'GET' && req.url === '/') {
    return getStaticClient(req, res);
  } else if (req.method === 'GET' && req.url === '/db/in-memory.js') {
    return getNewEvents(req, res);
  } else if (req.method === 'GET' && req.url === '/admin') {
    return getStaticAdmin(req, res);
  } else if (req.method === 'POST' && req.url === '/db/in-memory.js') {
    return postNewEvents(req, res);
  }
  res.statuscode = 404;
  res.end(`${res.statuscode}, Not Found`);
}
