document
  .querySelectorAll('.today-activity-done-checkbox')
  .forEach((checkbox) => {
    checkbox.addEventListener('change', (e) => {
      updateIsDone(e.target.value, e.target.checked);
    });
  });

async function updateIsDone(id, value) {
  await fetch(`/api/activities/${id}/update-is-done`, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_done: value,
    }),
  });
}
