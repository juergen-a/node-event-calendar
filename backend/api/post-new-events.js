import { allEvents } from '../../db/in-memory.js';

// POST new event
export function postNewEvents(req, res) {
  let body = [];

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    try {
      body = Buffer.concat(body).toString();
      const dataJs = JSON.parse(body);

      // Create next incremented id
      const nextId =
        allEvents.length > 0 ? Math.max(...allEvents.map((e) => e.id)) + 1 : 1;

      const newEvent = {
        id: nextId,
        teamHome: dataJs.teamHome,
        teamAway: dataJs.teamAway,
        date: dataJs.date,
        time: dataJs.time,
        venue: dataJs.venue,
      };

      // Add to in-memory DB
      allEvents.push(newEvent);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newEvent));
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Failed to add event' }));
    }
  });
}
