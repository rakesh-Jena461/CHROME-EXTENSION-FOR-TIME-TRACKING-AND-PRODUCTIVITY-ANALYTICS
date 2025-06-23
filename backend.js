let currentDomain = "";
let startTime = Date.now();

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}

async function logTime() {
  const endTime = Date.now();
  const timeSpent = endTime - startTime;

  if (currentDomain && timeSpent > 1000) {
    const payload = {
      userId: "abc123",
      domain: currentDomain,
      timeSpent: timeSpent,
      timestamp: new Date().toISOString()
    };

    await fetch("https://your-backend.com/api/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }
}

async function updateCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    await logTime();
    currentDomain = getDomain(tab.url);
    startTime = Date.now();
  }
}

chrome.tabs.onActivated.addListener(updateCurrentTab);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") updateCurrentTab();
});

chrome.windows.onFocusChanged.addListener(updateCurrentTab);
