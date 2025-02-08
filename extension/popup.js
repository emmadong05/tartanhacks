document.addEventListener("DOMContentLoaded", function () {
  const loginFormContainer = document.getElementById("loginFormContainer");
  const loggedInContent = document.getElementById("loggedInContent");
  const loginForm = document.getElementById("loginForm");
  const logoutButton = document.getElementById("logoutButton");

  // Function to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  // Check if token exists in cookies
  const token = getCookie("token");
  if (token) {
    // If token exists, display logged-in content
    loginFormContainer.style.display = "none";
    loggedInContent.style.display = "block";
  } else {
    // If token does not exist, display login form
    loginFormContainer.style.display = "block";
    loggedInContent.style.display = "none";
  }

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Perform your custom logic here, such as sending the data to a server
    console.log("Email:", email);
    console.log("Password:", password);

    // Example: Send the data to a server using fetch
    fetch("http://127.0.0.1:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((parsed) => {
        console.log("Success:", parsed.data);
        // Save the token correctly to document.cookie
        const token = parsed.data.token;

        // Save the token in chrome.storage.local
        chrome.storage.local.set({ token: token }, function () {
          console.log("Token is set to " + token);
        });

        // Display logged-in content
        loginFormContainer.style.display = "none";
        loggedInContent.style.display = "block";
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle login error
      });
  });

  logoutButton.addEventListener("click", function () {
    // Remove the token by expiring it
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Display login form
    loginFormContainer.style.display = "block";
    loggedInContent.style.display = "none";
  });
});
