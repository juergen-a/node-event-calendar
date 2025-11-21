import { allEvents } from '../../db/in-memory.js';

// Get-request from fetch-new-event -> push of update button
// Callback function autorunning upon IncomingMessage

export function getNewEvents(req, res) {
  // GET-request - !ok
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(`${res.statusCode}, Method Not Allowed`);
  }
  // Req-url - !ok
  // Get the file path of the static file to be served
  if (req.url !== '/db/in-memory.js') {
    res.statusCode = 404;
    return res.end(`${res.statuscode}, Not Found`);
  }

  // Get request && req-url ok
  // Set statusCode and content header
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');

  // Send body
  res.end(JSON.stringify(allEvents));

  // // Check if file exists
  // fs.stat(filePath, (err, stats) => {
  //   if (err || !stats.isFile()) {
  //     res.statusCode = 404;
  //     // Rank order of ending code regarding different files to be served
  //     return res.end('404 Not Found');
  //   }

  // // Create readStream
  // const streamFile = fs.createReadStream(filePath);

  // // Get extension of found & streamed file
  // let ext = path.extname(filePath).slice(1);
  // console.log('extension', ext);

  // const mimeType = {
  //   html: 'text/html',
  //   css: 'text/css',
  //   js: 'application/javascript',
  //   json: 'application/json',
  //   png: 'image/png',
  //   jpg: 'image/jpeg',
  //   svg: 'image/svg+xml',
  //   gif: 'image/gif',
  //   woff2: 'font/woff2',
  //   txt: 'text/plain',
  //   ico: 'image/x-icon',
  // };

  // const contentType = mimeType[ext];

  // // Send the response header to the browser //
  // streamFile.on('open', () => {
  //   res.statusCode = 200;
  //   res.setHeader('Content-type', contentType);
  // });

  // Stream the response body to the browser
  // streamFile.pipe(res);
  // });
}
