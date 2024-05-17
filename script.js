const APIKEY = "1eb4d6e612ee0e110e24ba230e7bc642";
const APIUrl_current = "https://api.openweathermap.org/data/2.5/weather";
const APIUrl_forecast = "https://api.openweathermap.org/data/2.5/forecast";

const weather = document.querySelector(".weather__info");

async function getData() {
  try {
    const city = document.querySelector("#finder").value;

    // Get current weather data
    const requestUrl_current = `${APIUrl_current}?q=${city}&appid=${APIKEY}&units=metric`;
    const data_current = await fetch(requestUrl_current).then((res) =>
      res.json()
    );
    // Get forecast data
    const requestUrl_forecast = `${APIUrl_forecast}?q=${city}&appid=${APIKEY}&units=metric`;
    const data_forecast = await fetch(requestUrl_forecast).then((res) =>
      res.json()
    );
    showWeatherInfo(city, data_current, data_forecast);
  } catch (error) {
    showErrorInfo(error);
  }
}

function showWeatherInfo(city, data_current, data_forecast) {
  const forecast_divs = data_forecast.list
    .filter((el, index) => index % 7 === 0)
    .splice(1)
    .map((day) => {
      let date = new Date(day.dt_txt);
      return `
     <div class="info3__temps">
     <img src="https://openweathermap.org/img/wn/${
       day.weather[0].icon
     }.png" alt="weather icon">
     <p class = "info3__deg">${Math.ceil(day.main.temp)}°C</p>
       <header class = "info3__data-time">${date.toLocaleString("en", {
         weekday: "long",
       })}, ${date.getDate()} ${date.toLocaleString("en", {
        month: "short",
      })}</header>
     </div>
     `;
    });
  const forecast_divs2 = data_forecast.list
    .filter((el, index) => index <= 5)
    .splice(1)
    .map((hour) => {
      let date = new Date(hour.dt_txt);
      let windDirection = hour.wind.deg;
      let rotationStyle = `transform: rotate(${windDirection}deg);`;
      return `
      <div class="info3__temps-time">
      <header class = "info3__data-time">${date.toLocaleString("en", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })}</header>
        <img src="https://openweathermap.org/img/wn/${
          hour.weather[0].icon
        }@2x.png" alt="weather icon">
        <p class = "info3__degHours">${Math.ceil(hour.main.temp)}°C</p>
        <img src="./icons/navigation.png" alt="img" class="forecast__navigation" style="${rotationStyle}">
        <p class = "wind__speed">${Math.ceil(hour.wind.speed)}km/h</p>
      </div>
    `;
    });
  const localDate = new Date(
    Date.now() +
      new Date().getTimezoneOffset() * 60000 +
      data_current.timezone * 1000
  );
  const padZero = (num) => (num < 10 ? "0" + num : num);
  const sunData = new Date(data_current.sys.sunrise * 1000);
  const sunData2 = new Date(data_current.sys.sunset * 1000);
  weather.innerHTML = `
  <div class="info1">
    <h2>${city}</h2>
    <p class="info__time">${localDate.getHours()}:${padZero(
    localDate.getMinutes()
  )}</p>
    <p class="info__data">${localDate.toLocaleString("en", {
      weekday: "long",
    })}, ${localDate.getDate()} ${localDate.toLocaleString("en", {
    month: "short",
  })}</p>
  </div>
    <div class="info2">
      <div class = "info__temp-left">
        <h3>${Math.ceil(data_current.main.temp)}°C</h3>
        <p class = "feels__like"><i class="like">Feels like:</i>
        <span class="span">${Math.ceil(
          data_current.main.feels_like
        )}°C</span></p>
        <div class = "info__sunrise">
          <img src="./icons/sunrise.png" alt="#">
            <div class = 'info__sun-time'>
            <p class = "sun__desc">Sunrise</p>
            <p class = "sun__time">${padZero(sunData.getHours())}:${padZero(
    sunData.getMinutes()
  )} AM</p>
    </div>
      </div>
      <div class = "info__sunset">
        <img src="./icons/sunset.png" alt="#">
        <div class = "info__sunset-time">
        <p class = "sun__desc">Sunset</p>
        <p class = "sun__time">${padZero(sunData2.getHours())}:${padZero(
    sunData2.getMinutes()
  )} PM</p>
        </div>
          </div>
          </div>
          <div class = "info__middle">
            <img src="https://openweathermap.org/img/wn/${
              data_current.weather[0].icon
            }@4x.png" alt="#">
            <p class ="info__desc">${data_current.weather[0].description}</p>
          </div>
          <div class="info__right">
            <div class="info__humidity">
              <img src="./icons/humidity.png" alt="#">
              <p class="right__desc">${data_current.main.humidity}%</p>
              <p class="right__num">Humidity</p>
            </div>
            <div class="info__wind">
              <img src="./icons/windSpeed.png" alt="#">
              <p class="right__desc">${data_current.wind.speed}km/h</p>
              <p class="right__num">Wind Speed</p>
            </div>
            <div class="info__pressure">
              <img src="./icons/pressure.png" alt="#">
              <p class="right__desc">${data_current.main.pressure}hPA</p>
              <p class="right__num">Pressure</p>
            </div>
            <div class="info__uv">
              <img src="./icons/uv-white.png" alt="#">
              <p class="right__desc">${data_current.clouds.all}</p>
              <p class="right__num">UV</p>
          </div>
        </div>
          </div>
            </div>
            <div class="info3">
            <h1>5 Days Forecast:</h1>
            <div class="info3__temp">
            <p>${forecast_divs.join("")}</p>
            </div>
            </div>
            <div class="info4">
            <h1>Hourly Forecast:</h1>
            <div class ="info__temp">
            <p>${forecast_divs2.join("")}</p>
            </div>
            </div>
  `;
}

function showErrorInfo(error) {
  weather.innerHTML = `
    <div>
      <h2>Ooops. Something went wrong.</h2>
      <p>${error.message}</p>
      <button class='change'>Try Again</button>
    </div>`;
}

function renderSearch() {
  weather.innerHTML = `
    <form>
      <input type="text" id="finder" placeholder="Enter city" />
      <button onclick="getData()">FIND</button>
    </form>`;
}

const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  getData();
});

const mode = document.querySelector(".switch-btn.switch-on");
mode.addEventListener("click", () => {
  document.body.style.background =
    document.body.style.background === "black" ? "white" : "black";
});
