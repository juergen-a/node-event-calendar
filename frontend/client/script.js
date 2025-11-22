// fetch-new-event
// Render only new events by appending to div-flexbox (eventList)
// Collapsible flexboxes - (eventList and calendar)
console.log('script loaded');

let allEvents = [
  {
    id: 1,
    teamHome: 'Lions',
    teamAway: 'Pistons',
    date: '2025-02-14',
    time: '14:15:00',
    venue: 'Pistons Stadium',
  },
  {
    id: 2,
    teamHome: 'Falcons',
    teamAway: 'Warriors',
    date: '2025-05-09',
    time: '09:30:00',
    venue: 'Falcon Arena',
  },
  {
    id: 3,
    teamHome: 'Tigers',
    teamAway: 'Sharks',
    date: '2025-11-22',
    time: '19:45:00',
    venue: 'Shark Dome',
  },
];

let eventsToDisplay = [
  {
    id: 1,
    teamHome: 'Lions',
    teamAway: 'Pistons',
    date: '2025-02-14',
    time: '14:15:00',
    venue: 'Pistons Stadium',
  },
];

const url = '/db/in-memory.js';

const options = {
  method: 'GET',
  headers: { Accept: 'application/javascript' },
  // add abort signal w/ timeout
};

async function getNewEvents() {
  try {
    const res = await fetch(url, options);
    // Check on http errors regarding the res-object - 404, 500
    if (!res.ok) {
      throw new Error(`Error, ${res.status}`);
    }
    // Read the res-body
    const data = await res.text();

    // Push allEvents to arrAllEvents for storage
    allEvents.push(data);

    // Compare if allEvents matches eventsToDisplay
    // Filter those elements (event objects) that do not match
    const idsAllEvents = allEvents.map((el) => el.id);
    const idsEventsToDisplay = eventsToDisplay.map((el) => el.id);

    const missingInEventsToDisplay = allEvents.filter(
      (el) => !idsEventsToDisplay.includes(el.id),
    );
    const missingInAllEvents = eventsToDisplay.filter(
      (el) => !idsAllEvents.includes(el.id),
    );

    const eventsToRender =
      missingInEventsToDisplay.length > 0
        ? missingInEventsToDisplay
        : missingInAllEvents;

    // Render events that are missing
    if (eventsToRender.length > 0) {
      renderEvent(eventsToRender);

      // Push to eventsToDisplay to update state
      eventsToDisplay.push(eventsToRender);
    }
    // Get DOM-Element where to render
    const container = document.getElementById('#eventList');

    // Render to DOM
    function renderEvent(event) {
      const el = document.createElement('div');
      el.classList.add('event-card');
      el.textContent = `${event.month}/${event.day}: ${event.title}`;
      container.appendChild(el);
    }

    // Catching network, connection and parsing errors
  } catch (error) {
    return { message: error.message };
  }
}

// Refresh - button
console.log('attaching event listener');
const btnRefresh = document.querySelector('#getNewEvents');

btnRefresh.addEventListener('click', () => {
  console.log('attaching event listener');
  getNewEvents();
});
