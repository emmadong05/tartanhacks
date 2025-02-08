console.log("background js called");

chrome.runtime.onStartup.addListener(() => {
  const response = fetch("http://127.0.0.1:3000/login", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: document.cookie,
    },
  });
  const parsed = response.json();
  if (response.ok) {
    return parsed.data;
  } else {
    throw new Error(parsed.message);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "captureTab") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      sendResponse({ screenshotUrl: dataUrl });
    });
    // Return true to indicate that the response is sent asynchronously.
    return true;
  }
});
