document.getElementById('eventForm').addEventListener('submit', (e) => {
  e.preventDefault();
  postNewEvent(e);
});

async function postNewEvent(e) {
  const formData = new FormData(e.target);

  const body = {
    teamHome: formData.get('teamHome'),
    teamAway: formData.get('teamAway'),
    date: formData.get('date'),
    time: formData.get('time'),
    venue: formData.get('venue'),
  };

  const res = await fetch('/db/in-memory.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  alert('Event added!\n\n' + JSON.stringify(data, null, 2));

  e.target.reset();
}
