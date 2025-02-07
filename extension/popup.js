chrome.storage.local.get("screenshot", (data) => {
  if (data.screenshot) {
    document.getElementById("screenshot").src = data.screenshot;
  }
});
