// POST-request from fetch-post-event -> push of Add Event button
// Callback function autorunning upon IncomingMessage

export function postNewEvents(req, res) {
  // GET-request - !ok
  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(`${res.statusCode}, Method Not Allowed`);
  }
}
// tbd. !!
