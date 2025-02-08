document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blobContainer");

  // Retrieve stored Blob URLs from chrome.storage.local
  chrome.storage.local.get({ reelVideo: [] }, (data) => {
    container.innerHTML = ""; // Clear previous content

    if (data.reelVideo.length === 0) {
      container.innerHTML = "<p>No recorded data available.</p>";
      return;
    }

    data.reelVideo.forEach((blobUrl) => {
      // Create an image element (or audio if applicable)
      const img = document.createElement("img");
      img.src = blobUrl;
      img.style.maxWidth = "100%";
      img.style.marginBottom = "10px";

      container.appendChild(img);
    });
  });
  chrome.storage.local.clear();
});
