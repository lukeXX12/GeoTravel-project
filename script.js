const form = document.getElementById("bookingForm");
const errorMsg = document.getElementById("errorMsg");
const burgerMenu = document.getElementById("burgerMenu");
const navLinks = document.querySelector(".nav-links");

burgerMenu.addEventListener("click", function () {
  burgerMenu.classList.toggle("active");
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links li a").forEach((link) => {
  link.addEventListener("click", function () {
    burgerMenu.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const place = document.getElementById("place").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const persons = document.getElementById("persons").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d).{8,}$/;

    if (!place || !checkin || !checkout || !persons || !email || !password) {
      errorMsg.style.color = "red";
      errorMsg.textContent = "fill in all fields!";
      return;
    }

    if (!emailRegex.test(email)) {
      errorMsg.style.color = "red";
      errorMsg.textContent = "Invalid email format!";
      return;
    }

    if (!passwordRegex.test(password)) {
      errorMsg.style.color = "red";
      errorMsg.textContent =
        "Password must be at least 8 characters and include a number!";
      return;
    }

    errorMsg.style.color = "green";
    errorMsg.textContent = "Booking successful ✅";
  });
}

const weatherIcons = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  51: "🌧️",
  61: "🌧️",
  65: "⛈️",
  71: "❄️",
  95: "⛈️",
};

async function getWeatherByCoordinates(lat, lon) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`,
    );

    if (!response.ok) throw new Error("Failed to fetch weather");

    const data = await response.json();
    displayWeather(data, lat, lon);
  } catch (error) {
    console.error("Weather error:", error);
    displayWeatherError("Unable to fetch weather data");
  }
}

function displayWeather(data, lat, lon) {
  const current = data.current;
  const icon = weatherIcons[current.weather_code] || "🌡️";
  const temp = Math.round(current.temperature_2m);
  const humidity = current.relative_humidity_2m;
  const wind = current.wind_speed_10m.toFixed(1);

  document.getElementById("weatherWidget").innerHTML = `
    <div class="weather-info">
      <div class="weather-icon">${icon}</div>
      <div class="weather-details-main">
        <div class="temperature">${temp}°C</div>
        <div class="weather-stats">
          <span>💧 ${humidity}%</span>
          <span>💨 ${wind} km/h</span>
        </div>
      </div>
    </div>
  `;
}

function displayWeatherError(msg) {
  document.getElementById("weatherWidget").innerHTML =
    `<div class="weather-error">${msg}</div>`;
}

function initializeWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        getWeatherByCoordinates(pos.coords.latitude, pos.coords.longitude),
      () => getWeatherByCoordinates(41.7151, 44.8271),
    );
  } else {
    getWeatherByCoordinates(41.7151, 44.8271);
  }
}

document.addEventListener("DOMContentLoaded", initializeWeather);

const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.id = "scrollToTopBtn";
scrollToTopBtn.setAttribute("aria-label", "Scroll to top");
document.body.appendChild(scrollToTopBtn);

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollToTopBtn.classList.add("show");
  } else {
    scrollToTopBtn.classList.remove("show");
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

const cookieNotification = document.getElementById("cookieNotification");
const acceptBtn = document.getElementById("acceptCookies");
const rejectBtn = document.getElementById("rejectCookies");

if (cookieNotification && acceptBtn && rejectBtn) {
  function checkCookieConsent() {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent) {
      cookieNotification.classList.add("hidden");
    }
  }

  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "accepted");
    cookieNotification.classList.add("hidden");
  });

  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookieConsent", "rejected");
    cookieNotification.classList.add("hidden");
  });

  window.addEventListener("load", checkCookieConsent);
}
