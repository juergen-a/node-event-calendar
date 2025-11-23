// fetch-new-event
// Render only new events by appending to div-flexbox (eventList)
// Collapsible flexboxes - (eventList and calendar)

let allEvents = [];

let eventsToDisplay = [];

const url = '/db/in-memory.js';

const options = {
  method: 'GET',
  headers: { Accept: 'application/javascript' },
  // add abort signal w/ timeout
};

// Pre-populate allEvents and eventsToDisplay on page load
window.addEventListener('load', () => {
  getAllEvents();
});

// Fetch - API-call upon page-load
async function getAllEvents() {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`Error, ${res.status}`);
  }

  const data = await res.json();
  allEvents.push(...data);
  eventsToDisplay.push(...data);

  console.log('Fetched data:', data);
  console.log('allEvents now:', allEvents);
  console.log('eventsToDisplay now:', eventsToDisplay);

  // Render eventsToDisplay
  if (eventsToDisplay.length > 0) {
    eventsToDisplay.forEach((el) => {
      renderEvent(el);
    });
  }
}

// Fetch - API-call upon pushing refresh button
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

    // Render events that are missing - set reference via Closure to storage outside the outer function
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

    // Catching network, connection and parsing errors
  } catch (error) {
    return { message: error.message };
  }
}

// Render to DOM
function renderEvent(event) {
  // Get DOM-Element where to render
  const container = document.querySelector('#eventList');

  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
  eventCard.textContent = `${event.teamHome}-${event.teamAway}, ${event.date}, ${event.time}, ${event.venue} `;

  // Add bttn Add && bttn Remove
  // Create buttons
  const btnAdd = document.createElement('button');
  btnAdd.textContent = 'Add';

  const btnRemove = document.createElement('button');
  btnRemove.textContent = 'Remove';
  btnRemove.style.display = 'none';

  // Add bttn behavior
  btnAdd.addEventListener('click', () => {
    addToCalendar(event, eventCard);
    btnAdd.style.display = 'none';
    btnRemove.style.display = 'inline-block';
  });

  btnRemove.addEventListener('click', () => {
    removeFromCalendar(event, eventCard);
  });

  // Add buttons to eventCard
  eventCard.appendChild(btnAdd);
  eventCard.appendChild(btnRemove);

  // Add eventCard to Container Event List
  container.appendChild(eventCard);
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
