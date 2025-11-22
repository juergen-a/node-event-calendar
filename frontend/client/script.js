// fetch-new-event
// Render only new events by appending to div-flexbox (eventList)
// Collapsible flexboxes - (eventList and calendar)

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
    // Read the res-body, parsing json to js array of objects
    const data = await res.json();

    // Push allEvents to arrAllEvents for storage
    data.forEach((enew) => {
      if (!allEvents.some((ecurrent) => ecurrent.id === enew.id)) {
        allEvents.push(enew);
      }
    });

    // Compare if allEvents matches eventsToDisplay
    // Filter those elements (event objects) that do not match
    const idsAllEvents = allEvents.map((eventDb) => eventDb.id);
    console.log('idsAllEvents', idsAllEvents);

    const idsEventsToDisplay = eventsToDisplay.map(
      (eventDisplay) => eventDisplay.id,
    );
    console.log('idsEventsToDisplay', idsEventsToDisplay);

    const missingInEventsToDisplay = allEvents.filter(
      (eventCard) => !idsEventsToDisplay.includes(eventCard.id),
    );
    console.log('missingInEventsToDisplay', missingInEventsToDisplay);

    const missingInAllEvents = eventsToDisplay.filter(
      (eventCard) => !idsAllEvents.includes(eventCard.id),
    );
    console.log('missingInAllEvents', missingInAllEvents);

    const eventsToRender =
      missingInEventsToDisplay.length > 0
        ? missingInEventsToDisplay
        : missingInAllEvents;
    console.log('eventsToRender', eventsToRender);

    // Get DOM-Element where to render
    const container = document.querySelector('#eventList');

    // Render events that are missing
    if (eventsToRender.length > 0) {
      eventsToRender.forEach((eMissing) => {
        renderEvent(eMissing);
      });

      // Push to eventsToDisplay to update state - new array
      const idsToUpdate = eventsToDisplay.map((el) => el.id);

      const elToUpdate = eventsToRender.filter(
        (el) => !idsToUpdate.includes(el.id),
      );

      eventsToDisplay.push(...elToUpdate);
    }

    // Render to DOM
    function renderEvent(event) {
      const eventCard = document.createElement('div');
      eventCard.classList.add('event-card');
      eventCard.textContent = `${event.teamHome}-${event.teamAway}, ${event.date}, ${event.time}, ${event.venue} `;
      // Add bttn add
      const btnAdd = document.createElement('button');
      btnAdd.textContent = 'Add';
      btnAdd.addEventListener('click', () => {
        addToCalendar(event, eventCard);
      });
      eventCard.appendChild(btnAdd);

      // Add bttn remove
      const btnRemove = document.createElement('button');
      btnRemove.textContent = 'Remove';
      btnRemove.addEventListener('click', () => {
        removeFromCalendar(event, eventCard);
      });
      eventCard.appendChild(btnRemove);

      // Add eventCard to Container Event List
      container.appendChild(eventCard);
    }

    // Catching network, connection and parsing errors
  } catch (error) {
    return { message: error.message };
  }
}

// Add to Calendar
function addToCalendar(event, eventCard) {
  const eventMonth = new Date(event.date).getMonth() + 1; // 1-12
  const monthContainer = document.getElementById(`${eventMonth}`);

  if (monthContainer) {
    monthContainer.appendChild(eventCard);
  }
}

// Remove from Calendar
function removeFromCalendar(event, eventCard) {
  eventCard.parentNode.removeChild(eventCard);
  eventsToDisplay = eventsToDisplay.filter((e) => e.id !== event.id);
  getNewEvents();
}

// Refresh - button
console.log('attaching event listener');
const btnRefresh = document.querySelector('#getNewEvents');

btnRefresh.addEventListener('click', () => {
  console.log('attaching event listener');
  getNewEvents();
});
