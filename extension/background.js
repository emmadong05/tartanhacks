chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "capture_screen") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
      chrome.storage.local.set({ screenshot: image }, () => {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
