//API
let apiKey = `6c5702b8e0bdf208e797742914ea7cea`;

// The date, time, month etc
let now = new Date();

function formatDate(Date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeek = days[now.getDay()];

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let currentMonth = months[now.getMonth()];

  let currentDay = now.getDate();

  function hours12() {
    return (now.getHours() + 24) % 12 || 12;
  }

  let hour = hours12();

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayOrNight = "AM";
  if (now.getHours() < 13) {
    dayOrNight = "AM";
  }
  if (now.getHours() > 12) {
    dayOrNight = "PM";
  }

  let currentDate = `Last updated: ${currentMonth} ${currentDay} - ${hour}:${minutes} ${dayOrNight}`;
  let currentDateTime = document.querySelector("#current-time");
  currentDateTime.innerHTML = `${currentDate}`;
}
formatDate();

// Forecast for the Week //
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[day];
}

function displayForecastWeek(response) {
  let forecast = response.data.daily.slice(1, 7);
  let forecastElement = document.querySelector("#forecastWeek");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay) {
    forecastHTML =
      forecastHTML +
      `
          <div class="col-2">
            <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
            <img 
              src="images/${forecastDay.weather[0].icon}.svg"
              alt="weather-icon" 
              class="icon"   
              id="icon"
            />
            <div class="forecast-temperature">
              <span class="minTemperature" id="forecastTemp"> ${Math.round(
                forecastDay.temp.min
              )}</span><span class="minTemperatures">° </span>
              <span class="maxTemperature" id="forecastTemp"> ${Math.round(
                forecastDay.temp.max
              )}</span><span class="maxTemperatures">° </span>
            </div>
          </div>`;
    minForecastTemp = forecastDay.temp.min;
    maxForecastTemp = forecastDay.temp.max;
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecastWeek(coord) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude={part}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecastWeek);
}

// Sunrise and Sunset Functions//
function formatSunriseTime(timestamp) {
  let time = new Date(timestamp);
  let hours = time.getHours();
  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
}
function formatSunsetTime(timestamp) {
  let time = new Date(timestamp);
  let hours = hours12();

  function hours12() {
    return (time.getHours() + 24) % 12 || 12;
  }
  let hour = hours12();

  let minutes = time.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;
}

// Search Engine //
function showWeather(response) {
  let currentCity = document.querySelector("#location");
  currentCity.innerHTML = response.data.name;
  let showTemp = document.querySelector("#temp");
  showTemp.innerHTML = Math.round(response.data.main.temp);
  let showDescription = document.querySelector("#description");
  showDescription.innerHTML = response.data.weather[0].description;
  let showWind = document.querySelector("#wind-value");
  showWind.innerHTML = Math.round(response.data.wind.speed);
  let showHumidity = document.querySelector("#humidity");
  showHumidity.innerHTML = Math.round(response.data.main.humidity);
  let showSunrise = document.querySelector("#sunrise-value");
  showSunrise.innerHTML = formatSunriseTime(response.data.sys.sunrise * 1000);
  let showSunset = document.querySelector("#sunset-value");
  showSunset.innerHTML = formatSunsetTime(response.data.sys.sunset * 1000);

  let showIcon = document.querySelector("#icon");
  showIcon.setAttribute("src", `images/${response.data.weather[0].icon}.svg`);
  showIcon.setAttribute("alt", response.data.weather[0].icon);

  cityName = response.data.name;

  getForecastWeek(response.data.coord);
  console.log(response);
}

function searchCity(city) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(showWeather);
  //handling wrong city name
  axios
    .get(apiUrl)
    .then(showWeather)
    .catch(function (error) {
      alert("Oops! No city was found with this name.");
    });
}

function searchInput(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#citySearch");
  formFahr.classList.add("active");
  formCelsius.classList.remove("active");

  searchCity(cityInput.value);
}
let citySearch = document.querySelector("#searchForm");
citySearch.addEventListener("submit", searchInput);

// Get Current Location //
function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  console.log(apiUrl);

  axios.get(apiUrl).then(showWeather);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}
let currentCityButton = document.querySelector("#locationButton");
currentCityButton.addEventListener("click", currentLocation);

// Temperature Unit Conversion //
function displayCelsiusTemp(event) {
  event.preventDefault();
  formCelsius.classList.add("active");
  formFahr.classList.remove("active"); //adding active class from celsius link
  units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = "m/s";
}
let formCelsius = document.querySelector("#celsius-temp");
formCelsius.addEventListener("click", displayCelsiusTemp);

function displayFahrTemp(event) {
  event.preventDefault();
  formFahr.classList.add("active");
  formCelsius.classList.remove("active"); //remove active class from celsius link
  units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(showWeather);
  let windUnits = document.querySelector("#windUnits");
  windUnits.innerHTML = "mph";
}
let formFahr = document.querySelector("#fahr-temp");
formFahr.addEventListener("click", displayFahrTemp);

let cityName = null;
let units = "imperial";

// Dark & Light Mode //
const htmlEl = document.getElementsByTagName("html")[0];
const currentTheme = localStorage.getItem("theme")
  ? localStorage.getItem("theme")
  : null;
if (currentTheme) {
  htmlEl.dataset.theme = currentTheme;
}
const toggleTheme = (theme) => {
  htmlEl.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

// CTA //
searchCity("Seattle");
