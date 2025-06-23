function formatTime(ms) {
  let totalSec = Math.floor(ms / 1000);
  let hrs = Math.floor(totalSec / 3600);
  let mins = Math.floor((totalSec % 3600) / 60);
  let secs = totalSec % 60;
  return `${hrs}h ${mins}m ${secs}s`;
}

document.getElementById('reset').addEventListener('click', () => {
  chrome.storage.local.clear(() => {
    location.reload();
  });
});

chrome.storage.local.get(null, (data) => {
  const container = document.getElementById('data');
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  for (let [domain, time] of sorted) {
    const div = document.createElement('div');
    div.textContent = `${domain}: ${formatTime(time)}`;
    container.appendChild(div);
  }
});
