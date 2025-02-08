(function () {
  // --- Part 1: Capture Screenshots from the Video ---
  async function captureScreenshots(video, interval = 1) {
    console.log("video", video);

    // Create an off-screen canvas matching the video's dimensions.
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    let screenshots = await new Promise((resolve) => {
      chrome.storage.local.get("reelVideo", (data) => {
        resolve(data.reelVideo || []);
      });
    });

    let runningstr = await new Promise((resolve) => {
      chrome.storage.local.get("runningstr", (data) => {
        resolve(data.runningstr || "");
      });
    });
    const table = document.getElementsByClassName("x6ikm8r x10wlt62 xuxw1ft");
    i = 0;
    for (element of table) {
      if (element.innerText) {
        runningstr = runningstr + ", " + element.innerText;
        console.log("found a header");
        element.classList = "";
        i = i + 1;
        if (i == 3) {
          break;
        }
      }
    }

    console.log(runningstr);

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataURL = canvas.toDataURL("image/png");

    for (let t = interval; t < video.duration; t += interval) {
      video.currentTime = 5;
      await new Promise((resolve) =>
        video.addEventListener("seeked", resolve, { once: true })
      );
    }

    const blob = await fetch(imageDataURL).then((res) => res.blob());
    screenshots.push(URL.createObjectURL(blob));
    await chrome.storage.local.set({ reelVideo: screenshots }, () => {
      console.log("blobbed");
    });

    await chrome.storage.local.get("token", (data) => {
      const token = data.token;

      function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      }

      blobToBase64(blob).then((base64String) => {
        fetch("http://127.0.0.1:4000/video", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64String,
          }),
        })
          .then((response) => {
            if (!response.ok) {
              // Handle server errors (e.g., 400, 500)
              throw new Error("Network response was not ok");
            }
            return response.json(); // Assuming the response is in JSON format
          })
          .then((data) => {
            console.log("Delta Server response:", data.message); // Handle the successful response here
          })
          .catch((error) => {
            console.error("WTF error Fetch Error:", error); // Handle any errors that occur in the fetch
          });
      });

      fetch("http://127.0.0.1:4000/metadata", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: runningstr,
        }),
      }).catch((error) => {
        console.error("Error:", error);
      });
    });

    //preview blob at bottom of current page

    // const img = document.createElement("img");
    // img.src = URL.createObjectURL(screenshots[0]);
    // document.body.appendChild(img);
    video.remove();
    video.src = "";
    video.load();
    return screenshots;
  }

  // --- Part 2: Record the Audio for Transcription ---
  async function recordVideoAudio(video) {
    // Check if captureStream() is available.
    if (typeof video.captureStream !== "function") {
      throw new Error("captureStream() is not supported by this browser.");
    }

    // Capture the media stream (video and audio) from the video element.
    const stream = video.captureStream();
    console.log("stream", stream);

    // Get only the audio tracks.
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error("No audio track found in the video.");
    }
    const audioStream = new MediaStream(audioTracks);

    // Setup MediaRecorder to record the audio stream.
    const options = { mimeType: "audio/webm" };
    const mediaRecorder = new MediaRecorder(audioStream, options);
    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    });

    const recordingComplete = new Promise((resolve) => {
      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        resolve(audioBlob);
      });
    });

    // Start recording.
    mediaRecorder.start();

    // Play the video so that its audio is recorded.
    video.play();

    // Wait until the video ends.
    // await new Promise((resolve) => {
    //   video.addEventListener("ended", resolve, { once: true });
    // });

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
    // Stop the recording.
    // mediaRecorder.stop();

    const audioBlob = await recordingComplete;
    return audioBlob;
  }

  // --- Combined Function to Process the Video ---
  async function processVideo() {
    // Locate the video element on the page.
    const video = document.getElementsByTagName("video")[0];
    if (!video) {
      console.log("No video element found on the page.");
      return;
    }

    try {
      // 1. Capture screenshots at 5‑second intervals.

      // 2. Record the audio from the video.
      // const audioBlob = await recordVideoAudio(video);
      // console.log("Recorded audio blob:", audioBlob);
      // chrome.storage.local.set(
      //   { reelAudio: URL.createObjectURL(audioBlob) },
      //   () => {
      //     console.log("audio blobbed");
      //   }
      // );
      const screenshots = await captureScreenshots(video, 5);
      console.log("Captured screenshots:", screenshots);
      // screenshots is now an array of data URLs representing PNG images.

      // 3. Transcribe the audio.
      // NOTE: Browsers don't provide built‑in audio-to-text functionality,
      // so you'd need to send `audioBlob` to an external speech-to-text API.
      //const transcript =
      //  "Transcription functionality requires integration with a speech-to-text API.";
      //console.log("Audio transcript:", transcript);
    } catch (err) {
      console.error("Error processing video:", err);
    }
  }
  video = document.getElementsByTagName("video")[0];
  screenshots = captureScreenshots(video, 5);
  console.log("Captured screenshots:", screenshots);
  console.log("loaded");

  // --- Event Listener: Trigger on Scroll ---
  let lastScroll = 9999;
  let scrollIdleTime = 200; // time interval that we consider a new scroll event
  let prevVideo = null;
  window.addEventListener("wheel", (e) => {
    let delta = e.deltaY;
    let timeNow = performance.now();
    if (delta != 0 && timeNow > lastScroll + scrollIdleTime) {
      console.log("scrolling");
      processVideo().then((a) => {
        console.log(a);
      });
    }
    lastScroll = timeNow;
  });
})();
