import { getNewEvents } from '../api/get-new-events.js';
import { getStaticAdmin } from '../api/get-static-admin.js';
import { getStaticClient } from '../api/get-static-client.js';
import { postNewEvents } from '../api/post-new-events.js';

export function router(req, res) {
  const staticFilesClient = ['/', '/script.js', '/styles.css', '/favicon.ico'];

  const staticFilesAdmin = [
    '/admin',
    '/script.js',
    '/styles.css',
    '/favicon.ico',
  ];

  if (req.method === 'GET' && staticFilesClient.includes(req.url)) {
    return getStaticClient(req, res);
  } else if (req.method === 'GET' && req.url === '/db/in-memory.js') {
    return getNewEvents(req, res);
  } else if (req.method === 'GET' && staticFilesAdmin.includes(req.url)) {
    return getStaticAdmin(req, res);
  } else if (req.method === 'POST' && req.url === '/db/in-memory.js') {
    return postNewEvents(req, res);
  }
  res.statuscode = 404;
  res.end(`${res.statuscode}, Not Found`);
}
