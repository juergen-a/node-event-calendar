// Get-request from fetch-all-events -> url entered into browser
import * as fs from 'node:fs';
import * as path from 'node:path';

// Callback function autorunning upon IncomingMessage
export function getStaticClient(req, res) {
  // GET-request - !ok
  if (req.method !== 'GET') {
    res.statusCode = 404;
    return res.end(`${res.statusCode}, Not found`);
  }
  // GET-request - ok
  // Get the file path of the static file to be served
  let reqUrl = req.url === '/' ? '/index.html' : req.url.replace('/client', '');

  let filePath = './frontend/client' + reqUrl;

  // Check if file exists
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      // Rank order of ending code regarding different files to be served
      return res.end('404 Not Found');
    }

    // Get extension of found & streamed file
    let ext = path.extname(filePath).slice(1);
    console.log('extension', ext);

    const mimeType = {
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      json: 'application/json',
      png: 'image/png',
      jpg: 'image/jpeg',
      svg: 'image/svg+xml',
      gif: 'image/gif',
      woff2: 'font/woff2',
      txt: 'text/plain',
      ico: 'image/x-icon',
    };

    const contentType = mimeType[ext];

    // Send the response header to the browser //
    res.statusCode = 200;
    res.setHeader('Content-type', contentType);

    // Create readStream
    const streamFile = fs.createReadStream(filePath);
    // Stream the response body to the browser
    streamFile.pipe(res);
  });
}
