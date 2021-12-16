// Search and localStorage variables
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('button-addon2');
const searchHistory = document.getElementById('history');
// Current weather variables
const todayWeather = document.getElementById('today-weather');
const todayPic = document.getElementById('today-pic');
const cityName = document.getElementById('city-name');
const todayTemp = document.getElementById('temp');
const todayHum = document.getElementById('humidity');
const todayWind = document.getElementById('wind');
const todayUV = document.getElementById('uv');
// 5 day forecast variables
const fivedayForecast = document.getElementById('fiveday-forecast');
const fivedayTitle = document.getElementById('fiveday-title');
// API Key
const apiKey = 'af48d67960dc6c043fc7658bf1e89f7f';

// Make sure to remove d-none from todayWeather(id=today-weather) and fivedayForecast(id=fiveday-forecast)

// event listener for search functionality and pass that value off to the function

searchBtn.addEventListener('click', function() {
    var searchValue = cityInput.value;
    cityName.innerHTML = searchValue;
    cityName.setAttribute('class', 'text-white text-uppercase text-center');
    var city = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey;
    getLatLon(city);
});

function getLatLon(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            console.log(data.coord.lat)
            console.log(data.coord.lon)

            var cityLat = data.coord.lat;
            var cityLon = data.coord.lon;

            var oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&units=imperial&exclude=hourly,minutely&appid=" + apiKey;
            getForecast(oneCall);
        })
};

function getForecast(link) {
    fetch(link)
        .then(res => res.json())
        .then(data => {
            todayWeather.classList.remove('d-none')
            // generate and append current date
            var currentDate = new Date(data.current.dt * 1000)
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() +1;
            const currentYear = currentDate.getFullYear();
            var cityDate = document.createElement('p');
            cityDate.textContent = "(" + currentMonth + "/" + currentDay + "/" + currentYear + ")";
            cityDate.setAttribute('class', 'text-white');
            cityName.append(cityDate)
            console.log(data)
            console.log(data.daily[0].dt)
            console.log(data.current.weather[0].icon)
            console.log(data.current.weather[0].description)
            // generate current weather image
            let currentWeatherPic = data.current.weather[0].icon;
            todayPic.setAttribute('src', 'https://openweathermap.org/img/wn/' + currentWeatherPic + '@2x.png');
            todayPic.setAttribute('alt', data.current.weather[0].description);
            // generate current weather data
            todayTemp.innerHTML = 'Temperature: ' + data.current.temp + '&#176';
            todayTemp.setAttribute('class', 'text-white text-center');
            todayHum.innerHTML = 'Humidity: ' + data.current.humidity + '%';
            todayHum.setAttribute('class', 'text-white text-center');
            todayWind.innerHTML = 'Wind Speed: ' + data.current.wind_speed + ' MPH';
            todayWind.setAttribute('class', 'text-white text-center');
            let UVI = document.createElement('span');
            if (data.current.uvi < 4) {
                UVI.setAttribute('class', 'badge alert-success')
            } else if (data.current.uvi < 8) {
                UVI.setAttribute('class', 'badge alert-warning')
            } else {
                UVI.setAttribute('class', 'badge alert-danger')
            };
            UVI.innerHTML = data.current.uvi;
            todayUV.innerHTML = 'UV Index: ';
            todayUV.setAttribute('class', 'text-white text-center');
            todayUV.append(UVI);
        })
}